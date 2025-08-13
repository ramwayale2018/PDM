import React, { useState, useEffect, useRef } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faFileUpload,
  faClipboardList,
  faCopy,
  faUsers,
  faEye,
  faHistory,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { BASE_URL } from '../../../public/config.js';
import AddRevisionPopup from '../../components/AddRevisionPopup';

interface Task {
  product_id: number;
  product_name: string;
  status: string;
  comments: string;
  assignedUsers: string;
  assignedRoles: string;
  latestFilePath: string;
  product_version: number;
  revision: string;
  type: string;
  ecn_id: number;
  productName: string;
}

const VendorList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadPopupOpen, setUploadPopupOpen] = useState(false);
  const [
    isUploadCustomerDocumentsPopupOpen,
    setUploadCustomerDocumentsPopupOpen,
  ] = useState(false);
  const [isLaserUploadPopupOpen, setLaserUploadPopupOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<(string | File)[]>([]);
  const [selectedLaserFiles, setSelectedLaserFiles] = useState<File[]>([]);
  const [selectedCustomerFiles, setSelectedCustomerFiles] = useState<File[]>(
    [],
  );
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [isUsersPopupOpen, setUsersPopupOpen] = useState(false);
  const [selectedAssignedUsers, setSelectedAssignedUsers] = useState<string[]>(
    [],
  );
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [reassignedUsers, setReassignedUsers] = useState<string[]>([]);
  const [showAddUserDropdown, setShowAddUserDropdown] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Task | null>(null);
  const [isFilesPopupOpen, setFilesPopupOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [showActivityLogPopup, setShowActivityLogPopup] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [status, setStatus] = useState('pending');
  const [comment, setComment] = useState('');
  const [showStatusActivityLogPopup, setShowStatusActivityLogPopup] =
    useState(false);
  const [statusActivityLogs, setStatusActivityLogs] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedDesigns, setUploadedDesigns] = useState<
    Record<number, boolean>
  >({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadOptionsPopupOpen, setUploadOptionsPopupOpen] = useState(false);
  const [isViewPopupOpen, setIsViewPopupOpen] = useState(false);
  const [selectedTaskForView, setSelectedTaskForView] = useState<Task | null>(
    null,
  );
  const [isPdfUploadPopupOpen, setPdfUploadPopupOpen] = useState(false);
  const [selectedPdfFiles, setSelectedPdfFiles] = useState<File[]>([]);
  const [isAddRevisionPopupOpen, setAddRevisionPopupOpen] = useState(false);
  const [selectedTaskForRevision, setSelectedTaskForRevision] =
    useState<Task | null>(null);
  const [partTypes, setPartTypes] = useState<any[]>([]);
  const [partType, setPartType] = useState('');
  const [isPdfUploading, setIsPdfUploading] = useState(false);
  const [pdfUploadProgress, setPdfUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const laserFileInputRef = useRef<HTMLInputElement | null>(null);
  const designFileInputRef = useRef<HTMLInputElement | null>(null);
  const customerFileInputRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();

  const handleAddRevisionClick = (task: Task) => {
    setSelectedTaskForRevision(task);
    setAddRevisionPopupOpen(true);
  };

  const closeViewPopup = () => {
    setIsViewPopupOpen(false);
    setUploadOptionsPopupOpen(false);
    setSelectedTaskForView(null);
  };

  const handleViewButtonClick = (task: Task) => {
    setSelectedTaskForView(task);
    setIsViewPopupOpen(true);
  };

  const handleViewPdfDocuments = (productId: number) => {
    navigate(`/products/${productId}/pdf-documents`);
    closeViewPopup();
  };

  const handleViewDesignFiles = (productId: number) => {
    navigate(`/product/${productId}/files`);
    closeViewPopup();
  };

  const handleViewLaserDesignFiles = (productId: number) => {
    navigate(`/product/${productId}/laser-designs`);
    closeViewPopup();
  };

  const handleFilesButtonClick = (productId: number) => {
    navigate(`/product/${productId}/files`);
  };

  const handleLaserDesignsButtonClick = (productId: number) => {
    navigate(`/product/${productId}/laser-designs`);
  };

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

  const fetchAvailableUsers = async () => {
    try {
      const response = await axios.get(BASE_URL + 'api/users');
      setAvailableUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/tasks`, {
        withCredentials: true,
      });
      const data = response.data.data;
      const tasks = data.map((task) => ({
        ...task,
        assignedUsers: task.assigned_users,
      }));
      const sortedTasks = tasks.sort(
        (a: Task, b: Task) => b.product_id - a.product_id,
      );
      setTasks(sortedTasks);
      fetchUploadedDesigns(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchUploadedDesigns = async (tasks: Task[]) => {
    const designStatus: Record<number, boolean> = {};
    for (const task of tasks) {
      try {
        const response = await axios.get(
          `${BASE_URL}api/product/${task.product_id}/uploads`,
          {
            withCredentials: true,
          },
        );
        designStatus[task.product_id] = response.data.files.length > 0;
      } catch (error) {
        designStatus[task.product_id] = false;
      }
    }
    setUploadedDesigns(designStatus);
  };

  useEffect(() => {
    fetchAvailableUsers();
    fetchTasks();
  }, []);

  const handleFileButtonClick = (task: Task) => {
    setUploadPopupOpen(true);
    setSelectedTask(task);
  };

  // const handleLaserFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     const files = Array.from(e.target.files).filter(
  //       (file) => file.type === 'application/pdf'
  //     );
  //     setSelectedLaserFiles(files); // ✅ FIXED: use setSelectedLaserFiles instead of setSelectedPdfFiles
  //   }
  // };

  const handleLaserFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedLaserFiles(Array.from(e.target.files));
    }
  };

  const handleCustomerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedCustomerFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };

  const handleLaserRemoveFile = (index: number) => {
    const updatedFiles = selectedLaserFiles.filter((_, i) => i !== index);
    setSelectedLaserFiles(updatedFiles);
  };

  const handleCustomerRemoveFile = (index: number) => {
    const updatedFiles = selectedCustomerFiles.filter((_, i) => i !== index);
    setSelectedCustomerFiles(updatedFiles);
  };

  const handleUpload1 = async () => {
    if (!selectedTask || selectedFiles.length === 0) {
      alert('Please select at least one file.');
      return;
    }

    if (!selectedTask.revision) {
      alert('Revision is missing. Please select a valid task with a revision.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('productId', selectedTask.product_id.toString());
    formData.append('revision', selectedTask.revision);
    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post(
        `${BASE_URL}api/upload-design`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1),
            );
            setUploadProgress(percentCompleted);
          },
        },
      );

      alert(response.data.message || 'Upload successful');
      setUploadPopupOpen(false);
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error uploading files:', error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert('Error uploading files.');
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleUpload2 = async () => {
    if (!selectedTask || selectedFiles.length === 0) {
      alert('Please select at least one file.');
      return;
    }

    if (!selectedTask.revision) {
      alert('Revision is missing. Please select a valid task with a revision.');
      return;
    }

    const formData = new FormData();
    formData.append('productId', selectedTask.product_id.toString());
    formData.append('revision', selectedTask.revision);
    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const response = await axios.post(
        `${BASE_URL}api/upload-design`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1),
            );
            setUploadProgress(percentCompleted);
          },
        },
      );

      alert(response.data.message || 'Upload successful');
      setUploadPopupOpen(false);
      setSelectedFiles([]);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          const confirmReplace = window.confirm(error.response.data.message);
          if (confirmReplace) {
            formData.append('replace', 'true');

            try {
              const replaceResponse = await axios.post(
                `${BASE_URL}api/upload-design`,
                formData,
                {
                  headers: { 'Content-Type': 'multipart/form-data' },
                  withCredentials: true,
                  onUploadProgress: (progressEvent) => {
                    const percent = Math.round(
                      (progressEvent.loaded * 100) / (progressEvent.total || 1),
                    );
                    setUploadProgress(percent);
                  },
                },
              );
              alert(replaceResponse.data.message || 'Upload successful');
              setUploadPopupOpen(false);
              setSelectedFiles([]);
            } catch (replaceError) {
              alert(
                `Error replacing files: ${
                  replaceError.response?.data?.message || replaceError.message
                }`,
              );
            }
          }
        } else {
          alert(error.response.data.message || 'Upload error');
        }
      } else {
        alert('Unexpected error during upload');
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };



  const handleUpload = async () => {
    if (!selectedTask || selectedFiles.length === 0) {
      alert('Please select at least one file.');
      return;
    }

    if (!selectedTask.revision) {
      alert('Revision is missing. Please select a valid task with a revision.');
      return;
    }

    // Initial FormData for the first attempt
    const formData = new FormData();
    formData.append('productId', selectedTask.product_id.toString());
    formData.append('revision', selectedTask.revision);
    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const response = await axios.post(
        `${BASE_URL}api/upload-design`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1),
            );
            setUploadProgress(percentCompleted);
          },
        },
      );

      alert(response.data.message || 'Upload successful');
      setUploadPopupOpen(false);
      setSelectedFiles([]);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          const confirmReplace = window.confirm(error.response.data.message);
          if (confirmReplace) {
            // Fresh FormData for replacement to avoid duplication
            const replaceFormData = new FormData();
            replaceFormData.append(
              'productId',
              selectedTask.product_id.toString(),
            );
            replaceFormData.append('revision', selectedTask.revision);
            replaceFormData.append('replace', 'true');
            selectedFiles.forEach((file) => {
              replaceFormData.append('files', file);
            });

            try {
              const replaceResponse = await axios.post(
                `${BASE_URL}api/upload-design`,
                replaceFormData,
                {
                  headers: { 'Content-Type': 'multipart/form-data' },
                  withCredentials: true,
                  onUploadProgress: (progressEvent) => {
                    const percent = Math.round(
                      (progressEvent.loaded * 100) / (progressEvent.total || 1),
                    );
                    setUploadProgress(percent);
                  },
                },
              );
              alert(replaceResponse.data.message || 'Upload successful');
              setUploadPopupOpen(false);
              setSelectedFiles([]);
            } catch (replaceError) {
              alert(
                `Error replacing files: ${
                  replaceError.response?.data?.message || replaceError.message
                }`,
              );
            }
          }
        } else {
          alert(error.response.data.message || 'Upload error');
        }
      } else {
        alert('Unexpected error during upload');
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // const handleCustomerDocumentUpload = async () => {
  //   if (!selectedTask || selectedCustomerFiles.length === 0) {
  //     alert('Please select at least one file.');
  //     return;
  //   }

  //   if (!selectedTask.revision) {
  //     alert('Revision is missing. Please select a valid task with a revision.');
  //     return;
  //   }

  //   setIsUploading(true);
  //   setUploadProgress(0);

  //   const formData = new FormData();
  //   formData.append('productId', selectedTask.product_id.toString());
  //   formData.append('revision', selectedTask.revision);
  //   selectedCustomerFiles.forEach((file) => {
  //     formData.append('files', file);
  //   });

  //   try {
  //     const response = await axios.post(
  //       `${BASE_URL}api/upload-customer-documents`,
  //       formData,
  //       {
  //         headers: { 'Content-Type': 'multipart/form-data' },
  //         withCredentials: true,
  //         onUploadProgress: (progressEvent) => {
  //           const percentCompleted = Math.round(
  //             (progressEvent.loaded * 100) / (progressEvent.total || 1),
  //           );
  //           setUploadProgress(percentCompleted);
  //         },
  //       },
  //     );

  //     alert(response.data.message || 'Upload successful');
  //     setUploadCustomerDocumentsPopupOpen(false);
  //     setSelectedCustomerFiles([]);
  //   } catch (error) {
  //     console.error('Error uploading files:', error);
  //     if (
  //       error.response &&
  //       error.response.data &&
  //       error.response.data.message
  //     ) {
  //       alert(error.response.data.message);
  //     } else {
  //       alert('Error uploading files.');
  //     }
  //   } finally {
  //     setIsUploading(false);
  //     setUploadProgress(0);
  //   }
  // };

  // 0 change
  // const handleLaserUpload = async () => {
  //   if (!selectedTask || selectedLaserFiles.length === 0) {
  //     alert('Please select at least one file.');
  //     return;
  //   }

  //   if (!selectedTask.revision) {
  //     alert('Revision is missing. Please select a valid task with a revision.');
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('productId', selectedTask.product_id.toString());
  //   formData.append('revision', selectedTask.revision);
  //   selectedLaserFiles.forEach((file) => {
  //     formData.append('files', file);
  //   });

  //   try {
  //     const response = await axios.post(
  //       `${BASE_URL}api/laser_upload-design`,
  //       formData,
  //       {
  //         headers: { 'Content-Type': 'multipart/form-data' },
  //         withCredentials: true,
  //       },
  //     );

  //     alert(response.data.message || 'Upload successful');
  //     setLaserUploadPopupOpen(false);
  //     setSelectedLaserFiles([]);
  //   } catch (error) {
  //     console.error('Error uploading files:', error);

  //     if (error.response) {
  //       // Server responded with a status code other than 2xx
  //       const errorMessage =
  //         error.response.data.message || error.response.statusText;
  //       if (error.response.status === 409) {
  //         // File already exists, ask for confirmation to replace
  //         const confirmReplace = window.confirm(errorMessage);
  //         if (confirmReplace) {
  //           // Re-upload files with the replace flag set to true
  //           formData.append('replace', 'true');
  //           try {
  //             const replaceResponse = await axios.post(
  //               `${BASE_URL}api/laser_upload-design`,
  //               formData,
  //               {
  //                 headers: { 'Content-Type': 'multipart/form-data' },
  //                 withCredentials: true,
  //               },
  //             );
  //             alert(replaceResponse.data.message || 'Upload successful');
  //             setLaserUploadPopupOpen(false);
  //             setSelectedLaserFiles([]);
  //           } catch (replaceError) {
  //             console.error('Error replacing files:', replaceError);
  //             alert(
  //               `Error replacing files: ${
  //                 replaceError.response?.data?.message || replaceError.message
  //               }`,
  //             );
  //           }
  //         } else {
  //           console.log('Upload canceled by the user.');
  //         }
  //       } else {
  //         alert(`Error: ${errorMessage}`);
  //       }
  //     } else if (error.request) {
  //       // Request was made but no response received
  //       alert(
  //         'No response from server. Please check your internet connection.',
  //       );
  //     } else {
  //       // Other errors (e.g., request setup issues)
  //       alert(`Unexpected error: ${error.message}`);
  //     }
  //   }
  // };

  const handleCustomerDocumentUpload = async () => {
    if (!selectedTask || selectedCustomerFiles.length === 0) {
      alert('Please select at least one file.');
      return;
    }

    if (!selectedTask.revision) {
      alert('Revision is missing. Please select a valid task with a revision.');
      return;
    }

    const formData = new FormData();
    formData.append('productId', selectedTask.product_id.toString());
    formData.append('revision', selectedTask.revision);
    selectedCustomerFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const response = await axios.post(
        `${BASE_URL}api/upload-customer-documents`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1),
            );
            setUploadProgress(percentCompleted);
          },
        },
      );

      alert(response.data.message || 'Upload successful');
      setUploadCustomerDocumentsPopupOpen(false);
      setSelectedCustomerFiles([]);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          const confirmReplace = window.confirm(error.response.data.message);
          if (confirmReplace) {
            formData.append('replace', 'true');

            try {
              const replaceResponse = await axios.post(
                `${BASE_URL}api/upload-customer-documents`,
                formData,
                {
                  headers: { 'Content-Type': 'multipart/form-data' },
                  withCredentials: true,
                  onUploadProgress: (progressEvent) => {
                    const percent = Math.round(
                      (progressEvent.loaded * 100) / (progressEvent.total || 1),
                    );
                    setUploadProgress(percent);
                  },
                },
              );
              alert(replaceResponse.data.message || 'Upload successful');
              setUploadCustomerDocumentsPopupOpen(false);
              setSelectedCustomerFiles([]);
            } catch (replaceError) {
              alert(
                `Error replacing files: ${
                  replaceError.response?.data?.message || replaceError.message
                }`,
              );
            }
          }
        } else {
          alert(error.response.data.message || 'Upload error');
        }
      } else {
        alert('Unexpected error during upload');
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleLaserUpload = async () => {
    if (!selectedTask || selectedLaserFiles.length === 0) {
      alert('Please select at least one file.');
      return;
    }

    if (!selectedTask.revision) {
      alert('Revision is missing. Please select a valid task with a revision.');
      return;
    }

    const formData = new FormData();
    formData.append('productId', selectedTask.product_id.toString());
    formData.append('revision', selectedTask.revision);
    selectedLaserFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const response = await axios.post(
        `${BASE_URL}api/laser_upload-design`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(percent);
          },
        },
      );

      alert(response.data.message || 'Upload successful');
      setLaserUploadPopupOpen(false);
      setSelectedLaserFiles([]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMessage =
            error.response.data.message || error.response.statusText;

          if (error.response.status === 409) {
            const confirmReplace = window.confirm(errorMessage);
            if (confirmReplace) {
              formData.append('replace', 'true');

              try {
                const replaceResponse = await axios.post(
                  `${BASE_URL}api/laser_upload-design`,
                  formData,
                  {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                    onUploadProgress: (progressEvent) => {
                      const percent = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total,
                      );
                      setUploadProgress(percent);
                    },
                  },
                );
                alert(replaceResponse.data.message || 'Upload successful');
                setLaserUploadPopupOpen(false);
                setSelectedLaserFiles([]);
              } catch (replaceError) {
                alert(
                  `Error replacing files: ${
                    replaceError.response?.data?.message || replaceError.message
                  }`,
                );
              }
            }
          } else {
            alert(`Error: ${errorMessage}`);
          }
        } else if (error.request) {
          alert(
            'No response from server. Please check your internet connection.',
          );
        } else {
          alert(`Unexpected error: ${error.message}`);
        }
      } else {
        alert(`Unexpected error: ${error}`);
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleUploadButtonClick = (task: Task) => {
    setSelectedTask(task);
    setUploadOptionsPopupOpen(true);
  };

  const handleAssignedUsersClick = (task: Task) => {
    const assignedUsers = task?.assignedUsers || '';
    console.log('Assigned Users:', assignedUsers);

    // Split, trim, and filter out any empty strings
    const usersArray = assignedUsers
      .split(',')
      .map((user) => user.trim())
      .filter((user) => user !== '');

    setSelectedTask(task);
    setSelectedAssignedUsers(usersArray);
    setReassignedUsers(usersArray);
    setUsersPopupOpen(true);
  };

  const closePopups = () => {
    setUploadPopupOpen(false);
    setUsersPopupOpen(false);
  };

  const handleRemoveUser = async (user: string) => {
    const userId = availableUsers.find((u) => u.name === user)?.id;
    if (!selectedTask || !selectedTask.product_id) {
      console.error('Error: selectedTask or its ID is undefined.');
      return;
    }
    if (userId) {
      try {
        await axios.delete(
          BASE_URL + `api/tasks/${selectedTask.product_id}/users/${userId}`,
        );
        setReassignedUsers((prev) => {
          const updatedUsers = prev.filter(
            (assignedUser) => assignedUser !== user,
          );
          console.log('Updated reassigned users:', updatedUsers);
          return updatedUsers;
        });
      } catch (error) {
        console.error('Error removing user:', error);
      }
    }
  };

  const handleAddUser = async (user: any) => {
    try {
      await axios.post(
        BASE_URL + `api/tasks/${selectedTask?.product_id}/users`,
        {
          userId: [user.id],
        },
      );
      setReassignedUsers((prev) => [...prev, user.name]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error adding user:', error.response?.data);
      } else {
        console.error('Error adding user:', error);
      }
    }
  };

  const handleUpdateUsers = async () => {
    try {
      await axios.put(
        BASE_URL + `api/tasks/${selectedTask?.product_id}/users`,
        {
          assignedUsers: reassignedUsers.join(','),
        },
      );
      setUsersPopupOpen(false);
      fetchTasks();
    } catch (error) {
      console.error('Error saving reassigned users:', error);
    }
  };

  const toggleAddUserDropdown = () => {
    setShowAddUserDropdown((prev) => !prev);
  };

  const filteredAvailableUsers = availableUsers.filter(
    (user) => !reassignedUsers.includes(user.name),
  );

  const copyFolderPath = async (projectName: string) => {
    try {
      const response = await axios.get(
        BASE_URL + `api/copy-folder-path/${encodeURIComponent(projectName)}`,
      );
      const folderPath = response.data.folderPath;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(folderPath);
        setPopupMessage('Folder path copied to clipboard!');
        setTimeout(() => setPopupMessage(null), 3000);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = folderPath;
        textarea.style.position = 'fixed';
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

  const handleEditClick = (task: Task) => {
    setSelectedProduct(task);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedProduct(null);
    setEditModalOpen(false);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      const response = await axios.put(
        `${BASE_URL}api/tasks/${selectedProduct.product_id}`,
        {
          productName: selectedProduct.product_name,
          docUpload: selectedProduct.latestFilePath,
          status: selectedProduct.status,
          comments: selectedProduct.comments,
          type: selectedProduct.type,
        },
        { withCredentials: true },
      );

      alert(response.data.message || 'Part updated successfully');
      fetchTasks();
      closeEditModal();
    } catch (error) {
      console.error('Error updating Part:', error);
      alert('Error updating Part.');
    }
  };

  const fetchActivityLogs = async (taskId: number) => {
    try {
      const response = await axios.get(
        BASE_URL + `api/task/${taskId}/activity-logs`,
      );

      if (response.data.logs && response.data.logs.length > 0) {
        setActivityLogs(response.data.logs);
        setShowActivityLogPopup(true);
      } else {
        setActivityLogs([]);
        setShowActivityLogPopup(true);
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      setActivityLogs([]);
      setShowActivityLogPopup(true);
    }
  };

  const handleViewActivityLogs = (productId: number) => {
    setSelectedProductId(productId);
    fetchActivityLogs(productId);
  };

  const handleClosePopup = () => {
    setShowStatusActivityLogPopup(false);
  };

  const fetchStatusActivityLogs = async (productId: number) => {
    try {
      const response = await axios.get(
        `${BASE_URL}api/tasks/${productId}/status-activity`,
        { withCredentials: true },
      );
      if (response.data.data && response.data.data.length > 0) {
        setStatusActivityLogs(response.data.data);
        setShowStatusActivityLogPopup(true);
      } else {
        setActivityLogs([]);
        setShowActivityLogPopup(true);
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      setActivityLogs([]);
      setShowActivityLogPopup(true);
    }
  };

  const handleVieStatuswActivityLogs = (productId: number) => {
    setSelectedProductId(productId);
    fetchStatusActivityLogs(productId);
  };

  const handleViewDocuments = (productId: number) => {
    navigate(`/products/${productId}/documents`);
    closeViewPopup();
  };

  const handlePdfUpload1 = async () => {
    if (!selectedTask || selectedPdfFiles.length === 0) {
      alert('Please select at least one PDF file.');
      return;
    }

    if (!selectedTask.revision) {
      alert('Revision is missing. Please select a valid task with a revision.');
      return;
    }

    const formData = new FormData();
    formData.append('productId', selectedTask.product_id.toString());
    formData.append('revision', selectedTask.revision);
    selectedPdfFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      setIsPdfUploading(true);
      setPdfUploadProgress(0);

      const response = await axios.post(`${BASE_URL}api/pdf-upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setPdfUploadProgress(percent);
        },
      });

      alert(response.data.message || 'PDF upload successful');
      setPdfUploadPopupOpen(false);
      setSelectedPdfFiles([]);
    } catch (error) {
      console.error('Error uploading PDF files:', error);
      alert('Error uploading PDF files.');
    } finally {
      setIsPdfUploading(false);
      setPdfUploadProgress(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(
        (file) => file.type === 'application/pdf',
      );
      setSelectedPdfFiles(files);
    }
  };

  // const handleDesignFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     const files = Array.from(e.target.files).filter(
  //       (file) => file.type === 'application/pdf',
  //     );
  //     setSelectedFiles(files);
  //   }
  // };
  

const handleDesignFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    const files = Array.from(e.target.files); // No filter applied
    setSelectedFiles(files);
  }
};

  const handlePdfUpload = async () => {
    if (!selectedTask || selectedPdfFiles.length === 0) {
      alert('Please select at least one PDF file.');
      return;
    }

    if (!selectedTask.revision) {
      alert('Revision is missing. Please select a valid task with a revision.');
      return;
    }

    const formData = new FormData();
    formData.append('productId', selectedTask.product_id.toString());
    formData.append('revision', selectedTask.revision);
    selectedPdfFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      setIsPdfUploading(true);
      setPdfUploadProgress(0);

      // Attempt initial upload
      await axios.post(`${BASE_URL}api/pdf-upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setPdfUploadProgress(percent);
        },
      });

      alert('PDF upload successful');
      setPdfUploadPopupOpen(false);
      setSelectedPdfFiles([]);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        const duplicates = error.response.data.duplicates || [];

        const confirmReplace = window.confirm(
          `files ${duplicates.join()} already exist.Do you want to replace them?`,
        );

        if (!confirmReplace) {
          setIsPdfUploading(false);
          return;
        }

        // Rebuild formData with overwrite flag
        const retryFormData = new FormData();
        retryFormData.append('productId', selectedTask.product_id.toString());
        retryFormData.append('revision', selectedTask.revision);
        retryFormData.append('overwrite', 'true');
        selectedPdfFiles.forEach((file) => {
          retryFormData.append('files', file);
        });

        try {
          const retryRes = await axios.post(
            `${BASE_URL}api/pdf-upload`,
            retryFormData,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
              withCredentials: true,
              onUploadProgress: (e) => {
                const percent = Math.round((e.loaded * 100) / e.total);
                setPdfUploadProgress(percent);
              },
            },
          );

          alert(retryRes.data.message || 'PDF upload successful');
          setPdfUploadPopupOpen(false);
          setSelectedPdfFiles([]);
        } catch (retryErr) {
          alert('Error uploading files after confirmation.');
          console.error(retryErr);
        }
      } else {
        console.error('Unexpected upload error:', error);
        alert('Error uploading PDF files.');
      }
    } finally {
      setIsPdfUploading(false);
      setPdfUploadProgress(0);
    }
  };

  useEffect(() => {
    const fetchPartTypes = async () => {
      try {
        const response = await axios.get(BASE_URL + 'api/part-types');
        console.log('Part Types Response:', response.data);
        setPartTypes(response.data.data);
      } catch (error) {
        console.error('Error fetching part types:', error);
        setPartTypes([]);
      }
    };
    fetchPartTypes();
  }, []);

  const handleViewECN = (task: Task) => {
    navigate(`/view-ecn-form?partNo=${task.product_name}`);
  };

  return (
    <div className="p-4">
      <Breadcrumb pageName="Part List" />
      <input
        type="text"
        placeholder="Search Parts"
        className="p-2 border border-gray-300 rounded w-half mr-2 mb-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-auto max-h-96 border rounded-lg bg-white shadow relative">
        <table className="w-full table-auto">
          <thead className="sticky top-0 bg-gray-200 z-10">
            <tr className="text-left">
              <th className="py-4 px-4">Part No</th>
              <th className="py-4 px-4">Type</th>
              <th className="py-4 px-4">Revision</th>
              <th className="py-4 px-4">Version</th>
              <th className="py-4 px-4">View Files</th>
              <th className="py-4 px-4">Upload Files</th>
              <th className="py-4 px-4">Status</th>

              {/* {(userRole === 'designer' ||
                (userRole === 'sales' && status === 'pending')) && (
                <th className="py-4 px-4">
                  {userRole === 'designer' ? 'Users' : 'Reassign'}
                </th>
              )} */}
              {(userRole === 'designer' ||
                userRole === 'admin' || // <-- added admin
                (userRole === 'sales' && status === 'pending')) && (
                <th className="py-4 px-4">
                  {userRole === 'designer' || userRole === 'admin'
                    ? 'Users'
                    : 'Reassign'}
                </th>
              )}

              <th className="py-4 px-8">Action</th>

              {(userRole === 'laser designer' || userRole === 'employee') && (
                <th className="py-4 px-4">View</th>
              )}
              {userRole === 'designer' && (
                <>
                  <th className="py-4 px-4">ECN</th>
                </>
              )}
            </tr>
          </thead>

          <tbody>
            {tasks
              .filter((task) =>
                task.product_name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()),
              )
              .map((task) => (
                <tr key={task.product_id}>
                  <td className="py-4 px-4">{task.product_name}</td>
                  <td className="py-4 px-4">{task.type}</td>
                  <td className="py-4 px-4">{task.revision}</td>

                  {userRole !== 'laser designer' && userRole !== 'employee' && (
                    <>
                      <td className="py-4 px-4">{task.product_version}</td>

                      <td className="py-4 px-4">
                        <button
                          className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                          onClick={() => handleViewButtonClick(task)}
                        >
                          View
                        </button>
                      </td>

                      <td className="py-4 px-4">
                        <button
                          className={`inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white ${
                            userRole === 'sales' && task.status === 'completed'
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-blue-500 hover:bg-opacity-75'
                          }`}
                          onClick={() => handleUploadButtonClick(task)}
                          disabled={
                            userRole === 'sales' && task.status === 'completed'
                          }
                        >
                          Upload
                        </button>
                      </td>
                    </>
                  )}

                  <td className="py-2 px-4 text-sm">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm ${
                        task.status === 'pending'
                          ? 'bg-gray-300 text-gray-600'
                          : task.status === 'in_progress'
                          ? 'bg-blue-300 text-blue-600'
                          : task.status === 'under_review'
                          ? 'bg-yellow-300 text-yellow-600'
                          : task.status === 'completed'
                          ? 'bg-green-300 text-green-600'
                          : task.status === 'on_hold'
                          ? 'bg-orange-300 text-orange-600'
                          : 'bg-danger text-danger'
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  {/* {userRole === 'sales' && (
                    <td className="py-4 px-4">
                      {task.status === 'pending' ? (
                        <button
                          title="Users"
                          className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                          onClick={() => {
                            closePopups();
                            handleAssignedUsersClick(task);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faUsers}
                            className="text-white"
                          />
                        </button>
                      ) : (
                        <button
                          title="Reassign (disabled)"
                          className="bg-gray-300 cursor-not-allowed inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white"
                          disabled
                        >
                          <FontAwesomeIcon
                            icon={faUsers}
                            className="text-gray-500"
                          />
                        </button>
                      )}
                    </td>
                  )} */}

                  {(userRole === 'sales' || userRole === 'admin') && (
                    <td className="py-4 px-4">
                      {userRole === 'admin' || task.status === 'pending' ? (
                        <button
                          title="Users"
                          className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                          onClick={() => {
                            closePopups();
                            handleAssignedUsersClick(task);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faUsers}
                            className="text-white"
                          />
                        </button>
                      ) : (
                        <button
                          title="Reassign (disabled)"
                          className="bg-gray-300 cursor-not-allowed inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white"
                          disabled
                        >
                          <FontAwesomeIcon
                            icon={faUsers}
                            className="text-gray-500"
                          />
                        </button>
                      )}
                    </td>
                  )}

                  {userRole === 'designer' && (
                    <td className="py-4 px-4 text-center">
                      <button
                        title="View Assigned Users"
                        className="inline-flex items-center justify-center bg-blue-500 rounded-md p-2 text-gray-700 hover:bg-gray-300"
                        onClick={() => {
                          closePopups();
                          handleAssignedUsersClick(task); // same function as for sales
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faUsers}
                          className="text-white"
                        />
                      </button>
                    </td>
                  )}

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {userRole === 'laser designer' && (
                        <button
                          title="Edit Comment"
                          className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                          onClick={() => handleEditClick(task)}
                        >
                          <FontAwesomeIcon
                            icon={faEdit}
                            className="text-white"
                          />
                        </button>
                      )}

                      <>
                        {userRole !== 'designer' && userRole !== 'sales' && (
                          <button
                            title="Copy Folder"
                            className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                            onClick={() => copyFolderPath(task.product_name)}
                          >
                            <FontAwesomeIcon
                              icon={faCopy}
                              className="text-white"
                            />
                          </button>
                        )}

                        {(userRole === 'sales' || userRole === 'admin') &&
                          task.status === 'completed' && (
                            <button
                              title="Add Revision"
                              className="bg-green-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                              onClick={() => handleAddRevisionClick(task)}
                            >
                              <FontAwesomeIcon
                                icon={faPlus}
                                className="text-white"
                              />
                            </button>
                          )}

                        {userRole !== 'sales' && userRole !== 'designer' && (
                          <button
                            title="Edit Status"
                            className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                            onClick={() => handleEditClick(task)}
                          >
                            <FontAwesomeIcon
                              icon={faEdit}
                              className="text-white"
                            />
                          </button>
                        )}

                        <button
                          title="Users Assignment Activity"
                          className="bg-meta-3 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                          onClick={() =>
                            handleViewActivityLogs(task.product_id)
                          }
                        >
                          <FontAwesomeIcon
                            icon={faClipboardList}
                            className="text-white"
                          />
                        </button>

                        <button
                          title="Status Activity"
                          onClick={() =>
                            handleVieStatuswActivityLogs(task.product_id)
                          }
                          className="bg-red-400 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                        >
                          <FontAwesomeIcon
                            icon={faHistory}
                            className="text-white"
                          />
                        </button>
                      </>
                    </div>
                  </td>

                  {/* <td className="py-4 px-4">
                    <button
                      className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                      onClick={() =>
                        navigate(
                          `/view-ecn-form?partNo=${task.product_id}&readonly=true`,
                        )
                      }
                    >
                      <FontAwesomeIcon icon={faEye} className="text-white" />
                    </button>
                  </td> */}

                  {userRole === 'designer' && (
                    <td className="py-4 px-4">
                      <button
                        className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                        onClick={() =>
                          navigate(
                            `/view-ecn-form?partNo=${task.product_id}&readonly=true`,
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faEye} className="text-white" />
                      </button>
                    </td>
                  )}

                  {(userRole === 'laser designer' ||
                    userRole === 'employee') && (
                    <td className="py-4 px-4">
                      <button
                        className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                        onClick={() => handleViewButtonClick(task)}
                      >
                        View
                      </button>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {isUploadOptionsPopupOpen && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-999">
          <div className="bg-white rounded p-4 w-96 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Upload Options </h3>

            {userRole !== 'designer' && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mb-2 w-full"
                onClick={() => {
                  setUploadOptionsPopupOpen(false);
                  setUploadCustomerDocumentsPopupOpen(true);
                }}
              >
                Customer Documents Upload
              </button>
            )}

            {userRole !== 'sales' && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mb-2 w-full"
                onClick={() => {
                  setUploadOptionsPopupOpen(false);
                  setUploadPopupOpen(true);
                }}
              >
                Design Upload
              </button>
            )}

            {userRole !== 'sales' && (
              <button
                className="bg-blue-500 text-white px-4 py-2 mb-2 rounded w-full"
                onClick={() => {
                  setUploadOptionsPopupOpen(false);
                  setLaserUploadPopupOpen(true);
                }}
              >
                DXF Upload
              </button>
            )}

            {userRole !== 'sales' && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                onClick={() => {
                  setUploadOptionsPopupOpen(false);
                  setPdfUploadPopupOpen(true);
                }}
              >
                PDF Upload
              </button>
            )}

            <button
              className="mt-4 w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              onClick={closeViewPopup}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* {isPdfUploadPopupOpen && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-4 w-96 shadow-lg">
            <h3 className="text-xl font-bold mb-4">
              Upload PDF for {selectedTask.product_name}
            </h3>
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files) {
                  const files = Array.from(e.target.files).filter(
                    (file) => file.type === 'application/pdf',
                  );
                  setSelectedPdfFiles(files);
                }
              }}
              className="mb-2"
              name="files"
              multiple
              accept="application/pdf"
            />
            {selectedPdfFiles.length > 0 && (
              <div className="mb-2 overflow-auto max-h-60">
                {selectedPdfFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mb-1"
                  >
                    <span>{file.name}</span>
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => {
                        const updatedFiles = selectedPdfFiles.filter(
                          (_, i) => i !== index,
                        );
                        setSelectedPdfFiles(updatedFiles);
                      }}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setPdfUploadPopupOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handlePdfUpload}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )} */}

      {isPdfUploadPopupOpen && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-4 w-96 shadow-lg">
            <h3 className="text-xl font-bold mb-4">
              Upload PDF for {selectedTask.product_name}
            </h3>

          
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              multiple
              accept="application/pdf"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mb-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              {selectedPdfFiles.length > 0
                ? `${selectedPdfFiles.length} file${
                    selectedPdfFiles.length > 1 ? 's' : ''
                  } selected`
                : 'Choose PDF Files'}
            </button>

            {selectedPdfFiles.length > 0 && (
              <div className="mb-2 overflow-auto max-h-60">
                {selectedPdfFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mb-1"
                  >
                    <span>{file.name}</span>
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => {
                        const updatedFiles = selectedPdfFiles.filter(
                          (_, i) => i !== index,
                        );
                        setSelectedPdfFiles(updatedFiles);
                      }}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}

            {isPdfUploading && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-100"
                  style={{ width: `${pdfUploadProgress}%` }}
                ></div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  setPdfUploadPopupOpen(false);
                   setSelectedPdfFiles([]);
                }}
                disabled={isPdfUploading}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded transition ${
                  isPdfUploading
                    ? 'bg-blue-300 text-blue-800'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
                onClick={handlePdfUpload}
                disabled={isPdfUploading}
              >
                {isPdfUploading ? `${pdfUploadProgress}%` : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isUsersPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-999 bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-white p-6 md:p-10 rounded-2xl shadow-2xl max-w-lg w-full transform transition-transform duration-300 ease-in-out scale-100 hover:scale-105">
            <h3 className="text-3xl font-bold text-center text-blue-700 mb-8">
              Reassign Users
            </h3>
            <div className="max-h-72 overflow-y-auto mb-6 space-y-6">
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-4">
                  Assigned Users
                </h4>
                <ul className="space-y-3">
                  {reassignedUsers.length > 0 ? (
                    reassignedUsers.map((user, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 hover:shadow-md hover:bg-gray-100 transition duration-200"
                      >
                        <span className="text-lg font-medium text-gray-700">
                          {user}
                        </span>
                        {userRole !== 'designer' && (
                          <button
                            className="text-red-500 hover:text-red-700 font-medium transition"
                            onClick={() => handleRemoveUser(user)}
                            disabled={!selectedTask || !selectedTask.product_id}
                          >
                            Remove
                          </button>
                        )}
                      </li>
                    ))
                  ) : (
                    <p>No users assigned.</p>
                  )}
                </ul>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-4">
                {userRole !== 'designer' && (
                  <button
                    onClick={toggleAddUserDropdown}
                    className="bg-blue-500 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-600 transition"
                  >
                    Add User
                  </button>
                )}

                {showAddUserDropdown && (
                  <div className="relative flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
                    <select
                      className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      onChange={(e) => {
                        const selectedUser = filteredAvailableUsers.find(
                          (user) => user.id === parseInt(e.target.value),
                        );
                        if (selectedUser) handleAddUser(selectedUser);
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select a User
                      </option>
                      {filteredAvailableUsers.length > 0 ? (
                        filteredAvailableUsers.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No users available</option>
                      )}
                    </select>
                    <button
                      className="bg-gray-500 text-white font-medium px-4 py-2 rounded-md hover:bg-gray-600 transition"
                      onClick={toggleAddUserDropdown}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-8">
              <button
                className="bg-red-500 text-white font-medium py-2 px-6 rounded-md hover:bg-red-600 transition"
                onClick={() => setUsersPopupOpen(false)}
              >
                Close
              </button>
              {userRole !== 'designer' && (
                <button
                  className="bg-green-500 text-white font-medium py-2 px-6 rounded-md hover:bg-green-600 transition"
                  onClick={handleUpdateUsers}
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* {isUploadPopupOpen && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-4 w-96 shadow-lg">
            <h3 className="text-xl font-bold mb-4">
              Upload Design for {selectedTask.product_name}
            </h3>
            <input
              type="file"
              onChange={handleFileChange}
              className="mb-2"
              name="files"
              multiple
            />
            {selectedFiles.length > 0 && (
              <div className="mb-2 overflow-auto max-h-60">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mb-1"
                  >
                    <span>{typeof file === 'string' ? file : file.name}</span>
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => handleRemoveFile(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setUploadPopupOpen(false)}
                disabled={isUploading}
              >
                Cancel
              </button>

              <button
                className={`px-4 py-2 rounded transition ${
                  isUploading
                    ? 'bg-blue-300 text-blue-800'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? `${uploadProgress}%` : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )} */}

      {isUploadPopupOpen && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-4 w-96 shadow-lg">
            <h3 className="text-xl font-bold mb-4">
              Upload Design for {selectedTask.product_name}
            </h3>

            <input
              ref={designFileInputRef}
              type="file"
              className="hidden"
              onChange={handleDesignFileChange}
              multiple
              accept="application/pdf"
            />

            <button
              type="button"
              onClick={() => designFileInputRef.current?.click()}
              className="mb-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              {selectedFiles.length > 0
                ? `${selectedFiles.length} file${
                    selectedFiles.length > 1 ? 's' : ''
                  } selected`
                : 'Choose Design Files'}
            </button>

            {selectedFiles.length > 0 && (
              <div className="mb-2 overflow-auto max-h-60">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mb-1"
                  >
                    <span>{typeof file === 'string' ? file : file.name}</span>
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => handleRemoveFile(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}

            {isUploading && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-100"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  setUploadPopupOpen(false);
                  setSelectedFiles([]);
                }}
                disabled={isUploading}
              >
                Cancel
              </button>

              <button
                className={`px-4 py-2 rounded transition ${
                  isUploading
                    ? 'bg-blue-300 text-blue-800'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? `${uploadProgress}%` : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isUploadCustomerDocumentsPopupOpen && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-999">
          <div className="bg-white rounded p-4 w-96 shadow-lg">
            <h3 className="text-xl font-bold mb-4">
              Upload Customer Documents for {selectedTask.product_name}
            </h3>
            {/* <input
              type="file"
              onChange={handleCustomerFileChange}
              className="mb-2"
              name="files"
              multiple
            /> */}

  <input
              ref={customerFileInputRef}
              type="file"
              className="hidden"
              onChange={handleCustomerFileChange}
              multiple
              accept="application/pdf"
            />

            <button
              type="button"
              onClick={() => customerFileInputRef.current?.click()}
              className="mb-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              {selectedCustomerFiles.length > 0
                ? `${selectedCustomerFiles.length} file${
                    selectedCustomerFiles.length > 1 ? 's' : ''
                  } selected`
                : 'Choose Design Files'}
            </button>

            {selectedCustomerFiles.length > 0 && (
              <div className="mb-2 overflow-auto max-h-60">
                {selectedCustomerFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mb-1"
                  >
                    <span>{typeof file === 'string' ? file : file.name}</span>
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => handleCustomerRemoveFile(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => {setUploadCustomerDocumentsPopupOpen(false);setSelectedCustomerFiles([]);}}
                disabled={isUploading}
              >
                Cancel
              </button>

              <button
                className={`px-4 py-2 rounded transition ${
                  isUploading
                    ? 'bg-blue-300 text-blue-800'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
                onClick={handleCustomerDocumentUpload}
                disabled={isUploading}
              >
                {isUploading ? `${uploadProgress}%` : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isLaserUploadPopupOpen && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-4 w-96 shadow-lg">
            <h3 className="text-xl font-bold mb-4">
              Upload Laser Design for {selectedTask.product_name}
            </h3>
            <input
              type="file"
              onChange={handleLaserFileChange}
              className="mb-2"
              name="files"
              multiple
            />
            {selectedLaserFiles.length > 0 && (
              <div className="mb-2 overflow-auto max-h-60">
                {selectedLaserFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mb-1"
                  >
                    <span>{file.name}</span>
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => handleLaserRemoveFile(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setLaserUploadPopupOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleLaserUpload}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-999">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Edit Part</h2>
            <form onSubmit={handleUpdateProduct}>
              {userRole !== 'designer' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-black mb-2">
                    Status:
                  </label>
                  <select
                    value={selectedProduct.status}
                    onChange={(e) =>
                      setSelectedProduct((prev) => ({
                        ...prev!,
                        status: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="under_review">Under Review</option>
                    <option value="on_hold">On Hold</option>
                    {userRole !== 'designer' && (
                      <option value="completed">Completed</option>
                    )}
                  </select>
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-black">
                  Part Description:
                </label>
                <textarea
                  value={selectedProduct.comments || ''}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700 focus:outline-none cursor-not-allowed"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showActivityLogPopup && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center ml-70 mt-10">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl w-full overflow-hidden">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
              Activity Logs
            </h2>

            {activityLogs.length > 0 ? (
              <div className="overflow-x-auto max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 text-sm font-medium">
                      <th className="py-3 px-4 border-b text-left">Name</th>
                      <th className="py-3 px-4 border-b text-left">Action</th>
                      {/* <th className="py-3 px-4 border-b text-left">
                        File Path
                      </th> */}
                      <th className="py-3 px-4 border-b text-left">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700">
                    {activityLogs.map((log, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4 border-b">{log.name}</td>
                        <td className="py-3 px-4 border-b">{log.action}</td>
                        {/* <td className="py-3 px-4 border-b">{log.file_path}</td> */}
                        <td className="py-3 px-4 border-b">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-600 py-10">
                No activity found
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                onClick={() => setShowActivityLogPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isLaserUploadPopupOpen && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-4 w-96 shadow-lg">
            <h3 className="text-xl font-bold mb-4">
              Upload DXF for {selectedTask.product_name}
            </h3>

            <input
              ref={laserFileInputRef}
              type="file"
              className="hidden"
              onChange={handleLaserFileChange}
              multiple
              accept="application/pdf"
            />

            <button
              type="button"
              onClick={() => laserFileInputRef.current?.click()}
              className="mb-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              {selectedLaserFiles.length > 0
                ? `${selectedLaserFiles.length} file${
                    selectedLaserFiles.length > 1 ? 's' : ''
                  } selected`
                : 'Choose DXF Files'}
            </button>

            {selectedLaserFiles.length > 0 && (
              <div className="mb-2 overflow-auto max-h-60">
                {selectedLaserFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mb-1"
                  >
                    <span>{typeof file === 'string' ? file : file.name}</span>
                    <button
                      type="button"
                      className="text-red-500"
                      onClick={() => handleLaserRemoveFile(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}

            {isUploading && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-100"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  setLaserUploadPopupOpen(false);
                  setSelectedLaserFiles([]);
                }}
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded transition ${
                  isUploading
                    ? 'bg-blue-300 text-blue-800'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
                onClick={handleLaserUpload}
                disabled={isUploading}
              >
                {isUploading ? `${uploadProgress}%` : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isViewPopupOpen && selectedTaskForView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-999">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4">View Options</h3>
            <div className="space-y-4">
              <>
                <button
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                  onClick={() =>
                    handleViewDocuments(selectedTaskForView.product_id)
                  }
                >
                  View Customer Data
                </button>

                {userRole !== 'sales' && (
                  <button
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    onClick={() =>
                      handleViewDesignFiles(selectedTaskForView.product_id)
                    }
                  >
                    View Design Files
                  </button>
                )}
              </>
              <>
                {userRole !== 'sales' && (
                  <button
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    onClick={() =>
                      handleViewLaserDesignFiles(selectedTaskForView.product_id)
                    }
                  >
                    View DXF Files
                  </button>
                )}
              </>

              <>
                {userRole !== 'sales' && (
                  <button
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                    onClick={() =>
                      handleViewPdfDocuments(selectedTaskForView.product_id)
                    }
                  >
                    View PDF Documents
                  </button>
                )}
              </>
            </div>
            <button
              className="mt-4 w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              onClick={closeViewPopup}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {popupMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          {popupMessage}
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

      {isAddRevisionPopupOpen && selectedTaskForRevision && (
        <AddRevisionPopup
          task={selectedTaskForRevision}
          onClose={() => setAddRevisionPopupOpen(false)}
        />
      )}
    </div>
  );
};

export default VendorList;
