import React, { useEffect, useState } from 'react'
import styles from "./monitors.module.css"
import commmonStyles from "../../commmonStyles/commonStyles.module.css"
import { useNavigate } from 'react-router-dom'
import { Select, MenuItem } from '@mui/material'
import axios from 'axios'
import MiniTimeHrTimeline from '../../components/MiniTimeHrTimeline/MiniTimeHrTimeline'

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
    const [monitorList, setMonitorList] = useState([
        {
            "created_at": "2024-09-10T10:27:18.869657+00:00",
            "interval": 300.0,
            "path": "https://www.npmjs.com/",
            "status": true
        },
        {
            "created_at": "2024-09-10T10:29:14.697783+00:00",
            "interval": 300.0,
            "path": "https://cozy-selkie-e18d80.netlify.app",
            "status": true
        }
    ])

    useEffect(() => {
        const fetchMonitorList = async (user_id) => {
            let resp
            try {
                resp = await axios.post("http://localhost:6969/fetch-monitor-list", {
                    user_id
                })
                let data = resp.data
                setMonitorList([...data])
            }
            catch (e) {
                console.log(e)
            }
        }
        fetchMonitorList(1);
        const intervalId = setInterval(() => {
            fetchMonitorList(1);
        }, 1000 * 60 * 1);

        // Cleanup function to clear the interval when the component unmounts
        return () => {
            clearInterval(intervalId);
        };
    }, [])
    const utilsSecToMin = (sec) => {
        return sec / 60
    }
    const utilsFormatDate = (date) => {
        const parsedDate = new Date(date);

        // Extract day, month, and year in two digits
        const day = String(parsedDate.getDate()).padStart(2, '0');
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = String(parsedDate.getFullYear()).slice(-2); // Get the last two digits of the year

        // Extract hours and minutes
        const hours = String(parsedDate.getHours()).padStart(2, '0');
        const minutes = String(parsedDate.getMinutes()).padStart(2, '0');

        // Format the date as DD-MM-YY TIME
        return `${day}-${month}-${year} ${hours}:${minutes}`;
    };

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
                            {monitorList.map((monitor) => (
                                <div className={styles.monitor} key={monitor.id}
                                    style={{ borderColor: monitor.status ? "green" : "red" }}
                                > {/* Ensure each child has a unique key */}
                                    <div>
                                        <div>{monitor.path}</div>
                                    </div>
                                    <div>Interval: {utilsSecToMin(monitor.interval)} min</div>
                                    <div>Created At: {utilsFormatDate(monitor.created_at)}</div>
                                    <div>
                                       <MiniTimeHrTimeline data={monitor.logs}></MiniTimeHrTimeline>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

            }
        </div>
    )
}

export default Monitors
