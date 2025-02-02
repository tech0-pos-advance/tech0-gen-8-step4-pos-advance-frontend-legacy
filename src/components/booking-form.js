"use client";

import { useState } from "react";
import { addBooking } from "@/components/actions";

export default function BookingForm() {
  const [employeeId, setEmployeeId] = useState("");
  const [facility, setFacility] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addBooking({
        employeeId,
        facility,
        date,
        timeSlot,
      });

      // フォームをリセット
      setEmployeeId("");
      setFacility("");
      setDate("");
      setTimeSlot("");

      alert("予約が完了しました");
    } catch (error) {
      alert("予約に失敗しました");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            社員番号
          </label>
          <input
            type="text"
            required
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="例: 123456"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            施設
          </label>
          <select
            value={facility}
            onChange={(e) => setFacility(e.target.value)}
            required
            className="form-select"
          >
            <option value="">施設を選択</option>
            <option value="meeting-room-1">会議室1</option>
            <option value="meeting-room-2">会議室2</option>
            <option value="meeting-room-3">会議室3</option>
            <option value="auditorium">講堂</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            日付
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="form-input"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            時間帯
          </label>
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            required
            className="form-select"
          >
            <option value="">時間帯を選択</option>
            <option value="09:00-10:00">09:00-10:00</option>
            <option value="10:00-11:00">10:00-11:00</option>
            <option value="11:00-12:00">11:00-12:00</option>
            <option value="13:00-14:00">13:00-14:00</option>
            <option value="14:00-15:00">14:00-15:00</option>
            <option value="15:00-16:00">15:00-16:00</option>
            <option value="16:00-17:00">16:00-17:00</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary">
          予約する
        </button>
      </div>
    </form>
  );
}
