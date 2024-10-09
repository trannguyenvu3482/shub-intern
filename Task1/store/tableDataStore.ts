import { create } from "zustand";

interface TableDataStore {
  tableData: TDataTable[];
  setTableData: (tableData: TDataTable[]) => void;
  clearTableData: () => void;
}

const useTableDataStore = create<TableDataStore>((set) => ({
  tableData: [],
  setTableData: (tableData: TDataTable[]) => set({ tableData }),
  clearTableData: () => set({ tableData: [] }),
}));

export default useTableDataStore;
