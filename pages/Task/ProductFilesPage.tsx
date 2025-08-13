// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { BASE_URL } from '../../../public/config.js';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faEdit,
//   faDownload,
//   faCopy,
//   faHistory,
//   faUpload,
//   faEye,
//   faFileArchive,
//   faArrowLeft,
// } from '@fortawesome/free-solid-svg-icons';
// import FileDetailsModal from './FileDetailsModal';
// import UploadModal from './UploadModal';

// interface FileData {
//   du_id: number;
//   designPath: string;
//   status: string;
//   comment: string | null;
//   version: number;
//   revision: string;
// }

// interface FileVersion {
//   duv_id: number;
//   du_id: number;
//   product_id: number;
//   user_id: number;
//   file_path: string;
//   timestamp: string;
//   version: number;
//   userName?: string;
// }

// const statusOptions = [
//   'pending',
//   'in_progress',
//   'under_review',
//   'on_hold',
//   'completed',
// ];

// const ProductFilesPage: React.FC = () => {
//   const { productId } = useParams<{ productId: string }>();
//   const [files, setFiles] = useState<FileData[]>([]);
//   const [popupMessage, setPopupMessage] = useState<string | null>(null);
//   const [editFile, setEditFile] = useState<FileData | null>(null);
//   const [selectedProductId, setSelectedProductId] = useState<number | null>(
//     null,
//   );
//   const [showStatusActivityLogPopup, setShowStatusActivityLogPopup] =
//     useState(false);
//   const [statusActivityLogs, setStatusActivityLogs] = useState<any[]>([]);
//   const [activityLogs, setActivityLogs] = useState<any[]>([]);
//   const [showActivityLogPopup, setShowActivityLogPopup] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<FileVersion | null>(null);
//   const [selectedVersions, setSelectedVersions] = useState<FileVersion[]>([]);
//   const [showModal, setShowModal] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedFileId, setSelectedFileId] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [userRole, setUserRole] = useState<string>('');

//   const [revisions, setRevisions] = useState<{ r_id: number; revision: string }[]>([]);
//   const [selectedRevisionId, setSelectedRevisionId] = useState<number | null>(null);

//   const navigate = useNavigate();

//   const handleBackButtonClick = () => {
//     navigate('/task/task-list');
//   };



//   const fetchFiles = async (revisionId?: number) => {
//     try {
//       setIsLoading(true);
  
//       const response = await axios.get(`${BASE_URL}api/product/${productId}/uploads/${revisionId || 'latest'}`);
      
//       setFiles(response.data.files || []);
      
//       // Store the selected or default latest revisionId
//       if (!revisionId) {
//         setSelectedRevisionId(response.data.revisionId);
//       }
//     } catch (error) {
//       console.error('Error fetching files:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  

//   const fetchRevisions = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}api/product/${productId}/revisions`);
//       const fetchedRevisions = response.data.revisions || [];
  
//       setRevisions(fetchedRevisions);
  
//       // Automatically select the latest revision
//       if (fetchedRevisions.length > 0) {
//         const latestRevision = fetchedRevisions[0].r_id;
//         setSelectedRevisionId(latestRevision);
        
//         // Fetch files for the latest revision
//         fetchFiles(latestRevision);
//       }
//     } catch (error) {
//       console.error('Error fetching revisions:', error);
//     }
//   };
  


//   const handleRevisionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedRevision = event.target.value;
//     setSelectedRevisionId(Number(selectedRevision));
//     if (selectedRevision) {
//       fetchFiles(Number(selectedRevision));
//     }
//   };

//   useEffect(() => {
//     fetchRevisions();
//   }, [productId]);

//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}auth/get-name`, {
//           withCredentials: true,
//         });
//         const role = response.data.role;
//         console.log('Role :', role);
//         setUserRole(role);
//       } catch (error) {
//         console.error('Error fetching user role:', error);
//       }
//     };
//     fetchUserRole();
//   }, []);

