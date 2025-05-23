const commonData: DataStorage = {
  broadcastMac: 'FF-FF-FF-FF-FF-F0',
  nodesMacList: [
    '30-F7-0D-3E-85-00',
    '30-F7-0D-3E-85-01',
    '30-F7-0D-3E-85-02',
    '30-F7-0D-3E-85-03',
    '00-26-99-30-DC-10',
    '00-26-99-30-DC-17',
    '00-26-99-30-DC-19',
    '00-15-17-50-8F-D0',
    '00-15-17-50-8F-D3',
    '00-0C-F1-FD-1A-B0',
    '00-0C-F1-FD-1A-B8',
    '02-00-02-06-02-60',
  ],
  etherTypes: {
    arp: '0x008',
    pppoeDiscovery: '0x8863',
    pppoeSession: '0x8864',
  },
  acl: {
    macBasedProfileId: 20,
  }
};

export default commonData;

type MacList = string[];
type DataStorage = {
  broadcastMac: 'FF-FF-FF-FF-FF-F0',
  nodesMacList: MacList,
  etherTypes: EthernetTypes,
  acl: ACLData,
};
type EthernetTypes = {
  arp: '0x008',
  pppoeDiscovery: '0x8863',
  pppoeSession: '0x8864',
};
export type PortsInfo = {
  common: { start: number, end: number },
  special: { start: number, end: number },
}
export type ACLData = {
  macBasedProfileId: number,
}
