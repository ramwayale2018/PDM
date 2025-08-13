import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../../public/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDownload,
  faArrowLeft,
  faFileArchive,
  faEye,
  faDeleteLeft,
  faTrash,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import PdfViewer from '../../components/PdfViewer';
interface Document {
  pd_id: number;
  product_id: number;
  revision_id: number;
  file_path: string;
  created_at: string;
  revision: string;
}

const ProductDocuments: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [revisions, setRevisions] = useState<
    { r_id: number; revision: string }[]
  >([]);
  const [selectedRevisionId, setSelectedRevisionId] = useState<number | null>(
    null,
  );
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deletePdId, setDeletePdId] = useState<number | null>(null);
  const [currentPdf, setCurrentPdf] = useState<{
    id: number;
    url: string;
  } | null>(null);
  const navigate = useNavigate();

  const [productStatus, setProductStatus] = useState<string>('');

  useEffect(() => {
    const fetchProductStatus = async () => {
      try {
        const res = await fetch(`${BASE_URL}api/statuses`);
        const data = await res.json();
        const product = data.find(
          (p: any) => p.product_id.toString() === productId,
        );
        if (product) {
          setProductStatus(product.status);
        }
      } catch (error) {
        console.error('Error fetching product status:', error);
      }
    };

    fetchProductStatus();
  }, [productId]);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(`${BASE_URL}auth/get-name`, {
          withCredentials: true,
        });
        const role = response.data.role;
        // console.log('Role :', role);
        setUserRole(role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };
    fetchUserRole();
  }, []);

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
        fetchDocuments(latestRevision);
      }
    } catch (error) {
      console.error('Error fetching revisions:', error);
    }
  };

  useEffect(() => {
    if (selectedRevisionId) {
      fetchDocuments(selectedRevisionId);
    }
  }, [selectedRevisionId]);

  const fetchDocuments = async (revisionId?: number) => {
    try {
      const response = await axios.get(
        `${BASE_URL}api/products/${productId}/documents/${revisionId}`,
      );
      setDocuments(response.data.files || []);
      if (!revisionId) {
        setSelectedRevisionId(response.data.revisionId);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleRevisionChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedRevision = event.target.value;
    setSelectedRevisionId(Number(selectedRevision));
    if (selectedRevision) {
      fetchDocuments(Number(selectedRevision));
    }
  };

  useEffect(() => {
    fetchRevisions();
  }, [productId]);

  // Extract file name from the path
  const extractFileName = (path: string) => {
    return path.split('\\').pop();
  };

  const handleDownload = async (fileId: number) => {
    try {
      const downloadUrl = `${BASE_URL}api/downloadProductDocument/${fileId}`;
      console.log('Download URL:', downloadUrl);

      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Error downloading file:', error);
      setPopupMessage('Failed to download file.');
      setTimeout(() => setPopupMessage(null), 3000);
    }
  };

  // const handleDownloadZip = async () => {
  //   try {
  //     const downloadUrl = selectedRevisionId
  //       ? `${BASE_URL}api/download-customer-documents-zip/${productId}/${selectedRevisionId}`
  //       : `${BASE_URL}api/download-customer-documents-zip/${productId}`;

  //     window.open(downloadUrl, '_blank');
  //   } catch (error) {
  //     console.error('Error downloading ZIP file:', error);
  //     setPopupMessage('Failed to download ZIP file.');
  //     setTimeout(() => setPopupMessage(null), 3000);
  //   }
  // };

  const handleDownloadZip = async () => {
    try {
      // const downloadUrl = selectedRevisionId
      //   ? `${BASE_URL}api/download-customer-documents-zip/${productId}/${selectedRevisionId}`
      //   : `${BASE_URL}api/download-customer-documents-zip/${productId}`;

      const downloadUrl =
        selectedRevisionId !== undefined && selectedRevisionId !== null
          ? `${BASE_URL}api/download-customer-documents-zip/${productId}/${selectedRevisionId}`
          : `${BASE_URL}api/download-customer-documents-zip/${productId}`;

      // Fetch the response first to check for errors
      const response = await fetch(downloadUrl);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to download ZIP file.');
      }

      // Open the download link only if the request was successful
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Error downloading ZIP file:', error);
      setPopupMessage(error.message || 'Failed to download ZIP file.');
      setTimeout(() => setPopupMessage(null), 1000);
    }
  };

  // 0 change

  // const openFile = async (pdId: number) => {
  //   try {
  //     const apiUrl = `${BASE_URL}api/open-cust-doc/${pdId}`;
  //     const response = await axios.get(apiUrl);

  //     if (response.data.fileUrl) {
  //       window.open(response.data.fileUrl, '_blank');
  //     } else {
  //       // alert("File URL not found.");
  //     }
  //   } catch (error) {
  //     console.error('❌ Error opening file:', error);
  //     alert('Failed to open the file.');
  //   }
  // };

  // i added this for local path :

  // 0 change
  // const openFile = (pdId: number) => {
  //   const fileStreamUrl = `${BASE_URL}api/open-cust-doc/${pdId}`;
  //   window.open(fileStreamUrl, '_blank');
  // };

  const openFile = async (pdfId: number) => {
    try {
      const apiUrl = `${BASE_URL}api/open-cust-doc/${pdfId}`;
      console.log('PDF URL: ', apiUrl);
      setCurrentPdf({ id: pdfId, url: apiUrl });
    } catch (error) {
      console.error('❌ Error opening file:', error);
      alert('Failed to open the file.');
    }
  };

  const closePdfViewer = () => setCurrentPdf(null);

  // const handleDelete = (pdId: number) => {
  //   setDeletePdId(pdId);
  //   setShowDeletePopup(true);
  // };

  const handleDelete = (pdId: number) => {
    // If user is sales and product is completed, block delete
    if (userRole === 'sales' && productStatus === 'completed') {
      setPopupMessage('You cannot delete documents for completed products.');
      return;
    }
    setDeletePdId(pdId);
    setShowDeletePopup(true);
  };


useEffect(() => {
  console.log('🔍 userRole:', userRole);
  console.log('🔍 productStatus:', productStatus);
}, [userRole, productStatus]);

  // const confirmDelete = async () => {
  //   if (!deletePdId) return;
  //   try {
  //     const response = await axios.delete(
  //       `${BASE_URL}api/delete-cust-doc/${deletePdId}`,
  //     );

  //     if (response.status === 200) {
  //       setDocuments((prevDocs) =>
  //         prevDocs.filter((doc) => doc.pd_id !== deletePdId),
  //       );
  //       setPopupMessage('Document deleted successfully.');
  //     } else {
  //       throw new Error('Deletion failed');
  //     }
  //   } catch (error) {
  //     console.error('Delete error:', error);
  //     setPopupMessage('Failed to delete document.');
  //   }
  //   setShowDeletePopup(false);
  //   setTimeout(() => setPopupMessage(null), 3000);
  // };

  const confirmDelete = async () => {
    if (!deletePdId) return;

    // Double check before delete
    if (userRole === 'sales' && productStatus === 'completed') {
      setPopupMessage('You cannot delete documents for completed products.');
      setShowDeletePopup(false);
      return;
    }

    try {
      const response = await axios.delete(
        `${BASE_URL}api/delete-cust-doc/${deletePdId}`,
      );

      if (response.status === 200) {
        setDocuments((prevDocs) =>
          prevDocs.filter((doc) => doc.pd_id !== deletePdId),
        );
        setPopupMessage('Document deleted successfully.');
      } else {
        throw new Error('Deletion failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setPopupMessage('Failed to delete document.');
    }
    setShowDeletePopup(false);
    setTimeout(() => setPopupMessage(null), 3000);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Customer Uploaded Documents </h1>

      <div className="flex items-center gap-4 mb-6">
        <button
          className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200"
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back
        </button>

        {userRole !== 'viewer' && userRole !== 'sales' && (
          <button
            className="flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-200"
            onClick={handleDownloadZip}
          >
            <FontAwesomeIcon icon={faFileArchive} className="mr-2" />
            Download ZIP
          </button>
        )}

        {/* Select Revision Dropdown */}
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
      </div>

      <div className="overflow-auto max-h-96 border rounded-lg bg-white shadow relative">
        <table className="w-full table-auto border-collapse">
          <thead className="sticky top-0 bg-gray-200 z-10">
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">Document</th>
              <th className="px-4 py-2 text-left">Revision</th>
              {(userRole === 'viewer' || userRole==='admin' || userRole === 'sales' || userRole === 'designer') && (
                <th className="px-4 py-2 text-left">View File</th>
              )}

              {/* {(userRole === 'sales' || userRole === 'admin') && (
                <>
                  <th className="px-4 py-2 text-left">Delete</th>
                </>
              )}
               */}
              {/* {(userRole === 'admin' ||
                (userRole === 'sales' && productStatus !== 'completed')) && (
                <th className="px-4 py-2 text-left">Delete</th>
              )} */}

              {(userRole === 'admin' ||
                (userRole === 'sales' && productStatus !== 'completed')) && (
                <th className="px-4 py-2 text-left">Delete</th>
              )}
            </tr>
          </thead>
          <tbody>
            {documents.length > 0 ? (
              documents.map((doc) => {
                const filename = extractFileName(doc.file_path);
                return (
                  <tr key={doc.pd_id} className="border-b">
                    <td className="px-4 py-2">{filename}</td>
                    <td className="px-4 py-2">{doc.revision}</td>
                    {/* <button
                        className="bg-purple-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                        onClick={() => handleDownload(doc.pd_id)}
                      >
                        <FontAwesomeIcon icon={faDownload} />
                      </button> */}

                    {/* {(userRole === 'viewer' || userRole === 'sales') &&
                      doc.file_path?.toLowerCase().endsWith('.pdf' !== 'null') && (
                        <td className="px-4 py-2">
                          <button
                            className="bg-purple-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                            onClick={() => openFile(doc.pd_id)}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                        </td>
                      )} */}
                    {userRole === 'viewer' || userRole==='admin'|| userRole === 'sales' || userRole === 'designer'? (
                      doc.file_path?.toLowerCase().endsWith('.pdf') ? (
                        <td className="px-4 py-2">
                          <button
                            className="bg-purple-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                            onClick={() => openFile(doc.pd_id)}
                            title="View file"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                        </td>
                      ) : (
                        <td className="px-4 py-2" title="Can't view this file">
                          <FontAwesomeIcon icon={faEyeSlash} />
                        </td>
                      )
                    ) : null}

                    {/* {(userRole === 'sales' || userRole === 'admin') && (
                      <td className="px-4 py-2">
                        <button
                          className="text-red-500 hover:text-red-700 ml-2"
                          onClick={() => handleDelete(doc.pd_id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    )} */}

                    {/* {(userRole === 'admin' ||
                      (userRole === 'sales' &&
                        productStatus !== 'completed')) && (
                      <td className="px-4 py-2">
                        <button
                          className="text-red-500 hover:text-red-700 ml-2"
                          onClick={() => handleDelete(doc.pd_id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    )} */}

                    {(userRole === 'admin' ||
                      (userRole === 'sales' &&
                        productStatus !== 'completed')) && (
                      <td className="px-4 py-2">
                        <button
                          className="ml-2 text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(doc.pd_id)}
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
                <td colSpan={2} className="py-4 pl-6 text-gray-500">
                  No documents uploaded
                </td>
                <td className="px-4 py-2"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-999">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete this product document? This action
              cannot be undone.
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

      {currentPdf && (
        <PdfViewer pdfUrl={currentPdf.url} onClose={closePdfViewer} />
      )}

      {popupMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          {popupMessage}
        </div>
      )}
    </div>
  );
};

export default ProductDocuments;
