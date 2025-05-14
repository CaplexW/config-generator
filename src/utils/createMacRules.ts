import data from "../data/data";

function createMacRules(profileId: number): string[] {
  let numberOfRules = 0;

  const { macList, etherTypes, ports } = data;

  const commonPortsRange = `${ports.common.start}-${ports.common.end}`;
  const specialPortsRange = `${ports.special.start}-${ports.special.end}`;
  const fullPortRange = `${ports.common.start}-${ports.special.end}`;

  const createSourceMacRules = (): string[] => {

    const createCommonRules = (): string[] => {
      const commonRules: string[] = [];

      macList.forEach((mac) => {
        const rule = `config access_profile profile_id ${profileId} add access_id ${numberOfRules + 1} ethernet source_mac ${mac} port ${commonPortsRange} deny`;
        commonRules.push(rule);
        numberOfRules++;
      })

      return commonRules;
    }
    const createSpecialRules = (): string[] => {
      const rules: string[] = [];

      macList.forEach((mac) => {
        const discoveryRule = `
          config access_profile profile_id ${profileId} 
          add access_id ${numberOfRules + 1} 
          ethernet source_mac ${mac} 
          ethernet_type ${etherTypes.pppoeDiscovery} 
          port ${specialPortsRange} 
          permit
          `;
        rules.push(discoveryRule);
        numberOfRules++;

        const sessionRule = `
          config access_profile profile_id ${profileId} 
          add access_id ${numberOfRules + 1} 
          ethernet source_mac ${mac} 
          ethernet_type ${etherTypes.pppoeSession} 
          port ${specialPortsRange} 
          permit
          `;
        rules.push(sessionRule);
        numberOfRules++;
      });

      return rules;
    }

    const commonRules = createCommonRules();
    const specialRules = createSpecialRules();
    const rules = [...commonRules, ...specialRules];

    return rules;
  };
  const createDestMacRules = (): string[] => {
    const rules: string[] = [];

    const broadCastRule = `
      config access_profile profile_id ${profileId} 
      add access_id ${numberOfRules + 1} 
      ethernet destination_mac FF-FF-FF-FF-FF-FF 
      ethernet_type ${etherTypes.pppoeDiscovery} 
      port ${fullPortRange} 
      permit
    `;
    rules.push(broadCastRule);
    numberOfRules++;

    macList.forEach((mac) => {
      const discoveryRule = `
        config access_profile profile_id ${profileId} 
        add access_id ${numberOfRules + 1} 
        ethernet destination_mac ${mac} 
        ethernet_type ${etherTypes.pppoeDiscovery} 
        port ${fullPortRange} 
        permit
      `;
      rules.push(discoveryRule);
      numberOfRules++;

      const sessionRule = `
        config access_profile profile_id ${profileId} 
        add access_id ${numberOfRules + 1} 
        ethernet destination_mac ${mac} 
        ethernet_type ${etherTypes.pppoeSession} 
        port ${fullPortRange} 
        permit
      `;
      rules.push(sessionRule);
      numberOfRules++;
    });

    return rules;
  };
  const createARPRules = (): string[] => {
    const rules: string[] = [];

    const arpRule = `
      config access_profile profile_id ${profileId} 
      add access_id ${numberOfRules + 1} 
      ethernet ethernet_type ${etherTypes.arp} 
      port ${fullPortRange} 
      permit
      `;
    rules.push(arpRule);
    numberOfRules++;

    return rules;
  };

  const sourceMacRules = createSourceMacRules();
  const destMacRules = createDestMacRules();
  const arpRules = createARPRules();

  const macRules = [...sourceMacRules, ...destMacRules, ...arpRules];

  return macRules;
}

export default createMacRules;
