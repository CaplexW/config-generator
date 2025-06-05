import type { EthernetTypes, IP, MAC, ValueOf } from "../data/commonData";

function createRule({
  profileId,
  ruleId,
  port,
  protocolValue,
  etherType,
  priority,
  action = 'deny',
  protocolDirection = 'src',
  protocol = 'ethernet',
}: RuleConfig): string {
  const rule = `
    config access_profile
    profile_id ${profileId}
    add access_id ${ruleId}
    ${protocol}
    ${protocolDirection === 'src' ? 'source_' : 'destination_'}${protocol === "ethernet" ? 'mac' : 'ip'}
    ${protocolValue}
    ${etherType ? `ethernet_type ${etherType}` : ''}
    port ${port}
    ${action}
    ${priority ? `priority ${priority}` : ''}
  `;

  return rule;
}

export default createRule;

export type NetworkProtocol =
  'ethernet'
  | "ip"
  | "tcp"
  | "udp"

export type RuleConfig = {
  profileId: number,
  ruleId: number,
  port: string | number,
  protocolValue: IP | MAC,
  action?: 'deny' | 'permit',
  etherType?: ValueOf<EthernetTypes>,
  priority?: number,
  protocolDirection?: 'src' | 'dest',
  protocol?: NetworkProtocol,
};
