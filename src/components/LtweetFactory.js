import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { db, storage } from "../fbase";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection } from "firebase/firestore";
import { useRef, useState } from "react";

function LtweetFactory({ userObj }) {
  const [ltweet, setLtweet] = useState("");
  const fileRef = useRef();
  const [attachment, setAttachment] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(response.ref);
    }
    const ltweetObj = {
      text: ltweet,
      createdAt: new Date(),
      createrId: userObj.uid,
      attachmentUrl,
    };
    addDoc(collection(db, "ltweets"), ltweetObj);
    setLtweet("");
    setAttachment("");
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setLtweet(value);
  };
  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishevent) => {
      const {
        currentTarget: { result },
      } = finishevent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => {
    setAttachment(null);
    console.log(fileRef.current);
    fileRef.current.value = "";
  };
  return (
    <form onSubmit={onSubmit}>
      <input
        onChange={onChange}
        value={ltweet}
        type="text"
        placeholder="What's on your mind?"
        maxLength={120}
      />
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        ref={fileRef}
      />
      <input type="submit" value="ltweet" />
      {attachment && (
        <div>
          <img alt={attachment} src={attachment} width="50px" height="50px" />
          <button onClick={onClearAttachment}>Clear</button>
        </div>
      )}
    </form>
  );
}
export default LtweetFactory;
