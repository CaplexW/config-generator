import commonData, { type IP, type MAC, type PortsInfo } from "../data/commonData";
import ACL from "./acl";
import createPortRanges from "./createPortRanges";
import createRule, { type RuleConfig } from "./createRule";

function createMacRules(ports: PortsInfo, profileId: number, portSequence: boolean = false): ConfigBlock {
  const { broadcastMac, nodesMacList, etherTypes } = commonData;

  let numberOfRules = 0;
  const { commonPortRange, specialPortRange, fullPortRange } = createPortRanges(ports);

  const accessProfile = `
    create access_profile 
    ethernet 
    source_mac FF-FF-FF-FF-FF-F0 
    destination_mac FF-FF-FF-FF-FF-F0 
    ethernet_type 
    profile_id ${profileId}`;

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

  const createRulesForIncomeTraffic = (action: 'deny' | 'permit', port: string): string[] => {
    const commonRules: string[] = [];

    if (portSequence) {
      nodesMacList.forEach((mac) => {
        for (let port = 1; port < ports.special.start; port++) {
          const ruleConfig: RuleConfig = {
            profileId,
            action,
            ruleId: numberOfRules + 1,
            port: port.toString(),
            protocolValue: mac,
          };
          const rule = createRule(ruleConfig);
          commonRules.push(rule);
          numberOfRules++;
        }
      })
    } else {
      nodesMacList.forEach((mac) => {
        const ruleConfig: RuleConfig = {
          profileId,
          ruleId: numberOfRules + 1,
          port,
          protocolValue: mac,
        };
        const rule = createRule(ruleConfig);
        commonRules.push(rule);
        numberOfRules++;
      })
      return commonRules;
    }

    return commonRules;
  }
  const createSpecialRules = (action: "deny" | "permit"): string[] => {
    const rules: string[] = [];

    nodesMacList.forEach((mac) => {
      const ruleConfig: RuleConfig = {
        profileId,
        ruleId: numberOfRules + 1,
        port: specialPortRange,
        protocolValue: mac,
        action,
        protocolDirection: 'src',
        priority: 3,
      };

      const discoveryRule = createRule({
        ...ruleConfig,
        etherType: etherTypes.pppoeDiscovery,
      });
      rules.push(discoveryRule);
      numberOfRules++;

      const sessionRule = createRule({
        ...ruleConfig,
        etherType: etherTypes.pppoeSession,
      });
      rules.push(sessionRule);
      numberOfRules++;
    });

    return rules;
  }

  const commonIncomeMac = ACL.createRuleFromList(nodesMacList, {
    profileId,
    action: 'deny',
    portRange: ports.common,
    ruleTarget: {
      direction: 'source',
    },
  }, numberOfRules);
  const fullMacRules = ACL.createRuleFromList(nodesMacList, {
    profileId,
    action: 'permit',
    portRange: ports.full,
    ehterType: [etherTypes.pppoeDiscovery, etherTypes.pppoeSession],
    ruleTarget: {
      direction: 'destination',
    },
  }, numberOfRules);
  // const fullOutcomeMac = createFromList(nodesMacList, 'permit', fullPortRange, 'dest', 3, 'pppoe');
  // const specialIncomMac = createFromList(nodesMacList, 'permit', specialPortRange, 'src', 3);
  // const incomeArp = createRule('permit', commonPortRange, 'arp', 3);

  const commonSourceRules = createRulesForIncomeTraffic('deny', commonPortRange);
  const destMacRules = createDestMacRules();
  const specialSourceRules = createSpecialRules('permit');
  const arpRules = createARPRules('permit', commonPortRange);

  const macRules = {
    header: accessProfile,
    blocks: [
      commonIncomeMac,
      // commonSourceRules,
      // destMacRules,
      // specialSourceRules,
      // arpRules,
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
