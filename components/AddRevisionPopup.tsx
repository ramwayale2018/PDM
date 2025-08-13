// // AddRevisionPopup.tsx
// import React, { useState } from 'react';
// import axios from 'axios';
// import { BASE_URL } from '../../public/config.js';

// const AddRevisionPopup = ({ task, onClose }) => {
//   const [revision, setRevision] = useState('');
//   const [files, setFiles] = useState<File[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setFiles(Array.from(e.target.files));
//     }
//   };

//   const handleSubmit = async () => {
//     if (!revision || files.length === 0) {
//       alert('Please enter a revision and upload at least one file.');
//       return;
//     }

//     setIsSubmitting(true);

//     const formData = new FormData();
//     formData.append('productId', task.product_id.toString());
//     formData.append('revision', revision);
//     formData.append('productName', task.product_name); 
//     files.forEach((file) => formData.append('files', file));

//     try {
//       const response = await axios.post(`${BASE_URL}api/add-revision`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         withCredentials: true,
//       });

//       alert(response.data.message);
//       onClose();
//       window.location.reload(); 
//     } catch (error) {
//       console.error('Error adding revision:', error);
//       alert('Failed to add revision.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-999 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//         <h2 className="text-xl font-bold mb-4">Add Revision</h2>
//         <input
//           type="text"
//           placeholder="Enter Revision"
//           className="w-full p-2 border border-gray-300 rounded mb-4"
//           value={revision}
//           onChange={(e) => setRevision(e.target.value)}
//         />
//         <input
//           type="file"
//           multiple
//           className="w-full p-2 border border-gray-300 rounded mb-4"
//           onChange={handleFileChange}
//         />
//         <div className="flex justify-end gap-2">
//           <button
//             className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//             onClick={onClose}
//             disabled={isSubmitting}
//           >
//             Cancel
//           </button>
//           <button
//             className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//             onClick={handleSubmit}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? 'Submitting...' : 'Submit'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddRevisionPopup;











// AddRevisionPopup.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../public/config.js';

const AddRevisionPopup = ({ task, onClose }) => {
  const [revision, setRevision] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  const handleSubmit = async () => {
    if (!revision || files.length === 0) {
      alert('Please enter a revision and upload at least one file.');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('productId', task.product_id.toString());
    formData.append('revision', revision);
    formData.append('productName', task.product_name); 
    files.forEach((file) => formData.append('files', file));

    try {
      const response = await axios.post(`${BASE_URL}api/add-revision`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      alert(response.data.message);
      onClose();
      window.location.reload(); 
    } catch (error) {
      console.error('Error adding revision:', error);
      alert('Failed to add revision.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add Revision</h2>
        <input
          type="text"
          placeholder="Enter Revision"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={revision}
          onChange={(e) => setRevision(e.target.value)}
        />
        <input
          type="file"
          multiple
          className="w-full p-2 border border-gray-300 rounded mb-4"
          onChange={handleFileChange}
        />
        <div className="mb-4">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between mb-2">
              <span>{file.name}</span>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleRemoveFile(index)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRevisionPopup;