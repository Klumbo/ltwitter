import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { addDoc, collection, query, setDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { useState } from "react";
import { auth, db, storage } from "../../fbase";
import style from "./AuthForm.module.css";

const AuthForm = ({ newAccount }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let data;
      if (newAccount) {
        data = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        data = await signInWithEmailAndPassword(auth, email, password);
      }
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className={style.login__form}>
        <input
          name="email"
          type="text"
          placeholder="이메일"
          required
          onChange={onChange}
          className={style.input}
        />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          required
          onChange={onChange}
          className={style.input}
        />
        <input
          type="submit"
          value={newAccount ? "회원가입" : "로그인"}
          className={style.button}
        />
        <span style={{ color: "red" }}>{error}</span>
      </form>
    </>
  );
};
export default AuthForm;
