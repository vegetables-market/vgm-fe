export type FormOption = {
  id: number;
  name: string;
};

export const SHIPPING_DAYS_OPTIONS: FormOption[] = [
  { id: 1, name: "1~2日で発送" },
  { id: 2, name: "2~3日で発送" },
  { id: 3, name: "4~7日で発送" },
];

export const SHIPPING_METHOD_OPTIONS: FormOption[] = [
  { id: 1, name: "未定" },
  { id: 2, name: "らくらくメルカリ便" },
];

export const PREFECTURE_OPTIONS: FormOption[] = [
  { id: 13, name: "東京都" },
  { id: 27, name: "大阪府" },
];
