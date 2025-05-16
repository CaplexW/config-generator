import type { PortsInfo } from "../../../../../data/commonData";
import ACL from "./ACL";

function DES_1228({ numberOfPorts, portConfig = 'default' }: SwitchProps) {
  const generateDefaultPortConfig = (): PortsInfo => {
    const portsConfig = {
      common: { start: 1, end: numberOfPorts - 2 },
      special: { start: numberOfPorts - 1, end: numberOfPorts },
    };
    return portsConfig;
  }
  
  return (
    <div className="switch">
      <ACL ports={portConfig === 'default' ? generateDefaultPortConfig() : portConfig} />
    </div>
  )
}

export default DES_1228;

export type SwitchProps = {
  numberOfPorts: number,
  portConfig?: PortsInfo | 'default'
};
