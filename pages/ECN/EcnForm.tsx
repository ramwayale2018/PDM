// import { useEffect,useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { BASE_URL } from "../../../public/config.js";

// const EcnForm = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const partNo = searchParams.get("partNo") || "";

//   const [rows, setRows] = useState([{ id: 1, description: "", reason: "" }]);
//   const [description, setDescription] = useState("");


//  //changes by ram
//   const [revision, setRevision] = useState('');
//   const [productId, setProductId] = useState('');




// useEffect(() => {
//   const fetchDescription = async () => {
//     try {
//       const response = await fetch(
//         `${BASE_URL}api/products/description?partNo=${encodeURIComponent(partNo)}`,
//         {
//           credentials: 'include',
//         }
//       );
//       const data = await response.json();
//       if (data.success) {
//         setDescription(data.description);
//         setProductId(data.product_id); 
//         fetchRevision(data.product_id); 
//       } else {
//         alert('Failed to fetch product description: ' + data.message);
//       }
//     } catch (error) {
//       console.error('Error fetching product description:', error);
//       alert('Something went wrong while fetching product description.');
//     }
//   };

//   if (partNo) {
//     fetchDescription();
//   }
// }, [partNo]);



// const fetchRevision = async (productId: string) => {
//   try {
//     const response = await fetch(
//       `${BASE_URL}api/latest-revision/${encodeURIComponent(productId)}`,
//       {
//         credentials: 'include',
//       }
//     );
//     const data = await response.json();
//     console.log('Revision response:', data);
//     if (data.revision !== undefined) {
//       setRevision(data.revision);
//     } else {
//       setRevision('N/A');
//     }
//   } catch (error) {
//     console.error('Error fetching revision:', error);
//     setRevision('N/A');
//   }
// };



//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const formData = {
//       product_id: partNo,
//       description: description,
//       revision:revision,
//       changeDetails: rows.map((row) => ({
//         description_of_change: row.description,
//         reason_of_change: row.reason,
//       })),
//     };

//     try {
//       const response = await fetch(`${BASE_URL}api/ecn`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();
//       if (data.success) {
//         alert("ECN Created Successfully!");
//         setDescription("");
//         setRows([{ id: 1, description: "", reason: "" }]);
//       } else {
//         alert("Error: " + data.message);
//       }
//     } catch (error) {
//       console.error("Error submitting ECN:", error);
//       alert("Something went wrong. Please try again.");
//     }
//   };

//   const addRow = () => {
//     setRows([...rows, { id: rows.length + 1, description: "", reason: "" }]);
//   };

//   const removeRow = (index: number) => {
//     if (rows.length > 1) {
//       setRows(rows.filter((_, i) => i !== index));
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-6 border border-gray-300 shadow-xl bg-white rounded-lg">
//       <h1 className="text-3xl font-extrabold text-center text-gray-800">
//         JAY ENGINEERS
//       </h1>
//       <h2 className="text-xl font-semibold text-center text-gray-600 mt-2">
//         ENGINEERING CHANGE NOTE (Create)
//       </h2>
//       <hr className="mt-3 border-gray-400" />

//       <form onSubmit={handleSubmit}>
//         <div className="mt-6 grid grid-cols-2 gap-x-10 gap-y-4">
//           <div className="col-span-2 flex justify-between">
//             <label className="font-semibold text-gray-700">Part No:</label>
//             <input
//               type="text"
//               className="border border-gray-400 p-2 w-3/4 rounded-md shadow-sm bg-gray-200"
//               value={partNo}
//               readOnly
//             />
//           </div>
//            {/* changes by ram  */}
//           <div className="col-span-2 flex justify-between">
//             <label className="font-semibold text-gray-700">Description:</label>
//             <input
//               type="text"
//               value={description}
//               readOnly
//               className="border border-gray-400 p-2 w-3/4 rounded-md shadow-sm bg-gray-200"
//             />
//           </div>
//           <div className="col-span-2 flex justify-between">
//             <label className="font-semibold text-gray-700">Revision:</label>
//             <input
//               type="text"
//               value={revision}
//               readOnly
//               className="border border-gray-400 p-2 w-3/4 rounded-md shadow-sm bg-gray-200"
//             />
//           </div>
//           {/*  */}
//           {/* <div className="col-span-2 flex justify-between">
//             <label className="font-semibold text-gray-700">Description:</label>
//             <input
//               type="text"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="border border-gray-400 p-2 w-3/4 rounded-md shadow-sm"
//               required
//             />
//           </div> */}
//         </div>

