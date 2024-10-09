declare type TDataTable = {
  id: string;
  date: string;
  time: string;
  station: string;
  pump: string;
  product: string;
  amount: number;
  unitPrice: number;
  total: number;
  payStatus: "Tiền mặt" | "Chờ chuyển khoản";
  customer: string;
  customerName: string;
  customerType: string;
  payDate: string;
  employee: string;
  plate: string;
  billStatus: string;
};
