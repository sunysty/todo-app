'use client';

import React, { useState, useEffect } from 'react';
import TaskModal from './components/TaskModal';
import TodoSection from './components/TodoSection';
import FloatingButton from './components/FloatingButton';
import { supabase } from './supabaseClient';

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [todos, setTodos] = useState([]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Supabase의 onAuthStateChange를 사용하여 인증 상태를 관리합니다.
  supabase.auth.onAuthStateChange((_, session) => {
    setIsAuthenticated(!!session);
  });

  const fetchTodos = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error(
        '사용자 정보를 가져오는 중 오류 발생:',
        userError || '사용자가 로그인하지 않았습니다.'
      );
      return;
    }

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id); // 사용자 ID로 필터링

    if (error) {
      console.error('할일을 가져오는 중 오류 발생:', error);
    } else {
      setTodos(data); // 모든 할일을 가져와서 상태를 업데이트
    }
  };
  const handleTodoComplete = async (todo) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error(
        '사용자 정보를 가져오는 중 오류 발생:',
        userError || '사용자가 로그인하지 않았습니다.'
      );
      return;
    }

    const updatedTask = {
      ...todo,
      completed: !todo.completed,
    };
    const { error } = await supabase
      .from('todos')
      .update({ completed: updatedTask.completed, user_id: user.id })
      .match({ id: todo.id });

    if (error) {
      console.error('할일 완료 상태 업데이트 중 오류 발생:', error);
    } else {
      setTodos((prevTodos) =>
        prevTodos.map((task) => (task.id === todo.id ? updatedTask : task))
      );
    }
  };

  const handleAddTodo = async (todoText) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error(
        '사용자 정보를 가져오는 중 오류 발생:',
        userError || '사용자가 로그인하지 않았습니다.'
      );
      return;
    }

    const { error } = await supabase
      .from('todos')
      .insert([{ task: todoText, completed: false, user_id: user.id }]);

    if (error) {
      console.error('할일 추가 중 오류 발생:', error);
    } else {
      fetchTodos();
    }
  };

  const handleDeleteTodo = async (id) => {
    const { error } = await supabase.from('todos').delete().match({ id });

    if (error) {
      console.error('할일 삭제 중 오류 발생:', error);
    } else {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div>
      {isAuthenticated ? (
        <TodoSection
          todos={todos}
          handleTodoComplete={handleTodoComplete}
          handleDeleteTodo={handleDeleteTodo}
        />
      ) : (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">
            로그인 후 이용해주세요.
          </h1>
        </div>
      )}
      <FloatingButton onClick={() => setShowModal(true)} />
      <TaskModal
        handleAddTodo={handleAddTodo}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default HomePage;
