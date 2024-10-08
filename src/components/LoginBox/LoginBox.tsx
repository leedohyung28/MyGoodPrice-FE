import { useState } from "react";
import KakaoLogin from "@/assets/imgs/Kakaologin.png";
import GoogleLogin from "@/assets/imgs/GoogleLogin.png";
import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia";
import { signInWithGoogle } from "@/firebase";
import { GoogleAuthProvider } from "firebase/auth";
import axios from "axios";
import useUserStore from "@/store/useUserStore";

export default function LoginBox() {
  const [values, setValues] = useState(["", ""]);
  const [show, setShow] = useState(false);
  const { setUserInfo } = useUserStore();
  const VITE_PRODUCTION_API_BASE_URL = import.meta.env
    .VITE_PRODUCTION_API_BASE_URL;

  const handleChange = (idx: number, value: string) => {
    const updatedValues = [...values];
    updatedValues[idx] = value;
    setValues(updatedValues);
  };

  const handleKakaoLogin = () => {
    const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${
      import.meta.env.VITE_KAKAO_REST_API_KEY
    }&redirect_uri=${import.meta.env.VITE_LOGIN_REDIRECT_URL}`;

    window.location.href = url;
  };

  const handleGoogleLogin = (e: any) => {
    const url = `${VITE_PRODUCTION_API_BASE_URL}/users/google`;
    e.preventDefault();
    signInWithGoogle()
      .then((res) => {
        const credential = GoogleAuthProvider.credentialFromResult(res);
        const accessToken = credential?.accessToken;
        const refreshToken = credential?.idToken;
        const userName = res.user.displayName;
        const userEmail = res.user.email;

        const data = {
          id: userEmail,
          name: userName,
          email: userEmail,
          access_token: accessToken,
          refresh_token: refreshToken,
        };

        axios
          .post(url, data, {
            withCredentials: true,
          })
          .then(() => {
            if (userName) {
              const userInfo = {
                id: userEmail,
                name: userName,
                provider: "google",
              };
              setUserInfo(userInfo);
              localStorage.setItem("userInfo", JSON.stringify(userInfo));
              window.location.href = "/mypage";
            }
          })
          .catch((error) => {
            console.error("서버 오류:", error);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="flex flex-col gap-4 p-2 items-center">
      <>
        <input
          className="w-full p-2 border rounded appearance-none"
          value={values[0]}
          type="email"
          placeholder="아이디"
          onChange={(e) => handleChange(0, e.target.value)}
        />
      </>
      <div className="relative w-full">
        <input
          className="w-full p-2 border rounded appearance-none"
          value={values[1]}
          type={show ? "text" : "password"}
          placeholder="비밀번호"
          onChange={(e) => handleChange(1, e.target.value)}
        />
        {show ? (
          <LiaEyeSolid
            className="absolute w-5 h-5 -translate-y-1/2 cursor-pointer top-1/2 right-4 text-subDarkColor"
            onClick={() => setShow(false)}
          />
        ) : (
          <LiaEyeSlashSolid
            className="absolute w-5 h-5 -translate-y-1/2 cursor-pointer top-1/2 right-4 text-subDarkColor"
            onClick={() => setShow(true)}
          />
        )}
      </div>
      <div className="flex items-center justify-center w-full h-16 p-2 font-bold border rounded-lg cursor-not-allowed bg-subDarkColor text-mainBrighterColor">
        <p className="text-xl">로그인</p>
      </div>
      <img
        src={KakaoLogin}
        alt="kakaoLogin"
        className="w-full h-16 cursor-pointer"
        onClick={handleKakaoLogin}
      />
      <img
        src={GoogleLogin}
        alt="googleLogin"
        className="w-full h-20 cursor-pointer"
        onClick={handleGoogleLogin}
      />

      <p className="text-center underline cursor-pointer text-subDarkColor">
        회원가입
      </p>
    </div>
  );
}
