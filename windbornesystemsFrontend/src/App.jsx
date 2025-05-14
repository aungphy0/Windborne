import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Windborne from './components/Windborne'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Windborne />
    </>
  )
}

export default App
