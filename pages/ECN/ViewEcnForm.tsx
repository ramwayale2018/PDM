// import { useEffect, useState } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { BASE_URL } from '../../../public/config.js';

// const ViewEcnForm = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const partNo = searchParams.get('partNo') || '';
//   const [ecnData, setEcnData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [status, setStatus] = useState('Requested');
//   const [description, setDescription] = useState('');

//   const fetchEcnDetails = async () => {
//     if (!partNo) return;
//     try {
//       const response = await fetch(`${BASE_URL}api/ecn/product/${partNo}`, {
//         method: 'GET',
//         credentials: 'include',
//       });
//       const data = await response.json();
//       if (data.success) {
//         setEcnData(data.ecn);
//         setStatus(data.ecn.status || 'Requested');
//         setDescription(data.ecn.description || '');
//       } else {
//         setEcnData(null);
//       }
//     } catch (error) {
//       console.error('Error fetching ECN details:', error);
//       setEcnData(null);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchEcnDetails();
//   }, [partNo]);

//   const updateEcn = async () => {
//     if (!ecnData) return;

//     try {
//       const response = await fetch(
//         `${BASE_URL}api/ecn/update/${ecnData.ecn_id}`,
//         {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           credentials: 'include',
//           body: JSON.stringify({ status, description }),
//         },
//       );

//       const result = await response.json();

//       if (result.success) {
//         alert('ECN updated successfully!');

//         setEcnData((prev) => ({
//           ...prev,
//           status: result.updatedStatus || status,
//         }));
//         setStatus(result.updatedStatus || status);
//       } else {
//         alert('Failed to update ECN: ' + result.message);
//       }
//     } catch (error) {
//       console.error('Error updating ECN:', error);
//       alert('An error occurred while updating the ECN.');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-lg font-semibold">Loading ECN details...</p>
//       </div>
//     );
//   }

//   if (!ecnData) {
//     return (
//       <div className="flex flex-col justify-center items-center min-h-screen">
//         <p className="text-lg font-semibold text-red-500">No ECN found</p>
//         <button
//           type="button"
//           className="mt-4 px-6 py-2 bg-gray-500 text-white font-bold rounded-md shadow-md hover:bg-gray-600 transition"
//           onClick={() => navigate(-1)}
//         >
//           Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-6 border border-gray-300 shadow-xl bg-white rounded-lg">
//       <h1 className="text-3xl font-extrabold text-center text-gray-800">
//         JAY ENGINEERS
//       </h1>
//       <h2 className="text-xl font-semibold text-center text-gray-600 mt-2">
//         ENGINEERING CHANGE NOTE
//       </h2>
//       <hr className="mt-3 border-gray-400" />

//       <div className="mt-6 grid grid-cols-2 gap-x-10 gap-y-4">
//         <div className="col-span-2 flex justify-between">
//           <label className="font-semibold text-gray-700">Part NO:</label>
//           <div className="border border-gray-400 p-2 w-3/4 rounded-md shadow-sm bg-gray-200">
//             {ecnData.product_name}
//           </div>
//         </div>

//         <div className="col-span-2 flex justify-between">
//           <label className="font-semibold text-gray-700">Description:</label>
//           <textarea
//             className="border border-gray-400 p-2 w-3/4 rounded-md shadow-sm bg-white"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             rows={3}
//             readOnly
//           />
//         </div>
//       </div>

