'use client';

const CompletedTasks = ({ completedTasks }) => {
  return (
    <div className="mt-8 mx-auto max-w-2xl p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">오늘의 한일</h2>
      {completedTasks.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          완료된 할일이 없습니다.
        </p>
      ) : (
        <ul className="space-y-3">
          {completedTasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center p-3 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={true}
                  readOnly
                  className="appearance-none h-5 w-5 bg-green-500 border-transparent rounded-md focus:outline-none"
                  id={`completed-${task.id}`}
                />
                <span className="absolute inset-0 flex items-center justify-center text-white">
                  <svg
                    className="h-3 w-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
              <span className="ml-3 text-gray-700 line-through">
                {task.text}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompletedTasks;
