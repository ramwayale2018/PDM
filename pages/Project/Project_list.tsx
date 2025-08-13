// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faFolderOpen,
//   faEdit,
//   faEye,
//   faClipboardList,
//   faCopy,
// } from '@fortawesome/free-solid-svg-icons';
// import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
// import EditProject from './EditProject ';
// import { BASE_URL } from '../../../public/config.js';

// interface Project {
//   project_id: number;
//   project_name: string;
//   vendor_name: string;
//   start_date: string;
//   end_date: string;
//   status: string;
//   comment: string;
//   doc_upload: string[];
//   latest_design_upload: string;
// }

// interface ActivityLog {
//   id: number;
//   project_id: number;
//   design_upload: string;
//   timestamp: string;
// }

// interface Task {
//   taskName: string;
//   startDate: string;
//   endDate: string;
//   status: string;
// }

// const ShowProject: React.FC = () => {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
//   const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
//   const [isReadOnly, setIsReadOnly] = useState(false);
//   const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
//   const [showLogs, setShowLogs] = useState(false);
//   const [popupMessage, setPopupMessage] = useState<string | null>(null);
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [showTasksPopup, setShowTasksPopup] = useState(false);
//   const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
//     null,
//   );

//   const fetchProjects = async () => {
//     try {
//       const response = await axios.get(BASE_URL + 'api/projects');
//       const sortedData = response.data.sort(
//         (a: Project, b: Project) => b.project_id - a.project_id,
//       );
//       setProjects(sortedData);
//       setFilteredProjects(sortedData);
//     } catch (error) {
//       console.error('Error fetching projects:', error);
//     }
//   };

//   const fetchTasks = async (projectId: number) => {
//     try {
//       const response = await axios.get(
//         `${BASE_URL}api/tasks/project/${projectId}`,
//         { withCredentials: true },
//       );
//       setTasks(response.data.data);
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//     }
//   };

