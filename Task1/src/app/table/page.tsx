"use client";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { vi } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import useTableDataStore from "../../../store/tableDataStore";
import { columns } from "./columns";
import { DataTable } from "./data-table";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformData = (data: any[]): TDataTable[] => {
  if (!data || data.length === 0) return [];

  const firstRow = data[4];
  const headers = Object.values(firstRow);

  const rows = data.slice(5).map((row) => {
    return headers.map((header, index) => {
      const key = Object.keys(firstRow)[index];
      return row[key] || "";
    });
  });

  return rows.map((row) => ({
    id: row[0].toString(),
    date: row[1],
    time: row[2],
    station: row[3],
    pump: row[4],
    product: row[5],
    amount: row[6],
    unitPrice: row[7],
    total: row[8],
    payStatus: row[9] === "Tiền mặt" ? "Tiền mặt" : "Chờ chuyển khoản",
    customer: row[10],
    customerName: row[11] || "",
    customerType: row[12] || "",
    payDate: row[13] || "",
    employee: row[14] || "",
    plate: row[15] || "",
    billStatus: row[16] || "",
  }));
};

const Page = () => {
  const { tableData } = useTableDataStore();
  const router = useRouter();
  const [data, setData] = useState<TDataTable[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const hasShownToast = useRef(false);

  const handleClearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    toast.success("Đã xóa các filter");
  };

  const memoizedColumns = useMemo(() => columns, []);
  const memoizedData = useMemo(() => data, [data]);

  useEffect(() => {
    if (!tableData || tableData.length === 0) {
      if (!hasShownToast.current) {
        toast.error("Dữ liệu rỗng");
        hasShownToast.current = true;
      }
      router.push("/");
      return;
    }

    const transformedData = transformData(tableData);
    setData(transformedData);
  }, [tableData, router]);

  return (
    <div className="mx-auto py-10 px-2">
      <div className="flex mb-4 gap-4">
        <DateTimePicker
          className="w-[280px] mr-8"
          locale={vi}
          value={startDate}
          onChange={setStartDate}
          displayFormat={{
            hour24: "dd/MM/yyyy, HH:mm:ss",
          }}
          placeholder="Từ ngày"
        />
        <DateTimePicker
          className="w-[280px]"
          locale={vi}
          value={endDate}
          onChange={setEndDate}
          displayFormat={{
            hour24: "dd/MM/yyyy, HH:mm:ss",
          }}
          placeholder="Đến ngày"
        />
        <Button variant="outline" size="default" onClick={handleClearFilters}>
          Clear
        </Button>
      </div>
      <DataTable
        columns={memoizedColumns}
        data={memoizedData}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
};

export default Page;
