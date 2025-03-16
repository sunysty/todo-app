'use client';
import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '../supabaseClient';

const Navigation = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Supabase의 onAuthStateChange를 사용하여 인증 상태를 관리합니다.
  supabase.auth.onAuthStateChange((_, session) => {
    setIsAuthenticated(!!session);
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
      <div className="text-2xl font-bold text-gray-800">
        <Link href="/">휘담의 투두앱</Link>
      </div>
      <ul className="flex space-x-6">
        <li className="text-gray-600 hover:text-purple-700 cursor-pointer transition-colors">
          <Link href="/dashboard">대시보드</Link>
        </li>
        {isAuthenticated ? (
          <li
            className="text-gray-600 hover:text-purple-700 cursor-pointer transition-colors"
            onClick={handleLogout}
          >
            로그아웃
          </li>
        ) : (
          <>
            <li className="text-gray-600 hover:text-purple-700 cursor-pointer transition-colors">
              <Link href="/login">로그인</Link>
            </li>
            <li className="text-gray-600 hover:text-purple-700 cursor-pointer transition-colors">
              <Link href="/signup">회원가입</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
