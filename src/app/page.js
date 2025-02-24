'use client';

import BookingForm from "@/components/booking-form";
import BookingList from "@/components/booking-list";
import "@/styles.css";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import bcrypt from 'bcryptjs';
import NavBar from '@/components/NavBar';

export default function Page() {
  // return (
  //   <div className="min-h-screen bg-gray-100">
  //     <header className="bg-gray-800 text-white p-4 mb-6">
  //       <h1 className="text-xl font-semibold">社内施設予約システム</h1>
  //     </header>
  //     <main className="container mx-auto px-4">
  //       <div className="bg-white shadow-sm rounded-sm p-6 mb-6">
  //         <h2 className="text-lg font-semibold mb-4 text-gray-700">新規予約</h2>
  //         <BookingForm />
  //       </div>
  //       <div className="bg-white shadow-sm rounded-sm p-6">
  //         <h2 className="text-lg font-semibold mb-4 text-gray-700">設備一覧</h2>
  //         <BookingList />
  //       </div>
  //     </main>
  //   </div>
  // );
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userList, setUserList] = useState([]); // ユーザーリストの管理

  // メールアドレスのバリデーション
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // パスワードのバリデーション
  const validatePassword = (password) => {
    return password.length >= 8;
  };

  // ログイン処理
  const handleLogin = async () => {
    // 入力チェック
    if (!validateEmail(email)) {
      setError('有効なメールアドレスを入力してください。');
      return;
    }
    if (!validatePassword(password)) {
      setError('パスワードは8文字以上で入力してください。');
      return;
    }

    try {
      // パスワードのハッシュ化
      const hashedPassword = await bcrypt.hash(password, 10);

      // ユーザーリストにデータを追加し、コンソールに表示
      setUserList((prevList) => {
        const updatedList = [...prevList, { email, password: hashedPassword }];
        console.log('✅ ユーザーリスト:', updatedList); // ログ確認
        return updatedList;
      });

      // 認証成功後にリダイレクト
      router.push('/search');
    } catch (err) {
      setError('ログイン処理中にエラーが発生しました。');
    }
  };

  return (
    <div>
      {/* ナビゲーションバー */}
      <NavBar />

      {/* ログインフォーム */}
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">ログイン</h2>

          {/* エラーメッセージの表示 */}
          {error && <p className="error-message">{error}</p>}

          <input
            type="email"
            placeholder="メールアドレス"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // 入力値を更新
          />
          <input
            type="password"
            placeholder="パスワード"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // 入力値を更新
          />
          <div className="checkbox-container">
            <input type="checkbox" className="mr-2" />
            <label>　ログインしたままにする</label>
          </div>

          {/* ログインボタン */}
          <button className="login-button" onClick={handleLogin}>
            ログイン
          </button>

          <div className="login-footer">
            <a href="#">パスワードを忘れた方はこちら</a><br />
            <a href="#">ログインできない方はこちら</a>
          </div>
        </div>
      </div>
    </div>
  );
}
