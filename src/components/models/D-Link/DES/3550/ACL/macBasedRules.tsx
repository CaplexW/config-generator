import type { PortsInfo } from "../../../../../../data/commonData";
import createMacRules from "../../../../../../utils/createMacRules";
import Display from "../../../../../display/display";

function MacSourceDestProfile({ ports, profileId, portSequence }: { ports: PortsInfo, profileId: number, portSequence:boolean }) {
  const configList = createMacRules(ports, profileId, portSequence);

  return <Display src={configList} />
}

export default MacSourceDestProfile;