//   const extractFileName = (path: string) => {
//     return path.split('\\').pop();
//   };

//   const copyFilePath = async (filePath: string) => {
//     try {
//       if (navigator.clipboard) {
//         await navigator.clipboard.writeText(filePath);
//         setPopupMessage('File path copied to clipboard!');
//         setTimeout(() => setPopupMessage(null), 3000);
//       }
//     } catch (error) {
//       console.error('Error copying file path:', error);
//       setPopupMessage('Failed to copy file path.');
//       setTimeout(() => setPopupMessage(null), 3000);
//     }
//   };

//   const handleEditClick = (file: FileData) => {
//     setEditFile(file);
//     console.log('Edit File: ', file);
//   };

//   const handleSaveChanges = async () => {
//     console.log('du_id:', editFile.du_id);
//     if (!editFile || !editFile.du_id) {
//       setPopupMessage('Invalid file ID.');
//       return;
//     }

//     try {
//       await axios.put(
//         `${BASE_URL}api/product/uploads/${editFile.du_id}`,
//         {
//           status: editFile.status,
//           comment: editFile.comment,
//         },
//         {
//           withCredentials: true,
//         },
//       );

//       setPopupMessage('File updated successfully!');
//       setFiles((prevFiles) =>
//         prevFiles.map((file) =>
//           file.du_id === editFile.du_id ? editFile : file,
//         ),
//       );
//       setEditFile(null);
//     } catch (error) {
//       console.error('Error updating file:', error);
//       setPopupMessage('Failed to update file.');
//     }

//     setTimeout(() => setPopupMessage(null), 3000);
//   };

//   const fetchStatusActivityLogs = async (duId: number) => {
//     try {
//       const response = await axios.get(
//         `${BASE_URL}api/product/${duId}/design-status-activity`,
//         { withCredentials: true },
//       );
//       if (response.data.data && response.data.data.length > 0) {
//         setStatusActivityLogs(response.data.data);
//         setShowStatusActivityLogPopup(true);
//       } else {
//         setStatusActivityLogs([]);
//         setShowStatusActivityLogPopup(true);
//       }
//     } catch (error) {
//       console.error('Error fetching activity logs:', error);
//       setStatusActivityLogs([]);
//       setShowStatusActivityLogPopup(true);
//     }
//   };

//   const handleVieStatuswActivityLogs = (duId: number) => {
//     setSelectedProductId(duId);
//     fetchStatusActivityLogs(duId);
//   };

//   const handleClosePopup = () => {
//     setShowStatusActivityLogPopup(false);
//   };

//   const handleDownload = async (fileId: number) => {
//     try {
//       const downloadUrl = `${BASE_URL}api/download/${fileId}`;
//       const link = document.createElement('a');
//       link.href = downloadUrl;
//       link.setAttribute('download', '');
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error('Error downloading file:', error);
//       setPopupMessage('Failed to download file.');
//       setTimeout(() => setPopupMessage(null), 3000);
//     }
//   };

//   const handleDownloadPreviousVersion = async (filePath) => {
//     try {
//       const downloadUrl = `${BASE_URL}api/download-by-path?filePath=${encodeURIComponent(
//         filePath,
//       )}`;
//       const link = document.createElement('a');
//       link.href = downloadUrl;
//       link.setAttribute('download', '');
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error('Error downloading file:', error);
//       setPopupMessage('Failed to download file.');
//       setTimeout(() => setPopupMessage(null), 3000);
//     }
//   };


//   const handleDownloadRevisionZip = async () => {
//     try {
//       // Use the selectedRevisionId to download the corresponding revision's zip
//       const downloadUrl = `${BASE_URL}api/download-latest-design-version-zip/${productId}/${selectedRevisionId}`;
      
//       // Create a temporary link to trigger the download
//       const link = document.createElement('a');
//       link.href = downloadUrl;
//       link.setAttribute('download', '');
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error('Error downloading zip file:', error);
//       setPopupMessage('Failed to download zip file.');
//       setTimeout(() => setPopupMessage(null), 3000);
//     }
//   };


