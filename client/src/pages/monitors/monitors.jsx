import React, { useState } from 'react'
import styles from "./monitors.module.css"
import commmonStyles from "../../commmonStyles/commonStyles.module.css"
import { useNavigate } from 'react-router-dom'
function Monitors() {
    const [monitors ,setMonitors] = useState([])
    const navigate = useNavigate()
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>Trackers </h3>
                <button  onClick={()=>navigate("/new")} className={commmonStyles.primary_btn_m}>New Tracker</button>
            </div>
            {
                monitors?.length === 0 &&
            <div className={styles.body}>
                <h1 className={styles.body_heading}>
                    Track your website with a single click.
                </h1>
                <h4 className={styles.data}>
                    Stay informed about your website, API, email service, or any network port or device. Track our servers to keep tabs on cron jobs and stay ahead of critical incidents.
                </h4>
                <h4>Get started now and be fully set up in less than 30 seconds! ⚡</h4>
            </div>
}
        </div>
    )
}

export default Monitors
