import React, { useState, useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faHistory,
  faClipboardList,
  faCopy,
  faUsers,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { BASE_URL } from '../../../public/config.js';
import { useNavigate } from 'react-router-dom';

interface Task {
ecn_id: number;
product_id: number;
productName: string;
type: string;
revision: string;
product_version: number;
status: string;
description: string;
assignedUsers: string;
assignedRoles: string;
}

const RequestedEcnList: React.FC = () => {
  const [products, setProducts] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [isUploadPopupOpen, setUploadPopupOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isUsersPopupOpen, setUsersPopupOpen] = useState(false);
  const [selectedAssignedUsers, setSelectedAssignedUsers] = useState<string[]>(
    [],
  );
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [reassignedUsers, setReassignedUsers] = useState<string[]>([]);
  const [showAddUserDropdown, setShowAddUserDropdown] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [showActivityLogPopup, setShowActivityLogPopup] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [isViewPopupOpen, setIsViewPopupOpen] = useState(false);
  const [selectedTaskForView, setSelectedTaskForView] = useState<Task | null>(
    null,
  );
  const [showStatusActivityLogPopup, setShowStatusActivityLogPopup] =
    useState(false);
  const [statusActivityLogs, setStatusActivityLogs] = useState<any[]>([]);
  const [isEditPopupOpen, setEditPopupOpen] = useState(false);
  const [selectedEcn, setSelectedEcn] = useState<{ ecn_id: number; status: string; description: string } | null>(null);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

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

  const fetchAvailableUsers = async () => {
    try {
      const response = await axios.get(BASE_URL + 'api/users');
      setAvailableUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/ecnParts/requested`, {
        withCredentials: true,
      });
  
      console.log(response.data);
  
      const { data } = response;
  
      if (Array.isArray(data)) {
        const formattedData: Task[] = data.map((item) => ({
          ecn_id: item.ecn_id,
          product_id: item.product_id,
          productName: item.product_name,
          type: item.type,
          revision: item.revision,
          product_version: item.product_version,
          status: item.status,
          description: item.description,
          assignedUsers: item.assignedUsers,
          assignedRoles: item.assignedRoles,
        }));
  
        setProducts(formattedData);
      } else {
        console.error('Invalid data structure received:', data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };
  

  useEffect(() => {
    fetchAvailableUsers();
    fetchProducts();
  }, []);


  const handleAssignedUsersClick = (task: Task) => {
    const assignedUsers = task?.assignedUsers || '';
    console.log('Assigned Users:', assignedUsers);

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
      fetchProducts();
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

  const filteredProducts = products.filter((product) =>
    [product.productName, product.type, product.revision].some(
      (field) => field?.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );


  const closeViewPopup = () => {
    setIsViewPopupOpen(false);
    setSelectedTaskForView(null);
  };

  const handleViewButtonClick = (task: Task) => {
    setSelectedTaskForView(task);
    setIsViewPopupOpen(true);
  };

  const handleViewDocuments = (productId: number) => {
    navigate(`/products/${productId}/documents`);
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

  const handleViewPdfDocuments = (productId: number) => {
    navigate(`/products/${productId}/pdf-documents`);
    closeViewPopup();
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

  const handleUpdateEcn = async () => {
    if (!selectedEcn) return;
  
    try {
      const response = await axios.put(
        `${BASE_URL}api/ecn/update/${selectedEcn.ecn_id}`,
        {
          status: updatedStatus,
          description: updatedDescription,
        },
        { withCredentials: true }
      );
  
      if (response.data.success) {
        setPopupMessage("ECN updated successfully!");
        setTimeout(() => setPopupMessage(null), 3000);
        fetchProducts();
        closeEditPopup();
      } else {
        console.error("Failed to update ECN:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating ECN:", error);
    }
  };
  

const openEditPopup = (ecn: any) => {
    setSelectedEcn(ecn);
    setUpdatedStatus(ecn.status);
    setUpdatedDescription(ecn.description);
    setEditPopupOpen(true);
  };
  
  const closeEditPopup = () => {
    setEditPopupOpen(false);
    setSelectedEcn(null);
  };

  const handleViewEcnActivity = async (ecn_id: number) => {
    try {
      const response = await axios.get(`${BASE_URL}api/ecn/activity/${ecn_id}`);
      
      if (response.data.success) {
        setStatusActivityLogs(response.data.data);
        setShowStatusActivityLogPopup(true); 
      } else {
        console.error("Failed to fetch activity logs");
      }
    } catch (error) {
      console.error("Error fetching ECN activity logs:", error);
    }
  };
  

  return (
    <div className="p-4">
      <Breadcrumb pageName="Requested ECN List" />
      <input
        type="text"
        placeholder="Search ECN Parts"
        className="p-2 border border-gray-300 rounded w-half mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-auto max-h-96 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-0">
        <table className="w-full table-auto">
          <thead className="sticky top-0 bg-gray-200 z-10">
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="py-4 px-4">Part No</th>
              <th className="py-4 px-4">Type</th>
              <th className="py-4 px-4">Revision</th>
              <th className="py-4 px-4">Version</th>
              <th className="py-4 px-4">View Files</th>
              <th className="py-4 px-4">ECN Status</th>
              <th className="py-4 px-4">Reassign</th>
              <th className="py-4 px-4">View ECN</th>
              <th className="py-4 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No Products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.product_id}>
                  <td className="border-b border-[#eee] py-3 px-4">
                    {product.productName}
                  </td>
                  <td className="py-4 px-4">{product.type}</td>
                  <td className="py-4 px-4">{product.revision}</td>
                  <td className="py-4 px-4">{product.product_version}</td>
                  <td className="py-4 px-4">
                    <button
                      className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                      onClick={() => handleViewButtonClick(product)}
                    >
                      View
                    </button>
                  </td>
                  <td className="py-2 px-4 text-sm">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm ${
                        product.status === 'requested'
                          ? 'bg-gray-300 text-gray-600'
                          : product.status === 'approved'
                          ? 'bg-blue-300 text-blue-600'
                          : product.status === 'reject'
                          ? 'bg-orange-300 text-orange-600'
                          : 'bg-danger text-danger'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <button
                      className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                      onClick={() => {
                        closePopups();
                        handleAssignedUsersClick(product);
                      }}
                    >
                      <FontAwesomeIcon icon={faUsers} className="text-white" />
                    </button>
                  </td>

                  <td className="py-4 px-4">
                    <button
                    title='View ECN'
                      className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                      onClick={() =>
                        navigate(
                          `/view-ecn-form?partNo=${product.product_id}&readonly=true`,
                        )
                      }
                    >
                      <FontAwesomeIcon icon={faEye} className="text-white" />
                    </button>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {userRole !== 'designer' && (
                        <button
                        title='Copy Path'
                          className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                          onClick={() => copyFolderPath(product.productName)}
                        >
                          <FontAwesomeIcon
                            icon={faCopy}
                            className="text-white"
                          />
                        </button>
                      )}

                      <button
                        title="Edit ECN"
                        onClick={() => openEditPopup(product)}
                        className="bg-yellow-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                        >
                        <FontAwesomeIcon icon={faEdit} className="text-white" />
                        </button>

                      <button
                      title='Activity Log'
                        className="bg-meta-3 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                        onClick={() =>
                          handleViewActivityLogs(product.product_id)
                        }
                      >
                        <FontAwesomeIcon
                          icon={faClipboardList}
                          className="text-white"
                        />
                      </button>

                      <button
                        title="ENC Activity Log"
                        onClick={() => handleViewEcnActivity(product.ecn_id)}
                        className="bg-green-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                        >
                        <FontAwesomeIcon icon={faHistory} className="text-white" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isEditPopupOpen && selectedEcn && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-999">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-semibold mb-4">Edit ECN Status</h2>
      
      {/* Status Dropdown */}
      <label className="block mb-2">Status:</label>
      <select
        className="w-full p-2 border rounded"
        value={updatedStatus}
        onChange={(e) => setUpdatedStatus(e.target.value)}
      >
        <option value="requested">Requested</option>
        <option value="approved">Approved</option>
        <option value="reject">Rejected</option>
      </select>

      {/* Description Input */}

      {/* <label className="block mt-4 mb-2">Description:</label>
      <textarea
        className="w-full p-2 border rounded"
        value={updatedDescription}
        readOnly
        onChange={(e) => setUpdatedDescription(e.target.value)}
      /> */}

      {/* Buttons */}
      <div className="flex justify-end mt-4">
        <button className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={closeEditPopup}>
          Cancel
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleUpdateEcn}>
          Update
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
                  Save Changes
                </button>
              )}
            </div>
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
                      {/* <th className="py-3 px-4 border-b text-left">File Path</th> */}
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

        {showStatusActivityLogPopup && (
        <div className="fixed inset-0 z-999 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                ECN Activity Logs
            </h2>

            {statusActivityLogs.length > 0 ? (
                <div className="overflow-x-auto max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead>
                    <tr className="bg-gray-100 text-gray-600 text-sm font-medium">
                        <th className="py-3 px-4 border-b text-left">Name</th>
                        <th className="py-3 px-4 border-b text-left">Role</th>
                        <th className="py-3 px-4 border-b text-left">Action</th>
                        <th className="py-3 px-4 border-b text-left">Timestamp</th>
                    </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                    {statusActivityLogs.map((log, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 border-b">{log.user_name}</td>
                        <td className="py-3 px-4 border-b">{log.role}</td>
                        <td className="py-3 px-4 border-b">{log.action}</td>
                        <td className="py-3 px-4 border-b">
                        {new Date(log.action_at).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true, 
                            })}
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            ) : (
                <div className="text-center text-gray-600 py-4">No activity found</div>
            )}

            <div className="flex justify-end mt-4">
                <button
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none"
                onClick={() => setShowStatusActivityLogPopup(false)}
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

    </div>
  );
};

export default RequestedEcnList;
