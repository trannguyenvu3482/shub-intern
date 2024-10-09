"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Dropzone from "react-dropzone";
import * as XLSX from "xlsx";
import useTableDataStore from "../../store/tableDataStore";

export default function Home() {
  const router = useRouter();
  const { setTableData } = useTableDataStore();
  const [file, setFile] = useState<File>();

  const handleDrop = (acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) {
      console.error("No file selected");
      return;
    }

    const file = acceptedFiles[0];

    setFile(file);
    console.log(acceptedFiles);
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target?.result;
      try {
        // Read and parse the XLSX file
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0]; // Get first sheet
        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]); // Convert sheet to JSON

        setTableData(sheet);
        // After parsing, redirect to the table route and pass the parsed data
        router.push("/table");
      } catch (err) {
        console.error("Error parsing the file", err);
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="mt-4 flex items-center justify-center flex-col">
      <Dropzone
        onDrop={handleDrop}
        maxFiles={1}
        accept={{
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
            ".xlsx",
          ],
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className="flex items-center justify-center w-[1200px]"
          >
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  {file ? (
                    <>Đã upload file</>
                  ) : (
                    <>
                      <span className="font-semibold">Chọn file từ máy</span>{" "}
                      hoặc kéo thả file vào đây
                    </>
                  )}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {file?.name || "XLSX (Excel file) only"}
                </p>
              </div>
              <input {...getInputProps()} />
            </label>
          </div>
        )}
      </Dropzone>
    </div>
  );
}
