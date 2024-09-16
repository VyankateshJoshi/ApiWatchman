import React, { useEffect, useState } from 'react'
import styles from "./MiniTimeHrTimeline.module.css"
import { Tooltip } from '@mui/material'
function MiniTimeHrTimeline({ data }) {
    const [numberOfHr, setNumberOfHr] = useState([])
    useEffect(() => {
        if (data) {
            setNumberOfHr(data)
        }
    }, [data])
    return (
        <div className={styles.container}>

            {numberOfHr.map((hourData) => <Tooltip title={hourData.time} placement='top'><div style={{ backgroundColor: hourData.status ? "green" : "red" }} className={styles.hourBlock}></div>
            </Tooltip>)}
        </div>
    )
}

export default MiniTimeHrTimeline
