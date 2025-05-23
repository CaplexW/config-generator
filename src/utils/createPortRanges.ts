import type { PortsInfo } from '../data/commonData';

function createPortRanges(portsConfig: PortsInfo ): PortRanges {
  return {
    commonPortRange: `${portsConfig.common.start}-${portsConfig.common.end}`,
    specialPortRange: `${portsConfig.special.start}-${portsConfig.special.end}`,
    fullPortRange: `${portsConfig.common.start}-${portsConfig.special.end}`,
  };
}

export default createPortRanges;

export type PortRanges = {
  commonPortRange: string,
  specialPortRange: string,
  fullPortRange: string,
}
