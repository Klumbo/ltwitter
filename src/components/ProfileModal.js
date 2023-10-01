import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useState } from "react";
import { db, storage } from "../fbase";
import style from "./ProfileModal.module.css";
import imageCompression from "browser-image-compression";

const ProfileModal = ({
  userObj,
  userDisplayName,
  setUserDisplayName,
  onModalToggle,
  profileImg,
  setProfileImg,
}) => {
  const [fileName, setFileName] = useState("클릭 또는 드래그하여 사진 업로드");
  const [imgChanged, setImageChanged] = useState(false);
  const [waiting, setWating] = useState(false);
  const onSubmit = async (e) => {
    e.preventDefault();
    setWating(true);
    if (
      userDisplayName.newDisplayName !== "" &&
      userDisplayName.newDisplayName !== userDisplayName.displayName
    ) {
      await updateDoc(doc(db, "users", userObj.uid), {
        displayName: userDisplayName.newDisplayName,
      });
      setUserDisplayName((prev) => ({
        ...prev,
        displayName: prev.newDisplayName,
      }));
    }
    if (imgChanged) {
      const fileRef = ref(storage, `profile/${userObj.uid}`);
      const response = await uploadString(
        fileRef,
        profileImg.newProfileImg,
        "data_url"
      );
      const profileUrl = await getDownloadURL(response.ref);
      await updateDoc(doc(db, "users", userObj.uid), {
        profileImgUrl: profileUrl,
      });
    }
    onModalToggle();
  };
  const displayNameChange = (e) => {
    const {
      target: { value },
    } = e;
    setUserDisplayName((prev) => ({ ...prev, newDisplayName: value }));
  };
  const onFileChange = async (e) => {
    const {
      target: { files },
    } = e;
    if (!files[0]) return;
    const name = files[0].name;
    setFileName(name.length < 16 ? name : name.slice(0, 12) + "...");
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 400,
    };
    try {
      const compressedFile = await imageCompression(files[0], options);

      const result = await imageCompression.getDataUrlFromFile(compressedFile);
      setProfileImg((prev) => ({
        ...prev,
        newProfileImg: result,
      }));
      setImageChanged(true);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={style.modal__wrap}>
      <div className={style.modal__content}>
        <div className={style.modal__close}>
          <span className={style.close__btn} onClick={onModalToggle}>
            &times;
          </span>
        </div>
        <div className={style.modal__body}>
          <h1>프로필 수정</h1>
          {profileImg.newProfileImg && (
            <div className={style.profile__img__cover}>
              <img
                src={profileImg.newProfileImg}
                alt={userDisplayName.displayName}
                className={style.profile__img}
              />
            </div>
          )}
          <form onSubmit={onSubmit} className={style.change}>
            <div className={style.change__img}>
              <input type="file" accept="image/*" onChange={onFileChange} />
              <span>{fileName}</span>
            </div>
            <div className={style.change__name__box}>
              <label htmlFor="userDisplayName">닉네임</label>
              <input
                name="userDisplayName"
                type="text"
                value={userDisplayName.newDisplayName}
                onChange={displayNameChange}
                className={style.change__name}
              />
            </div>
            <input
              type="submit"
              value={waiting ? "수정중..." : "수정하기"}
              className={waiting ? style.block : style.change__submit}
              disabled={waiting}
            />
          </form>
        </div>
      </div>
    </div>
  );
};
export default ProfileModal;