//   const handleUploadClick = (fileId) => {
//     setSelectedFileId(fileId);
//     setIsModalOpen(true);
//   };


//   const handleUpload = async (file: File, comment: string) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('comment', comment);

//     setIsLoading(true);
  
//     for (let [key, value] of (formData as any)) {
//       console.log(key, value);
//     }
  
//     try {
//       const response = await axios.post(
//         `${BASE_URL}api/upload/${selectedFileId}`, 
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//           withCredentials: true,
//         },
//       );
  
//       if (response.data.message === 'File uploaded successfully.') {
//         setPopupMessage('File uploaded successfully.');
//         setTimeout(() => setPopupMessage(null), 3000);
//         fetchFiles(selectedRevisionId);
//       }
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       throw new Error(error.response?.data?.message || 'Failed to upload file.');
//     } finally {
//       setIsLoading(false);
//     }
//   };



//   const fetchFileVersions = async (du_id: number) => {
//     try {
//       const response = await axios.get(
//         `${BASE_URL}api/product/${du_id}/designUploadVersions`,
//       );
//       if (response.data.versions && response.data.versions.length > 0) {
//         // Fetch user names for all versions
//         const versionsWithUserNames = await Promise.all(
//           response.data.versions.map(async (version) => {
//             const userResponse = await axios.get(
//               `${BASE_URL}api/users/${version.user_id}`,
//             );
//             return { ...version, userName: userResponse.data.name };
//           }),
//         );
//         setSelectedVersions(versionsWithUserNames);
//         setShowModal(true);
//       }
//     } catch (error) {
//       console.error('Error fetching file versions:', error);
//     }
//   };

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold">Design Files</h2>

// <div className="mb-6">
//   <label className="block text-sm font-semibold text-gray-700 mb-2">
//     Select Revision
//   </label>
//   <select
//     className="w-full px-2 py-1 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
//     value={selectedRevisionId || ''}
//     onChange={handleRevisionChange}
//   >
//     <option value="" disabled className="text-gray-400">
//       Select Revision
//     </option>
//     {revisions.map((revision) => (
//       <option
//         key={revision.r_id}
//         value={revision.r_id}
//         className="text-gray-700 hover:bg-blue-100"
//       >
//         {revision.revision}
//       </option>
//     ))}
//   </select>
// </div>
//         <button
//           className="bg-green-500 inline-flex items-center justify-center rounded-md py-2 px-4 text-center text-white hover:bg-opacity-75"
//           // onClick={handleDownloadLatestVersionZip}
//           onClick={handleDownloadRevisionZip}
//         >
//           <FontAwesomeIcon icon={faFileArchive} className="mr-2" />
//           Download Zip
//         </button>
//       </div>

//       <div className="overflow-auto max-h-96 border rounded-lg bg-white shadow relative">
//         <table className="w-full table-auto border-collapse">
//           <thead className=" top-0 bg-gray-200 z-10 sticky">
//             <tr className="bg-gray-200">
//               <th className="px-4 py-2 text-left">File Name</th>
//               <th className="px-4 py-2 text-left">Revision</th>
//               <th className="px-4 py-2 text-left">Version</th>
//               {userRole !== 'designer' && (
//               <th className="px-4 py-2 text-left">Status</th>
//               )}
//               <th className="px-4 py-2 text-left">Comment</th>
//               <th className="px-4 py-2 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {files.length > 0 ? (
//               files.map((file) => (
//                 <tr key={file.du_id} className="border-b">
//                   <td className="px-4 py-2">
//                     {extractFileName(file.designPath)}
//                   </td>
//                   <td className="px-4 py-2">{file.revision}</td>
//                   <td className="px-4 py-2">{file.version}</td>
//                   {userRole !== 'designer' && (
//                   <td className="py-2 px-4">
//                     <span
//                       className={`inline-block px-3 py-1 rounded-full text-sm ${
//                         file.status === 'pending'
//                           ? 'bg-gray-300 text-gray-600'
//                           : file.status === 'in_progress'
//                           ? 'bg-blue-300 text-blue-600'
//                           : file.status === 'on_hold'
//                           ? 'bg-yellow-300 text-yellow-600'
//                           : file.status === 'completed'
//                           ? 'bg-green-300 text-green-600'
//                           : file.status === 'under_review'
//                           ? 'bg-orange-300 text-orange-600'
//                           : 'bg-danger text-black'
//                       }`}
//                     >
//                       {file.status}
//                     </span>
//                   </td>
//                   )}
//                   <td className="px-4 py-2">{file.comment || 'No comments'}</td>
//                   <td className="px-4 py-2 flex gap-2">
//                     {/* <button
//                       className="bg-blue-500  mr-2 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
//                       onClick={() => copyFilePath(file.designPath)}
//                     >
                    
