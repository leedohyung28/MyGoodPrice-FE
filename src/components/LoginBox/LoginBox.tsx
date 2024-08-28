import { useState } from "react";
import KakaoLogin from "@/assets/imgs/Kakaologin.png";
import GoogleLogin from "@/assets/imgs/GoogleLogin.png";
import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia";

export default function LoginBox() {
  const [values, setValues] = useState(["", ""]);
  const [show, setShow] = useState(false);
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

  const handleGoogleLogin = async () => {
    const url = `${VITE_PRODUCTION_API_BASE_URL}/auth/google`;
    window.location.href = url;
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
        onClick={() => handleGoogleLogin()}
      />

      <p className="text-center underline cursor-pointer text-subDarkColor">
        회원가입
      </p>
    </div>
  );
}
