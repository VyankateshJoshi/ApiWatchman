import React, { useState } from 'react'
import styles from "./monitors.module.css"
import commmonStyles from "../../commmonStyles/commonStyles.module.css"
import { useNavigate } from 'react-router-dom'
import { Select, MenuItem } from '@mui/material'

const sortNames = [
    "A To Z",
    "Z To A",
    "Oldest First",
    "Newest First"
]
function Monitors() {
    const [monitors, setMonitors] = useState([1])
    const [search, setSearch] = useState("")
    const [selectedSort, setSelectedSort] = useState("A To Z")

    const navigate = useNavigate()
    return (
        <div className={styles.container}>

            {
                monitors?.length === 0 ?
                    <div>
                        <div className={styles.header}>
                            <h3>Trackers </h3>
                            <button onClick={() => navigate("/new")} className={commmonStyles.primary_btn_m}>New Tracker</button>
                        </div>
                        <div className={styles.body}>
                            <h1 className={styles.body_heading}>
                                Track your website with a single click.
                            </h1>
                            <h4 className={styles.data}>
                                Stay informed about your website, API, email service, or any network port or device. Track our servers to keep tabs on cron jobs and stay ahead of critical incidents.
                            </h4>
                            <h4>Get started now and be fully set up in less than 30 seconds! ⚡</h4>
                        </div>
                    </div>
                    :
                    <div className={styles.mainContent}>
                        <div className={styles.header}>
                            <h3>Trackers </h3>
                            <button onClick={() => navigate("/new")} className={commmonStyles.primary_btn_m}>New Tracker</button>
                        </div>
                        <div className={styles.filtersContainer}>
                            <input placeholder='  Search by Url' type='text' className={styles.searchBox} />
                            <Select
                                value={selectedSort}
                                label=""
                                size='small'
                                onChange={(e) => { setSelectedSort(e.target.value) }}
                                sx={{ width: "13%" }}
                            >
                                {
                                    sortNames.map((names) => <MenuItem value={names}>{names}</MenuItem>)
                                }
                            </Select>
                        </div>
                        <div className={styles.monitorsListContainer}>
                              
                        </div>
                    </div>

            }
        </div>
    )
}

export default Monitors
