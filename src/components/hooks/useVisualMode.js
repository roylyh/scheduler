import { useState } from "react";

const useVisualMode = (initial) => {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace=false) => {
    if (!replace) {
      setHistory(prev => ([...prev, newMode]));
      // setHistory([...history, newMode]);
    }
    setMode(newMode);
  };

  const back = () => {
    if (history.length > 1) {
      setMode(history[history.length - 2]);
      setHistory(
        prev => prev.filter((_, i) => {
          return i !== prev.length - 1;
        })
      );
    } else{
      console.log("Aready at initial");
    }
  };
  return { mode, transition, back };
};

export default useVisualMode;
