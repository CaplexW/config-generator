import type { PortsInfo } from "../../../../../../data/commonData";
import createMacRules from "../../../../../../utils/createMacRules";
import Display from "../../../../../display/display";

function MacSourceDestProfile({ ports, profileId }: { ports: PortsInfo, profileId: number }) {
  const configList = createMacRules(ports, profileId);

  return <Display src={configList} />
}

export default MacSourceDestProfile;
