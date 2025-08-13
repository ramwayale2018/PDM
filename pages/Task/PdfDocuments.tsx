import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../../public/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDownload,
  faArrowLeft,
  faEye,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { BsTruck } from 'react-icons/bs';

import PdfViewer from "../../components/PdfViewer"

interface PdfDocument {
  pdf_id: number;
  product_id: number;
  pdf_file_path: string;
  upload_timestamp: string;
  revision_id: number;
  revision: string;
  version: number;
}

const PdfDocuments: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [pdfDocuments, setPdfDocuments] = useState<PdfDocument[]>([]);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [revisions, setRevisions] = useState<
    { r_id: number; revision: string }[]
  >([]);
  const [selectedRevisionId, setSelectedRevisionId] = useState<number | null>(
    null,
  );
  const [versions, setVersions] = useState<PdfDocument[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deletePdfId, setDeletePdfId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string>('');


  const [currentPdf, setCurrentPdf] = useState<{ id: number; url: string } | null>(null);
  
  const navigate = useNavigate();

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

  const fetchPdfDocuments = async (revisionId?: number, version?: string) => {
    try {
      let url = `${BASE_URL}api/product/${productId}/pdf-documents/${revisionId}`;
      if (version && version !== '') {
        url += `/${version}`;
      }
      const response = await axios.get(url);
      setPdfDocuments(response.data.files || []);
    } catch (error) {
      console.error('Error fetching files:', error);
      setPdfDocuments([]);
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
        fetchPdfDocuments(latestRevision);
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
        fetchPdfDocuments(revisionId, latestVersion.toString());
      } else {
        setVersions([]);
        setSelectedVersion('');
        fetchPdfDocuments(revisionId);
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
    fetchPdfDocuments(selectedRevision);
  };

  const handleVersionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;

    if (!selectedValue) {
      // If "Select Version" is chosen, remove the version filter
      setSelectedVersion('');
      fetchPdfDocuments(selectedRevisionId);
    } else {
      setSelectedVersion(selectedValue);
      fetchPdfDocuments(selectedRevisionId, selectedValue);
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

  const handleDownload = async (pdfId: number) => {
    try {
      const downloadUrl = `${BASE_URL}api/downloadPdfDocument/${pdfId}`;
      console.log('Download URL:', downloadUrl);

      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Error downloading PDF file:', error);
      setPopupMessage('Failed to download PDF file.');
      setTimeout(() => setPopupMessage(null), 3000);
    }
  };





// 0 chnage 
  // const openFile = async (pdfId: number) => {
  //   try {
  //     const apiUrl = `${BASE_URL}api/open-file/${pdfId}`;
  //     window.open(apiUrl, '_blank'); // This will now open in browser PDF viewer
  //   } catch (error) {
  //     console.error('❌ Error opening file:', error);
  //     alert('Failed to open the file.');
  //   }
  // };





  // const openFile = async (pdfId: number) => {
  //   try {
  //     const apiUrl = `${BASE_URL}api/open-file/${pdfId}`;
  //     console.log("PDF URL: ", apiUrl)
  //     setCurrentPdf({ id: pdfId, url: apiUrl });
  //   } catch (error) {
  //     console.error('❌ Error opening file:', error);
  //     alert('Failed to open the file.');
  //   }
  // };

const openFile = async (pdfId: number) => {
  try {
    const apiUrl = `${BASE_URL}api/open-file/${pdfId}`;
    console.log("PDF URL: ", apiUrl);
    setCurrentPdf({ id: pdfId, url: apiUrl });
  } catch (error) {
    console.error("❌ Error opening file:", error);
    alert("Failed to open the file.");
  }
};

const closePdfViewer = () => setCurrentPdf(null);


  const confirmDelete = async () => {
    if (!deletePdfId) return;

    try {
      await axios.delete(`${BASE_URL}api/delete-pdf/${deletePdfId}`);
      setPopupMessage('PDF deleted successfully.');
      // setShowDeletePopup(true);
      fetchPdfDocuments();
    } catch (error) {
      // console.error('Error deleting PDF:', error);
      setPopupMessage('Failed to delete PDF.');
    }

    setShowDeletePopup(false);
    setDeletePdfId(null);
    setTimeout(() => setPopupMessage(null), 3000);
  };

  return (
    <div className="p-4" >
      <div className="flex items-center justify-between gap-4 mb-6">
        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-800 whitespace-nowrap">
          PDF Documents
        </h1>
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
        {/* Back Button */}
        <button
          className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 whitespace-nowrap"
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back
        </button>
      </div>

      <div className="overflow-auto max-h-96 border rounded-lg bg-white shadow relative">
        <table className="w-full table-auto border-collapse">
          <thead className="sticky top-0 bg-gray-200 z-10">
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">PDF Document</th>
              <th className="px-4 py-2 text-left">Revision</th>
              <th className="px-4 py-2 text-left">Version</th>
              <th className="px-4 py-2 text-left">Uploaded At</th>
              {/* <th className="px-4 py-2 text-left">Download</th> */}
              <th className="px-4 py-2 text-left">View</th>
              {(userRole === 'admin' || userRole === 'designer' &&
              <th className="px-4 py-2 text-left">Delete</th>
            )}
            </tr>
          </thead>
          <tbody>
            {pdfDocuments.length > 0 ? (
              pdfDocuments.map((pdfDoc) => {
                const filename = extractFileName(pdfDoc.pdf_file_path);
                return (
                  <tr key={pdfDoc.pdf_id} className="border-b">
                    <td className="px-4 py-2">{filename}</td>
                    <td className="px-4 py-2">{pdfDoc.revision}</td>
                    <td className="px-4 py-2">{pdfDoc.version}</td>
                    <td className="px-4 py-2">
                      {new Date(pdfDoc.upload_timestamp).toLocaleString()}
                    </td>
                    {/* <td className="px-4 py-2">
                      <button
                        className="bg-purple-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                        onClick={() => handleDownload(pdfDoc.pdf_id)}
                      >
                        <FontAwesomeIcon icon={faDownload} />
                      </button>
                    </td> */}

                    {/* <td className="px-4 py-2">
                      <button
                        className="bg-purple-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                        onClick={() => openFile(pdfDoc.pdf_id)}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </td> */}

                    <td className="px-4 py-2">
                      <button
                      title='View File'
                        className="bg-purple-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                        onClick={() => {
                          openFile(pdfDoc.pdf_id);
                        }}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </td>
                    
                    {(userRole === 'admin' || userRole === 'designer' &&
                    <td className="px-4 py-2">
                      <button
                      title='Delete'
                        className="bg-red-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                        onClick={() => {
                          setShowDeletePopup(true);
                          setDeletePdfId(pdfDoc.pdf_id);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
                  No PDF documents uploaded
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
      </div>
    {currentPdf && <PdfViewer pdfUrl={currentPdf.url} onClose={closePdfViewer} />}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-999">
          <div className="bg-white p-6 rounded shadow-lg">
            <p className="mb-4">Are you sure you want to delete this PDF?</p>
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={confirmDelete}
              >
                Delete
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowDeletePopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
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

export default PdfDocuments;
