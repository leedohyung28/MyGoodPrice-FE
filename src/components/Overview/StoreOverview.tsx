import { useState, Fragment, MouseEvent, useEffect } from "react";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { PiCaretUpDownLight } from "react-icons/pi";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import useShopStore from "@/store/useShopStore";
import useUserStore from "@/store/useUserStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ShopTypes, AttributeType } from "@/types";
import { filterSearchCriteria } from "@/utils/filterSearchCriteria";

type StoreOverviewProps = {
  attributes?: AttributeType[];
  currentCategory?: string;
  pageType?: "main" | "my";
};

export default function StoreOverview({
  attributes = [
    { id: 1, name: "가게 이름", isSorting: "lexical" },
    { id: 2, name: "위치", isSorting: "location" },
    { id: 3, name: "카테고리", isSorting: null },
    { id: 4, name: "찜", isSorting: "likes" },
  ],
  currentCategory = "전체",
  pageType,
}: StoreOverviewProps) {
  const {
    currentFilter,
    currentShopData,
    myShopData,
    toggleLikeShop,
    sortData,
    setFilter,
    setCurrentShopData,
    setMyShopData,
  } = useShopStore();
  const { userInfo, setUserInfo } = useUserStore();
  const [current, setCurrent] = useState<string | null>(null);
  const { setLoading } = useUserStore();
  const navigate = useNavigate();

  const data = pageType === "main" ? currentShopData : myShopData;
  const setData = pageType === "main" ? setCurrentShopData : setMyShopData;

  useEffect(() => {
    const fetchKakaoUserInfo = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_PRODUCTION_API_BASE_URL}/likes/my/kakao`,
          { withCredentials: true }
        );
        const likes = response.data.map((item: any) => item.id);

        setUserInfo({ likes });
      } catch (err) {
        console.error(err);
      }
    };

    const fetchGoogleUserInfo = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_PRODUCTION_API_BASE_URL}/likes/my/google`,
          { withCredentials: true }
        );
        const likes = response.data.map((item: any) => item.id);

        setUserInfo({ likes });
      } catch (err) {
        console.error(err);
      }
    };

    if (userInfo.provider === "kakao") {
      console.log("Kakao");
      fetchKakaoUserInfo();
    } else if (userInfo.provider === "google") {
      console.log("Google");
      fetchGoogleUserInfo();
    }
  }, []);

  const toggleLikes = async (e: MouseEvent, id: string) => {
    e.stopPropagation();
    const url = `${import.meta.env.VITE_PRODUCTION_API_BASE_URL}/likes`;

    if (userInfo.provider === "kakao") {
      if (userInfo.likes.includes(id)) {
        await axios.delete(`${url}/kakao`, {
          data: { storeId: id },
          withCredentials: true,
        });

        const updatedLikes = userInfo.likes.filter((likeId) => likeId !== id);
        setUserInfo({ likes: updatedLikes });

        toggleLikeShop(id, true);
      } else {
        await axios.post(
          `${url}/kakao`,
          { storeId: id },
          { withCredentials: true }
        );
        toggleLikeShop(id, false);

        const updatedLikes = [...userInfo.likes, id];
        setUserInfo({ likes: updatedLikes });
      }
    } else if (userInfo.provider === "google") {
      if (userInfo.likes.includes(id)) {
        await axios.delete(`${url}/google`, {
          data: { storeId: id },
          withCredentials: true,
        });

        const updatedLikes = userInfo.likes.filter((likeId) => likeId !== id);
        setUserInfo({ likes: updatedLikes });

        toggleLikeShop(id, true);
      } else {
        await axios.post(
          `${url}/google`,
          { storeId: id },
          { withCredentials: true }
        );
        toggleLikeShop(id, false);

        const updatedLikes = [...userInfo.likes, id];
        setUserInfo({ likes: updatedLikes });
      }
    }
  };

  // [API] ('/shop') : 페이지네이션
  const handleSearchAddShop = async () => {
    const nextPage = currentFilter.page ? currentFilter.page + 1 : 1;
    const { searchMinPrice, searchMaxPrice, searchLocation, searchCategory } =
      filterSearchCriteria(currentFilter);

    const url = `${
      import.meta.env.VITE_PRODUCTION_API_BASE_URL
    }/stores?page=${nextPage}&limit=${
      currentFilter.limit
    }&category=${searchCategory}&maxPrice=${searchMaxPrice}&minPrice=${searchMinPrice}&location=${searchLocation}&search=${
      currentFilter.input
    }`;

    try {
      setLoading(true);
      const res = await axios.get(url, { withCredentials: true });
      setFilter({
        ...currentFilter,
        page: nextPage,
        isEnd: res.data.length !== currentFilter.limit,
      });
      setData([...(data as ShopTypes[]), ...res.data]);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center p-0 overflow-y-scroll">
      {data === null ? (
        <p className="font-bold text-mainDarkColor">
          필터 혹은 검색하여 원하는 가게를 찾아보세요.
        </p>
      ) : data?.length === 0 ? (
        <p className="font-bold text-mainDarkColor">
          필터링 된 가게가 존재하지 않습니다.
        </p>
      ) : (
        <>
          <table className="max-w-4xl min-w-full mx-auto bg-white border border-subDarkColor">
            <thead>
              <tr className="w-full text-mainColor bg-mainBrighterColor">
                {attributes.map((attribute) => (
                  <th
                    key={attribute.id}
                    className={`py-1 border-b ${
                      attribute.name.length >= 2
                        ? "relative w-[15vw]"
                        : "w-[5vw]"
                    }`}
                  >
                    {attribute.isSorting !== null ? (
                      <div
                        className="flex items-center justify-center cursor-pointer hover:underline underline-offset-2"
                        onClick={() => sortData(attribute.isSorting)}
                      >
                        <p>{attribute.name}</p>
                        <PiCaretUpDownLight className="w-4 h-4" />
                      </div>
                    ) : (
                      <p className="whitespace-nowrap">{attribute.name}</p>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.filter(
                (shop) =>
                  currentCategory === "전체" ||
                  currentCategory === shop.category
              ).length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-4 font-bold text-center text-mainDarkColor"
                  >
                    카테고리에 속한 가게가 없습니다.
                  </td>
                </tr>
              ) : (
                data?.map((shop) => {
                  if (
                    currentCategory === "전체" ||
                    currentCategory === shop.category
                  ) {
                    return (
                      <Fragment key={shop.id}>
                        <tr
                          className="cursor-pointer hover:bg-mainBrightColor"
                          onClick={() =>
                            setCurrent(shop.id === current ? null : shop.id)
                          }
                        >
                          <td className="px-1 py-2 text-center border-b">
                            {shop.name}
                          </td>
                          <td className="px-1 py-2 text-center border-b">
                            {shop.state} {shop.city}
                          </td>
                          <td className="px-1 py-2 text-center border-b whitespace-nowrap">
                            {shop.category}
                          </td>
                          <td
                            className="border-b"
                            onClick={(e) => toggleLikes(e, shop.id)}
                          >
                            <span className="flex items-center justify-center gap-1">
                              {userInfo.likes.includes(shop.id) ? (
                                <FcLike />
                              ) : (
                                <FcLikePlaceholder />
                              )}
                              <p>{shop.likes}</p>
                            </span>
                          </td>
                        </tr>
                        {current === shop.id && (
                          <tr>
                            <td
                              colSpan={2}
                              className="px-4 py-2 border-b bg-mainBrighterColor"
                            >
                              <ul className="pl-5 list-disc">
                                {shop.menu.map((item) => (
                                  <li key={item.id}>
                                    {item.menu} - {item.price}원
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td
                              colSpan={2}
                              className="px-4 py-2 transition duration-300 border-b border-l focus:outline-none bg-mainColor hover:bg-mainDarkColor"
                              onClick={() => navigate(`/shop?id=${shop.id}`)}
                            >
                              <p className="text-xl font-bold text-mainBrighterColor">
                                해당 가게로 이동
                              </p>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  }
                  return null;
                })
              )}
            </tbody>
          </table>
          <div>
            {!currentFilter.isEnd && pageType === "main" && (
              <MdKeyboardDoubleArrowDown
                className="w-10 h-10 mt-2 cursor-pointer text-subColor"
                onClick={handleSearchAddShop}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
