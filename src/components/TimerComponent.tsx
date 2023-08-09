import { FC, useEffect } from "react";
import "../styles/TimerComponentStyle.css";
 
export const TimerComponent: FC<{
  props: number,
  setProps: any,
  setIsTimeUp: Function,
}> = ({ props, setProps, setIsTimeUp }) => {
 
  let timer: any;
 
  useEffect(() => {
      props > 0 && timeout()
      if (props === 0)
        finishedCounting();
      return () => {
        clearTimeout(timer);
    }
  }, [props]);
 
  function finishedCounting() {
    setIsTimeUp();
  }
 
  function timeout() {
    return timer = window.setTimeout(() => { setProps(props - 1) }, 1000)
  }
 
  return (
    <div className="timerComponent" >
      <div className="timerPoligon">
      </div>
      <div className="timerCounter">
        {props}
      </div>
    </div>
  );
}