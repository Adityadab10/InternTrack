import React, { useMemo } from 'react';
import { ProgressCircle } from './ProgressCircle';

const InternshipCard = ({ internship, onTaskToggle }) => {
  // Memoize the tasks array to prevent unnecessary recalculations
  const tasks = useMemo(() => 
    internship.tasks.map((task, index) => ({
      text: typeof task === 'string' ? task : task.text,
      completed: Array.isArray(internship.taskStatus) ? 
        internship.taskStatus[index] : false
    }))
  , [internship.tasks, internship.taskStatus]);

  // Memoize the progress calculation
  const { completedTasks, progress } = useMemo(() => {
    const completed = tasks.filter(task => task.completed).length;
    const total = tasks.length;
    return {
      completedTasks: completed,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [tasks]);

  const handleTaskToggle = async (index) => {
    try {
      if (typeof index !== 'number' || index < 0) {
        console.error('Invalid task index:', index);
        return;
      }

      if (onTaskToggle) {
        await onTaskToggle(internship._id, index);
      }
    } catch (error) {
      console.error('Error toggling task:', error);
      // Remove the alert - errors will be handled by the parent component
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-blue-600">
            {internship.internshipTitle || internship.title}
          </h3>
          <p className="text-gray-600">{internship.company}</p>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
          Active
        </span>
      </div>
      
      <div className="mt-4 flex gap-6">
        <div className="flex-1">
          <h4 className="font-medium text-gray-700 mb-2">Assigned Tasks:</h4>
          <ul className="space-y-2">
            {tasks.map((task, index) => (
              <li key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleTaskToggle(index)}
                  className="w-4 h-4 text-purple-600 rounded border-gray-300 
                           focus:ring-purple-500 cursor-pointer"
                />
                <span className={`text-gray-600 ${
                  task.completed ? 'line-through text-gray-400' : ''
                }`}>
                  {task.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-center justify-center">
          <ProgressCircle percentage={progress} />
          <p className="text-sm text-gray-600 mt-2">
            {completedTasks} of {tasks.length} tasks completed
          </p>
        </div>
      </div>
    </div>
  );
};

export default InternshipCard; 