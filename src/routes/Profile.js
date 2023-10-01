import { signOut } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import ProfileModal from "../components/ProfileModal";
import { auth, db, storage } from "../fbase";
import style from "./Profile.module.css";

const Profile = ({ userObj, userDisplayName, setUserDisplayName }) => {
  const [profileImg, setProfileImg] = useState({
    profileImg: "",
    newProfileImg: "",
  });
  const [modalOn, setModalOn] = useState(false);
  const onLogOutClick = () => signOut(auth);
  const onModalToggle = () => {
    setModalOn((prev) => !prev);
  };
  const getMyLtweets = async () => {
    const q = query(
      collection(db, "ltweets"),
      where("createrId", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );
    const ltweets = await getDocs(q);
    console.log(ltweets.docs.map((doc) => doc.data()));
  };
  const getUserData = async () => {
    const response = await (await getDoc(doc(db, "users", userObj.uid))).data();
    if (!response?.profileImgUrl) {
      const downloadUrl = await getDownloadURL(
        ref(storage, "default/user.png")
      );
      setProfileImg({
        newProfileImg: downloadUrl,
        profileImg: downloadUrl,
      });
    } else {
      setProfileImg({
        newProfileImg: response.profileImgUrl,
        profileImg: response.profileImgUrl,
      });
    }
  };
  useEffect(() => {
    // getMyLtweets();
    onSnapshot(doc(db, "users", userObj.uid), (snapshot) => {
      const response = snapshot.data();
      if (response?.profileImgUrl)
        setProfileImg({
          newProfileImg: response.profileImgUrl,
          profileImg: response.profileImgUrl,
        });
    });
    getUserData();
  }, []);
  return (
    <div className={style.profile__container}>
      <button onClick={onLogOutClick} className={style.logout}>
        Log Out
      </button>
      <div className={style.profile__img__cover}>
        {profileImg.profileImg && (
          <img
            src={profileImg.profileImg}
            alt={userDisplayName.displayName}
            className={style.profile__img}
          />
        )}
      </div>
      <h2 className={style.profile__name}>{userDisplayName.displayName}</h2>
      <button onClick={onModalToggle} className={style.edit__profile}>
        프로필 수정
      </button>
      {modalOn && (
        <ProfileModal
          userObj={userObj}
          userDisplayName={userDisplayName}
          setUserDisplayName={setUserDisplayName}
          onModalToggle={onModalToggle}
          profileImg={profileImg}
          setProfileImg={setProfileImg}
        />
      )}
    </div>
  );
};
export default Profile;
