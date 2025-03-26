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
    <div className="bg-gradient-to-br from-purple-900/20 via-black/40 to-indigo-900/20 rounded-lg border border-purple-500/30 hover:border-purple-400 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-2">
      <div className="p-6 backdrop-blur-sm">
        <h3 className="font-bold text-xl text-purple-300 mb-2">{internship.title}</h3>
        <p className="text-purple-100/80 mb-4">{internship.company}</p>
        <div className="mt-4 flex gap-6">
          <div className="flex-1">
            <div className="text-purple-100">
              <h4 className="font-medium text-purple-300 mb-2">Assigned Tasks:</h4>
              <ul className="space-y-2">
                {tasks.map((task, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleTaskToggle(index)}
                      className="w-4 h-4 text-purple-600 rounded border-purple-400 
                               focus:ring-purple-500 cursor-pointer bg-purple-900/50"
                    />
                    <span className={`text-purple-200 ${
                      task.completed ? 'line-through text-purple-400/50' : ''
                    }`}>
                      {task.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <ProgressCircle percentage={progress} />
            <p className="text-sm text-gray-600 mt-2">
              {completedTasks} of {tasks.length} tasks completed
            </p>
          </div>
        </div>
        <button
          onClick={() => handleApply(internship._id)}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-md hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default InternshipCard; 