//       <div className="overflow-x-auto mt-6">
//         <table className="table-auto border-collapse border border-gray-300 text-left shadow-md rounded-lg w-full">
//           <thead>
//             <tr className="bg-gray-100 text-gray-700">
//               <th className="border border-gray-300 px-4 py-2 text-center w-16">
//                 Sr. No
//               </th>
//               <th className="border border-gray-300 px-4 py-2 w-1/2">
//                 DESCRIPTION OF CHANGE REQUIRED
//               </th>
//               <th className="border border-gray-300 px-4 py-2 w-1/2">
//                 REASON OF CHANGE REQUIRED
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {ecnData.changeDetails.length > 0 ? (
//               ecnData.changeDetails.map((change: any, index: number) => (
//                 <tr key={index} className="even:bg-gray-50">
//                   <td className="border border-gray-300 px-4 py-2 text-center w-16">
//                     {index + 1}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2 break-words whitespace-normal">
//                     {change.description_of_change}
//                   </td>
//                   <td className="border border-gray-300 px-4 py-2 break-words whitespace-normal">
//                     {change.reason_of_change}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan={3}
//                   className="border border-gray-300 px-4 py-2 text-center text-gray-500"
//                 >
//                   No changes recorded.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <div className="mt-6 flex justify-between">
//         <button
//           type="button"
//           className="px-6 py-2 bg-gray-500 text-white font-bold rounded-md shadow-md hover:bg-gray-600 transition"
//           onClick={() => navigate(-1)}
//         >
//           Back
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ViewEcnForm;



import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BASE_URL } from '../../../public/config.js';

const ViewEcnForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const partNo = searchParams.get('partNo') || '';
  const [ecnData, setEcnData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Requested');
  const [description, setDescription] = useState('');
  const [revision, setRevision] = useState(0);

  const fetchEcnDetails = async () => {
    if (!partNo) return;
    try {
      const response = await fetch(`${BASE_URL}api/ecn/product/${partNo}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      console.log(data, 'ecn data');
      if (data.success) {
        setEcnData(data.ecn);
        setStatus(data.ecn.status || 'Requested');
        setDescription(data.ecn.description || '');
        setRevision(
          data.ecn.revision !== undefined && data.ecn.revision !== null
            ? data.ecn.revision
            : 0,
        );
      } else {
        setEcnData(null);
      }
    } catch (error) {
      console.error('Error fetching ECN details:', error);
      setEcnData(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEcnDetails();
  }, [partNo]);

  const updateEcn = async () => {
    if (!ecnData) return;

    try {
      const response = await fetch(
        `${BASE_URL}api/ecn/update/${ecnData.ecn_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ status, description }),
        },
      );

      const result = await response.json();

      if (result.success) {
        alert('ECN updated successfully!');

        setEcnData((prev) => ({
          ...prev,
          status: result.updatedStatus || status,
        }));
        setStatus(result.updatedStatus || status);
      } else {
        alert('Failed to update ECN: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating ECN:', error);
      alert('An error occurred while updating the ECN.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">Loading ECN details...</p>
      </div>
    );
  }

  if (!ecnData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-red-500">No ECN found</p>
        <button
          type="button"
          className="mt-4 px-6 py-2 bg-gray-500 text-white font-bold rounded-md shadow-md hover:bg-gray-600 transition"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 border border-gray-300 shadow-xl bg-white rounded-lg">
      <h1 className="text-3xl font-extrabold text-center text-gray-800">
        JAY ENGINEERS
      </h1>
      <h2 className="text-xl font-semibold text-center text-gray-600 mt-2">
        ENGINEERING CHANGE NOTE
      </h2>
      <hr className="mt-3 border-gray-400" />

      <div className="mt-6 grid grid-cols-2 gap-x-10 gap-y-4">
        <div className="col-span-2 flex justify-between">
          <label className="font-semibold text-gray-700">Part NO:</label>
          <div className="border border-gray-400 p-2 w-3/4 rounded-md shadow-sm bg-gray-200">
            {ecnData.product_name}
          </div>
        </div>

        <div className="col-span-2 flex justify-between">
          <label className="font-semibold text-gray-00">Part Description:</label>
          <textarea
            className="border border-gray-400 p-2 w-3/4 rounded-md shadow-sm bg-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            readOnly
          />
        </div>
        <div className="col-span-2 flex justify-between">
          <label className="font-semibold text-gray-700">Revision:</label>
          <textarea
            className="border border-gray-400 p-2 w-3/4 rounded-md shadow-sm bg-white"
            value={revision.toString()}
            onChange={(e) => setRevision(Number(e.target.value))}
            rows={1}
            readOnly
          />
        </div>
      </div>

      <div className="overflow-x-auto mt-6">
        <table className="table-auto border-collapse border border-gray-300 text-left shadow-md rounded-lg w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border border-gray-300 px-4 py-2 text-center w-16">
                Sr. No
              </th>
              <th className="border border-gray-300 px-4 py-2 w-1/2">
                DESCRIPTION OF CHANGE REQUIRED
              </th>
              <th className="border border-gray-300 px-4 py-2 w-1/2">
                REASON OF CHANGE REQUIRED
              </th>
            </tr>
          </thead>
          <tbody>
            {ecnData.changeDetails.length > 0 ? (
              ecnData.changeDetails.map((change: any, index: number) => (
                <tr key={index} className="even:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-center w-16">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 break-words whitespace-normal">
                    {change.description_of_change}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 break-words whitespace-normal">
                    {change.reason_of_change}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                >
                  No changes recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          className="px-6 py-2 bg-gray-500 text-white font-bold rounded-md shadow-md hover:bg-gray-600 transition"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewEcnForm;
