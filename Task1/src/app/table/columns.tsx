"use client";

import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TDataTable>[] = [
  {
    accessorKey: "date",
    header: "Ngày",
  },
  {
    accessorKey: "time",
    header: "Giờ",
  },
  {
    accessorKey: "station",
    header: "Trạm",
  },
  {
    accessorKey: "pump",
    header: "Trụ bơm",
  },
  {
    accessorKey: "product",
    header: "Mặt hàng",
  },
  {
    accessorKey: "amount",
    header: "Số lượng",
  },
  {
    accessorKey: "unitPrice",
    header: "Đơn giá",
    cell: ({ row }) => {
      const unitPrice = parseFloat(row.getValue("unitPrice"));
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(unitPrice);

      return <div className="">{formatted}</div>;
    },
  },
  {
    accessorKey: "total",
    header: "Thành tiền (VNĐ)",
    cell: ({ row }) => {
      const total = parseFloat(row.getValue("total"));
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(total);

      return <div className="">{formatted}</div>;
    },
  },
  {
    accessorKey: "payStatus",
    header: "Trạng thái thanh toán",
  },
  {
    accessorKey: "customer",
    header: "Mã khách hàng",
  },
  {
    accessorKey: "customerName",
    header: "Tên khách hàng",
  },
  {
    accessorKey: "customerType",
    header: "Loại khách hàng",
  },
  {
    accessorKey: "payDate",
    header: "Ngày thanh toán",
  },
  {
    accessorKey: "employee",
    header: "Nhân viên",
  },
  {
    accessorKey: "plate",
    header: "Biển số xe",
  },
  {
    accessorKey: "billStatus",
    header: "Trạng thái hóa đơn",
  },
];
