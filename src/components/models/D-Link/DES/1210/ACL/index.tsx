import type { PortsInfo } from "../../../../../../data/commonData";
import commonData from "../../../../../../data/commonData";
import MacSourceDestProfile from "./macBasedRules";

function ACL({ ports }: { ports: PortsInfo }) {
  const { acl } = commonData;
  return (
    <div className="acl">
      <MacSourceDestProfile ports={ports} profileId={acl.macBasedProfileId} />
    </div>
  )
}

export default ACL;