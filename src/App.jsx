import { useState, useRef } from "react";

function App() {
  const [width, setWidth] = useState(280);
  const [displayTime, setDisplayTime] = useState("");
  const [showTimerButtons, setShowTimerButtons] = useState(true);

  // Use refs to store interval IDs so they persist across renders
  const widthIntervalRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const timeoutRef = useRef(null);

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
      decreaseAmount = 400 / 300;
      totalMilliseconds = 300000;
    } else if (min === 15) {
      decreaseAmount = 400 / 900;
      totalMilliseconds = 900000;
    } else {
      decreaseAmount = 400 / 1800;
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
      setShowTimerButtons(true);
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
        setDisplayTime("✅️ Completed!");
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
    setWidth(400);
    setDisplayTime("");

    // Start fresh
    startTimer(min);
    countdownTimer(min);
  }

  return (
    <>
      <div className="container">
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