//                           <FontAwesomeIcon
//                         icon={faCopy}
//                       />
//                     </button> */}
//                     <button
//                       className="bg-green-500  inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
//                       onClick={() => handleEditClick(file)}
//                     >
//                       <FontAwesomeIcon icon={faEdit} />
//                     </button>
//                     <button
//                       onClick={() => handleVieStatuswActivityLogs(file.du_id)}
//                       className="bg-red-400 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
//                     >
//                       <FontAwesomeIcon icon={faHistory} />
//                     </button>

//                       {userRole !== 'designer' && (
//                     <button
//                       className="bg-purple-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
//                       onClick={() => handleDownload(file.du_id)}
//                     >
//                       <FontAwesomeIcon icon={faDownload} />
//                     </button>
//                     )}

//                     <button
//                       onClick={() => handleUploadClick(file.du_id)}
//                       className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75 cursor-pointer"
//                     >
//                       <FontAwesomeIcon icon={faUpload} />
//                     </button>

//                     <button
//                       className="bg-blue-500 mr-2 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
//                       onClick={() => fetchFileVersions(file.du_id)}
//                     >
//                       <FontAwesomeIcon icon={faEye} />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={4} className="text-center py-4 text-gray-500">
//                   No files are uploaded
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

// {userRole !== 'viewer' && (
//       <div className="mt-4">
//         <button
//           className="bg-gray-500 inline-flex items-center justify-center rounded-md py-2 px-4 text-center text-white hover:bg-opacity-75"
//           onClick={handleBackButtonClick}
//         >
//           <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
//           Back
//         </button>
//       </div>
//       )}

