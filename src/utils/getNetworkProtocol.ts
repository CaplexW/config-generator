import type { IP, MAC } from "../data/commonData";
import type { NetworkProtocol } from "./createRule";

export const isMac =  /^([0-9A-Fa-f]{2}-){5}[0-9A-Fa-f]{2}$/;

function getNetworkProtocol(adress: IP | MAC): NetworkProtocol {
  return isMac.test(adress) ? 'ethernet' : 'ip';
}

export default getNetworkProtocol;
