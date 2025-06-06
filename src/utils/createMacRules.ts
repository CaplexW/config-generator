import commonData, { type IP, type MAC, type PortsInfo } from "../data/commonData";
import ACL, { type ACLRuleConfig } from "./acl";
import createPortRanges from "./createPortRanges";
import createRule, { type RuleConfig } from "./createRule";

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

  function configureRules(
    list: MAC[] | IP[],
    config: ACLRuleConfig,
    increment = list.length
  ) {
    const rules = ACL.createRuleFromList(list, { ...config, ruleId: numberOfRules });
    numberOfRules += increment;
    return rules;
  };
  

  const commonIncomeMac = ACL.createRuleFromList(nodesMacList, {
    profileId,
    action: 'deny',
    portRange: ports.common,
    ruleTarget: {
      direction: 'source',
    },
  }, numberOfRules);
  numberOfRules += commonIncomeMac.length;

  const fullOutBroadcastMac = ACL.createRuleFromList([broadcastMac], {
    profileId,
    action: 'permit',
    portRange: ports.full,
    ehterType: [etherTypes.pppoeDiscovery],
    priority: 3,
    ruleTarget: {
      direction: 'destination',
    },
  }, numberOfRules);
  numberOfRules += 1;

  const fullOutMacRules = ACL.createRuleFromList(nodesMacList, {
    profileId,
    action: 'permit',
    portRange: ports.full,
    ehterType: [etherTypes.pppoeDiscovery, etherTypes.pppoeSession],
    priority: 3,
    ruleTarget: {
      direction: 'destination',
    },
  }, numberOfRules);
  numberOfRules += fullOutMacRules.length;

  const specialIncomeMac = ACL.createRuleFromList(nodesMacList, {
    profileId,
    action: 'permit',
    portRange: ports.special,
    ehterType: [etherTypes.pppoeDiscovery, etherTypes.pppoeSession],
    priority: 3,
    ruleTarget: {
      direction: 'source',
    }
  }, numberOfRules);
  numberOfRules += specialIncomeMac.length;

  const commonArpRules = [ACL.createRule({
    profileId,
    ruleId: numberOfRules,
    portRange: ports.common,
    protocol: 'ethernet',
    ehterType: etherTypes.arp,
    action: 'permit',
    priority: 1,
  })];
  numberOfRules += commonArpRules.length;

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