//         <div className="overflow-x-auto mt-6">
//           <table className="w-full border-collapse border border-gray-300 text-left shadow-md rounded-lg">
//             <thead>
//               <tr className="bg-gray-100 text-gray-700">
//                 <th className="border border-gray-300 px-4 py-2 text-center">
//                   Sr. No
//                 </th>
//                 <th className="border border-gray-300 px-4 py-2">
//                   DESCRIPTION OF CHANGE REQUIRED
//                 </th>
//                 <th className="border border-gray-300 px-4 py-2">
//                   REASON OF CHANGE REQUIRED
//                 </th>
//                 <th className="border border-gray-300 px-4 py-2 text-center">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {rows.map((row, index) => (
//                 <tr key={row.id} className="even:bg-gray-50">
//                   <td className="border border-gray-300 px-4 py-2 text-center">
//                     {index + 1}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     <input
//                       type="text"
//                       className="w-full p-2 border border-gray-300 rounded-md"
//                       value={row.description}
//                       onChange={(e) => {
//                         const newRows = [...rows];
//                         newRows[index].description = e.target.value;
//                         setRows(newRows);
//                       }}
//                       required
//                     />
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2">
//                     <input
//                       type="text"
//                       className="w-full p-2 border border-gray-300 rounded-md"
//                       value={row.reason}
//                       onChange={(e) => {
//                         const newRows = [...rows];
//                         newRows[index].reason = e.target.value;
//                         setRows(newRows);
//                       }}
//                       required
//                     />
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2 text-center">
//                     <button
//                       type="button"
//                       className={`text-lg font-bold transition ${
//                         rows.length === 1
//                           ? "text-gray-400 cursor-not-allowed"
//                           : "text-red-500 hover:text-red-700"
//                       }`}
//                       onClick={() => removeRow(index)}
//                       disabled={rows.length === 1}
//                     >
//                       ✖
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="flex justify-start items-center gap-4 mt-4">
//           <button
//             type="button"
//             className="flex items-center bg-green-500 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-green-600 transition"
//             onClick={addRow}
//           >
//             ＋ Add Row
//           </button>
//         </div>

//         <div className="mt-6 flex justify-between">
//           <button
//             type="button"
//             className="px-6 py-2 bg-gray-500 text-white font-bold rounded-md shadow-md hover:bg-gray-600 transition"
//             onClick={() => navigate(-1)}
//           >
//             Back
//           </button>
//           <button
//             type="submit"
//             className="px-6 py-2 bg-green-500 text-white font-bold rounded-md shadow-md hover:bg-green-600 transition"
//           >
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EcnForm;











import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BASE_URL } from '../../../public/config.js';

const EcnForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const partNo = searchParams.get('partNo') || '';

  const [rows, setRows] = useState([{ id: 1, description: '', reason: '' }]);

  //changes by ram
  const [description, setDescription] = useState('');
  const [revision, setRevision] = useState('');
  const [productId, setProductId] = useState('');




