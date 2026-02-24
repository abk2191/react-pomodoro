import { useState, useRef, useEffect } from "react";

const FULL_WIDTH = 280;

/* -------------------- messages -------------------- */

const HALF_WAY_MESSAGES = [
  "Halfway there",
  "You're halfway done",
  "50% completed",
  "Nice, halfway through",
  "Half the work is done",
];

const ALMOST_THERE_MESSAGES = [
  "Almost there",
  "Final stretch",
  "You’re close, keep going",
  "Just a little more",
  "Nearly done",
];

function getRandomMessage(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function App() {
  const [width, setWidth] = useState(FULL_WIDTH);
  const [displayTime, setDisplayTime] = useState("");
  const [message, setMessage] = useState("");
  const [showTimerButtons, setShowTimerButtons] = useState(true);
  const [totaltime, setTotalTime] = useState(null);

  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const durationMsRef = useRef(null);
  const sessionMinutesRef = useRef(null);

  const halfwayRef = useRef(false);
  const almostThereRef = useRef(false);
  const messageTimeoutRef = useRef(null);

  /* -------------------- persistence -------------------- */

  useEffect(() => {
    const saved = localStorage.getItem("pomodoroTotalTime");
    if (saved) setTotalTime(parseInt(saved, 10));
  }, []);

  useEffect(() => {
    if (totaltime !== null) {
      localStorage.setItem("pomodoroTotalTime", totaltime.toString());
    }
  }, [totaltime]);

  /* -------------------- helpers -------------------- */

  function showTime(minutes) {
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    }
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m === 0
      ? `${h} hour${h !== 1 ? "s" : ""}`
      : `${h} hour${h !== 1 ? "s" : ""} ${m} minute${m !== 1 ? "s" : ""}`;
  }

  function showTempMessage(text) {
    setMessage(text);

    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }

    messageTimeoutRef.current = setTimeout(() => {
      setMessage("");
    }, 3000);
  }

  function clearTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);

    setWidth(FULL_WIDTH);
    setDisplayTime("");
    setMessage("");
    setShowTimerButtons(true);

    localStorage.removeItem("pomodoroTotalTime");
    setTotalTime(0);
  }

  /* -------------------- core logic -------------------- */

  function startPomodoro(min) {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);

    const now = Date.now();

    startTimeRef.current = now;
    durationMsRef.current = min * 60 * 1000;
    endTimeRef.current = now + durationMsRef.current;
    sessionMinutesRef.current = min;

    halfwayRef.current = false;
    almostThereRef.current = false;

    setMessage("");
    setShowTimerButtons(false);
    setDisplayTime(`${min}:00`);
    setWidth(FULL_WIDTH);

    intervalRef.current = setInterval(tick, 250);
  }

  function tick() {
    const now = Date.now();
    const remainingMs = endTimeRef.current - now;

    if (remainingMs <= 0) {
      finishPomodoro();
      return;
    }

    const progress = remainingMs / durationMsRef.current;

    // ⏳ Halfway (50%)
    if (progress <= 0.5 && !halfwayRef.current) {
      halfwayRef.current = true;
      showTempMessage(getRandomMessage(HALF_WAY_MESSAGES));
    }

    // 🔥 Almost there (33% left)
    if (progress <= 1 / 3 && !almostThereRef.current) {
      almostThereRef.current = true;
      showTempMessage(getRandomMessage(ALMOST_THERE_MESSAGES));
    }

    const totalSeconds = Math.ceil(remainingMs / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    setDisplayTime(`${mins}:${secs < 10 ? "0" + secs : secs}`);

    setWidth(FULL_WIDTH * progress);
  }

  function finishPomodoro() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);

    setWidth(0);
    setDisplayTime("✅ Completed!");
    setMessage("");
    setShowTimerButtons(true);
    setTotalTime((prev) =>
      prev ? prev + sessionMinutesRef.current : sessionMinutesRef.current,
    );
  }

  /* -------------------- UI -------------------- */

  return (
    <div className="container">
      <div className="total-time-display">
        <h3>POMODORO</h3>
        <p>Time Completed: {totaltime ? showTime(totaltime) : "0 minutes"}</p>
        <button className="clear-timer-button" onClick={clearTimer}>
          Clear Timer
        </button>
      </div>

      <div className="timer-display">
        <h1 className="timeDisplay">{displayTime}</h1>
        <div className="message-container">
          {message && <p className="milestone-message">{message}</p>}
        </div>
      </div>

      <div className="wrapper">
        <div className="inner-wrapper" style={{ width }} />
      </div>

      <div className="placeholder">
        {showTimerButtons && (
          <div className="time-buttons-div">
            <button className="time-buttons" onClick={() => startPomodoro(5)}>
              5 min
            </button>
            <button className="time-buttons" onClick={() => startPomodoro(15)}>
              15 min
            </button>
            <button className="time-buttons" onClick={() => startPomodoro(30)}>
              30 min
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
