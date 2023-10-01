import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Ltweet from "../components/Ltweet";
import { db, storage } from "../fbase";
import style from "./Home.module.css";
import { getDownloadURL, ref } from "firebase/storage";
import { Link } from "react-router-dom";
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
    test();
  }, []);
  const test = async () => {
    const downloadUrl = await getDownloadURL(ref(storage, "default/user.png"));
    console.log(downloadUrl);
  };
  return (
    <div>
      <div className={style.create__post}>
        <button>
          <Link to="create">새로운 이야기를 작성해보세요!</Link>
        </button>
      </div>
      <div className={style.ltweets}>
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