useEffect(() => {
  const fetchDescription = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}api/products/description?partNo=${encodeURIComponent(partNo)}`,
        {
          credentials: 'include',
        }
      );
      const data = await response.json();
      if (data.success) {
        setDescription(data.description);
        setProductId(data.product_id); 
        fetchRevision(data.product_id); 
      } else {
        alert('Failed to fetch product description: ' + data.message);
      }
    } catch (error) {
      console.error('Error fetching product description:', error);
      alert('Something went wrong while fetching product description.');
    }
  };

  if (partNo) {
    fetchDescription();
  }
}, [partNo]);



const fetchRevision = async (productId: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}api/latest-revision/${encodeURIComponent(productId)}`,
      {
        credentials: 'include',
      }
    );
    const data = await response.json();
    console.log('Revision response:', data);
    if (data.revision !== undefined) {
      setRevision(data.revision);
    } else {
      setRevision('N/A');
    }
  } catch (error) {
    console.error('Error fetching revision:', error);
    setRevision('N/A');
  }
};


////////



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      product_id: partNo,
      description: description,
      revision:revision,
      changeDetails: rows.map((row) => ({
        description_of_change: row.description,
        reason_of_change: row.reason,
      })),
    };

    try {
      const response = await fetch(`${BASE_URL}api/ecn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        alert('ECN Created Successfully!');
        setRows([{ id: 1, description: '', reason: '' }]);
        navigate(-1);
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error submitting ECN:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const addRow = () => {
    setRows([...rows, { id: rows.length + 1, description: '', reason: '' }]);
  };

  const removeRow = (index: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 border border-gray-300 shadow-xl bg-white rounded-lg">
      <h1 className="text-3xl font-extrabold text-center text-gray-800">
        JAY ENGINEERS
      </h1>
      <h2 className="text-xl font-semibold text-center text-gray-600 mt-2">
        ENGINEERING CHANGE NOTE (Create)
      </h2>
      <hr className="mt-3 border-gray-400" />

      <form onSubmit={handleSubmit}>
        <div className="mt-6 grid grid-cols-2 gap-x-10 gap-y-4">
          <div className="col-span-2 flex justify-between">
            <label className="font-semibold text-gray-700">Part No:</label>
            <input
              type="text"
              className="border border-gray-400 p-2 w-3/4 rounded-md shadow-sm bg-gray-200"
              value={partNo}
              readOnly
            />
          </div>
          {/* changes by ram  */}
          <div className="col-span-2 flex justify-between">
            <label className="font-semibold text-gray-700">Description:</label>
            <input
              type="text"
              value={description}
              readOnly
              className="border border-gray-400 p-2 w-3/4 rounded-md shadow-sm bg-gray-200"
            />
          </div>
          <div className="col-span-2 flex justify-between">
            <label className="font-semibold text-gray-700">Revision:</label>
            <input
              type="text"
              value={revision}
              readOnly
              className="border border-gray-400 p-2 w-3/4 rounded-md shadow-sm bg-gray-200"
            />
          </div>
          {/*  */}
        </div>

        <div className="overflow-x-auto mt-6">
          <table className="w-full border-collapse border border-gray-300 text-left shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border border-gray-300 px-4 py-2 text-center">
                  Sr. No
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  DESCRIPTION OF CHANGE REQUIRED
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  REASON OF CHANGE REQUIRED
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id} className="even:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={row.description}
                      onChange={(e) => {
                        const newRows = [...rows];
                        newRows[index].description = e.target.value;
                        setRows(newRows);
                      }}
                      required
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={row.reason}
                      onChange={(e) => {
                        const newRows = [...rows];
                        newRows[index].reason = e.target.value;
                        setRows(newRows);
                      }}
                      required
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      type="button"
                      className={`text-lg font-bold transition ${
                        rows.length === 1
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-red-500 hover:text-red-700'
                      }`}
                      onClick={() => removeRow(index)}
                      disabled={rows.length === 1}
                    >
                      ✖
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-start items-center gap-4 mt-4">
          <button
            type="button"
            className="flex items-center bg-green-500 text-white font-bold py-2 px-4 rounded-md shadow-md hover:bg-green-600 transition"
            onClick={addRow}
          >
            ＋ Add Row
          </button>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            className="px-6 py-2 bg-gray-500 text-white font-bold rounded-md shadow-md hover:bg-gray-600 transition"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-500 text-white font-bold rounded-md shadow-md hover:bg-green-600 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EcnForm;
