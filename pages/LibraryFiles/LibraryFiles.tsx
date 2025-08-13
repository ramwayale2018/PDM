import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUpload, faDownload } from '@fortawesome/free-solid-svg-icons';
import { BASE_URL } from '../../../public/config.js';

const LibraryFiles = () => {
  const [libraryFiles, setLibraryFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [userRole, setUserRole] = useState<string>('');
  const [duplicateFileMessage, setDuplicateFileMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchLibraryFiles = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/fetch-library-files`);
        // Sort files in descending order based on upload_timestamp
        const sortedFiles = response.data.files.sort((a, b) => 
          new Date(b.upload_timestamp).getTime() - new Date(a.upload_timestamp).getTime()
        );
        setLibraryFiles(sortedFiles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching library files:', error);
        setError('Failed to fetch library files.');
        setLoading(false);
      }
    };
  
    fetchLibraryFiles();
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(`${BASE_URL}auth/get-name`, {
          withCredentials: true,
        });
        const role = response.data.role;
        console.log('Role :', role);
        setUserRole(role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };
    fetchUserRole();
  }, []);

  const extractFileName = (path: string) => {
    return path.split('\\').pop();
  };

    const handleDownload = async (fileId: number) => {
      try {
        const downloadUrl = `${BASE_URL}api/downloadLibrary/${fileId}`;
        console.log('Download URL:', downloadUrl);
        window.open(downloadUrl, '_blank');
      } catch (error) {
        console.error('Error downloading file:', error);
        setPopupMessage('Failed to download file.');
        setTimeout(() => setPopupMessage(null), 3000);
      }
    };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleUploadFiles = async () => {
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });

      // Check for duplicate files
      const duplicateFiles = selectedFiles.filter((file) =>
        libraryFiles.some((libFile) => libFile.library_file_path.includes(file.name))
      );

      if (duplicateFiles.length > 0) {
        setDuplicateFileMessage(`The file "${duplicateFiles[0].name}" already exists.`);
        return;
      }

      // If no duplicates, proceed with upload
      const response = await axios.post(`${BASE_URL}api/upload-library-files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (response.status === 201) {
        setShowUploadPopup(false);
        setSelectedFiles([]);
        setDuplicateFileMessage(null);
        // Refresh the library files list
        const fetchResponse = await axios.get(`${BASE_URL}api/fetch-library-files`);
        setLibraryFiles(fetchResponse.data.files);
      }
    } catch (error) {
      console.error('Error uploading library files:', error);
      setError('Failed to upload library files.');
    }
  };

  // Filter files based on search term
  const filteredFiles = libraryFiles.filter((file) =>
    extractFileName(file.library_file_path).toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <Breadcrumb pageName="Library Files" />

      {/* Search and Upload Section */}
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search files by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded w-1/3"
        />

        {/* Upload Button */}
        {userRole === 'admin' && (
          <button
            onClick={() => setShowUploadPopup(true)}
            className="bg-blue-500 inline-flex items-center justify-center rounded-md py-2 px-4 text-center text-white hover:bg-blue-600"
          >
            <FontAwesomeIcon icon={faUpload} className="mr-2" />
            Upload Library Files
          </button>
        )}
      </div>

      {/* Upload Popup */}
      {showUploadPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-999">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">Upload Library Files</h2>

            {/* Duplicate File Message */}
            {duplicateFileMessage && (
              <div className="mb-4 text-red-500">
                {duplicateFileMessage}
              </div>
            )}

            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="mb-4"
            />
            <div className="mb-4">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between mb-2">
                  <span>{file.name}</span>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowUploadPopup(false);
                  setDuplicateFileMessage(null);
                }}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadFiles}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-auto max-h-96 border rounded-lg bg-white shadow relative">
        <table className="w-full table-auto">
          <thead className="sticky top-0 bg-gray-200 z-10">
            <tr className="text-left">
              <th className="py-4 px-4">Sr. No.</th>
              <th className="py-4 px-4">File Path</th>
              <th className="py-4 px-4">Uploaded Time</th>
              <th className="py-4 px-4">Download</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  No matching files found
                </td>
              </tr>
            ) : (
              filteredFiles.map((file, index) => (
                <tr key={file.l_id}>
                  <td className="py-4 px-4 text-black">{index + 1}</td>
                  <td className="py-4 px-4 text-black">{extractFileName(file.library_file_path)}</td>
                  <td className="py-4 px-4 text-black">{formatDateTime(file.upload_timestamp)}</td>
                    <td className="px-4 py-2">
                        <button
                            className="bg-purple-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                            onClick={() => handleDownload(file.l_id)}
                        >
                        <FontAwesomeIcon icon={faDownload} />
                    </button>
                 </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {popupMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          {popupMessage}
        </div>
      )}

    </div>
  );
};

export default LibraryFiles;