'use client';
import Navigation from '../components/Navigation';
import { supabase } from '../supabaseClient';
import { useState } from 'react';

const SignupPage = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(`가입 오류: ${error.message}`);
    } else {
      setMessage('가입 성공! 확인 이메일을 확인하세요.');
    }
  };

  return (
    <>
      <div className="flex flex-col items-center p-6 rounded-lg">
        <h1 className="text-2xl text-purple-800">회원가입</h1>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            type="email"
            name="email"
            placeholder="이메일 입력"
            required
            className="p-2 m-2 border border-gray-300 rounded-md w-72"
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호 입력"
            required
            className="p-2 m-2 border border-gray-300 rounded-md w-72"
          />
          <button
            type="submit"
            className="p-2 m-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 w-72"
          >
            가입하기
          </button>
        </form>
        {message && <p className="text-red-500">{message}</p>}
        <div className="mt-4">
          <a href="/login" className="text-purple-500 hover:underline">
            로그인 페이지로 이동
          </a>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
