import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Ltweet from "../components/Ltweet";
import { db } from "../fbase";
import LtweetFactory from "../components/LtweetFactory";
const Home = ({ userObj }) => {
  const [ltweets, setLtweets] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "ltweets"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      const ltweetsArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLtweets(ltweetsArray);
    });
  }, []);

  return (
    <div>
      <LtweetFactory userObj={userObj} />
      <div>
        {ltweets.map((ltweet) => (
          <Ltweet
            key={ltweet.id}
            ltweetObj={ltweet}
            isOwner={ltweet.createrId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
