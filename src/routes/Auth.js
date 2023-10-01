import React, { useState } from "react";
import AuthForm from "../components/auth/AuthForm";
import AuthGraphic from "../components/auth/AuthGraphic";
import AuthSocialForm from "../components/auth/AuthSocialForm";
import style from "./Auth.module.css";

const Auth = () => {
  const [newAccount, setNewAccount] = useState(false);
  const toggleAccount = () => setNewAccount((prev) => !prev);

  return (
    <div className={style.contents__box}>
      <AuthGraphic />
      <div>
        <div className={style.contents__box2}>
          <h1 className={style.title}>CONNEC</h1>
          <div>
            <AuthForm newAccount={newAccount} />
          </div>
          {!newAccount && (
            <>
              <span className={style.social__title}>소셜 로그인</span>
              <div className={style.social__login}>
                <AuthSocialForm />
              </div>
            </>
          )}
        </div>
        <div className={style.create__account}>
          계정이 {newAccount ? "있다면" : "없으신가요"}?{" "}
          <span onClick={toggleAccount}>
            {newAccount ? "로그인" : "가입하기"}
          </span>
        </div>
      </div>
    </div>
  );
};
export default Auth;
