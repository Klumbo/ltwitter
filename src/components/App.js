import { useEffect, useState } from "react";
import AppRouter from "./router";
import { auth } from "../fbase";
import { updateCurrentUser } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);
      } else setIsLoggedIn(false);
      setInit(true);
    });
  }, []);
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
        />
      ) : (
        "Initializing..."
      )}
    </div>
  );
}

export default App;
