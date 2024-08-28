import { MdOutlineAnalytics } from "react-icons/md";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { useEffect, useState } from "react";
import axios from "axios";
import { PieChartType, TichChartType } from "@/types";
import { Bar } from "react-chartjs-2";
import useUserStore from "@/store/useUserStore";

// Chart.js 구성 요소 등록
ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const API_BASE_URL = import.meta.env.VITE_PRODUCTION_API_BASE_URL;

const LikeAnalyze = () => {
  const [pieData, setPieData] = useState<PieChartType[]>([]);
  const [tickData, setTickData] = useState<TichChartType[]>([]);
  const [likes, setLikes] = useState<string[]>([]);
  const { userInfo } = useUserStore();

  //카테고리 퍼센트
  const pieChart = {
    labels: pieData
      ? pieData.map((item) => item.category)
      : ["한식", "중식", "양식", "일식", "기타"],
    datasets: [
      {
        label: "좋아요 카테고리 분석",
        data: pieData
          ? pieData.map((item) => parseInt(item.percent))
          : [30, 20, 25, 25, 10], // API에서 받은 데이터 또는 더미 데이터
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  // 카테고리별 평균금액
  const tickChart = () => {
    const labels = ["한식", "중식", "양식", "일식", "기타"];
    const data = labels.map((label) => {
      const found = tickData.find((item) => item.category === label);
      return found ? found.averagePrice : 0; // 카테고리가 없으면 0
    });

    return {
      labels,
      datasets: [
        {
          label: "평균 금액",
          data,
          backgroundColor: "rgba(54, 108, 240, 0.6)",
          borderColor: "rgba(54, 108, 240, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          autoSkip: false,
        },
      },
      y: {
        beginAtZero: true,
        max: 20000,
        ticks: {
          stepSize: 2000,
        },
      },
    },
  };

  useEffect(() => {
    const fetchKakaoUserInfo = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_PRODUCTION_API_BASE_URL}/likes/my/kakao`,
          { withCredentials: true }
        );
        const likes = response.data.map((item: any) => item.id);
        setLikes(likes);
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
        setLikes(likes);
      } catch (err) {
        console.error(err);
      }
    };
    if (userInfo.provider === "kakao") {
      fetchKakaoUserInfo();
    } else if (userInfo.provider === "google") {
      fetchGoogleUserInfo();
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeIds = JSON.stringify(likes);
        const pieRes = await axios.get(`${API_BASE_URL}/myplaces/percent`, {
          params: {
            storeId: storeIds,
          },
        });
        setPieData(pieRes.data);
        const tickRes = await axios.get(`${API_BASE_URL}/myplaces/average`, {
          params: {
            storeId: storeIds,
          },
        });
        setTickData(tickRes.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (likes.length > 0) {
      fetchData();
    }
  }, [likes]);

  return (
    <div className="flex flex-col items-center justify-start w-full h-full pt-6 overflow-y-scroll">
      <div className="flex flex-col items-center h-40">
        <h1 className="flex items-center text-3xl font-bold text-mainDarkColor">
          <MdOutlineAnalytics className="mt-1" /> 좋아요 분석
        </h1>
        <span className="mt-8">내가 어떤 카테고리를 많이 사용하는지</span>
        <span className="mb-5 text-lg font-bold">
          좋아요를 많이 누른 카테고리를 분석합니다!
        </span>
      </div>
      <div className="mx-auto">
        <Doughnut data={pieChart} className="mb-5" />
        <Bar data={tickChart()} options={options} className="mb-5" />
      </div>
    </div>
  );
};

export default LikeAnalyze;
