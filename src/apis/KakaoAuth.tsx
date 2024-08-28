import useUserStore from "@/store/useUserStore";
import axios from "axios";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const KakaoAuth = () => {
  const navigate = useNavigate();
  const hasPageBeenRendered = useRef({ effect: false });
  const { setUserInfo, userInfo } = useUserStore();

  useEffect(() => {
    const fetchCode = async () => {
      const CODE = new URLSearchParams(window.location.search).get("code");

      if (CODE) {
        try {
          const user = await axios.post(
            `${import.meta.env.VITE_PRODUCTION_API_BASE_URL}/users/kakao`,
            {
              code: CODE,
            },
            {
              withCredentials: true,
            }
          );
          setUserInfo({
            ...userInfo,
            id: user.data.id,
            name: user.data.name,
            provider: "kakao",
          });
          navigate("/mypage");
        } catch (error) {
          console.error("Error fetching cookie:", error);
        }
      }
    };

    if (!hasPageBeenRendered.current["effect"]) {
      fetchCode();
      hasPageBeenRendered.current["effect"] = true;
    }
  }, []);

  return null;
};

export default KakaoAuth;
