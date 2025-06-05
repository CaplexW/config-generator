import type { EthernetTypes, IP, MAC, PortRange, ValueOf } from "../data/commonData";
import type { NetworkProtocol } from "./createRule";
import getNetworkProtocol, { isMac } from "./getNetworkProtocol";

const ACL = {
  createRule: (rule: ACLRuleConfig) => {
    return `
      config
      access_profile
      profile_id ${rule.profileId}
      add
      access_id ${rule.ruleId}
      ${rule.protocol}
      ${rule.ruleTarget ? `
        ${rule.ruleTarget.direction}_${isMac.test(rule.ruleTarget.value) ? 'mac' : 'ip'} 
        ${rule.ruleTarget.value}
        `
        : ''}
      ${rule.ehterType ? `ethernet_type ${rule.ehterType}` : ''}
      port ${rule.ports}
      ${rule.action}
      ${rule.priority ? `priority ${rule.priority}` : ''}
    `;
  },
  createRuleFromList: (list: MAC[] | IP[], rule: ACLRuleConfig, numberOfRules: number, portSequence: boolean = false) => {
    const { portRange } = rule;
    console.log(portRange);
    if (portRange === undefined) throw 'portRange property is not defined in createRuleFromList argument. This property could not be undefined in this function argument.';

    if (portSequence) {
      const result = list.flatMap((item) => {
        if (rule.ehterType && Array.isArray(rule.ehterType)) {
          const rules = rule.ehterType.flatMap((type) => {
            const currentRule: ACLRuleConfig = {
              ...rule,
              ruleId: numberOfRules + 1,
              ports: `${portRange.start}-${portRange.end}`,
              protocol: getNetworkProtocol(item),
              ehterType: type,
            };
            if (currentRule.ruleTarget) currentRule.ruleTarget.value = item;

            return ACL.createRule(currentRule);
          })

          return rules;
        } else {
          const itemRules: string[] = [];
          for (let currentPort = portRange.start; currentPort <= portRange.end; currentPort++) {
            const currentRule: ACLRuleConfig = {
              ...rule,
              ruleId: numberOfRules + 1,
              ports: currentPort,
              protocol: getNetworkProtocol(item),
            };
            if (currentRule.ruleTarget) currentRule.ruleTarget.value = item;

            console.log(currentRule)
            itemRules.push(ACL.createRule(currentRule));
            numberOfRules++;
          }
          return itemRules;
        }
      });

      return result;
    } else {
      const result = list.map((item) => {
        if (rule.ehterType && Array.isArray(rule.ehterType)) {
          const rules = rule.ehterType.flatMap((type) => {
            const currentRule: ACLRuleConfig = {
              ...rule,
              ruleId: numberOfRules + 1,
              ports: `${portRange.start}-${portRange.end}`,
              protocol: getNetworkProtocol(item),
              ehterType: type,
            };
            if (currentRule.ruleTarget) currentRule.ruleTarget.value = item;

            return ACL.createRule(currentRule);
          })

          return rules;
        } else {
          const currentRule: ACLRuleConfig = {
            ...rule,
            ruleId: numberOfRules + 1,
            ports: `${portRange.start}-${portRange.end}`,
            protocol: getNetworkProtocol(item),
          }
          if (currentRule.ruleTarget) currentRule.ruleTarget.value = item;

          numberOfRules++;
          return ACL.createRule(currentRule);
        }
      });

      return result;
    }
  }
}

export type ACLRuleConfig = {
  profileId: number;
  action: 'permit' | 'deny',
  ruleId?: number;
  protocol?: NetworkProtocol;
  ports?: number | string;
  portRange?: PortRange,
  priority?: number,
  ehterType?: ValueOf<EthernetTypes> | ValueOf<EthernetTypes>[];
  ruleTarget?: {
    value?: IP | MAC;
    direction: 'source' | 'destination';
    subProtocol?: 'tcp' | 'udp';
  };
};

export default ACL;
