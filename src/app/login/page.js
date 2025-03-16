'use client';
import { useState } from 'react';
import { supabase } from '../supabaseClient';

const LoginPage = () => {
  const [error, setError] = useState('');
  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        alert('로그인 성공!'); // 로그인 성공 알림
        window.location.href = '/';
      }
    } catch (err) {
      setError('로그인 요청 중 오류가 발생했습니다.'); // 네트워크 오류 메시지
      console.error('로그인 오류:', err); // 콘솔에 오류 로그
    }
  };

  return (
    <>
      <div className="p-5 max-w-md mx-auto border border-gray-300 rounded-lg">
        <h1 className="text-xl font-bold mb-4">로그인 페이지</h1>

        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              이메일:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600"
          >
            로그인
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
