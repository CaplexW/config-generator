import type { PortsInfo } from "../../../../../data/commonData";
import ACL from "./ACL";

function DES_3550({ portConfig = 'default' }: SwitchProps) {
  const numberOfPorts = 50;
  const generateDefaultPortConfig = (): PortsInfo => {
    const portsConfig = {
      common: { start: 1, end: numberOfPorts - 2 },
      special: { start: numberOfPorts - 1, end: numberOfPorts },
      full: { start: 1, end: numberOfPorts },
    };
    return portsConfig;
  }

  return (
    <div className="switch">
      <ACL ports={portConfig === 'default' ? generateDefaultPortConfig() : portConfig} portSequence={true} />
    </div>
  )
}

export default DES_3550;

export type SwitchProps = {
  numberOfPorts: number,
  portConfig?: PortsInfo | 'default'
};
