import { Link } from "react-router-dom";
import style from "./Header.module.css";

const Header = ({ userObj, userDisplayName }) => {
  return (
    <div className={style.header}>
      <h1>
        <Link to="/">CONNEC</Link>{" "}
        <span>
          by.{" "}
          {userDisplayName.displayName ? userDisplayName.displayName : "사용자"}
        </span>
      </h1>
    </div>
  );
};

export default Header;
