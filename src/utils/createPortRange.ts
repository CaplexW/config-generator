import type { PortsInfo } from './../data/commonData';
function createPortRange(portsConfig: PortsInfo[keyof PortsInfo]  ): string {
  return `${portsConfig.start}-${portsConfig.end}`;
}

export default createPortRange;
