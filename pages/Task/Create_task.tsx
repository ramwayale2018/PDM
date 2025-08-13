import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { BASE_URL } from '../../../public/config.js';

const ProductForm = () => {
  const [productName, setProductName] = useState('');
  const [revision, setRevision] = useState('');
  const [assignedUser, setAssignedUser] = useState([{ userId: '' }]);
  const [documents, setDocuments] = useState<File[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [status, setStatus] = useState('pending');
  const [comments, setComments] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [partTypes, setPartTypes] = useState<any[]>([]);
  const [partType, setPartType] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(BASE_URL + 'api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

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

    fetchUsers();
    fetchPartTypes();
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

  // ram changes in this
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setDocuments(files);
    setIsDisabled(true);
  };
  //changes end

  // ram changes in this
  const handleRemoveFile = (index: number) => {
    const updatedFiles = documents.filter((_, i) => i !== index);
    setDocuments(updatedFiles);
    if (updatedFiles.length === 0) {
      setIsDisabled(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  //changes end

  const handleUserChange = (index: number, value: string) => {
    const updatedUsers = assignedUser.map((user, i) =>
      i === index ? { userId: value } : user,
    );
    setAssignedUser(updatedUsers);
  };

  const handleAddUser = () => {
    setAssignedUser([...assignedUser, { userId: '' }]);
  };

  const handleRemoveUser = (index: number) => {
    const updatedUsers = assignedUser.filter((_, i) => i !== index);
    setAssignedUser(updatedUsers);
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   const productData = new FormData();
  //   productData.append('productName', productName);
  //   productData.append('revision', revision);
  //   productData.append('partType', partType);

  //   documents.forEach((file, index) => {
  //     productData.append('files', file);
  //   });

  //   const assignedUserIds = assignedUser.map(user => user.userId).filter(id => id);
  //   if (assignedUserIds.length > 0) {
  //     const parsedAssignedUsers = assignedUserIds.map(userId => parseInt(userId, 10));
  //     productData.append('assignedUser', JSON.stringify(parsedAssignedUsers));
  //     console.log("Assigned Users JSON:", JSON.stringify(parsedAssignedUsers));
  //   } else {
  //     console.error("Invalid format for assigned users:", assignedUser);
  //     return;
  //   }

  //   productData.append('status', status);
  //   productData.append('comments', comments);

  //   try {
  //     await axios.post(BASE_URL + 'api/create-task', productData, {
  //       headers: { 'Content-Type': 'multipart/form-data' },
  //       withCredentials: true,
  //     });
  //     setShowSuccessPopup(true);
  //     setErrorMessage('');
  //     resetForm();
  //   } catch (error) {
  //     console.error('Error creating Part :', error);
  //     if (error.response && error.response.data && error.response.data.message) {
  //       setErrorMessage(error.response.data.message);
  //     } else {
  //       setErrorMessage('An error occurred while creating the Part .');
  //     }
  //   }
  // };

  /// ram changes in this
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadProgress(1);
    setProcessing(false);
    setShowSuccessPopup(false);

    try {
      const existingPartsResponse = await axios.get(
        `${BASE_URL}api/checkProducts`,
      );
      const existingParts = existingPartsResponse.data.data;
      const partExists = existingParts.some(
        (part: any) =>
          part.product_name.toLowerCase() === productName.toLowerCase(),
      );

      if (partExists) {
        setErrorMessage('Part with this name already exists.');
        setUploadProgress(0);
        return;
      }

      const productData = new FormData();
      productData.append('productName', productName);
      productData.append('revision', revision);
      productData.append('partType', partType);

      documents.forEach((file) => {
        productData.append('files', file);
      });

      const assignedUserIds = assignedUser
        .map((user) => user.userId)
        .filter((id) => id);
      if (assignedUserIds.length > 0) {
        productData.append(
          'assignedUser',
          JSON.stringify(assignedUserIds.map((userId) => parseInt(userId, 10))),
        );
      } else {
        console.error('Invalid format for assigned users:', assignedUser);
        setUploadProgress(0);
        return;
      }

      productData.append('status', status);
      productData.append('comments', comments);

      await axios.post(BASE_URL + 'api/create-task', productData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percent);

          if (percent === 100) {
            setProcessing(true); // Show processing after upload completed
          }
        },
      });

      setShowSuccessPopup(true);
      setErrorMessage('');
      resetForm();
      setUploadProgress(0);
      setProcessing(false);
    } catch (error) {
      console.error('Error creating Part:', error);
      setErrorMessage(
        error.response?.data?.message ||
          'An error occurred while creating the Part.',
      );
      setUploadProgress(0);
      setProcessing(false);
    }
  };
  //changes end

  const resetForm = () => {
    setProductName('');
    setRevision('');
    setDocuments([]);
    setAssignedUser([{ userId: '' }]);
    setStatus('pending');
    setComments('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (productName.trim() === '') {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const response = await axios.get(
          `${BASE_URL}api/products/suggestions`,
          {
            params: { query: productName },
          },
        );
        setSuggestions(response.data);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    // Debounce the API call
    const debounceTimer = setTimeout(fetchSuggestions, 300); // 300ms delay
    return () => clearTimeout(debounceTimer);
  }, [productName]);

  return (
    <>
      <Breadcrumb pageName="Create Part " />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1 m-5">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Create Part{' '}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="p-5">
            <div className="mb-4">
              <div className="flex gap-4">
                <div className="w-1/2 relative">
                  <label className="mb-2 block text-black dark:text-white">
                    Enter Part No
                  </label>
                  <input
                    id="partName"
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter Part Name"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 text-black outline-none focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
                    onBlur={() =>
                      setTimeout(() => setShowSuggestions(false), 200)
                    }
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-md mt-1 max-h-48 overflow-y-auto">
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="p-2 text-black bg-whiten hover:bg-gray-300 border-b-2 cursor-pointer transition-colors duration-200"
                          onClick={() => {
                            setProductName(suggestion);
                            setShowSuggestions(false);
                          }}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="w-1/2">
                  <label
                    className="mb-2 block text-black dark:text-white"
                    htmlFor="revision"
                  >
                    Enter Revision
                  </label>
                  <input
                    id="revision"
                    type="text"
                    value={revision}
                    onChange={(e) => setRevision(e.target.value)}
                    placeholder="Enter Revision"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 text-black outline-none focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-black dark:text-white">
                Part Description
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                placeholder="Add any comments here..."
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              ></textarea>
            </div>

            {/* ram changes in this  */}
            <div className="mb-4">
              <label className="mb-2 block text-black dark:text-white">
                Document Upload
              </label>
              <input
                type="file"
                name="files"
                multiple
                onChange={handleFileChange}
                ref={fileInputRef}
                disabled={isDisabled}
                required
                className="w-full rounded border-[1.5px] border-stroke py-2 px-4 bg-transparent text-black focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
              />
            </div>
            {/*  changes end */}

            {documents.length > 0 && (
              <div>
                <h3>Selected Files:</h3>
                <ul>
                  {documents.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span>{file.name}</span>
                      <button
                        type="button"
                        className="text-red-500"
                        onClick={() => handleRemoveFile(index)}
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mb-4">
              <label className="mb-2 block text-black dark:text-white">
                Assign Users
              </label>
              {assignedUser.map((user, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <select
                    value={user.userId}
                    onChange={(e) => handleUserChange(index, e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke py-2 px-4 bg-transparent text-black focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
                  >
                    <option value="">Select a user</option>

                    {users
                      .filter((u) => u.role === 'designer')
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.role})
                        </option>
                      ))}
                  </select>
                  {assignedUser.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveUser(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddUser}
                className="mt-2 text-blue-500 hover:text-blue-700"
              >
                + Add Another User
              </button>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-black dark:text-white">
                Part Type
              </label>
              <select
                value={partType}
                onChange={(e) => setPartType(e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke py-2 px-4 bg-transparent text-black focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
              >
                <option value="">Select a part type</option>
                {partTypes?.map((type) => (
                  <option key={type.id} value={type.type_name}>
                    {type.type_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 flex space-x-4 justify-end">
              {/* ram  changes in this  */}
              <button
                type="submit"
                disabled={
                  (uploadProgress > 0 && uploadProgress < 100) || processing
                }
                className={`bg-primary text-white py-2 px-4 rounded transition 
    ${
      (uploadProgress > 0 && uploadProgress < 100) || processing
        ? 'opacity-60 cursor-not-allowed'
        : 'hover:bg-opacity-90'
    }`}
              >
                {uploadProgress > 0 && uploadProgress < 100
                  ? `Uploading ${uploadProgress}%`
                  : processing
                  ? 'Processing...'
                  : 'Create Part'}
              </button>
              {/* changes end */}
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-opacity-90 transition"
              >
                Reset
              </button>
            </div>
          </form>

          {showSuccessPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-lg font-bold mb-4">
                  Part Created Successfully!
                </h2>
                <button
                  onClick={() => {
                    setShowSuccessPopup(false);
                    navigate('/task/task-list');
                  }}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-lg font-bold mb-4">{errorMessage}</h2>
                <button
                  onClick={() => setErrorMessage('')}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductForm;
