export type UserTypes = {
  id: number | null;
  name: string;
  provider: string;
  likes: string[];
  location: {
    latitude: string;
    longitude: string;
  };
};

export type MenuTypes = {
  id: number;
  menu: string;
  price: number;
};

export type ShopTypes = {
  id: string;
  name: string;
  state: string;
  city: string;
  address: string;
  tel: string;
  category: string;
  likes?: number;
  menu: MenuTypes[];
};

export type ShopWithLocation = ShopTypes & {
  latitude: number;
  longitude: number;
};

export type CategoryFilterTypes = {
  id: number;
  name: string;
};

export type FilterTypes = {
  input: string;
  minPrice: number | null;
  maxPrice: number | null;
  location: {
    state: string | null;
    city: string | null;
  };
  category: string | null;
  checkFilter: boolean[];
  page: number | null;
  limit: number;
  isEnd: boolean;
};

export type AttributeType = {
  id: number;
  name: string;
  isSorting: "lexical" | "likes" | "location" | null;
};

export type PieChartType = {
  category: string;
  percent: string;
};

export type TichChartType = {
  category: string;
  averagePrice: string;
};
