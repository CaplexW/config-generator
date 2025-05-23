import commonData, { type PortsInfo } from "../data/commonData";

function createMacRules(ports: PortsInfo, profileId: number, portRange: boolean = true): ConfigBlock {
  const { broadcastMac, nodesMacList, etherTypes } = commonData;

  let numberOfRules = 0;
  
  const commonPortsRange = `${ports.common.start}-${ports.common.end}`;
  const specialPortsRange = `${ports.special.start}-${ports.special.end}`;
  const fullPortRange = `${ports.common.start}-${ports.special.end}`;

  const accessProfile = `
    create access_profile 
    ethernet 
    source_mac FF-FF-FF-FF-FF-F0 
    destination_mac FF-FF-FF-FF-FF-F0 
    ethernet_type 
    profile_id ${profileId}`;

  const createSourceMacRules = (): string[][] => {

    const createCommonRules = (action: string): string[] => {
      const commonRules: string[] = [];

      nodesMacList.forEach((mac) => {
        const rule = `
          config access_profile profile_id ${profileId} 
          add access_id ${numberOfRules + 1}
          ethernet source_mac ${mac} 
          port ${commonPortsRange} 
          ${action}
        `;
        commonRules.push(rule);
        numberOfRules++;
      })

      return commonRules;
    }
    const createSpecialRules = (action: string, priority: number = 3): string[] => {
      const rules: string[] = [];

      nodesMacList.forEach((mac) => {
        const discoveryRule = `
          config access_profile profile_id ${profileId} 
          add access_id ${numberOfRules + 1} 
          ethernet source_mac ${mac} 
          ethernet_type ${etherTypes.pppoeDiscovery} 
          port ${specialPortsRange} 
          ${action} 
          priority ${priority}
        `;
        rules.push(discoveryRule);
        numberOfRules++;

        const sessionRule = `
          config access_profile profile_id ${profileId} 
          add access_id ${numberOfRules + 1} 
          ethernet source_mac ${mac} 
          ethernet_type ${etherTypes.pppoeSession} 
          port ${specialPortsRange} 
          ${action} 
          priority ${priority}
          `;
        rules.push(sessionRule);
        numberOfRules++;
      });

      return rules;
    }

    const commonRules = createCommonRules('deny');
    const specialRules = createSpecialRules('permit');
    const rules = [commonRules, specialRules];

    return rules;
  };
  const createDestMacRules = (): string[] => {
    const priority = 3;
    const createBroadcastRule = (action: string): string => {
      const rule = `
      config access_profile profile_id ${profileId}
      add access_id ${numberOfRules + 1} 
      ethernet  
      destination_mac ${broadcastMac} 
      ethernet_type ${etherTypes.pppoeDiscovery}       
      port ${fullPortRange} 
      ${action} 
      priority ${priority}
    `;
      numberOfRules++;

      return rule;
    }
    const createMacRules = (action: string): string[] => {
      const rules: string[] = [];

      // Позволям соединение с УЗЛАМИ толкьо через PPPoE
      nodesMacList.forEach((mac) => {
        const discoveryRule = `
        config access_profile profile_id ${profileId}  
        add access_id ${numberOfRules + 1} 
        ethernet  
        destination_mac ${mac} 
        ethernet_type ${etherTypes.pppoeDiscovery}      
        port ${fullPortRange} 
        ${action} 
        priority ${priority}
      `;
        rules.push(discoveryRule);
        numberOfRules++;

        const sessionRule = `
        config access_profile profile_id ${profileId}  
        add access_id ${numberOfRules + 1} 
        ethernet  
        destination_mac ${mac} 
        ethernet_type ${etherTypes.pppoeSession}      
        port ${fullPortRange} 
        ${action} 
        priority ${priority}
      `;
        rules.push(sessionRule);
        numberOfRules++;
      });

      return rules;
    }

    const broadCastRule = createBroadcastRule('permit');
    const specialRules = createMacRules('permit');
    const destMacRules = [broadCastRule, ...specialRules];

    return destMacRules;
  };
  const createARPRules = (action: string, ports: string, priority: number = 1): string[] => {
    const rules: string[] = [];

    const arpRule = `
      config access_profile profile_id ${profileId}  
      add access_id ${numberOfRules + 1} 
      ethernet  
      ethernet_type ${etherTypes.arp} 
      port ${ports} 
      ${action} 
      priority ${priority}
      `;
    rules.push(arpRule);
    numberOfRules++;

    return rules;
  };

  const sourceMacRules = createSourceMacRules();
  const commonSourceRules = sourceMacRules[0];
  const specialSourceRules = sourceMacRules[1];
  const destMacRules = createDestMacRules();
  const arpRules = createARPRules('permit', commonPortsRange);

  const macRules = {
    header: accessProfile,
    blocks: [
      commonSourceRules,
      destMacRules,
      specialSourceRules,
      arpRules,
    ]
  }

  return macRules;
}

export default createMacRules;

export type ConfigBlock = {
  header: string,
  blocks: RuleBlock[],
}

export type RuleBlock = string[];
