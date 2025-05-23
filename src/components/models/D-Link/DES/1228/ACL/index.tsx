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


// Список задач для ACL
//  L2
//    1. Запретить входящий трафик с MAC_LIST для клиентских портов.
//    2. Разрешить исходящий PPPoE-трафик на MAC_LIST и BROADCAST_MAC для всех портов
//      с приоритетом 3
//    3. Разрешить входящий трафик с MAC_LIST для служебных портов
//      с приоритетом 3
//    4. Разрешить APR-трафик для клиентских портов
//      с приоритетом 1
//  L3
//    1. Разрешить входящий трафик с CLIENT_IP_LIST для клиентских портов
//      для [0.0.0.0, 172.17.0.0, 172.27.0.0] с приоритетом 1
//      для [239.255.0.0] с приоритетом 4
//      для [172.23.0.0] с приоритетом 5
//    2. Рахрешить входящий трафик с SERV_IP_LIST для служебных портов
//      c приоритетом 7
//    3. Запретить входящий трафик с ZERO_MAC для клиентских портов
//    4. Запретить CPU для всех портов
//    5. Включить cpu_interface фильтр
//  L4
//    1. Запретить исходящий трафик с DANGER_TCP_PORTS для клиентских портов
//    2. Запретить исходящий трафик с DANGER_UDP_PORTS для клиентских портов
//  Другое
//    1. Запретить трафик содержащий DANGER_PACKETS проводя инспекцию через оффсеты
// 