//   const fetchActivityLogs = async (projectId: number) => {
//     try {
//       const response = await axios.get(
//         BASE_URL + `api/project/project-logs/${projectId}`,
//       );
//       if (response.data && response.data.logs.length === 0) {
//         setActivityLogs([]);
//         setShowLogs(true);
//       } else {
//         setActivityLogs(response.data.logs);
//         setShowLogs(true);
//       }
//     } catch (error) {
//       console.error('Error fetching project activity logs:', error);
//       setActivityLogs([]);
//       setShowLogs(true);
//     }
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const extractVersion = (filePath: string) => {
//     if (!filePath) return 'Original';
//     const versionMatch = filePath.match(/V(\d+)/);
//     return versionMatch ? versionMatch[0] : 'Original';
//   };

//   const openFolder = async (projectName: string) => {
//     try {
//       await axios.get(
//         BASE_URL + `api/open-folder/${encodeURIComponent(projectName)}`,
//       );
//     } catch (error) {
//       console.error('Error opening file:', error);
//     }
//   };

//   const copyFolderPath = async (projectName: string) => {
//     try {
//       const response = await axios.get(
//         BASE_URL + `api/copy-folder-path/${encodeURIComponent(projectName)}`,
//       );
//       const folderPath = response.data.folderPath;

//       // Check if the Clipboard API is available
//       if (navigator.clipboard && navigator.clipboard.writeText) {
//         // Use Clipboard API to copy the folder path
//         await navigator.clipboard.writeText(folderPath);
//         setPopupMessage('Folder path copied to clipboard!');
//         setTimeout(() => setPopupMessage(null), 3000);
//       } else {
//         // Fallback for unsupported browsers
//         const textarea = document.createElement('textarea');
//         textarea.value = folderPath;
//         textarea.style.position = 'fixed'; // Prevents scrolling to bottom
//         document.body.appendChild(textarea);
//         textarea.focus();
//         textarea.select();

//         try {
//           document.execCommand('copy');
//           setPopupMessage('Folder path copied to clipboard!');
//           setTimeout(() => setPopupMessage(null), 3000);
//         } catch (error) {
//           console.error('Fallback: Failed to copy folder path:', error);
//           setPopupMessage('Failed to copy folder path.');
//         } finally {
//           document.body.removeChild(textarea);
//         }
//       }
//     } catch (error) {
//       console.error('Error getting folder path:', error);
//       setPopupMessage('Error getting folder path.');
//       setTimeout(() => setPopupMessage(null), 3000);
//     }
//   };

//   //   const openFolder = async (projectName: string) => {
//   //     try {
//   //         const response = await axios.get(BASE_URL + `api/open-folder/${encodeURIComponent(projectName)}`);
//   //         const { networkPath } = response.data;

//   //         // Attempt to open the network path (may need additional handling for UNC paths)
//   //         window.location.href = networkPath; // Forces the browser to navigate
//   //     } catch (error) {
//   //         console.error('Error opening file:', error);
//   //     }
//   // };

//   const handleOpenFile = async (
//     fileName: string,
//     projectName: string | undefined,
//   ) => {
//     console.log('File Name:', fileName);
//     console.log('Product Name:', projectName);
//     if (!fileName || !projectName) {
//       console.error('File name or Product name is missing');
//       return;
//     }

//     try {
//       await axios.get(
//         BASE_URL +
//           `api/open-file/${encodeURIComponent(
//             projectName,
//           )}/${encodeURIComponent(fileName)}`,
//       );
//     } catch (error) {
//       console.error('Error opening file:', error);
//     }
//   };

//   const handleSearch = () => {
//     const results = projects.filter(
//       (project) =>
//         project.project_id.toString().includes(searchTerm) ||
//         project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         project.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         project.start_date.includes(searchTerm) ||
//         project.end_date.includes(searchTerm) ||
//         project.comment.includes(searchTerm.toLowerCase()),
//     );
//     setFilteredProjects(results);
//   };

//   const handleEdit = (project: Project) => {
//     setSelectedProject(project);
//     setIsReadOnly(false);
//   };

//   const handleView = (project: Project) => {
//     setSelectedProject(project);
//     setIsReadOnly(true);
//   };

//   const handleUpdate = () => {
//     fetchProjects();
//     setSelectedProject(null);
//   };

//   const handleCancelEdit = () => {
//     setSelectedProject(null);
//   };

//   const handleEyeClick = (projectId: number) => {
//     setSelectedProjectId(projectId);
//     fetchTasks(projectId);
//     setShowTasksPopup(true);
//   };

//   const handleClosePopup = () => {
//     setShowTasksPopup(false);
//   };

//   return (
//     <div className="p-4">
//       <Breadcrumb pageName="Product List" />
//       <div className="flex mb-4">
//         <input
//           type="text"
//           placeholder="Search"
//           className="p-2 border border-gray-300 rounded w-half mr-2"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <button
//           className="px-4 py-2 bg-blue-500 text-white rounded"
//           onClick={handleSearch}
//         >
//           Search
//         </button>
//       </div>

//       <div className="max-w-full overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-0">
//         <table className="w-full table-auto">
//           <thead>
//             <tr className="bg-gray-2 text-left dark:bg-meta-4">
//               <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
//                 Product Name
//               </th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">
//                 Vendor Name
//               </th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">
//                 Start Date
//               </th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">
//                 End Date
//               </th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">
//                 Status
//               </th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">
//                 Version
//               </th>
//               <th className="py-4 px-4 font-medium text-black dark:text-white">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredProjects.map((project) => (
//               <tr key={project.project_id}>
//                 <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark xl:pl-11">
//                   <h5 className="font-medium text-black dark:text-white">
//                     {project.project_name}
//                   </h5>
//                 </td>
//                 <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
//                   <p className="text-black dark:text-white">
//                     {project.vendor_name}
//                   </p>
//                 </td>
//                 <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
//                   <p className="text-black dark:text-white">
//                     {new Date(project.start_date).toLocaleDateString()}
//                   </p>
//                 </td>
//                 <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
//                   <p className="text-black dark:text-white">
//                     {new Date(project.end_date).toLocaleDateString()}
//                   </p>
//                 </td>

//                 <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
//                   <p
//                     className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
//                       project.status === 'not started'
//                         ? 'bg-gray-500 text-gray-500'
//                         : project.status === 'active'
//                         ? 'bg-blue-300 text-blue-600'
//                         : project.status === 'hold'
//                         ? 'bg-yellow-300 text-yellow-600'
//                         : project.status === 'Client Review'
//                         ? 'bg-orange-300 text-orange-600'
//                         : project.status === 'completed'
//                         ? 'bg-green-300 text-green-600'
//                         : 'bg-danger text-danger'
//                     }`}
//                   >
//                     {project.status.charAt(0).toUpperCase() +
//                       project.status.slice(1)}
//                   </p>
//                 </td>

//                 <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
//                   <p className="text-black dark:text-white">
//                     {extractVersion(project.latest_design_upload)}
//                   </p>
//                 </td>

//                 <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
//                   <div className="flex items-center gap-2">
//                     {/* <button
//                       className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
//                       onClick={() => openFolder(project.project_name)}
//                     >
//                       <FontAwesomeIcon icon={faFolderOpen} className="text-white" />
//                     </button> */}

//                     <button
//                       className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
//                       onClick={() => copyFolderPath(project.project_name)}
//                     >
//                       <FontAwesomeIcon icon={faCopy} className="text-white" />
//                     </button>

//                     <button
//                       className="bg-meta-3 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
//                       onClick={() => handleEdit(project)}
//                     >
//                       <FontAwesomeIcon icon={faEdit} className="text-white" />
//                     </button>

//                     {/* <button
//                       className="bg-gray-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
//                       onClick={() => handleView(project)}
//                     >
//                       <FontAwesomeIcon icon={faEye} className="text-white" />
//                     </button> */}

//                     <button
//                       className="bg-meta-3 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
//                       onClick={() => fetchActivityLogs(project.project_id)}
//                     >
//                       <FontAwesomeIcon icon={faClipboardList} />
//                     </button>

//                     <button
//                       className="bg-warning inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
//                       onClick={() => handleEyeClick(project.project_id)}
//                     >
//                       <FontAwesomeIcon icon={faEye} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal Popup for Edit or View Form */}
//       {selectedProject && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto mt-10">
//           <div className="bg-white p-6 rounded shadow-lg w-1/2 mt-10 relative max-h-[90vh] overflow-y-auto">
//             <button
//               onClick={handleCancelEdit}
//               className="absolute top-2 right-2 text-gray-600 text-2xl"
//             >
//               &times;
//             </button>
//             <EditProject
//               project={selectedProject}
//               onUpdate={handleUpdate}
//               onCancel={handleCancelEdit}
//               readOnly={isReadOnly}
//             />
//           </div>
//         </div>
//       )}

//       {showLogs && (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl w-full relative">
//             <button
//               onClick={() => setShowLogs(false)}
//               className="absolute top-2 right-2 text-gray-600 text-2xl"
//             >
//               &times;
//             </button>
//             <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
//               Project Activity Logs
//             </h2>

//             {activityLogs.length === 0 ? (
//               <p className="text-center text-gray-600">No activity yet.</p>
//             ) : (
//               <div className="overflow-x-auto max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
//                 <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
//                   <thead>
//                     <tr className="bg-gray-100 text-gray-600 text-sm font-medium">
//                       {/* <th className="py-2 px-4 border">ID</th> */}
//                       <th className="py-3 px-4 border-b text-left">
//                         Design Upload
//                       </th>
//                       <th className="py-3 px-4 border-b text-left">
//                         Timestamp
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {activityLogs.map((log) => (
//                       <tr
//                         key={log.id}
//                         className="hover:bg-gray-50 transition-colors"
//                       >
//                         {/* <td className="py-2 px-4 border">{log.id}</td> */}
//                         <td className="py-3 px-4 border-b">
//                           {log.design_upload}
//                         </td>
//                         <td className="py-3 px-4 border-b">
//                           {new Date(log.timestamp).toLocaleString()}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             <div className="flex justify-end mt-6">
//               <button
//                 className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
//                 onClick={() => setShowLogs(false)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {popupMessage && (
//         <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
//           {popupMessage}
//         </div>
//       )}

//       {/* Popup to show tasks */}
//       {showTasksPopup && selectedProjectId !== null && (
//         <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-2/3 lg:w-1/2">
//             <h2 className="text-2xl font-bold text-left text-gray-800 mb-6">
//               Tasks for Project
//             </h2>
//             <table className="w-full table-auto mb-4 text-left text-gray-700">
//               <thead>
//                 <tr className='bg-gray'>
//                   <th className="py-2 px-4 text-sm font-medium text-gray-600">
//                     Task Name
//                   </th>
//                   <th className="py-2 px-4 text-sm font-medium text-gray-600">
//                     Start Date
//                   </th>
//                   <th className="py-2 px-4 text-sm font-medium text-gray-600">
//                     End Date
//                   </th>
//                   <th className="py-2 px-4 text-sm font-medium text-gray-600">
//                     Status
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {tasks.map((task, index) => (
//                   <tr key={index} className="border-b border-gray-200">
//                     <td className="py-2 px-4 text-sm">{task.taskName}</td>
//                     <td className="py-2 px-4 text-sm">
//                       {new Date(task.startDate).toLocaleDateString()}
//                     </td>
//                     <td className="py-2 px-4 text-sm">
//                       {new Date(task.endDate).toLocaleDateString()}
//                     </td>
//                     <td className="py-2 px-4 text-sm">
//                       <span
//                         className={`inline-block px-3 py-1 rounded-full text-sm ${
//                           task.status === 'pending'
//                           ? 'bg-gray-300 text-gray-600'
//                           : task.status === 'in progress'
//                           ? 'bg-blue-300 text-blue-600'
//                           : task.status === 'on hold'
//                           ? 'bg-yellow-300 text-yellow-600'
//                           : task.status === 'completed'
//                           ? 'bg-green-300 text-green-600'
//                           : task.status === 'under review'
//                           ? 'bg-orange-300 text-orange-600'
//                           : 'bg-danger text-danger'
//                         }`}
//                       >
//                         {task.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div className="flex justify-end">
//               <button
//                 className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300"
//                 onClick={handleClosePopup}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShowProject;








































import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFolderOpen,
  faEdit,
  faEye,
  faClipboardList,
  faCopy,
} from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import EditProject from './EditProject ';
import { BASE_URL } from '../../../public/config.js';

interface Project {
  project_id: number;
  project_name: string;
  vendor_name: string;
  start_date: string;
  end_date: string;
  status: string;
  comment: string;
  doc_upload: string[];
  latest_design_upload: string;
}

interface ActivityLog {
  id: number;
  project_id: number;
  design_upload: string;
  timestamp: string;
}

interface Task {
  taskName: string;
  startDate: string;
  endDate: string;
  status: string;
  latestFilePath: string;
}

interface FileDetail {
  filePath: string;
  action: string;
  timestamp: string;
}

const ShowProject: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTasksPopup, setShowTasksPopup] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null,
  );

  const fetchProjects = async () => {
    try {
      const response = await axios.get(BASE_URL + 'api/projects');
      const sortedData = response.data.sort(
        (a: Project, b: Project) => b.project_id - a.project_id,
      );
      setProjects(sortedData);
      setFilteredProjects(sortedData);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchTasks = async (projectId: number) => {
    try {
      const response = await axios.get(
        `${BASE_URL}api/tasks/project/${projectId}`,
        { withCredentials: true },
      );
      setTasks(response.data.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const getVersionFromPath = (filePath: string): string => {
    if (!filePath) {
      return 'N/A';  
    }
    const match = filePath.match(/_v(\d+)\.pdf/); 
    return match ? `v${match[1]}` : 'N/A';  
  };
  
  

  const fetchActivityLogs = async (projectId: number) => {
    try {
      const response = await axios.get(
        BASE_URL + `api/project/project-logs/${projectId}`,
      );
      if (response.data && response.data.logs.length === 0) {
        setActivityLogs([]);
        setShowLogs(true);
      } else {
        setActivityLogs(response.data.logs);
        setShowLogs(true);
      }
    } catch (error) {
      console.error('Error fetching project activity logs:', error);
      setActivityLogs([]);
      setShowLogs(true);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const extractVersion = (filePath: string) => {
    if (!filePath) return 'Original';
    const versionMatch = filePath.match(/V(\d+)/);
    return versionMatch ? versionMatch[0] : 'Original';
  };

  const openFolder = async (projectName: string) => {
    try {
      await axios.get(
        BASE_URL + `api/open-folder/${encodeURIComponent(projectName)}`,
      );
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  const copyFolderPath = async (projectName: string) => {
    try {
      const response = await axios.get(
        BASE_URL + `api/copy-folder-path/${encodeURIComponent(projectName)}`,
      );
      const folderPath = response.data.folderPath;

      // Check if the Clipboard API is available
      if (navigator.clipboard && navigator.clipboard.writeText) {
        // Use Clipboard API to copy the folder path
        await navigator.clipboard.writeText(folderPath);
        setPopupMessage('Folder path copied to clipboard!');
        setTimeout(() => setPopupMessage(null), 3000);
      } else {
        // Fallback for unsupported browsers
        const textarea = document.createElement('textarea');
        textarea.value = folderPath;
        textarea.style.position = 'fixed'; // Prevents scrolling to bottom
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
          document.execCommand('copy');
          setPopupMessage('Folder path copied to clipboard!');
          setTimeout(() => setPopupMessage(null), 3000);
        } catch (error) {
          console.error('Fallback: Failed to copy folder path:', error);
          setPopupMessage('Failed to copy folder path.');
        } finally {
          document.body.removeChild(textarea);
        }
      }
    } catch (error) {
      console.error('Error getting folder path:', error);
      setPopupMessage('Error getting folder path.');
      setTimeout(() => setPopupMessage(null), 3000);
    }
  };

  //   const openFolder = async (projectName: string) => {
  //     try {
  //         const response = await axios.get(BASE_URL + `api/open-folder/${encodeURIComponent(projectName)}`);
  //         const { networkPath } = response.data;

  //         // Attempt to open the network path (may need additional handling for UNC paths)
  //         window.location.href = networkPath; // Forces the browser to navigate
  //     } catch (error) {
  //         console.error('Error opening file:', error);
  //     }
  // };

  const handleOpenFile = async (
    fileName: string,
    projectName: string | undefined,
  ) => {
    console.log('File Name:', fileName);
    console.log('Product Name:', projectName);
    if (!fileName || !projectName) {
      console.error('File name or Product name is missing');
      return;
    }

    try {
      await axios.get(
        BASE_URL +
          `api/open-file/${encodeURIComponent(
            projectName,
          )}/${encodeURIComponent(fileName)}`,
      );
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  const handleSearch = () => {
    const results = projects.filter(
      (project) =>
        project.project_id.toString().includes(searchTerm) ||
        project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.start_date.includes(searchTerm) ||
        project.end_date.includes(searchTerm) ||
        project.comment.includes(searchTerm.toLowerCase()),
    );
    setFilteredProjects(results);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsReadOnly(false);
  };

  const handleView = (project: Project) => {
    setSelectedProject(project);
    setIsReadOnly(true);
  };

  const handleUpdate = () => {
    fetchProjects();
    setSelectedProject(null);
  };

  const handleCancelEdit = () => {
    setSelectedProject(null);
  };

  const handleEyeClick = (projectId: number) => {
    setSelectedProjectId(projectId);
    fetchTasks(projectId);
    setShowTasksPopup(true);
  };

  const handleClosePopup = () => {
    setShowTasksPopup(false);
  };

  return (
    <div className="p-4">
      <Breadcrumb pageName="Product List" />
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search"
          className="p-2 border border-gray-300 rounded w-half mr-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <div className="max-w-full overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-0">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Product Name
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Vendor Name
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Start Date
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                End Date
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Version
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project.project_id}>
                <td className="border-b border-[#eee] py-3 px-0 pl-2 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {project.project_name}
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {project.vendor_name}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {new Date(project.start_date).toLocaleDateString()}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {new Date(project.end_date).toLocaleDateString()}
                  </p>
                </td>

                <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                      project.status === 'not started'
                        ? 'bg-gray-500 text-gray-500'
                        : project.status === 'active'
                        ? 'bg-blue-300 text-blue-600'
                        : project.status === 'hold'
                        ? 'bg-yellow-300 text-yellow-600'
                        : project.status === 'Client Review'
                        ? 'bg-orange-300 text-orange-600'
                        : project.status === 'completed'
                        ? 'bg-green-300 text-green-600'
                        : 'bg-danger text-danger'
                    }`}
                  >
                    {project.status.charAt(0).toUpperCase() +
                      project.status.slice(1)}
                  </p>
                </td>

                <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {extractVersion(project.latest_design_upload)}
                  </p>
                </td>

                <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                  <div className="flex items-center gap-2">
                    {/* <button
                      className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                      onClick={() => openFolder(project.project_name)}
                    >
                      <FontAwesomeIcon icon={faFolderOpen} className="text-white" />
                    </button> */}

                    <button
                      className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                      onClick={() => copyFolderPath(project.project_name)}
                    >
                      <FontAwesomeIcon icon={faCopy} className="text-white" />
                    </button>

                    <button
                      className="bg-meta-3 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                      onClick={() => handleEdit(project)}
                    >
                      <FontAwesomeIcon icon={faEdit} className="text-white" />
                    </button>

                    {/* <button
                      className="bg-gray-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                      onClick={() => handleView(project)}
                    >
                      <FontAwesomeIcon icon={faEye} className="text-white" />
                    </button> */}

                    <button
                      className="bg-meta-3 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                      onClick={() => fetchActivityLogs(project.project_id)}
                    >
                      <FontAwesomeIcon icon={faClipboardList} />
                    </button>

                    <button
                      className="bg-warning inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                      onClick={() => handleEyeClick(project.project_id)}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Popup for Edit or View Form */}
      {selectedProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto mt-10">
          <div className="bg-white p-6 rounded shadow-lg w-1/2 mt-10 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleCancelEdit}
              className="absolute top-2 right-2 text-gray-600 text-2xl"
            >
              &times;
            </button>
            <EditProject
              project={selectedProject}
              onUpdate={handleUpdate}
              onCancel={handleCancelEdit}
              readOnly={isReadOnly}
            />
          </div>
        </div>
      )}

      {showLogs && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl w-full relative">
            <button
              onClick={() => setShowLogs(false)}
              className="absolute top-2 right-2 text-gray-600 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
              Project Activity Logs
            </h2>

            {activityLogs.length === 0 ? (
              <p className="text-center text-gray-600">No activity yet.</p>
            ) : (
              <div className="overflow-x-auto max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 text-sm font-medium">
                      {/* <th className="py-2 px-4 border">ID</th> */}
                      <th className="py-3 px-4 border-b text-left">
                        Design Upload
                      </th>
                      <th className="py-3 px-4 border-b text-left">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* <td className="py-2 px-4 border">{log.id}</td> */}
                        <td className="py-3 px-4 border-b">
                          {log.design_upload}
                        </td>
                        <td className="py-3 px-4 border-b">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                onClick={() => setShowLogs(false)}
              >
                Close
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

      {/* Popup to show tasks */}
      {showTasksPopup && selectedProjectId !== null && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-2/3 lg:w-1/2">
            <h2 className="text-2xl font-bold text-left text-gray-800 mb-6">
              Tasks for Project
            </h2>
            <table className="w-full table-auto mb-4 text-left text-gray-700">
              <thead>
                <tr className='bg-gray'>
                  <th className="py-2 px-4 text-sm font-medium text-gray-600">
                    Task Name
                  </th>
                  <th className="py-2 px-4 text-sm font-medium text-gray-600">
                    Start Date
                  </th>
                  <th className="py-2 px-4 text-sm font-medium text-gray-600">
                    End Date
                  </th>
                  <th className="py-2 px-4 text-sm font-medium text-gray-600">
                    Status
                  </th>
                  {/* <th className="py-2 px-4 text-sm font-medium text-gray-600">
                    Version
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-2 px-4 text-sm">{task.taskName}</td>
                    <td className="py-2 px-4 text-sm">
                      {new Date(task.startDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 text-sm">
                      {new Date(task.endDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm ${
                          task.status === 'pending'
                          ? 'bg-gray-300 text-gray-600'
                          : task.status === 'in progress'
                          ? 'bg-blue-300 text-blue-600'
                          : task.status === 'on hold'
                          ? 'bg-yellow-300 text-yellow-600'
                          : task.status === 'completed'
                          ? 'bg-green-300 text-green-600'
                          : task.status === 'under review'
                          ? 'bg-orange-300 text-orange-600'
                          : 'bg-danger text-danger'
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    {/* <td className="border-b border-[#eee] py-3 px-0 dark:border-strokedark">
                  <p className="text-black dark:text-white ml-4">
                  {getVersionFromPath(task.latestFilePath)}
                  </p>
                </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end">
              <button
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300"
                onClick={handleClosePopup}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default ShowProject;
