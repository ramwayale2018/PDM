import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../../public/config.js';

const AddPath: React.FC = () => {
  const [folderPath, setFolderPath] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleAddFolderPath = async () => {
    if (!folderPath.trim()) {
      setMessage('Folder path cannot be empty.');
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}api/add-folder-path`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder_path: folderPath }),
      });

      if (!response.ok) {
        throw new Error('Failed to add folder path');
      }

      const data = await response.json();
      setMessage(data.message);
      setFolderPath('');
    } catch (error) {
      console.error('Error adding folder path:', error);
      setMessage('Failed to add folder path. Please try again.');
    }
  };

  return (
    <>
      <div className="mt-4">
        <label
          htmlFor="folderPath"
          className="block text-sm font-medium text-gray-700"
        >
          Add Base Folder Path
        </label>
        <input
          id="folderPath"
          type="text"
          value={folderPath}
          onChange={(e) => setFolderPath(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter folder path"
        />
        <button
          onClick={handleAddFolderPath}
          className="mt-2 mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add
        </button>
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
      </div>
    </>
  );
};

export default AddPath;
