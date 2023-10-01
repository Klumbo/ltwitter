import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { db, storage } from "../fbase";
import style from "./EditPost.module.css";
import { useNavigate, useParams } from "react-router-dom";
import imageCompression from "browser-image-compression";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import { uuidv4 } from "@firebase/util";

const CreatePost = ({ userObj }) => {
  const navigate = useNavigate();
  const [newText, setNewText] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    image: "",
  });
  const [newImgFile, setNewImgFile] = useState("");
  const [newImgName, setNewImgName] = useState("");
  const getUser = async () => {
    const userDoc = await (await getDoc(doc(db, "users", userObj.uid))).data();
    setUserData({ name: userDoc.displayName, image: userDoc.profileImgUrl });
  };

  const textOnChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewText(value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    let attachmentUrl = "";
    if (newImgFile !== "") {
      const attachmentRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        newImgFile,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(response.ref);
    }
    const ltweetObj = {
      text: newText,
      createdAt: new Date(),
      createrId: userObj.uid,
      attachmentUrl,
      id: uuidv4(),
    };
    addDoc(collection(db, "ltweets"), ltweetObj);
    navigate("/");
  };
  const onFileChange = async (e) => {
    const {
      target: { files },
    } = e;
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 400,
    };
    try {
      setNewImgName(files[0].name);
      const compressedFile = await imageCompression(files[0], options);
      const result = await imageCompression.getDataUrlFromFile(compressedFile);
      setNewImgFile(result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <div className={style.edit__post}>
      <div className={style.ltweet__container}>
        <div className={style.ltweet__header}>
          <div className={style.creater__info}>
            <div className={style.creater__img__box}>
              {userData.image && (
                <img src={userData.image} alt={userData.name} />
              )}
            </div>
            <span>{userData.name}</span>
          </div>
        </div>
        <hr />
        <>
          <div className={style.img__zone}>
            {newImgFile && (
              <img src={newImgFile} alt={userData.name} width="360px" />
            )}
          </div>
          <form onSubmit={onSubmit}>
            <div className={style.change__img}>
              <input type="file" accept="image/*" onChange={onFileChange} />
              <span>
                {newImgName ? newImgName : "사진을 추가하거나 바꾸려면 클릭"}
              </span>
            </div>
            <textarea
              className={style.post__text}
              value={newText}
              onChange={textOnChange}
            ></textarea>
            <div className={style.buttons__area}>
              <button>글쓰기</button>
            </div>
          </form>
        </>
      </div>
    </div>
  );
};
export default CreatePost;
