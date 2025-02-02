"use client";

import { useEffect, useState } from "react";
import { getBookings, cancelBooking } from "@/components/actions";

export default function BookingList() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const data = await getBookings();
    setBookings(data);
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm("予約をキャンセルしてもよろしいですか？")) {
      try {
        await cancelBooking(bookingId);
        await loadBookings();
        alert("予約をキャンセルしました");
      } catch (error) {
        alert("キャンセルに失敗しました");
      }
    }
  };

  const getFacilityName = (facilityId) => {
    const facilities = {
      "meeting-room-1": "会議室1",
      "meeting-room-2": "会議室2",
      "meeting-room-3": "会議室3",
      auditorium: "講堂",
    };
    return facilities[facilityId] || facilityId;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">
              予約ID
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              社員番号
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">施設</th>
            <th className="border border-gray-300 px-4 py-2 text-left">日付</th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              時間帯
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              操作
            </th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{booking.id}</td>
              <td className="border border-gray-300 px-4 py-2">
                {booking.employeeId}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {getFacilityName(booking.facility)}
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
                  className="btn btn-danger"
                >
                  キャンセル
                </button>
              </td>
            </tr>
          ))}
          {bookings.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="border border-gray-300 px-4 py-4 text-center text-gray-500"
              >
                予約がありません
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
