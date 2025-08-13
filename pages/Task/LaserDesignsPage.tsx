import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../../public/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faDownload,
  faFileArchive,
} from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface LaserDesign {
  ldu_id: number;
  laserDesignPath: string;
  uploadTimestamp: string;
  revision_id: number;
  revision: string;
  version: number;
}

const LaserDesignsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [laserDesigns, setLaserDesigns] = useState<LaserDesign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [revisions, setRevisions] = useState<
    { r_id: number; revision: string }[]
  >([]);
  const [selectedRevisionId, setSelectedRevisionId] = useState<number | null>(
    null,
  );
  const [versions, setVersions] = useState<LaserDesign[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteLduId, setDeleteLduId] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchLaserDesigns = async (revisionId?: number, version?: string) => {
    try {
      let url = `${BASE_URL}api/product/${productId}/laserUploads/${revisionId}`;
      if (version && version !== '') {
        url += `/${version}`;
      }
      const response = await axios.get(url);
      setLaserDesigns(response.data.files || []);
    } catch (error) {
      console.error('Error fetching files:', error);
      setLaserDesigns([]);
    }
  };

  const fetchRevisions = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}api/product/${productId}/revisions`,
      );
      const fetchedRevisions = response.data.revisions || [];
      setRevisions(fetchedRevisions);

      if (fetchedRevisions.length > 0) {
        const latestRevision = fetchedRevisions[0].r_id;
        setSelectedRevisionId(latestRevision);
        fetchVersions(latestRevision);
        fetchLaserDesigns(latestRevision);
      }
    } catch (error) {
      console.error('Error fetching revisions:', error);
    }
  };

  const fetchVersions = async (revisionId: number) => {
    try {
      const response = await axios.get(
        `${BASE_URL}api/revisions/${revisionId}/versions`,
      );
      const versionList = response.data.versions || [];

      if (versionList.length > 0) {
        const latestVersion = Math.max(...versionList.map((v) => v.version));
        setVersions(versionList);
        setSelectedVersion(latestVersion.toString());
        fetchLaserDesigns(revisionId, latestVersion.toString());
      } else {
        setVersions([]);
        setSelectedVersion('');
        fetchLaserDesigns(revisionId);
      }
    } catch (error) {
      console.error('Error fetching versions:', error);
    }
  };

  const handleRevisionChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedRevision = Number(event.target.value);
    setSelectedRevisionId(selectedRevision);
    setSelectedVersion('');
    fetchVersions(selectedRevision);
    fetchLaserDesigns(selectedRevision);
  };

  const handleVersionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;

    if (!selectedValue) {
      // If "Select Version" is chosen, remove the version filter
      setSelectedVersion('');
      fetchLaserDesigns(selectedRevisionId);
    } else {
      setSelectedVersion(selectedValue);
      fetchLaserDesigns(selectedRevisionId, selectedValue);
    }
  };

  useEffect(() => {
    fetchRevisions();
  }, [productId]);

  useEffect(() => {
    if (selectedRevisionId) {
      fetchVersions(selectedRevisionId);
    }
  }, [selectedRevisionId]);

  const extractFileName = (path: string) => {
    return path.split('\\').pop();
  };

  const handleDownload = async (fileId: number) => {
    console.log('Downloading file with ID:', fileId);
    try {
      const downloadUrl = `${BASE_URL}api/downloadLaser/${fileId}`;
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Error downloading file:', error);
      setPopupMessage('Failed to download file.');
      setTimeout(() => setPopupMessage(null), 3000);
    }
  };

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const handleDelete = (lduId: number) => {
    setDeleteLduId(lduId);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    if (!deleteLduId) return;

    try {
      await axios.delete(`${BASE_URL}api/delete-laser/${deleteLduId}`);
      setPopupMessage('File deleted successfully.');
      fetchLaserDesigns(selectedRevisionId, selectedVersion);
    } catch (error) {
      console.error('Error deleting file:', error);
      setPopupMessage('Failed to delete file.');
    }

    setShowDeletePopup(false);
    setDeleteLduId(null);
    setTimeout(() => setPopupMessage(null), 3000);
  };

  const handleDownloadRevisionZip = async () => {
    if (!selectedRevisionId) {
      setPopupMessage('Please select a revision to download.');
      setTimeout(() => setPopupMessage(null), 3000);
      return;
    }

    try {
      const downloadUrl = `${BASE_URL}api/download-latest-laser-design-version-zip/${productId}/${selectedRevisionId}`;

      // Check if file exists before triggering
      const headResponse = await fetch(downloadUrl, { method: 'HEAD' });
      if (!headResponse.ok) {
        throw new Error('No ZIP file found for download.');
      }

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', ''); // let server filename be used
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      console.error('Error downloading ZIP file:', error);
      setPopupMessage(error.message || 'Failed to download ZIP file.');
      setTimeout(() => setPopupMessage(null), 3000);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800 whitespace-nowrap">
          Laser Designs
        </h2>

        <div className="flex-1 max-w-md">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Select Revision
          </label>
          <select
            className="px-2 py-1 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
            value={selectedRevisionId || ''}
            onChange={handleRevisionChange}
          >
            <option value="" disabled className="text-gray-400">
              Select Revision
            </option>
            {revisions.map((revision) => (
              <option key={revision.r_id} value={revision.r_id}>
                {revision.revision}
              </option>
            ))}
          </select>
        </div>

        {versions.length > 0 && (
          <div className="flex-1 max-w-md">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Select Version
            </label>
            <select
              className="px-2 py-1 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
              value={selectedVersion || ''}
              onChange={handleVersionChange}
            >
              <option value="">Select Version</option>
              {versions.map((version) => (
                <option key={version.version} value={version.version}>
                  {version.version}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-2 self-end">
          <button
            className="bg-green-500 inline-flex items-center justify-center rounded-md py-2 px-4 text-white hover:bg-opacity-75"
            onClick={handleDownloadRevisionZip}
          >
            <FontAwesomeIcon icon={faFileArchive} className="mr-2" />
            Download Zip
          </button>

          <button
            className="flex items-center justify-center bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 whitespace-nowrap"
            onClick={handleBackButtonClick}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="overflow-auto max-h-96 border rounded-lg bg-white shadow relative">
          <table className="w-full table-auto border-collapse">
            <thead className="top-0 bg-gray-200 z-10 sticky">
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">File Name</th>
                <th className="px-4 py-2 text-left">Revision</th>
                <th className="px-4 py-2 text-left">Version</th>
                <th className="px-4 py-2 text-left">Uploaded At</th>
                <th className="px-4 py-2 text-left">Download</th>
                <th className="px-4 py-2 text-left">Delete</th>
              </tr>
            </thead>
            <tbody>
              {laserDesigns.length > 0 ? (
                laserDesigns.map((design, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">
                      {extractFileName(design.laserDesignPath)}
                    </td>
                    <td className="px-4 py-2">{design.revision}</td>
                    <td className="px-4 py-2">{design.version}</td>
                    <td className="px-4 py-2">
                      {new Date(design.uploadTimestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        title="Download"
                        className="bg-purple-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                        onClick={() => handleDownload(design.ldu_id)}
                      >
                        <FontAwesomeIcon icon={faDownload} />
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        title="Delete"
                        className="bg-red-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                        onClick={() => handleDelete(design.ldu_id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No laser designs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-999">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete this file? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowDeletePopup(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {popupMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          {popupMessage}
        </div>
      )}
    </div>
  );
};

export default LaserDesignsPage;
