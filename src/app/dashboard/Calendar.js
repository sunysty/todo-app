import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const Calendar = ({ userId, onDateClick }) => {
  const daysInWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const [currentDate, setCurrentDate] = useState(new Date());
  const [todos, setTodos] = useState([]);

  // 사용자의 할 일을 가져오는 함수
  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select()
      .eq('user_id', userId); // userId에 따라 필터링

    if (error) {
      console.error('Error fetching todos:', error);
    } else {
      setTodos(data);
    }
  };

  useEffect(() => {
    fetchTodos(); // 컴포넌트가 마운트될 때 할 일 가져오기
  }, [userId]);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInCurrentMonth = getDaysInMonth(
    currentDate.getMonth(),
    currentDate.getFullYear()
  );
  const firstDayOfMonth = getFirstDayOfMonth(
    currentDate.getMonth(),
    currentDate.getFullYear()
  );

  const handleDateClick = (day) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    onDateClick(date);
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  return (
    <div className="calendar">
      <div className="header">
        <button onClick={handlePrevMonth} className="nav-button">
          이전 달
        </button>
        <span className="current-month">
          {currentDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </span>
        <button onClick={handleNextMonth} className="nav-button">
          다음 달
        </button>
      </div>
      <div className="days-header">
        {daysInWeek.map((day) => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}
      </div>
      <div className="days">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={index} className="day empty"></div>
        ))}
        {Array.from({ length: daysInCurrentMonth }).map((_, index) => {
          const day = index + 1;
          const hasCompleted = todos.some((todo) => {
            const todoDate = new Date(todo.created_at);
            return (
              todoDate.getDate() === day &&
              todoDate.getMonth() === currentDate.getMonth() &&
              todoDate.getFullYear() === currentDate.getFullYear() &&
              todo.completed // 완료된 할일만 체크
            );
          });
          return (
            <div
              key={day}
              className={`day ${hasCompleted ? 'has-completed' : ''}`}
              onClick={() => handleDateClick(day)}
            >
              {day}
              {hasCompleted && <span className="dot completed" />}
            </div>
          );
        })}
      </div>
      <style jsx>{`
        .calendar {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
          width: 100%;
          margin-top: 10px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .nav-button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 5px;
          cursor: pointer;
        }
        .nav-button:hover {
          background-color: #0056b3;
        }
        .current-month {
          font-weight: bold;
        }
        .days-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
        }
        .day-header {
          text-align: center;
          font-weight: bold;
        }
        .days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 5px;
        }
        .day {
          padding: 10px;
          text-align: center;
          cursor: pointer;
          position: relative;
          border: 1px solid #e0e0e0;
          border-radius: 5px;
          transition: background-color 0.3s;
        }
        .day:hover {
          background-color: #f0f0f0;
        }
        .day.empty {
          background-color: transparent;
        }
        .day.has-completed {
          background-color: #ffe0e0; /* 완료된 할일이 있는 날 */
        }
        .dot {
          display: block;
          width: 8px; /* 점의 크기를 약간 키움 */
          height: 8px; /* 점의 크기를 약간 키움 */
          border-radius: 50%;
          position: absolute;
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
        }
        .dot.completed {
          background-color: red; /* 완료된 할일의 점 */
        }
      `}</style>
    </div>
  );
};

export default Calendar;
