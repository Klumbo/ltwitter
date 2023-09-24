import React, { useState } from "react";
import { db, storage } from "../fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
const Ltweet = ({ ltweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newLtweet, setNewLtweet] = useState(ltweetObj.text);
  const onDeleteClick = () => {
    const ok = window.confirm("정말로 삭제하시겠습니까?");
    if (ok) {
      deleteDoc(doc(db, "ltweets", ltweetObj.id));
      deleteObject(ref(storage, ltweetObj.attachmentUrl));
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = (e) => {
    e.preventDefault();
    updateDoc(doc(db, "ltweets", ltweetObj.id), { text: newLtweet });
    setEditing(false);
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewLtweet(value);
  };
  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input required value={newLtweet} onChange={onChange}></input>
            <input type="submit" value="Update ltweet"></input>
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{ltweetObj.text}</h4>
          {ltweetObj.attachmentUrl && (
            <img
              src={ltweetObj.attachmentUrl}
              alt={ltweetObj.attachmentUrl}
              width="50px"
              height="50px"
            />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete ltweet</button>
              <button onClick={toggleEditing}>Edit ltweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Ltweet;
