'use client';

import React from 'react';
import { Home, Calendar, Heart, RotateCcw, User } from 'lucide-react';

const NavBar = () => {
  return (
    <nav className="navbar">
      <a href="/" className="text-lg font-bold">施設予約システム</a>
      <div className="nav-links">
        <a href="/search" className="nav-link">
          <Home size={16} />
          <span>検索ホーム</span>
        </a>
        <a href="/reservations" className="nav-link">
          <Calendar size={16} />
          <span>予約一覧</span>
        </a>
        <a href="/favorites" className="nav-link">
          <Heart size={16} />
          <span>お気に入り</span>
        </a>
        <a href="/history" className="nav-link">
          <RotateCcw size={16} />
          <span>閲覧履歴</span>
        </a>
        <a href="/profile" className="nav-link user-icon">
          <User size={16} />
        </a>
      </div>
    </nav>
  );
};

export default NavBar;
