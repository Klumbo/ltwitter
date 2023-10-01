import React, { useEffect, useState } from "react";
import { db, storage } from "../fbase";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import style from "./Ltweet.module.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link, redirect } from "react-router-dom";

const Ltweet = ({ ltweetObj, isOwner }) => {
  const [creater, setCreater] = useState({
    name: "",
    image: "",
  });
  const onDeleteClick = () => {
    const ok = window.confirm("정말로 삭제하시겠습니까?");
    if (ok) {
      deleteDoc(doc(db, "ltweets", ltweetObj.id));
      deleteObject(ref(storage, ltweetObj.attachmentUrl));
    }
  };
  const getUserData = async () => {
    const createrData = await (
      await getDoc(doc(db, "users", ltweetObj.createrId))
    ).data();
    setCreater({
      image: createrData.profileImgUrl,
      name: createrData.displayName,
    });
  };
  useEffect(() => {
    getUserData();
  }, []);
  return (
    <div className={style.ltweet}>
      <div className={style.ltweet__container}>
        <div className={style.ltweet__header}>
          <div className={style.creater__info}>
            <div className={style.creater__img__box}>
              {creater.image && <img src={creater.image} alt={creater.name} />}
            </div>
            <span>{creater.name}</span>
          </div>
          {isOwner && (
            <div className={style.dropdown}>
              <button className={style.dropdown__btn}>
                <BsThreeDotsVertical />
              </button>

              <div className={style.dropdown__content}>
                <button onClick={onDeleteClick}>삭제</button>
                <Link to={`update/${ltweetObj.id}`}>
                  <button>수정</button>
                </Link>
              </div>
            </div>
          )}
        </div>
        <hr />
        {ltweetObj.attachmentUrl && (
          <div className={style.img__zone}>
            <img
              src={ltweetObj.attachmentUrl}
              alt={ltweetObj.attachmentUrl}
              width="360px"
            />
          </div>
        )}
        <h4 className={style.context}>{ltweetObj.text}</h4>
      </div>
    </div>
  );
};

export default Ltweet;
