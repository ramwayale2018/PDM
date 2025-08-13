

import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileExcel, faTimes } from '@fortawesome/free-solid-svg-icons';
import { BASE_URL } from '../../../public/config.js';
import * as XLSX from 'xlsx';

const LatestDesignFiles = () => {
  const [designFiles, setDesignFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(''); 
  const [endDate, setEndDate] = useState(''); 
  const [currentPage, setCurrentPage] = useState(1);
  const [filesPerPage] = useState(10);

  useEffect(() => {
    const fetchDesignFiles = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/latest-design-upload`);
        setDesignFiles(response.data.data);
        setFilteredFiles(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching design upload versions:', error);
        setError('Failed to fetch design upload versions.');
        setLoading(false);
      }
    };

    fetchDesignFiles();
  }, []);

  const extractFileName = (path: string) => {
    return path.split('\\').pop();
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

  useEffect(() => {
    let filtered = designFiles;

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter((file) => {
        const userMatch = file.user_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const productMatch = file.product_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const fileMatch = extractFileName(file.design_path).toLowerCase().includes(searchTerm.toLowerCase());
        const versionMatch = file.version.toString().includes(searchTerm);
        return userMatch || productMatch || fileMatch || versionMatch;
      });
    }

    // Apply date filter
    if (startDate && endDate) {
      filtered = filtered.filter((file) => {
        const fileDate = new Date(file.upload_timestamp).getTime();
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        return fileDate >= start && fileDate <= end;
      });
    }

    setFilteredFiles(filtered);
    setCurrentPage(1);
  }, [searchTerm, startDate, endDate, designFiles]);

  // Clear all filters
  const clearFilter = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
  };

  const handleDownloadPreviousVersion = async (filePath) => {
    try {
      const downloadUrl = `${BASE_URL}api/download-by-path?filePath=${encodeURIComponent(filePath)}`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', '');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      setPopupMessage('Failed to download file.');
      setTimeout(() => setPopupMessage(null), 3000);
    }
  };

  // Export to Excel function
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredFiles.map((file) => ({
      'Sr. No.': (filteredFiles.indexOf(file) + 1),
      'Uploaded By': file.user_name || 'N/A',
      'Product': file.product_name || 'N/A',
      'File Name': extractFileName(file.design_path),
      'Version': file.version,
      'Timestamp': formatDateTime(file.upload_timestamp),
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Design Files');
    XLSX.writeFile(workbook, 'LatestDesignFiles.xlsx');
  };

  // Pagination logic
  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to next page
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredFiles.length / filesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredFiles.length / filesPerPage);

  // Generate pagination numbers with ellipsis
  const getPaginationNumbers = () => {
    const pages = [];
    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        pages.push(1, 2, 3);
        if (totalPages > 3) pages.push('...');
      } else if (currentPage >= totalPages - 1) {
        if (totalPages > 3) pages.push('...');
        pages.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...');
      }
    }
    return pages;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <Breadcrumb pageName="Latest Design Files" />

      {/* Search and Date Filter Section */}
      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search files"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded w-1/4"
        />
        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={clearFilter}
          className="bg-gray-500 inline-flex items-center justify-center rounded-md py-2 px-4 text-center text-white hover:bg-gray-600"
        >
          <FontAwesomeIcon icon={faTimes} className="mr-2" />
          Clear Filter
        </button>
        <button
          onClick={exportToExcel}
          className="bg-green-500 inline-flex items-center justify-center rounded-md py-2 px-4 text-center text-white hover:bg-green-600"
        >
          <FontAwesomeIcon icon={faFileExcel} className="mr-2" />
          Export to Excel
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto max-h-96 border rounded-lg bg-white shadow relative">
        <table className="w-full table-auto">
          <thead className="sticky top-0 bg-gray-200 z-10">
            <tr className="text-left">
              <th className="py-4 px-4">Sr. No.</th>
              <th className="py-4 px-4">Uploaded By</th>
              <th className="py-4 px-4">Product</th>
              <th className="py-4 px-4">File Name</th>
              <th className="py-4 px-4">Version</th>
              <th className="py-4 px-4">Timestamp</th>
              <th className="py-4 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentFiles.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  No matching files found
                </td>
              </tr>
            ) : (
              currentFiles.map((file, index) => (
                <tr key={file.duv_id}>
                  <td className="py-4 px-4">{(currentPage - 1) * filesPerPage + index + 1}</td>
                  <td className="py-4 px-4">{file.user_name || 'N/A'}</td>
                  <td className="py-4 px-4">{file.product_name || 'N/A'}</td>
                  <td className="py-4 px-4">{extractFileName(file.design_path)}</td>
                  <td className="py-4 px-4">{file.version}</td>
                  <td className="py-4 px-4">{formatDateTime(file.upload_timestamp)}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="bg-purple-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                        onClick={() => handleDownloadPreviousVersion(file.design_path)}
                      >
                        <FontAwesomeIcon icon={faDownload} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 mx-1 rounded ${
            currentPage === 1
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Previous
        </button>
        {getPaginationNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && paginate(page)}
            className={`px-4 py-2 mx-1 rounded ${
              currentPage === page
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 mx-1 rounded ${
            currentPage === totalPages
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Next
        </button>
      </div>

      {/* Popup Message */}
      {popupMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          {popupMessage}
        </div>
      )}
    </div>
  );
};

export default LatestDesignFiles;