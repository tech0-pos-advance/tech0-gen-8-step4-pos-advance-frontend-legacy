'use client';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import NavBar from '@/components/NavBar'; // 共通コンポーネントのインポート
import '../globals.css';
import { FaMapMarkerAlt } from 'react-icons/fa'; // アイコンライブラリをインポート

const SearchPage = () => {
  const [areaPopup, setAreaPopup] = useState(false);
  const [datePopup, setDatePopup] = useState(false);
  const [purposePopup, setPurposePopup] = useState(false);
  const [calendarPopup, setCalendarPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateText, setSelectedDateText] = useState('');
  const [startHour, setStartHour] = useState('');
  const [startMinute, setStartMinute] = useState('');
  const [endHour, setEndHour] = useState('');
  const [endMinute, setEndMinute] = useState('');
  const [isFullDay, setIsFullDay] = useState(false);
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [areaInput, setAreaInput] = useState('');

  const handleNowLink = () => {
    const now = new Date();
    
    // 日付を設定
    setSelectedDate(now); // 選択された日付として設定

    // 時刻を15分単位に丸める
    const roundedMinutes = Math.floor(now.getMinutes() / 15) * 15;
    now.setMinutes(roundedMinutes);
    now.setSeconds(0);
    now.setMilliseconds(0);
  
    // 開始時間を設定
    const startHour = String(now.getHours()).padStart(2, '0');
    const startMinute = String(now.getMinutes()).padStart(2, '0');
  
    // 終了時間（1時間後）
    const endTime = new Date(now.getTime() + 60 * 60 * 1000); // 1時間後
    const endHour = String(endTime.getHours()).padStart(2, '0');
    const endMinute = String(endTime.getMinutes()).padStart(2, '0');
  
    // ステートに値をセット
    setStartHour(startHour);
    setStartMinute(startMinute);
    setEndHour(endHour);
    setEndMinute(endMinute);
  
    // 日付テキストも更新する
    const dateText = now.toLocaleDateString();
    setSelectedDateText(`${dateText} ${startHour}:${startMinute} ~ ${endHour}:${endMinute}`);
  };

  return (
    <div>
      {/* 共通ナビゲーションバーを使用 */}
      <NavBar />

      {/* 検索バー */}
      <div className="search-container">
        <h2 className="text-xl font-bold text-center mt-8">
          社内会議室、レンタルスペース、point0 など、使用したいスペースを予約しよう！
        </h2>
        <div className="search-bar mt-8 flex justify-center space-x-4">
          <input
            type="text"
            placeholder="エリア・駅名・住所"
            value={selectedArea}
            className="search-input"
            onClick={() => setAreaPopup(true)}
            readOnly
          />
          <input
            type="text"
            placeholder="利用日時"
            value={selectedDateText}
            className="search-input"
            onClick={() => setDatePopup(true)}
            readOnly
          />
          <input
            type="text"
            placeholder="利用目的"
            value={selectedPurpose}
            className="search-input"
            onClick={() => setPurposePopup(true)}
            readOnly
          />
          <button className="search-button">検索</button>
        </div>
      </div>

      {/* ポップアップ: エリア検索 */}
      {areaPopup && (
        <div className="popup">
          <h3 className="popup-title">検索詳細: エリア・駅名・住所</h3>
          <input
            type="text"
            placeholder="エリア・駅名・住所を入力"
            className="input-field"
            value={areaInput}
            onChange={(e) => setAreaInput(e.target.value)}
          />

          {/* 現在地付近リンクとアイコン */}
          <div
            className="flex items-center text-blue-600 mt-2 cursor-pointer"
            onClick={async () => {
              try {
                // IPジオロケーションAPIを使って現在地を取得
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
      
                if (data && data.city) {
                  setAreaInput(`現在地付近 (${data.city})`);
                } else {
                  setAreaInput('現在地付近（不明）');
                }
              } catch (error) {
                console.error('現在地の取得に失敗しました:', error);
                setAreaInput('現在地付近（取得失敗）');
              }
            }}
          >
            <FaMapMarkerAlt className="mr-2" />
            <span>現在地付近</span>
          </div>

          {/* 適用するボタン */}
          <button
            className="popup-button"
            onClick={() => {
              setSelectedArea(areaInput);
              setAreaPopup(false);
            }}
          >
            適用する
          </button>

          {/* 閉じるボタン */}
          <button className="popup-close" onClick={() => setAreaPopup(false)}>✕</button>
        </div>
      )}

      {/* ポップアップ: 利用日時検索 */}
      {datePopup && (
        <div className="popup">
          <h3 className="popup-title flex justify-between">
            利用日時
            <button className="popup-close" onClick={() => setDatePopup(false)}>
              ✕
            </button>
          </h3>

          {/* 利用日 */}
          <label className="block text-sm font-semibold">利用日</label>
          <input
            type="text"
            placeholder="年 / 月 / 日"
            className="input-field"
            value={selectedDate ? selectedDate.toLocaleDateString() : ''}
            onClick={() => setCalendarPopup(true)}
            readOnly
          />
          {/* 今から使うリンク */}
          <a
            href="#"
            className="text-blue-600 underline mt-2 inline-block"
            onClick={(e) => {
              e.preventDefault();
              handleNowLink();
            }}
          >
            今から使う
          </a>

          {/* 利用時間 */}
          <label className="block text-sm font-semibold mt-4">利用時間</label>
          <div className="flex space-x-2 mt-2">
            {/* 開始時間 */}
            <div className="flex space-x-1 items-center">
                <select
                    value={startHour}
                    onChange={(e) => setStartHour(e.target.value)}
                    className="input-field w-20"
                    disabled={isFullDay}
                >
                    <option value="">時</option> {/* 初期値のプレースホルダー */}
                    {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={String(i).padStart(2, '0')}>
                            {i}
                        </option>
                    ))}
                </select>
                <span>:</span>
                <select
                    value={startMinute}
                    onChange={(e) => setStartMinute(e.target.value)}
                    className="input-field w-20"
                    disabled={isFullDay}
                >
                     <option value="">分</option> {/* 初期値のプレースホルダー */}
                    {['00', '15', '30', '45'].map((minute) => (
                        <option key={minute} value={minute}>
                            {minute}
                        </option>
                ))}
            </select>
        </div>

            <span className="flex items-center">~</span>

            {/* 終了時間 */}
            <div className="flex space-x-1 items-center">
                <select
                    value={endHour}
                    onChange={(e) => setEndHour(e.target.value)}
                    className="input-field w-20"
                    disabled={isFullDay}
                >
                    <option value="">時</option> {/* 初期値のプレースホルダー */}
                    {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={String(i).padStart(2, '0')}>
                            {i}
                        </option>
                    ))}
                </select>
                <span>:</span>
                <select
                    value={endMinute}
                    onChange={(e) => setEndMinute(e.target.value)}
                    className="input-field w-20"
                    disabled={isFullDay}
                >
                     <option value="">分</option> {/* 初期値のプレースホルダー */}
                    {['00', '15', '30', '45'].map((minute) => (
                        <option key={minute} value={minute}>
                            {minute}
                        </option>
                    ))}
                </select>
            </div>
          </div>

          {/* 1日貸し切り */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              checked={isFullDay}
              onChange={() => setIsFullDay(!isFullDay)}
              className="mr-2"
            />
            <label>1日貸し切り</label>
          </div>

          {/* 適用するボタン */}
          <button
            className="popup-button mt-4"
            onClick={() => {
              const dateText = selectedDate
                ? selectedDate.toLocaleDateString()
                : '';
              const timeText = isFullDay
                ? '終日利用'
                : `${startHour.padStart(2, '0')}:${startMinute} ~ ${endHour.padStart(2, '0')}:${endMinute}`;

              setSelectedDateText(`${dateText} ${timeText}`);
              setDatePopup(false);
            }}
          >
            適用する
          </button>
        </div>
      )}

      {/* カレンダーポップアップ */}
      {calendarPopup && (
        <div className="popup">
          <h3 className="popup-title">カレンダー</h3>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setCalendarPopup(false);
            }}
            inline
          />
          <button
            className="popup-close"
            onClick={() => setCalendarPopup(false)}
          >
            ✕
          </button>
        </div>
      )}

      {/* ポップアップ: 利用目的選択 */}
      {purposePopup && (
        <div className="popup">
          <h3 className="popup-title flex justify-between">
            利用目的
            <button className="popup-close" onClick={() => setPurposePopup(false)}>✕</button>
          </h3>
          <ul className="space-y-2">
            {['デスクワーク', '集中作業・テレビ会議', '会議', '研修・セミナー'].map((purpose) => (
              <li
                key={purpose}
                className="cursor-pointer hover:text-primary"
                onClick={() => {
                  setSelectedPurpose(purpose);
                  setPurposePopup(false);
                }}
              >
                {purpose}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* カレンダーポップアップ */}
      {calendarPopup && (
        <div className="popup">
          <h3 className="popup-title">カレンダー</h3>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setCalendarPopup(false);
            }}
            inline
          />
          <button className="popup-close" onClick={() => setCalendarPopup(false)}>✕</button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
