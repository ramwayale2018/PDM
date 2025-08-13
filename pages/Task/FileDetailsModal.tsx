import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const FileDetailsModal = ({ versions, onClose, onDownload }) => {
  if (!versions || versions.length === 0) return null;

  // Function to extract the file name from the file path
  const extractFileName = (path) => {
    return path.split('\\').pop();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full relative">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          File Versions
        </h2>
        {versions.length > 0 ? (
          <div className="overflow-x-auto max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm font-medium">
                  <th className="py-3 px-4 border-b text-left">File Name</th>
                  <th className="py-3 px-4 border-b text-left">Version</th>
                  <th className="py-3 px-4 border-b text-left">Uploaded By</th>
                  <th className="py-3 px-4 border-b text-left">Uploaded At</th>
                  <th className="py-3 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {versions.map((version) => (
                  <tr
                    key={version.duv_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 border-b">
                      {extractFileName(version.file_path)}
                    </td>
                    <td className="py-3 px-4 border-b">{version.version}</td>
                    <td className="py-3 px-4 border-b">
                      {version.userName || 'Unknown'}
                    </td>
                    <td className="py-3 px-4 border-b">
                      {new Date(version.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 border-b">
                      <button
                        className="bg-purple-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                        onClick={() => onDownload(version.file_path)}
                      >
                        <FontAwesomeIcon icon={faDownload} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-600">No versions found.</p>
        )}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileDetailsModal;