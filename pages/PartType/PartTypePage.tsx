// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
// import { BASE_URL } from '../../../public/config.js';

// const PartTypePage = () => {
//     const [partTypes, setPartTypes] = useState([]);
//     const [showPopup, setShowPopup] = useState(false);
//     const [newPartType, setNewPartType] = useState('');
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         fetchPartTypes();
//     }, []);

//     const fetchPartTypes = async () => {
//         try {
//             const response = await axios.get(`${BASE_URL}api/part-types`);
//             setPartTypes(response.data.data);
//         } catch (error) {
//             console.error('Error fetching part types:', error);
//             setError('Failed to load part types.');
//         }
//     };

//     const handleAddPartType = async () => {
//         if (!newPartType.trim()) {
//             setError('Part Type cannot be empty.');
//             return;
//         }

//         try {
//             await axios.post(`${BASE_URL}api/part-types`, { typeName: newPartType });
//             setNewPartType('');
//             setShowPopup(false);
//             fetchPartTypes();
//         } catch (error) {
//             console.error('Error adding part type:', error);
//             setError('Failed to add part type.');
//         }
//     };

//     return (
//         <div className="p-4">
//             <h2 className="text-xl font-bold mb-4">Part Types</h2>

//             {/* Add Part Type Button */}
//             <button
//                 onClick={() => setShowPopup(true)}
//                 className="bg-blue-500 text-white py-2 px-4 rounded-md flex items-center"
//             >
//                 <FontAwesomeIcon icon={faPlus} className="mr-2" />
//                 Add Type
//             </button>

//             {/* Table */}
//             <div className="mt-4 overflow-auto max-h-96 border rounded-lg bg-white shadow">
//                 <table className="w-full table-auto">
//                     <thead className="bg-gray-200">
//                         <tr className="text-left">
//                             <th className="py-3 px-4">Sr. No.</th>
//                             <th className="py-3 px-4">Part Type</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {partTypes.length === 0 ? (
//                             <tr>
//                                 <td colSpan={2} className="text-center py-4">No Part Types Found</td>
//                             </tr>
//                         ) : (
//                             partTypes.map((part, index) => (
//                                 <tr key={part.id}>
//                                     <td className="py-3 px-4">{index + 1}</td>
//                                     <td className="py-3 px-4">{part.type_name}</td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Popup */}
//             {showPopup && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//                     <div className="bg-white p-6 rounded shadow-lg w-1/3">
//                         <h2 className="text-lg font-bold mb-4">Enter Part Type</h2>

//                         {error && <div className="text-red-500 mb-2">{error}</div>}

//                         <input
//                             type="text"
//                             value={newPartType}
//                             onChange={(e) => setNewPartType(e.target.value)}
//                             className="w-full p-2 border border-gray-300 rounded mb-4"
//                             placeholder="Enter Part Type"
//                         />

//                         <div className="flex justify-end gap-2">
//                             <button
//                                 onClick={() => setShowPopup(false)}
//                                 className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handleAddPartType}
//                                 className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//                             >
//                                 Save
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PartTypePage;





























import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';
import { BASE_URL } from '../../../public/config.js';

const PartTypePage = () => {
    const [partTypes, setPartTypes] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [newPartType, setNewPartType] = useState('');
    const [editPartType, setEditPartType] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPartTypes();
    }, []);

    const fetchPartTypes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}api/part-types`);
            setPartTypes(response.data.data);
        } catch (error) {
            console.error('Error fetching part types:', error);
            setError('Failed to load part types.');
        }
    };

    const handleAddOrUpdatePartType = async () => {
        if (!newPartType.trim()) {
            setError('Part Type cannot be empty.');
            return;
        }

        try {
            if (editPartType) {
                // Update Part Type
                await axios.put(`${BASE_URL}api/part-types/${editPartType.id}`, { typeName: newPartType });
            } else {
                // Add New Part Type
                await axios.post(`${BASE_URL}api/part-types`, { typeName: newPartType });
            }

            setNewPartType('');
            setEditPartType(null);
            setShowPopup(false);
            fetchPartTypes();
        } catch (error) {
            console.error('Error saving part type:', error);
            setError('Failed to save part type.');
        }
    };

    const handleEditClick = (part) => {
        setEditPartType(part);
        setNewPartType(part.type_name);
        setShowPopup(true);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Part Types</h2>

            <button
                onClick={() => {
                    setEditPartType(null);
                    setNewPartType('');
                    setShowPopup(true);
                }}
                className="bg-blue-500 text-white py-2 px-4 rounded-md flex items-center"
            >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Add Type
            </button>

            <div className="mt-4 overflow-auto max-h-96 border rounded-lg bg-white shadow">
                <table className="w-full table-auto">
                    <thead className="bg-gray-200">
                        <tr className="text-left">
                            <th className="py-3 px-4">Sr. No.</th>
                            <th className="py-3 px-4">Part Type</th>
                            <th className="py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {partTypes.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="text-center py-4">No Part Types Found</td>
                            </tr>
                        ) : (
                            partTypes.map((part, index) => (
                                <tr key={part.id}>
                                    <td className="py-3 px-4">{index + 1}</td>
                                    <td className="py-3 px-4">{part.type_name}</td>
                                    <td className="py-3 px-4">
                                        <button
                                            onClick={() => handleEditClick(part)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Popup */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h2 className="text-lg font-bold mb-4">{editPartType ? 'Edit Part Type' : 'Enter Part Type'}</h2>

                        {error && <div className="text-red-500 mb-2">{error}</div>}

                        <input
                            type="text"
                            value={newPartType}
                            onChange={(e) => setNewPartType(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            placeholder="Enter Part Type"
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowPopup(false);
                                    setEditPartType(null);
                                }}
                                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddOrUpdatePartType}
                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                            >
                                {editPartType ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PartTypePage;
