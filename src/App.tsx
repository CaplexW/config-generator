import './App.css'
import Display from './components/display'

function App() {
  const configList = [
    'create access_profile packet_content_mask offset1 l2 0 0xffff offset2 l3 8 0xff offset3 l4 2 0xffff profile_id 10',
    'config access_profile profile_id 10 add access_id 1 packet_content offset1 0x8864 offset1_mask 0xffff port 1-10 deny',
    'config access_profile profile_id 20 add access_id 25 ethernet ethernet_type 0x806 port 1-24 permit priority 1',
    'config access_profile profile_id 20 add access_id 25 ethernet ethernet_type 0x806 port 1-24 permit priority 1',
    'config access_profile profile_id 20 add access_id 25 ethernet ethernet_type 0x806 port 1-24 permit priority 1',
    'config access_profile profile_id 20 add access_id 25 ethernet ethernet_type 0x806 port 1-24 permit priority 1',
    'config access_profile profile_id 20 add access_id 25 ethernet ethernet_type 0x806 port 1-24 permit priority 1',
    'config access_profile profile_id 20 add access_id 25 ethernet ethernet_type 0x806 port 1-24 permit priority 1',
  ];

  return <Display src={configList} />
}

export default App
