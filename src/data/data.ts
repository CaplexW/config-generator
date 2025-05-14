const data: DataStorage = {
  macList: [
    '30-F7-0D-3E-85-00',
    '30-F7-0D-3E-85-01',
    '30-F7-0D-3E-85-02',
    '30-F7-0D-3E-85-03',
    '00-26-99-30-DC-10',
    '00-26-99-30-DC-17',
    '00-26-99-30-DC-19',
  ],
  etherTypes: {
    arp: '0x008',
    pppoeDiscovery: '0x8863',
    pppoeSession: '0x8864',
  },
  ports: {
    common: { start: 1, end: 24 },
    special: { start: 25, end: 25 },
  }
};

export default data;

type MacList = string[];
type DataStorage = {
  macList: MacList,
  etherTypes: EthernetTypes,
  ports: PortsInfo,
};
type EthernetTypes = {
  arp: '0x008',
  pppoeDiscovery: '0x8863',
  pppoeSession: '0x8864',
};
type PortsInfo = {
  common: { start: number, end: number },
  special: { start: number, end: number },
}
