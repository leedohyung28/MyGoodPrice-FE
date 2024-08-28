import { useEffect, useState, MouseEvent } from "react";
import formatPrice from "@/utils/getUtil";
import { ShopTypes } from "@/types";
import useUserStore from "@/store/useUserStore";
import { Review } from "@/components/Review/Review";
import Loading from "@/components/Loading/LoadingBar";
import { PiCurrencyKrwFill } from "react-icons/pi";
import { BsTelephone } from "react-icons/bs";
import { BiCategoryAlt } from "react-icons/bi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import useShopStore from "@/store/useShopStore";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const [shopData, setShopData] = useState<ShopTypes>();

  const { loading, setLoading } = useUserStore();
  const { userInfo, setUserInfo } = useUserStore();
  const { toggleLikeShop } = useShopStore();

  useEffect(() => {
    const fetchShopData = async () => {
      const id = searchParams.get("id");
      if (id) {
        try {
          setLoading(true);
          const url = `${
            import.meta.env.VITE_PRODUCTION_API_BASE_URL
          }/stores/${id}`;
          const response = await axios.get(url);
          setShopData(response.data);
          setLoading(false);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchShopData();
  }, [searchParams, setLoading]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_PRODUCTION_API_BASE_URL}/likes/my/kakao`,
          { withCredentials: true }
        );
        setUserInfo({ likes: response.data });
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserInfo();
  }, []);

  const toggleLikes = async (e: MouseEvent, id: string) => {
    e.stopPropagation();
    const url = `${import.meta.env.VITE_PRODUCTION_API_BASE_URL}/likes`;
    let storedLikes = localStorage.getItem("likes");
    let likesArray: string[] = storedLikes ? JSON.parse(storedLikes) : [];

    if (userInfo.likes.includes(id)) {
      await axios.delete(url, { data: { storeId: id }, withCredentials: true });
      const updatedLikes = userInfo.likes.filter((likeId) => likeId !== id);
      setUserInfo({ likes: updatedLikes });
      toggleLikeShop(id, true);

      likesArray = likesArray.filter((likeId) => likeId !== id);
      localStorage.setItem("likes", JSON.stringify(likesArray));

      if (shopData) {
        setShopData({
          ...shopData,
          likes: (shopData.likes as number) - 1,
        });
      }
    } else {
      await axios.post(url, { storeId: id });
      toggleLikeShop(id, false);
      const updatedLikes = [...userInfo.likes, id];
      setUserInfo({ likes: updatedLikes });

      likesArray.push(id);
      localStorage.setItem("likes", JSON.stringify(likesArray));

      if (shopData) {
        setShopData({
          ...shopData,
          likes: (shopData.likes as number) + 1,
        });
      }
    }
  };

  if (loading) return <Loading text="가게 정보 불러오는 중.." />;

  return (
    <div className="top-0 w-full h-full overflow-y-scroll">
      <div
        className={`flex flex-col items-start justify-between w-full px-5 pt-5 mx-auto mt-5 `}
        style={{
          height: `calc(40% + ${
            shopData?.menu?.length ? shopData.menu.length * 50 : 0
          }px)`,
        }}
      >
        <div className="flex items-center justify-between w-full">
          <h1 className="text-2xl font-bold">{shopData?.name}</h1>
          <div
            className="flex flex-col items-center"
            onClick={(e) => toggleLikes(e, shopData?.id as string)}
          >
            {shopData && userInfo.likes.includes(shopData.id) ? (
              <FcLike className="w-6 h-6 cursor-pointer" />
            ) : (
              <FcLikePlaceholder className="w-6 h-6 cursor-pointer" />
            )}
            <p className="text-lg">{shopData?.likes}</p>
          </div>
        </div>
        <span className="flex items-start">
          <HiOutlineLocationMarker className="mt-1 mr-1" />
          주소 : {shopData?.address}
        </span>
        <span className="flex items-start ">
          <BiCategoryAlt className="mt-1 mr-1" />
          카테고리 : {shopData?.category}
        </span>
        <span className="flex items-start ">
          <BsTelephone className="mt-1 mr-1" />
          전화번호 : {shopData?.tel}
        </span>
        <div className="w-full p-5 mx-auto -mt-5 text-xl ">
          {shopData?.menu.map((item, idx) => (
            <div className="flex items-center justify-between mt-1" key={idx}>
              <PiCurrencyKrwFill
                style={{
                  fill: "white",
                  stroke: "black",
                  strokeWidth: 5,
                  fontSize: "35px",
                }}
              />
              <div className="w-16 ml-2">품목</div>
              <div className="flex-1 mr-2 break-words">{item.menu}</div>
              <div className="ml-6 whitespace-nowrap">
                {formatPrice(item.price)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full mb-5">
        <Review />
      </div>
    </div>
  );
}
