'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import Calendar from './Calendar';
import 'react-calendar/dist/Calendar.css';

const DashboardPage = () => {
  const [userData, setUserData] = useState(null);
  const [todos, setTodos] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [value, setValue] = useState(new Date());
  const [selectedTodos, setSelectedTodos] = useState([]);

  const fetchUserData = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error(
        '사용자 정보를 가져오는 중 오류 발생:',
        error || '사용자가 로그인하지 않았습니다.'
      );
      return;
    }

    setUserData(user);
    fetchTodos(user.id); // 사용자 ID로 할일 목록 가져오기
    fetchMonthlyStats(); // 월별 통계 가져오기
  };

  const fetchTodos = async (userId) => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('할일을 가져오는 중 오류 발생:', error);
    } else {
      setTodos(data);
    }
  };

  const fetchMonthlyStats = async () => {
    const { data, error } = await supabase
      .from('monthly_todo_stats')
      .select('*');

    if (error) {
      console.error('월별 통계를 가져오는 중 오류 발생:', error);
    } else {
      setMonthlyStats(data);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const completedCount = todos.filter((todo) => todo.completed).length;
  const incompleteCount = todos.filter((todo) => !todo.completed).length;

  const handleDateChange = (date) => {
    setValue(date);
    const selectedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
    const filteredTodos = todos.filter((todo) => {
      const todoDate = new Date(todo.created_at).toISOString().split('T')[0]; // 할일의 날짜
      return todoDate === selectedDate;
    });
    setSelectedTodos(filteredTodos);
  };

  // 이 함수는 특정 날짜에 할일이 있는지 확인하는 데 사용됩니다.

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-4">대시보드</h1>
      {userData ? (
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            환영합니다, {userData.email}
          </h2>
          <div className="flex flex-row justify-between gap-4">
            <div className="bg-blue-100 w-1/3 p-4 rounded-lg shadow flex flex-col gap-2">
              <p className="text-xl">전체 할일</p>
              <span className="font-semibold">{todos.length}</span>
            </div>
            <div className="bg-red-100 w-1/3 p-4 rounded-lg shadow flex flex-col gap-2">
              <p className="text-xl">완료된 할일</p>
              <span className="font-semibold">{completedCount}</span>
            </div>
            <div className="bg-green-100 w-1/3 p-4 rounded-lg shadow flex flex-col gap-2">
              <p className="text-xl">진행중인 할일</p>
              <span className="font-semibold">{incompleteCount}</span>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">캘린더</h3>
            <Calendar userId={userData.id} onDateClick={handleDateChange} />
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">월별 통계</h3>
            {monthlyStats.length > 0 ? (
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">월</th>
                    <th className="py-2 px-4 border-b">전체 할일</th>
                    <th className="py-2 px-4 border-b">완료된 할일</th>
                    <th className="py-2 px-4 border-b">미완료 할일</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyStats.map((stat) => (
                    <tr key={stat.month}>
                      <td className="py-2 px-4 border-b">
                        {new Date(stat.month).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                        })}
                      </td>
                      <td className="py-2 px-4 border-b">{stat.total_todos}</td>
                      <td className="py-2 px-4 border-b">
                        {stat.completed_todos}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {stat.incomplete_todos}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>월별 통계가 없습니다.</p>
            )}
          </div>
        </div>
      ) : (
        <p>사용자 정보를 로드하는 중입니다...</p>
      )}
    </div>
  );
};

export default DashboardPage;
