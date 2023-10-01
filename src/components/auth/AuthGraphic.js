import { useEffect, useRef } from "react";
import style from "./AuthGraphic.module.css";
const AuthGraphic = () => {
  const firstLineRef = useRef();
  const secondLineRef = useRef();
  useEffect(() => {
    setTimeout(() => {
      secondLineRef.current.style.opacity = 1;
      firstLineRef.current.classList = [style.write__complete];
    }, 2100);
  }, []);
  return (
    <div className={style.graphic__container}>
      <div className={style.typewriter} ref={firstLineRef}>
        <h1>Make A</h1>
      </div>
      <div className={style.typewriter}>
        <h1 ref={secondLineRef}>New Connetion!</h1>
      </div>
    </div>
  );
};
export default AuthGraphic;
