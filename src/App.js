import './App.css';
import {useState} from "react";


function App() {

  const [displayTime, setDisplayTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [sessionTime, setSessionTime] = useState(25 * 60);
  const [timerOn, setTimerOn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  //const [Sound, setSound] = useState(new Audio("/beep-06.mp3"));

  const playSound = (Sound) => {
    Sound.currentTime = 0;
    Sound.play();
  };

  const formatTime = (time) => {
    let min = Math.trunc(time / 60);
    let sec = time % 60;
    return(
      (min < 10 ? "0" + min : min) + ":" + 
      (sec < 10 ? "0" + sec : sec)
    );
  }

  const changeTime = (amount, type) => {
    if(type === "break"){
      if (breakTime <= 0 && amount < 0){
        return;
      }
      setBreakTime((prev) => prev + amount);
    } else {
      if (sessionTime <= 0 && amount < 0){
        return;
      }
      setSessionTime((prev) => prev + amount);
      if (!(timerOn)){
        setDisplayTime(sessionTime + amount)
      }
    }
  }

  const controlTime = () => {
    let audio1 = new Audio("/wait.mp3");
    let audio2 = new Audio("/beep-06.mp3");
    let duration = displayTime;
    let onBreakVariable = onBreak;
    if (!(timerOn)){
      let interval = setInterval(()=>{
        duration -= 1;
        setDisplayTime(duration);
        if (duration <= 0 && !(onBreakVariable)){
          playSound(audio1);
          onBreakVariable = true;
          setOnBreak(true);
          duration = breakTime + 1;
        } else if (duration <= 0 && onBreakVariable){
          playSound(audio2);
          onBreakVariable = false;
          setOnBreak(false);
          duration = sessionTime + 1;
        }
      }, 1000);
      localStorage.clear();
      localStorage.setItem("intervalId", interval);
    }
    if(timerOn){
      clearInterval(localStorage.getItem("intervalId"));
    }
    setTimerOn(!timerOn);
  }

  const resetTime = () => {
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
    setOnBreak(false);
  }


  return (
    <div className="main center-align">
      <h3>25 + 5 Clock</h3>

      <div className="dual-container">
        <Length title={"Break Length"} changeTime={changeTime} type={"break"} time={breakTime} formatTime={formatTime} />
        <Length title={"Session Length"} changeTime={changeTime} type={"play"} time={sessionTime} formatTime={formatTime} />
      </div>

      <div className="grid-session">
      <h4>{onBreak ? "Break" : "Session"}</h4>
      <h2>{formatTime(displayTime)}</h2>
      <button onClick={() => controlTime()} className="btn-large red lighten-2">
        {timerOn ?
          <i className="material-icons">pause_circle_filled</i>
          :
          <i className="material-icons">play_circle_filled</i>
        }
      </button>
      <button onClick={() => resetTime()} className="btn-large red lighten-2">
        <i className="material-icons">refresh</i>
      </button>
      </div>

    </div>
  );
}

function Length({title, changeTime, type, time, formatTime}){
  return (
    <div>
      <h4>{title}</h4>
      <div className="time-sets">
        <button onClick={()=>changeTime(-60, type)} className="btn-small red lighten-2">
          <i className="material-icons">arrow_downward</i>
        </button>
        <h4>{formatTime(time)}</h4>
        <button onClick={()=>changeTime(60, type)} className="btn-small red lighten-2">
          <i className="material-icons">arrow_upward</i>
        </button>
      </div>
    </div>
  );
}

export default App;
