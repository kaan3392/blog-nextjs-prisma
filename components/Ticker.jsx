import style from "../styles/Ticker.module.css";
import { useEffect, useState } from "react";

export default function Ticker(props) {
  const [repeats, setRepeats] = useState(0);
  const [shift, setShift] = useState(0);
  const [spf, setSpf] = useState(10);
  const [pause, setPause] = useState(false);

  let timer;

  const scrollBy = (pixels) => {
    timer =
      !timer &&
      setInterval(() => {
        setShift((prevShift) => prevShift + pixels);
      }, 10);
    if (pause) {
      setShift((prevShift) => prevShift - pixels);
    }
    const screenWidth = document.getElementById("tickerWrapper").clientWidth;
    const totalLength = document.getElementById("tickerVanilla").clientWidth;
    setShift(shift % totalLength);
    const remaining = totalLength - shift;
    let extension = document.getElementById("tickerExtension");
    setRepeats(Math.ceil((screenWidth - remaining) / totalLength));
  };

  useEffect(() => {
    scrollBy(1);
    return () => clearInterval(timer);
  }, [shift]);

  const arrayForRepeats = Array.apply(null, { length: repeats }).map(
    Number.call,
    Number
  );

  const separator = "◈";

  return (
    <div className={style.ticker}>
      <div
        id="tickerWrapper"
        onMouseEnter={() => {
          setPause(true);
        }}
        onMouseLeave={() => {
          setPause(false);
        }}
      >
        <div
          className={style.tickerRow}
          style={{ position: "relative", left: "-" + shift + "px" }}
        >
          <div className={style.tickerRow} id="tickerVanilla">
            {props.messages.map((message, index) => (
              <div key={index}>
                {message}&nbsp;&nbsp;{separator}&nbsp;&nbsp;
              </div>
            ))}
          </div>
          <div className={style.tickerRow} id="tickerExtension">
            {arrayForRepeats.map((repeat, indexTwo) => (
              <div className={style.tickerRow} key={indexTwo}>
                {props.messages.map((message, index) => (
                  <div key={index}>
                    {message}&nbsp;&nbsp;{separator}&nbsp;&nbsp;
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
