import './App.css'
import Display from './components/display'
import createMacRules from './utils/createMacRules'

function App() {
  const configList = createMacRules(20);

  return <Display src={configList} />
}

export default App
