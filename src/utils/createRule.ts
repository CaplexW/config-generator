function createRule(
  profileId: number,
  ruleId: number,
  port: string | number,
  protocolTarget: IP | MAC,
  action: 'deny' | 'permit' = 'deny',
  protocolDirection: 'src' | 'dest' = 'src',
  protocol: NetworkProtocol = 'ethernet',
): string {
  const rule = `
    confing access_profile ${profileId}
    profile_id ${ruleId}
    ${protocol}
    ${protocolDirection === 'src' ? 'source_' : 'destination_'}+${protocol}
    ${protocolTarget}
    ${port}
    ${action}
  `;

  return rule;
}

export default createRule;

export type NetworkProtocol =
  'ethernet'
  | "ip"
  | "tcp"
  | "udp"

type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

type IP = `${Digit}.${Digit}.${Digit}.${Digit}`;
type MAC = `${string}-${string}-${string}-${string}-${string}-${string}`;
