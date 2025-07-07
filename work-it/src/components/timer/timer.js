import { useEffect, useState, useRef } from "react";
import "./CountdownTimer.css";
import Alarm from '../music/Alarm';


function CountdownTimer() {
  const [seconds, setSeconds] = useState(900);
  const [isActive, setIsActive] = useState(false);
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState("00:15:00");
  const [soundOn, setSoundOn] = useState(true);
  const alarmRef = useRef(null);

  useEffect(() => {
    if (!alarmRef.current) {
        alarmRef.current = new Alarm();
    }
  }, []); 

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
            const nextSeconds = prevSeconds - 1;
            if (nextSeconds <= 0) {
                clearInterval(interval);
                setIsActive(false);
                if (soundOn) {
                    alarmRef.current.start();
                }
                return 0;
            }
            return nextSeconds;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, soundOn]);
  
  const stopAlarm = () => {
      if (alarmRef.current) {
          alarmRef.current.stop();
      }
  };

  const startCountdown = async () => {
    if (seconds > 0) {
      if(alarmRef.current) {
          await alarmRef.current.prepare();
      }
      stopAlarm();
      setIsActive(true);
    }
  };

  const resetCountdown = () => {
    setSeconds(900);
    setInputValue("00:15:00");
    setIsActive(false);
    stopAlarm();
  };

  const toggleSound = () => {
    setSoundOn((prev) => {
      const newState = !prev;
      if (!newState) {
        stopAlarm();
      }
      return newState;
    });
  };

  const handleOptionClick = (time) => {
    setSeconds(time);
    setIsActive(false);
    stopAlarm();
    setInputValue(formatToHHMMSS(time));
  };

  const applyCustomTime = () => {
    let raw = inputValue.replace(/\D/g, "");
    raw = raw.slice(0, 6).padStart(6, "0");
    const hours = Number(raw.slice(0, 2));
    const minutes = Number(raw.slice(2, 4));
    const secs = Number(raw.slice(4, 6));
    const totalSecs = hours * 3600 + minutes * 60 + secs;

    setSeconds(totalSecs);
    setInputValue(formatToHHMMSS(totalSecs)); 
    setIsActive(false);
    stopAlarm();
    setEditing(false);
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  const handleTimerClick = () => {
    setEditing(true);
    setInputValue(formatToHHMMSS(seconds));
  };

  const formatToHHMMSS = (totalSeconds) => {
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${secs}`;
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  return (
    <div className="timer-wrapper">
      <div className="timer-container">
        <button className="volume-button" onClick={toggleSound} title={soundOn ? "Sound On" : "Sound Off"}>
          <span className="material-symbols-outlined">
            {soundOn ? "volume_up" : "volume_off"}
          </span>
        </button>
      {editing ? (
        <input
            className="timer-input"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={applyCustomTime}
            onKeyDown={(e) => e.key === "Enter" && applyCustomTime()}
            autoFocus
            placeholder="HH:MM:SS"
          />
      ) : (
        <h1 className="timer" onClick={handleTimerClick}>
          {formatTime(seconds)}
        </h1>
      )}
        <div className="option-buttons">
          <button onClick={() => handleOptionClick(60)} className="button">1 min</button>
          <button onClick={() => handleOptionClick(300)} className="button">5 min</button>
          <button onClick={() => handleOptionClick(1800)} className="button">30 min</button>
        </div>
        <div className="actions">
          <button onClick={startCountdown} disabled={isActive || seconds === 0} className="action-button">Start</button>
          <button onClick={resetCountdown} className="action-button" style={{ marginLeft: "10px" }}>Reset</button>
        </div>
      </div>
    </div>
  );
}


export default CountdownTimer;
