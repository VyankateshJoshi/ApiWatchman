import React, { useEffect, useState } from 'react'
import styles from "./NewTracker.module.css"
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import HttpIcon from '@mui/icons-material/Http';
import commmonStyles from "../commmonStyles/commonStyles.module.css"
import CustomSlider from '../components/CustomSlider/CustomSlider';
import { MenuItem, nativeSelectClasses, Select, Slider } from '@mui/material';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const labels = {
  1: '5 minutes',
  2: '15 minutes',
  3: '30 minutes',
  4: '1 hours',
  5: '4 hours',
  6: '6 hours',
  7: '12 hours',
  8: '24 hours',
};
const httpMethodNames = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'HEAD',
];

function NewTracker() {
  const [url, setUrl] = useState("https://")
  const [interval, setInterval] = useState(1)
  const [requestTimeOut, setRequestTimeOut] = useState(1)
  const [selectedMethod, setSelectedMethod] = useState('HEAD')
  const [requestBody, setRequestBody] = useState({})
  const [disableSubmit, setDisableSubmit] = useState(true)
  const navigate = useNavigate()
  const handleChangeInterval = (event, newValue) => {
    setInterval(newValue);
  };
  const handleChangeRequestTimeOut = (event, newValue) => {
    setRequestTimeOut(newValue);
  };
  const isValidURL = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  useEffect(() => {
    // Enable button if URL is valid
    setDisableSubmit(!isValidURL(url));
  }, [url]);
  const handleCreateMonitor = async () => {
    let resp
    try {
      resp = await axios.post("http://localhost:6969/add-monitor", {
        "path": url,
        "method": selectedMethod,
        "interval": `${labels[interval]}`,
        "timeout": `${requestTimeOut} seconds`,
        "request_body": requestBody,
        "response_body": {},
        "query_params": {},
        "headers": { "Accept": "application/json" },
        "user_id": 1
      })
      console.log(resp)
      toast("New Watchmen Added")
      setTimeout(() => {
        navigate("/monitors")
      }, 1000);
    }
    catch (e) {
      console.log(e)
    }
  }
  return (
    <div className={styles.container}>
      <ToastContainer />
      <button className={commmonStyles.secondary_btn_m} onClick={() => navigate("/monitors")}><ArrowBackIosIcon sx={{ height: "10px" }} />Back</button>
      <div className={styles.heading}>Add Tracker</div>
      <div className={styles.form}>
        <div className={styles.protocolInfo}>
          <div className={styles.protocolHeading}>
            <HttpIcon sx={{ height: "52px", width: "52px", backgroundColor: "" }} /> <div> HTTP / website monitoring</div>
          </div>
          <div className={styles.protocolbody}>
            Use an HTTP(S) monitor to track your website, API endpoint, or any service running on HTTP.
          </div>
        </div>
        <hr></hr>
        <div>Url to monitor</div>
        <input value={url} onChange={(e) => setUrl(e.target.value)} className={styles.url_Input} />
        <div className={styles.sliderContainer}>
          <div>
            Your tracker will be checked your Api after every  <b>{labels[interval]}</b>.
          </div>
          <CustomSlider handleOnChange={handleChangeInterval} value={interval}></CustomSlider>
        </div>
        <hr></hr>
        <div className={styles.sliderContainer}>
          <div>
            Request Time out after {requestTimeOut}.
          </div>
          <Slider
            defaultValue={30}
            min={1}
            max={60}
            onChange={handleChangeRequestTimeOut}
            value={requestTimeOut}
            aria-label="Small"
            valueLabelDisplay="auto"
            sz
            marks={[
              {
                value: 1,
                label: '1s',
              },
              {
                value: 60,
                label: '60s',
              },
            ]}
          />
        </div>
        <div className={styles.methodDropDownContainer}>
          <div>Http Method Type</div>
          <Select
            value={selectedMethod}
            label=""
            onChange={(e) => { setSelectedMethod(e.target.value) }}
            sx={{ marginTop: "10px", width: "13%" }}
          >
            {
              httpMethodNames.map((method) => <MenuItem value={method}>{method}</MenuItem>)
            }
          </Select>
          <div>Request body</div>
          <JSONInput
            id='a_unique_id'
            placeholder={requestBody}
            onChange={(value) => setRequestBody(value)}
            locale={locale}
            height='200px'
            width='100%'
            style={{ borderRadius: "10px" }}
          />
        </div>

        <button onClick={handleCreateMonitor} disabled={disableSubmit} className={commmonStyles.primary_btn_l}>Create WatchMen</button>
      </div>

    </div>
  )
}
export default NewTracker
