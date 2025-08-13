    <div className="overflow-auto max-h-96 border rounded-lg bg-white shadow relative">
        <table className="w-full table-auto">
          <thead className="sticky top-0 bg-gray-200 z-10">
            <tr className="text-left ">
              <th className="py-4 px-4">Product Name</th>
              <th className="py-4 px-4">Version</th>
              <th className="py-4 px-4">Doc</th>
              {userRole !== 'designer' && (
                <th className="py-4 px-4">Design Upload</th>
              )}
              <th className="py-4 px-4">Laser</th>
              <th className="py-4 px-4">Status</th>
              {/* <th className="py-4 px-4">D Files</th>
              <th className="py-4 px-4">L Files</th> */}
              <th className="py-4 px-4">
                {userRole === 'designer' ? 'Users' : 'Reassign'}
              </th>
              <th className="py-4 px-8">Action</th>
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
                  <td className="py-4 px-4">{task.product_version}</td>

                  {/* <td className="py-4 px-4">
                 
                    <button
                      className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                      onClick={() => handleViewDocuments(task.product_id)}
                    >
                      View
                    </button>
                  </td> */}

              <td className="py-4 px-4">
                <button
                    className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                    onClick={() => handleViewButtonClick(task)}
                  >
                    View
                  </button>
                  </td>

                  {userRole !== 'designer' && (
                    <td className="py-4 px-2">
                      <button
                        className={`gap-2 inline-flex items-center justify-center rounded-md py-1 px-3 text-center w-24 ${
                          uploadedDesigns[task.product_id]
                            ? 'bg-blue-500 text-white'
                            : 'bg-blue-700 text-white hover:bg-opacity-75'
                        }`}
                        onClick={() => handleFileButtonClick(task)}
                      >
                        {uploadedDesigns[task.product_id]
                          ? 'Reupload'
                          : 'Upload'}
                      </button>
                    </td>                  
                  )}

                  <td className="py-4 px-2">
                  <button
                        className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                        onClick={() => {
                          setUsersPopupOpen(false);
                          setTimeout(() => {
                            setLaserUploadPopupOpen(true);
                            setSelectedTask(task);
                          }, 0);
                        }}
                      >
                        <FontAwesomeIcon icon={faFileUpload} />
                      </button>
                  </td>

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
                  {/* <td className="py-4 px-4">
                    <button
                      className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                      onClick={() => handleFilesButtonClick(task.product_id)}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                      onClick={() => handleLaserDesignsButtonClick(task.product_id)}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </td> */}
                  <td className="py-4 px-4">
                    <button
                      className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                      onClick={() => {
                        closePopups();
                        handleAssignedUsersClick(task);
                      }}
                    >
                      <FontAwesomeIcon icon={faUsers} className="text-white" />
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                  {userRole !== 'designer' && (
                      <button
                        className="bg-blue-500 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                        onClick={() => copyFolderPath(task.product_name)}
                      >
                        <FontAwesomeIcon icon={faCopy} className="text-white" />
                      </button>
                  )}
                      {userRole !== 'designer' && (
                        <button
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
                        className="bg-meta-3 inline-flex items-center justify-center rounded-md py-1 px-3 text-center text-white hover:bg-opacity-75"
                        onClick={() => handleViewActivityLogs(task.product_id)}
                      >
                        <FontAwesomeIcon
                          icon={faClipboardList}
                          className="text-white"
                        />
                      </button>
                      <button
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
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {/* </div> */}
      </div>