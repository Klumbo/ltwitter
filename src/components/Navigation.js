import React from "react";
import { Link } from "react-router-dom";
import style from "./Navigation.module.css";
import { AiOutlineHome } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
const Navigation = () => (
  <nav className={style.navigation}>
    <ul>
      <li>
        <Link to="/">
          <AiOutlineHome />
        </Link>
      </li>
      <div className={style.parsor}></div>
      <li>
        <Link to="/profile">
          <BsPersonCircle />
        </Link>
      </li>
    </ul>
  </nav>
);
export default Navigation;
