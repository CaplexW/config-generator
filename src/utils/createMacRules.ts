import commonData, { type EthernetTypes, type IP, type MAC, type PortRange, type PortsInfo, type ValueOf } from "../data/commonData";
import ACL from "./acl";
import type { NetworkProtocol } from "./createRule";

function createMacRules(ports: PortsInfo, profileId: number, portSequence: boolean = false): ConfigBlock {
  const { broadcastMac, nodesMacList, etherTypes } = commonData;

  let numberOfRules = 0;

  const accessProfile = `
    create access_profile 
    ethernet 
    source_mac FF-FF-FF-FF-FF-F0 
    destination_mac FF-FF-FF-FF-FF-F0 
    ethernet_type 
    profile_id ${profileId}`;

  const baseRuleConfig = {
    profileId,
    portSequence,
  };

  const configureRules = (
    list: MAC[] | IP[],
    config: ACLRuleSubConfig,
  ) => {
    const rules = ACL.createRuleFromList(list, { ...config, ruleId: numberOfRules });
    numberOfRules += rules.length;

    return rules;
  };

  const commonIncomeMac = configureRules(nodesMacList, {
    ...baseRuleConfig,
    action: 'deny',
    portRange: ports.common,
    ruleTarget: {
      direction: 'source',
    },
  });
  const fullOutBroadcastMac = configureRules([broadcastMac], {
    ...baseRuleConfig,
    action: 'permit',
    portRange: ports.full,
    ehterType: [etherTypes.pppoeDiscovery],
    priority: 3,
    ruleTarget: {
      direction: 'destination',
    },
  });
  const fullOutMacRules = configureRules(nodesMacList, {
    ...baseRuleConfig,
    action: 'permit',
    portRange: ports.full,
    ehterType: [etherTypes.pppoeDiscovery, etherTypes.pppoeSession],
    priority: 3,
    ruleTarget: {
      direction: 'destination',
    },
  });
  const specialIncomeMac = configureRules(nodesMacList, {
    ...baseRuleConfig,
    action: 'permit',
    portRange: ports.special,
    ehterType: [etherTypes.pppoeDiscovery, etherTypes.pppoeSession],
    priority: 3,
    ruleTarget: {
      direction: 'source',
    }
  });
  const commonArpRules = [ACL.createRule({
    ...baseRuleConfig,
    ruleId: numberOfRules + 1,
    portRange: ports.common,
    protocol: 'ethernet',
    ehterType: etherTypes.arp,
    action: 'permit',
    priority: 1,
  })];

  const macRules = {
    header: accessProfile,
    blocks: [
      commonIncomeMac,
      fullOutBroadcastMac,
      fullOutMacRules,
      specialIncomeMac,
      commonArpRules,
    ],
  };

  return macRules;
}

export default createMacRules;

export type ConfigBlock = {
  header: string,
  blocks: RuleBlock[],
}
export type RuleBlock = string[];
export type ACLRuleSubConfig = {
  profileId: number,
  portSequence: boolean,
  action: 'permit' | 'deny',
  portRange: PortRange,
  ruleId?: number;
  protocol?: NetworkProtocol;
  priority?: number,
  ehterType?: ValueOf<EthernetTypes> | ValueOf<EthernetTypes>[];
  ruleTarget?: {
    value?: IP | MAC;
    direction: 'source' | 'destination';
    subProtocol?: 'tcp' | 'udp';
  };
};