//       {editFile && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
//           <div className="bg-white p-6 rounded shadow-lg w-96">
//             <h3 className="text-lg font-bold mb-4">Edit File</h3>
//             {userRole !== 'designer' && (
//             <label className="block mb-2 text-black">
//               Status:
//               <select
//                 className="block w-full mt-1 border rounded px-3 py-2"
//                 value={editFile.status}
//                 onChange={(e) =>
//                   setEditFile((prev) =>
//                     prev ? { ...prev, status: e.target.value } : prev,
//                   )
//                 }
//               >
//                 {statusOptions.map((option) => (
//                   <option key={option} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
//             </label>
//             )}
//             <label className="block mb-4 text-black">
//               Comment:
//               <textarea
//                 className="block w-full mt-1 border rounded px-3 py-2"
//                 value={editFile.comment || ''}
//                 onChange={(e) =>
//                   setEditFile((prev) =>
//                     prev ? { ...prev, comment: e.target.value } : prev,
//                   )
//                 }
//               />
//             </label>
//             <div className="flex justify-end space-x-2">
//               <button
//                 className="bg-gray-500 text-white rounded px-3 py-1"
//                 onClick={() => setEditFile(null)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-blue-500 text-white rounded px-3 py-1"
//                 onClick={handleSaveChanges}
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showStatusActivityLogPopup && (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl w-full relative">
//             <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
//               Status Activity Logs
//             </h2>
//             {statusActivityLogs.length > 0 ? (
//               <div className="overflow-x-auto max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
//                 <table className="w-full table-auto">
//                   <thead>
//                     <tr className="bg-gray-100 text-gray-600 text-sm font-medium">
//                       <th className="py-3 px-4 border-b text-left">User</th>
//                       <th className="py-3 px-4 border-b text-left">Role</th>
//                       <th className="py-3 px-4 border-b text-left">
//                         Previous Status
//                       </th>
//                       <th className="py-3 px-4 border-b text-left">
//                         Updated Status
//                       </th>
//                       <th className="py-3 px-4 border-b text-left">
//                         Timestamp
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {statusActivityLogs.map((log) => (
//                       <tr
//                         key={log.activityId}
//                         className="hover:bg-gray-50 transition-colors"
//                       >
//                         <td className="py-3 px-4 border-b">{log.userName}</td>
//                         <td className="py-3 px-4 border-b">{log.role}</td>
//                         <td className="py-3 px-4 border-b">
//                           {log.previousStatus}
//                         </td>
//                         <td className="py-3 px-4 border-b">
//                           {log.updatedStatus}
//                         </td>
//                         <td className="py-3 px-4 border-b">
//                           {new Date(log.timestamp).toLocaleString()}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <p className="text-center text-gray-600">No activity yet.</p>
//             )}
//             <div className="flex justify-end mt-6">
//               <button
//                 onClick={handleClosePopup}
//                 className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showModal && (
//         <FileDetailsModal
//           versions={selectedVersions}
//           onClose={() => setShowModal(false)}
//           onDownload={handleDownloadPreviousVersion}
//         />
//       )}

//         <UploadModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onUpload={handleUpload}
//       />


// {isLoading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       )}


//       {popupMessage && (
//         <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
//           {popupMessage}
//         </div>
//       )}
      
//     </div>
//   );
// };

// export default ProductFilesPage;

























































































import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../../public/config.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faDownload,
  faCopy,
  faHistory,
  faUpload,
  faEye,
  faFileArchive,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import FileDetailsModal from './FileDetailsModal';
import UploadModal from './UploadModal';

interface FileData {
  du_id: number;
  designPath: string;
  status: string;
  comment: string | null;
  version: number;
  revision: string;
}

interface FileVersion {
  duv_id: number;
  du_id: number;
  product_id: number;
  user_id: number;
  file_path: string;
  timestamp: string;
  version: number;
  userName?: string;
}

interface FileVersion {
  rvid: number;
  version: number;
}

const statusOptions = [
  'pending',
  'in_progress',
  'under_review',
  'on_hold',
  'completed',
];

const ProductFilesPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [files, setFiles] = useState<FileData[]>([]);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [editFile, setEditFile] = useState<FileData | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [showStatusActivityLogPopup, setShowStatusActivityLogPopup] =
    useState(false);
  const [statusActivityLogs, setStatusActivityLogs] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [showActivityLogPopup, setShowActivityLogPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileVersion | null>(null);
  const [selectedVersions, setSelectedVersions] = useState<FileVersion[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [revisions, setRevisions] = useState<{ r_id: number; revision: string }[]>([]);
  const [selectedRevisionId, setSelectedRevisionId] = useState<number | null>(null);
  const [versions, setVersions] = useState<FileVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate(-1);
  };



  const fetchFiles = async (revisionId?: number, version?: string) => {
    try {
      let url = `${BASE_URL}api/product/${productId}/uploads/${revisionId}`;
      if (version && version !== "") {
        url += `/${version}`; 
      }
      const response = await axios.get(url);
      setFiles(response.data.files || []);
    } catch (error) {
      console.error('Error fetching files:', error);
      setFiles([]); 
    }
  };
  

  const fetchRevisions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/product/${productId}/revisions`);
      const fetchedRevisions = response.data.revisions || [];
      setRevisions(fetchedRevisions);

      if (fetchedRevisions.length > 0) {
        const latestRevision = fetchedRevisions[0].r_id;
        setSelectedRevisionId(latestRevision);
        fetchVersions(latestRevision);  
        fetchFiles(latestRevision); 
      }
    } catch (error) {
      console.error('Error fetching revisions:', error);
    }
  };


  const fetchVersions = async (revisionId: number) => {
    try {
      const response = await axios.get(`${BASE_URL}api/revisions/${revisionId}/versions`);
      const versionList = response.data.versions || [];
      
      if (versionList.length > 0) {
        const latestVersion = Math.max(...versionList.map(v => v.version));
        setVersions(versionList);
        setSelectedVersion(latestVersion.toString());
        fetchFiles(revisionId, latestVersion.toString());
      } else {
        setVersions([]);
        setSelectedVersion("");
        fetchFiles(revisionId);
      }
    } catch (error) {
      console.error("Error fetching versions:", error);
    }
  };

  const handleRevisionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRevision = Number(event.target.value);
    setSelectedRevisionId(selectedRevision);
    setSelectedVersion("");
    fetchVersions(selectedRevision); 
    fetchFiles(selectedRevision);
  };

  const handleVersionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    
    if (!selectedValue) {
      // If "Select Version" is chosen, remove the version filter
      setSelectedVersion("");
      fetchFiles(selectedRevisionId);
    } else {
      setSelectedVersion(selectedValue);
      fetchFiles(selectedRevisionId, selectedValue);
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

  const copyFilePath = async (filePath: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(filePath);
        setPopupMessage('File path copied to clipboard!');
        setTimeout(() => setPopupMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error copying file path:', error);
      setPopupMessage('Failed to copy file path.');
      setTimeout(() => setPopupMessage(null), 3000);
    }
  };

  const handleEditClick = (file: FileData) => {
    setEditFile(file);
    console.log('Edit File: ', file);
  };

  const handleSaveChanges = async () => {
    console.log('du_id:', editFile.du_id);
    if (!editFile || !editFile.du_id) {
      setPopupMessage('Invalid file ID.');
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}api/product/uploads/${editFile.du_id}`,
        {
          status: editFile.status,
          comment: editFile.comment,
        },
        {
          withCredentials: true,
        },
      );

      setPopupMessage('File updated successfully!');
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.du_id === editFile.du_id ? editFile : file,
        ),
      );
      setEditFile(null);
    } catch (error) {
      console.error('Error updating file:', error);
      setPopupMessage('Failed to update file.');
    }

    setTimeout(() => setPopupMessage(null), 3000);
  };

  const fetchStatusActivityLogs = async (duId: number) => {
    try {
      const response = await axios.get(
        `${BASE_URL}api/product/${duId}/design-status-activity`,
        { withCredentials: true },
      );
      if (response.data.data && response.data.data.length > 0) {
        setStatusActivityLogs(response.data.data);
        setShowStatusActivityLogPopup(true);
      } else {
        setStatusActivityLogs([]);
        setShowStatusActivityLogPopup(true);
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      setStatusActivityLogs([]);
      setShowStatusActivityLogPopup(true);
    }
  };

  const handleVieStatuswActivityLogs = (duId: number) => {
    setSelectedProductId(duId);
    fetchStatusActivityLogs(duId);
  };

  const handleClosePopup = () => {
    setShowStatusActivityLogPopup(false);
  };

  const handleDownload = async (fileId: number) => {
    try {
      const downloadUrl = `${BASE_URL}api/download/${fileId}`;
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

  const handleDownloadPreviousVersion = async (filePath) => {
    try {
      const downloadUrl = `${BASE_URL}api/download-by-path?filePath=${encodeURIComponent(
        filePath,
      )}`;
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


  const handleDownloadRevisionZip1 = async () => {
    try {
      const downloadUrl = `${BASE_URL}api/download-latest-design-version-zip/${productId}/${selectedRevisionId}`;
      
      const response = await fetch(downloadUrl);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "No files found for download.");
    }

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', '');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading zip file:', error);
      setPopupMessage(error.message || 'Failed to download zip file.');
      setTimeout(() => setPopupMessage(null), 3000);
    }
  };


  const handleDownloadRevisionZip = async () => {
  try {
    const downloadUrl = `${BASE_URL}api/download-latest-design-version-zip/${productId}/${selectedRevisionId}`;

    // First, check if the file exists without downloading
    const headResponse = await fetch(downloadUrl, { method: "HEAD" });
    if (!headResponse.ok) {
      throw new Error("No files found for download.");
    }

    // Create a hidden link and trigger it
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", ""); // Let backend decide filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading zip file:", error);
    setPopupMessage(error.message || "Failed to download zip file.");
    setTimeout(() => setPopupMessage(null), 3000);
  }
};


  const handleUploadClick = (fileId) => {
    setSelectedFileId(fileId);
    setIsModalOpen(true);
  };


  const handleUpload = async (file: File, comment: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('comment', comment);

    setIsLoading(true);
  
    for (let [key, value] of (formData as any)) {
      console.log(key, value);
    }
  
    try {
      const response = await axios.post(
        `${BASE_URL}api/upload/${selectedFileId}`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        },
      );
  
      if (response.data.message === 'File uploaded successfully.') {
        setPopupMessage('File uploaded successfully.');
        setTimeout(() => setPopupMessage(null), 3000);
        fetchFiles(selectedRevisionId);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload file.');
    } finally {
      setIsLoading(false);
    }
  };



  const fetchFileVersions = async (du_id: number) => {
    try {
      const response = await axios.get(
        `${BASE_URL}api/product/${du_id}/designUploadVersions`,
      );
      if (response.data.versions && response.data.versions.length > 0) {
        // Fetch user names for all versions
        const versionsWithUserNames = await Promise.all(
          response.data.versions.map(async (version) => {
            const userResponse = await axios.get(
              `${BASE_URL}api/users/${version.user_id}`,
            );
            return { ...version, userName: userResponse.data.name };
          }),
        );
        setSelectedVersions(versionsWithUserNames);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error fetching file versions:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Design Files</h2>

<div className="mb-6">
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Select Revision
  </label>
  <select
    className="w-full px-2 py-1 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
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

{versions.length > 0 && (
  <div className="mb-6">
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Select Version
    </label>
    <select
      className="w-full px-2 py-1 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
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



        <button
          className="bg-green-500 inline-flex items-center justify-center rounded-md py-2 px-4 text-center text-white hover:bg-opacity-75"
          // onClick={handleDownloadLatestVersionZip}
          onClick={handleDownloadRevisionZip}
        >
          <FontAwesomeIcon icon={faFileArchive} className="mr-2" />
          Download Zip
        </button>
      </div>

      <div className="overflow-auto max-h-96 border rounded-lg bg-white shadow relative">
        <table className="w-full table-auto border-collapse">
          <thead className=" top-0 bg-gray-200 z-10 sticky">
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">File Name</th>
              <th className="px-4 py-2 text-left">Revision</th>
              <th className="px-4 py-2 text-left">Version</th>
              {/* {userRole !== 'designer' && (
              <th className="px-4 py-2 text-left">Status</th>
              )} */}
              <th className="px-4 py-2 text-left">Comment</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.length > 0 ? (
              files.map((file) => (
                <tr key={file.du_id} className="border-b">
                  <td className="px-4 py-2">
                    {extractFileName(file.designPath)}
                  </td>
                  <td className="px-4 py-2">{file.revision}</td>
                  <td className="px-4 py-2">{file.version}</td>
                  {/* {userRole !== 'designer' && (
                  <td className="py-2 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm ${
                        file.status === 'pending'
                          ? 'bg-gray-300 text-gray-600'
                          : file.status === 'in_progress'
                          ? 'bg-blue-300 text-blue-600'
                          : file.status === 'on_hold'
                          ? 'bg-yellow-300 text-yellow-600'
                          : file.status === 'completed'
                          ? 'bg-green-300 text-green-600'
                          : file.status === 'under_review'
                          ? 'bg-orange-300 text-orange-600'
                          : 'bg-danger text-black'
                      }`}
                    >
                      {file.status}
                    </span>
                  </td>
                  )} */}
                  <td className="px-4 py-2">{file.comment || 'No comments'}</td>
                  <td className="px-4 py-2 flex gap-2">
                    {/* <button
                      className="bg-blue-500  mr-2 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                      onClick={() => copyFilePath(file.designPath)}
                    >
                    
                          <FontAwesomeIcon
                        icon={faCopy}
                      />
                    </button> */}
                    <button
                      className="bg-green-500  inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                      onClick={() => handleEditClick(file)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    {/* <button
                      onClick={() => handleVieStatuswActivityLogs(file.du_id)}
                      className="bg-red-400 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                    >
                      <FontAwesomeIcon icon={faHistory} />
                    </button> */}

                      {/* {userRole !== 'designer' && (
                    <button
                      className="bg-purple-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                      onClick={() => handleDownload(file.du_id)}
                    >
                      <FontAwesomeIcon icon={faDownload} />
                    </button>
                    )}

                    <button
                      onClick={() => handleUploadClick(file.du_id)}
                      className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faUpload} />
                    </button> */}

                    {/* <button
                      className="bg-blue-500 mr-2 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                      onClick={() => fetchFileVersions(file.du_id)}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button> */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No files are uploaded
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

{userRole !== 'viewer' && (
      <div className="mt-4">
        <button
          className="bg-gray-500 inline-flex items-center justify-center rounded-md py-2 px-4 text-center text-white hover:bg-opacity-75"
          onClick={handleBackButtonClick}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back
        </button>
      </div>
      )}

      {editFile && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Edit File</h3>
            {/* {userRole !== 'designer' && (
            <label className="block mb-2 text-black">
              Status:
              <select
                className="block w-full mt-1 border rounded px-3 py-2"
                value={editFile.status}
                onChange={(e) =>
                  setEditFile((prev) =>
                    prev ? { ...prev, status: e.target.value } : prev,
                  )
                }
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            )} */}
            <label className="block mb-4 text-black">
              Comment:
              <textarea
                className="block w-full mt-1 border rounded px-3 py-2"
                value={editFile.comment || ''}
                onChange={(e) =>
                  setEditFile((prev) =>
                    prev ? { ...prev, comment: e.target.value } : prev,
                  )
                }
              />
            </label>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white rounded px-3 py-1"
                onClick={() => setEditFile(null)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white rounded px-3 py-1"
                onClick={handleSaveChanges}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showStatusActivityLogPopup && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl w-full relative">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
              Status Activity Logs
            </h2>
            {statusActivityLogs.length > 0 ? (
              <div className="overflow-x-auto max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 text-sm font-medium">
                      <th className="py-3 px-4 border-b text-left">User</th>
                      <th className="py-3 px-4 border-b text-left">Role</th>
                      <th className="py-3 px-4 border-b text-left">
                        Previous Status
                      </th>
                      <th className="py-3 px-4 border-b text-left">
                        Updated Status
                      </th>
                      <th className="py-3 px-4 border-b text-left">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {statusActivityLogs.map((log) => (
                      <tr
                        key={log.activityId}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4 border-b">{log.userName}</td>
                        <td className="py-3 px-4 border-b">{log.role}</td>
                        <td className="py-3 px-4 border-b">
                          {log.previousStatus}
                        </td>
                        <td className="py-3 px-4 border-b">
                          {log.updatedStatus}
                        </td>
                        <td className="py-3 px-4 border-b">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-600">No activity yet.</p>
            )}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleClosePopup}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <FileDetailsModal
          versions={selectedVersions}
          onClose={() => setShowModal(false)}
          onDownload={handleDownloadPreviousVersion}
        />
      )}

        <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleUpload}
      />


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

export default ProductFilesPage;
