"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Home() {
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");

  const fetchPortfolio = () => {
    fetch("http://127.0.0.1:8000/portfolio")
      .then((res) => res.json())
      .then((data) => setPortfolio(data));
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleAdd = async () => {
    await fetch(
      `http://127.0.0.1:8000/portfolio/add?symbol=${symbol}&quantity=${quantity}`,
      { method: "POST" }
    );

    setSymbol("");
    setQuantity("");
    fetchPortfolio();
  };

  const totalValue = portfolio.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const chartData = portfolio.map((item) => ({
    name: item.symbol,
    value: item.total,
  }));

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-gray-900">
      <h1 className="text-4xl font-bold mb-6 text-black">
        Portfolio Dashboard
      </h1>

      {/* TOP */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* TOTAL */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-black font-semibold">Total Value</h2>
          <p className="text-2xl font-bold mt-2">
            ${totalValue.toFixed(2)}
          </p>
        </div>

        {/* ADD */}
        <div className="bg-white p-6 rounded-xl shadow col-span-2 flex gap-2 items-center">
          <input
            className="border p-2 rounded w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Symbol (AAPL)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />

          <input
            className="border p-2 rounded w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <button
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-600 transition text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-2 gap-6">
        {/* TABLE */}
        <div className="bg-white p-6 rounded-xl shadow text-gray-900">
          <h2 className="text-xl font-bold mb-4 text-black">Assets</h2>

          <table className="w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border text-black">Symbol</th>
                <th className="p-2 border text-black">Qty</th>
                <th className="p-2 border text-black">Price</th>
                <th className="p-2 border text-black">Total</th>
              </tr>
            </thead>

            <tbody className="text-gray-900">
              {portfolio.map((item, index) => (
                <tr
                  key={index}
                  className="text-center hover:bg-gray-100 transition"
                >
                  <td className="p-2 border">{item.symbol}</td>
                  <td className="p-2 border">{item.quantity}</td>
                  <td className="p-2 border">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="p-2 border font-semibold">
                    ${item.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CHART */}
        <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4 text-black">
            Distribution
          </h2>

          <PieChart width={400} height={350}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(1)}%`
              }
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  );
}