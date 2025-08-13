import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../../public/config.js';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCopy } from '@fortawesome/free-solid-svg-icons';

interface DfxFile {
  dfx_id: number;
  product_id: number;
  user_id: number;
  dfx_file_path: string;
  upload_timestamp: string;
  revision_id: number;
  revision: string;
}

const DfxFiles: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [dfxFiles, setDfxFiles] = useState<DfxFile[]>([]);
  const [revisions, setRevisions] = useState<
    { r_id: number; revision: string }[]
  >([]);
  const [selectedRevisionId, setSelectedRevisionId] = useState<number | null>(
    null,
  );
  const navigate = useNavigate();

  const fetchDfxFiles = async (revisionId?: number) => {
    try {
      const response = await axios.get(
        `${BASE_URL}api/dfx-files/${productId}/${revisionId}`,
        {
          withCredentials: true,
        },
      );
      setDfxFiles(response.data.data);
      setSelectedRevisionId(response.data.revisionId);
    } catch (error) {
      console.error('Error fetching DXF files:', error);
    }
  };

  const fetchRevisions = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}api/product/${productId}/revisions`,
      );
      const fetchedRevisions = response.data.revisions || [];

      setRevisions(fetchedRevisions);

      // Automatically select the latest revision
      if (fetchedRevisions.length > 0) {
        const latestRevision = fetchedRevisions[0].r_id;
        setSelectedRevisionId(latestRevision);

        // Fetch files for the latest revision
        fetchDfxFiles(latestRevision);
      }
    } catch (error) {
      console.error('Error fetching revisions:', error);
    }
  };

  useEffect(() => {
    if (selectedRevisionId) {
      fetchDfxFiles(selectedRevisionId);
    }
  }, [selectedRevisionId]);

  const handleRevisionChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedRevision = event.target.value;
    setSelectedRevisionId(Number(selectedRevision));
    if (selectedRevision) {
      fetchDfxFiles(Number(selectedRevision));
    }
  };

  useEffect(() => {
    fetchRevisions();
  }, [productId]);

  const handleCopyPath = async (dfxId: number) => {
    try {
      // Call the new endpoint to get the resolved network path
      const response = await axios.get(
        `${BASE_URL}api/copy-dfx-path/${dfxId}`,
        {
          withCredentials: true,
        },
      );

      const resolvedFilePath = response.data.resolvedFilePath;

      // Copy the resolved network path to the clipboard
      navigator.clipboard
        .writeText(resolvedFilePath)
        .then(() => {
          alert('File path copied to clipboard!');
        })
        .catch((err) => {
          console.error('Failed to copy file path:', err);
          alert('Failed to copy file path.');
        });
    } catch (error) {
      console.error('Error copying file path:', error);
      alert('An error occurred while copying the file path.');
    }
  };

  return (
    <div className="p-4">
      <Breadcrumb pageName="DXF Files" />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => navigate(-1)}
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Back
      </button>
      <div className="flex-1">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Select Revision
        </label>
        <select
          className=" px-2 py-2 mb-5 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
          value={selectedRevisionId || ''}
          onChange={handleRevisionChange}
        >
          <option value="" disabled className="text-gray-400">
            Select Revision
          </option>
          {revisions.map((revision) => (
            <option
              key={revision.r_id}
              value={revision.r_id}
              className="text-gray-700 hover:bg-blue-100"
            >
              {revision.revision}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-auto max-h-96 border rounded-lg bg-white shadow relative">
        <table className="w-full table-auto">
          <thead className="sticky top-0 bg-gray-200 z-10">
            <tr className="text-left">
              <th className="py-4 px-4">File Name</th>
              <th className="py-4 px-4">Uploaded At</th>
              <th className="py-4 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dfxFiles.length > 0 ? (
              dfxFiles.map((file) => (
                <tr key={file.dfx_id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 text-black">
                    {file.dfx_file_path.split('\\').pop()}
                  </td>
                  <td className="py-4 px-4">
                    {new Date(file.upload_timestamp).toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => handleCopyPath(file.dfx_id)}
                    >
                      <FontAwesomeIcon icon={faCopy} className="mr-2" />
                      Copy Path
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-4 px-4 text-center text-gray-500">
                  No files available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DfxFiles;
