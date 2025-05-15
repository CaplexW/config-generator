import type { PortsInfo } from "../../../../../data/commonData";
import ACL from "./ACL";

function DES_1210({ numberOfPorts, portConfig = 'default' }: SwitchProps) {
  const generateDefaultPortConfig = (): PortsInfo => {
    const portsArray = new Array(numberOfPorts).fill(null);
    const portsConfig = {
      common: { start: 1, end: portsArray.length - 2 },
      special: { start: portsArray.length - 1, end: numberOfPorts },
    };
    return portsConfig;
  }
  return (
    <div className="switch">
      <ACL ports={portConfig === 'default' ? generateDefaultPortConfig() : portConfig} />
    </div>
  )
}

export default DES_1210;

export type SwitchProps = {
  numberOfPorts: number,
  portConfig?: PortsInfo | 'default'
};
