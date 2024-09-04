import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import commonStyls from "./commmonStyles/commonStyles.module.css"
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div style={{display:"flex",flexDirection:"column" ,gap:"10px"}}>
        <h4>primary buttons</h4>
        <button className={commonStyls.primary_btn_sm}>small</button>
        <button className={commonStyls.primary_btn_m}>medium</button>
        <button className={commonStyls.primary_btn_m}>large</button>
      </div>
      <div style={{display:"flex",flexDirection:"column" ,gap:"10px"}}>
        <h4>secondary buttons</h4>
        <button className={commonStyls.secondary_btn_sm}>small</button>
        <button className={commonStyls.secondary_btn_m}>medium</button>
        <button className={commonStyls.secondary_btn_m}>large</button>
      </div>
    </>
  )
}

export default App
