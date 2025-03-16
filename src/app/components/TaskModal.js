'use client';
import React, { useState, useRef } from 'react';

const TaskModal = ({ isOpen, onClose, handleAddTodo }) => {
  const [taskText, setTaskText] = useState('');
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskText.trim()) {
      handleAddTodo(taskText);
      setTaskText('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transition-all transform"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800">새 할일 추가</h2>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="할일을 입력하세요"
            className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
