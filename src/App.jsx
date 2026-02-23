import { useState, useRef, useEffect } from "react";

function App() {
  const [width, setWidth] = useState(280);
  const [displayTime, setDisplayTime] = useState("");
  const [showTimerButtons, setShowTimerButtons] = useState(true);
  const [totaltime, setTotalTime] = useState(null);
  // Use refs to store interval IDs so they persist across renders
  const widthIntervalRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const timeoutRef = useRef(null);

  // Load totaltime from localStorage on component mount
  useEffect(() => {
    const savedTime = localStorage.getItem("pomodoroTotalTime");
    if (savedTime) {
      setTotalTime(parseInt(savedTime, 10));
    }
  }, []);

  // Save totaltime to localStorage whenever it changes
  useEffect(() => {
    if (totaltime !== null) {
      localStorage.setItem("pomodoroTotalTime", totaltime.toString());
    }
  }, [totaltime]);

  function showTime(minutes) {
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;

      if (remainingMinutes === 0) {
        return `${hours} hour${hours !== 1 ? "s" : ""}`;
      } else {
        return `${hours} hour${hours !== 1 ? "s" : ""} ${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`;
      }
    }
  }

  function clearTimer() {
    // Clear all intervals and timeouts
    if (widthIntervalRef.current) clearInterval(widthIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Reset to default values
    setWidth(280);
    setDisplayTime("");
    setShowTimerButtons(true);

    // Clear localStorage and set totaltime to 0
    localStorage.removeItem("pomodoroTotalTime");
    setTotalTime(0);
  }

  function startTimer(min) {
    // Clear any existing intervals/timeouts
    if (widthIntervalRef.current) clearInterval(widthIntervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Reset width to 400px
    setWidth(280);
    setShowTimerButtons(false);

    let decreaseAmount;
    let totalMilliseconds;

    if (min === 5) {
      decreaseAmount = 280 / 300;
      totalMilliseconds = 300000;
    } else if (min === 15) {
      decreaseAmount = 280 / 900;
      totalMilliseconds = 900000;
    } else {
      decreaseAmount = 280 / 1800;
      totalMilliseconds = 1800000;
    }

    widthIntervalRef.current = setInterval(() => {
      setWidth((prev) => {
        const newWidth = prev - decreaseAmount;
        return newWidth < 0 ? 0 : newWidth;
      });
    }, 1000);

    timeoutRef.current = setTimeout(() => {
      clearInterval(widthIntervalRef.current);
    }, totalMilliseconds);
  }

  function countdownTimer(min) {
    // Clear any existing timer interval
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    // Reset display time
    setDisplayTime("");

    let totalSeconds = min * 60;

    // Display initial time
    const initialFormatted = `${min}:00`;
    setDisplayTime(initialFormatted);

    timerIntervalRef.current = setInterval(() => {
      totalSeconds -= 1;

      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      const formattedTime = `${mins}:${secs < 10 ? "0" + secs : secs}`;

      setDisplayTime(formattedTime);

      if (totalSeconds <= 0) {
        setWidth(0); // force final state
        setDisplayTime("✅️ Completed!");
        setShowTimerButtons(true);
        setTotalTime((prev) => (prev ? prev + min : min));
        clearInterval(widthIntervalRef.current); // stop shrinking
        clearInterval(timerIntervalRef.current);
      }
    }, 1000);
  }

  function handleButtonClick(min) {
    // Clear both timers and reset everything
    if (widthIntervalRef.current) clearInterval(widthIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Reset to default values
    setWidth(280);
    setDisplayTime("");

    // Start fresh
    startTimer(min);
    countdownTimer(min);
  }

  return (
    <>
      <div className="container">
        <div className="total-time-display">
          <h3>POMODORO Timer</h3>
          <p>Time Completed: {totaltime ? showTime(totaltime) : "0 minutes"}</p>
          <button className="clear-timer-button" onClick={clearTimer}>
            Clear Timer
          </button>
        </div>
        <div className="timer-display">
          <h1 className="timeDisplay">{displayTime}</h1>
        </div>
        <div className="wrapper">
          <div className="inner-wrapper" style={{ width: width }}></div>
        </div>
        <div className="placeholder">
          {showTimerButtons && (
            <div className="time-buttons-div">
              <button
                className="time-buttons"
                onClick={() => handleButtonClick(5)}
              >
                5 min
              </button>
              <button
                className="time-buttons"
                onClick={() => handleButtonClick(15)}
              >
                15 min
              </button>
              <button
                className="time-buttons"
                onClick={() => handleButtonClick(30)}
              >
                30 min
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
