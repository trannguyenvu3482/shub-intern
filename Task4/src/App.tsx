import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [result, setResult] = useState([]);
  const [postResult, setPostResult] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://test-share.shub.edu.vn/api/intern-test/input"
        );

        console.log(response);

        const { data, token, query } = response.data;
        setData(data);

        // Mảng tích lũy tính từ đầu
        const prefixSum = new Array(data.length + 1).fill(0);
        // Mảng tích lũy tính xen kẽ chẵn lẻ
        const evenOddSum = new Array(data.length + 1).fill(0); // For type 2 query

        // Chạy qua vòng lặp để tạo 2 mảng tích lũy: O(n), với n là số phần tử
        for (let i = 0; i < data.length; i++) {
          prefixSum[i + 1] = prefixSum[i] + data[i];
          evenOddSum[i + 1] =
            evenOddSum[i] + (i % 2 === 0 ? data[i] : -data[i]);
        }

        // Xử lí dữ liệu: O(q), với q là số câu truy vấn
        const results = query.map(({ type, range }) => {
          const [l, r] = range;
          if (type === "1") {
            // Loại 1: tính tổng các phần tử trong khoảng
            return prefixSum[r + 1] - prefixSum[l];
          } else if (type === "2") {
            // Loại 2: Tính tổng các phần tử ở vị trí chẵn và trừ đi tổng các phần tử ở vị trí lẻ trong khoảng
            return evenOddSum[r + 1] - evenOddSum[l];
          }
        });

        console.log(results);

        const postResult = await axios.post(
          "https://test-share.shub.edu.vn/api/intern-test/output",
          results,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setPostResult(postResult.data.message);
        setResult(results);
      } catch (error) {
        console.error("Lỗi:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="mx-auto p-4">
      <h1 className="text-3xl font-bold">Task 4 - Trần Nguyên Vũ</h1>
      <h2 className="mt-4 text-xl font-bold">Mảng gốc</h2>
      <p className="break-all">{JSON.stringify(data)}</p>
      <h2 className="mt-4 text-xl font-bold">Danh sách query từ input</h2>
      <ul>
        {result.map((res, index) => (
          <li key={index}>
            Query {index + 1}: {res}
          </li>
        ))}
      </ul>
      <h1 className="mt-2 text-xl font-bold">Kết quả: {postResult}</h1>
    </div>
  );
}

export default App;
