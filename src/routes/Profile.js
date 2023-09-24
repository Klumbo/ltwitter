import { signOut, updateProfile } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../fbase";

const Profile = ({ userObj, refreshUser }) => {
  const [newDisplayName, setNewDisplayName] = useState(
    userObj.displayName ? userObj.displayName : "사용자"
  );
  const displayNameChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDisplayName(value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName && userObj.displayName !== newDisplayName) {
      await updateProfile(userObj, { displayName: newDisplayName });
      refreshUser();
    } else if (!userObj.displayName) {
      await updateProfile(userObj, { displayName: newDisplayName });
      refreshUser();
    }
  };
  const onLogOutClick = () => signOut(auth);
  const getMyLtweets = async () => {
    const q = query(
      collection(db, "ltweets"),
      where("createrId", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );
    const ltweets = await getDocs(q);
    console.log(ltweets.docs.map((doc) => doc.data()));
  };
  useEffect(() => {
    getMyLtweets();
  }, []);
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={newDisplayName}
          onChange={displayNameChange}
        />
        <input type="submit" value="이름 변경" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};
export default Profile;
