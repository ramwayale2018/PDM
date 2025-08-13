import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../public/config.js';

interface Task {
  product_id: number;
  product_name: string;
  status: string;
  comments: string;
  assignedUsers: string;
  assignedRoles: string;
  latestFilePath: string;
  product_version: number;
}

const Parts: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/tasks`, {
        withCredentials: true,
      });
      const data = response.data.data;
      const tasks = data.map((task) => ({
        ...task,
        assignedUsers: task.assigned_users,
      }));
      const sortedTasks = tasks.sort(
        (a: Task, b: Task) => b.product_id - a.product_id,
      );
      setTasks(sortedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleViewFiles = (productId: number) => {
    navigate(`/dfx-files/${productId}`); 
  };

  return (
    <div className="p-4">
      <Breadcrumb pageName="Part List" />
      <input
        type="text"
        placeholder="Search Parts"
        className="p-2 border border-gray-300 rounded w-half mr-2 mb-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-auto max-h-96 border rounded-lg bg-white shadow relative">
        <table className="w-full table-auto">
          <thead className="sticky top-0 bg-gray-200 z-10">
            <tr className="text-left">
              <th className="py-4 px-4">Part No</th>
              <th className="py-4 px-4">DFX Files</th>
            </tr>
          </thead>
          <tbody>
            {tasks
              .filter((task) =>
                task.product_name.toLowerCase().includes(searchTerm.toLowerCase()),
              )
              .map((task) => (
                <tr key={task.product_id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 text-black">{task.product_name}</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleViewFiles(task.product_id)}
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition-colors"
                    >
                      View DFX Files
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Parts;
