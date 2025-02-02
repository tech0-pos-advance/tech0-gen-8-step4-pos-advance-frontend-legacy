"use client";

import { useEffect, useState, useCallback } from "react";
import { getBookings, cancelBooking } from "@/components/actions";

export default function BookingList() {
  // 状態管理: 予約データ、設備データ、エラーメッセージ
  const [bookings, setBookings] = useState(null); // 初期値 null は読み込み中を示す
  const [facilities, setFacilities] = useState({});
  const [error, setError] = useState([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!apiUrl) {
      setError((prev) => [...prev, "API URLが設定されていません。"]);
      return;
    }

    // コンポーネントのアンマウント時に fetch をキャンセルするための AbortController
    const controller = new AbortController();

    const fetchData = async () => {
      // 予約データと設備データを並列で取得
      const results = await Promise.allSettled([
        getBookings(),
        fetch(`${apiUrl}/facilities`, {
          cache: "no-store",
          signal: controller.signal,
        }),
      ]);

      // 予約データの処理
      if (results[0].status === "fulfilled") {
        setBookings(results[0].value || []);
      } else {
        setError((prev) => [...prev, "予約データの取得に失敗しました。"]);
        setBookings([]); // エラー発生時も空配列にしてローディングを解除
      }

      // 設備データの処理
      if (results[1].status === "fulfilled") {
        const response = results[1].value;
        if (!response.ok) {
          setError((prev) => [...prev, "設備データの取得に失敗しました。"]);
        } else {
          try {
            const facilityData = await response.json();
            // 施設データを facility_id をキーとしたオブジェクトに変換
            const facilityMap = facilityData.reduce((acc, facility) => {
              acc[facility.facility_id] = facility;
              return acc;
            }, {});
            setFacilities(facilityMap);
          } catch (err) {
            console.error("設備データの解析エラー:", err.message);
            setError((prev) => [...prev, "設備データの解析に失敗しました。"]);
          }
        }
      } else {
        setError((prev) => [...prev, "設備データの取得に失敗しました。"]);
      }
    };

    fetchData();

    // クリーンアップ: アンマウント時に fetch を中断
    return () => {
      controller.abort();
    };
  }, [apiUrl]);

  // 予約キャンセル処理（useCallback でメモ化）
  const handleCancel = useCallback(async (bookingId) => {
    if (!window.confirm("予約をキャンセルしてもよろしいですか？")) return;

    try {
      await cancelBooking(bookingId);
      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
      alert("予約をキャンセルしました");
    } catch (err) {
      alert("キャンセルに失敗しました");
    }
  }, []);

  return (
    <div className="overflow-x-auto">
      {/* エラー表示 */}
      {error.length > 0 && (
        <div className="text-red-500 text-center p-4">
          {error.map((err, index) => (
            <p key={index}>{err}</p>
          ))}
        </div>
      )}

      {/* 予約一覧表示 */}
      {bookings === null ? (
        <div className="text-center text-gray-500 p-4">
          予約データを読み込んでいます...
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-gray-500 p-4">予約がありません</div>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">
                施設ID
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                社員番号
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                施設名
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                種類
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                収容人数
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                日付
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                時間帯
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              // 各予約に対応する施設情報（取得できなかった場合は空オブジェクト）
              const facility = facilities[booking.facility_id] || {};

              return (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {booking.facility_id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {booking.employeeId}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {facility.facility_name || "不明"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {facility.facility_type || "不明"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {facility.capacity || "不明"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {booking.date}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {booking.timeSlot}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      キャンセル
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* 施設一覧表示 */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">設備一覧</h2>
        {Object.keys(facilities).length === 0 ? (
          <div className="text-center text-gray-500 p-4">
            施設データを読み込んでいます...
          </div>
        ) : (
          <table className="w-full border-collapse border border-gray-300 text-gray-900">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  施設ID
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  施設名
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  種類
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  収容人数
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.values(facilities).map((facility) => (
                <tr key={facility.facility_id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {facility.facility_id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {facility.facility_name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {facility.facility_type}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {facility.capacity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
