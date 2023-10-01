import {
  getAdditionalUserInfo,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db, storage } from "../../fbase";
import { BsGithub, BsGoogle } from "react-icons/bs";
import style from "./AuthSocialForm.module.css";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
const AuthSocialForm = () => {
  const onSocialClick = async (event) => {
    const {
      currentTarget: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    const data = await signInWithPopup(auth, provider);
    const { isNewUser } = getAdditionalUserInfo(data);
    const downloadUrl = await getDownloadURL(ref(storage, "default/user.png"));
    if (isNewUser) {
      const userData = {
        uid: auth.currentUser.uid,
        displayName: auth.currentUser.displayName
          ? auth.currentUser.displayName
          : "사용자",
        profileImgUrl: downloadUrl,
      };
      const added = await setDoc(
        doc(db, "users", auth.currentUser.uid),
        userData
      );
      console.log(added);
    }
  };
  return (
    <>
      <button
        name="google"
        onClick={onSocialClick}
        className={style.social__login}
      >
        <div>
          <BsGoogle />
        </div>
        <div>Google 계정으로 계속</div>
      </button>
      <button
        name="github"
        onClick={onSocialClick}
        className={style.social__login}
      >
        <div>
          <BsGithub />
        </div>
        <div>Github 계정으로 계속</div>
      </button>
    </>
  );
};

export default AuthSocialForm;
