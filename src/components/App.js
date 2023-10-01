import { useEffect, useState } from "react";
import AppRouter from "./router";
import { auth, db, storage } from "../fbase";
import { updateCurrentUser, updateProfile } from "firebase/auth";
import Initialize from "./Initialize";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const [userDisplayName, setUserDisplayName] = useState({
    displayName: "",
    newDisplayName: "",
  });
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user && !user.displayName) {
        updateProfile(user, { displayName: "사용자" });
        initSetting();
      }
      console.log(user);
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);
        loadUserName(user);
      } else setIsLoggedIn(false);
      setInit(true);
    });
  }, []);
  const initSetting = async () => {
    const downloadUrl = await getDownloadURL(ref(storage, "default/user.png"));
    const userData = {
      uid: auth.currentUser.uid,
      displayName: auth.currentUser.displayName
        ? auth.currentUser.displayName
        : "사용자",
      profileImgUrl: downloadUrl,
    };
    await setDoc(doc(db, "users", auth.currentUser.uid), userData);
  };
  const loadUserName = async (user) => {
    const userData = (await getDoc(doc(db, "users", user.uid))).data();
    if (userData)
      setUserDisplayName({
        displayName: userData.displayName,
        newDisplayName: userData.displayName,
      });
    else
      setUserDisplayName({
        displayName: "사용자",
        newDisplayName: "사용자",
      });
  };
  const refreshUser = async () => {
    await updateCurrentUser(auth, auth.currentUser);
    setUserObj(auth.currentUser);
  };
  console.log(auth);
  return (
    <div>
      {init ? (
        <AppRouter
          isLoggedIn={isLoggedIn}
          userObj={userObj}
          refreshUser={refreshUser}
          userDisplayName={userDisplayName}
          setUserDisplayName={setUserDisplayName}
        />
      ) : (
        <Initialize />
      )}
    </div>
  );
}

export default App;
