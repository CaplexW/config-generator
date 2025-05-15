import './App.css'
import Display from './components/display'
import DES_1210 from './components/models/D-Link/DES/1210'
import createMacRules from './utils/createMacRules'

function App() {
  return <DES_1210 numberOfPorts={26} />
}

export default App
