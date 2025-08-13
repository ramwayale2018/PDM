import  mysql from 'mysql2';
import db from '../database/db.js';
import  { promisify } from 'util';



// const insertProject = async (projectData) => {
//   const sql = `
//     INSERT INTO projects (
//       project_name, vendor_name, project_description, doc_upload, 
//       start_date, end_date, status, comment, design_upload
//     ) 
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   const {
//     project_name,
//     vendor_name,
//     project_description,
//     doc_upload,
//     start_date,
//     end_date,
//     status,
//     comment,
//     design_upload,
//   } = projectData;

//   try {
//     // Promisify the query function for async/await
//     const queryAsync = promisify(db.query).bind(db);
//     const result = await queryAsync(sql, [
//       project_name,
//       vendor_name,
//       project_description,
//       JSON.stringify(doc_upload),
//       start_date,
//       end_date,
//       status,
//       comment,
//       design_upload,
//     ]);
//     return result;
//   } catch (err) {
//     console.error('Error in SQL query:', err);
//     throw err; // Pass the error to the controller for handling
//   }
// };







const insertProject = async (projectData) => {
  const sql = `
    INSERT INTO projects (
      project_name, vendor_name, project_description, doc_upload, 
      start_date, end_date, status, comment, design_upload
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const {
    project_name,
    vendor_name,
    project_description,
    doc_upload,
    start_date,
    end_date,
    status,
    comment,
    design_upload,
  } = projectData;

  const connection = await db.getConnection();
  try {
    console.log("Preparing to execute SQL query...");
    const timeout = setTimeout(() => {
      throw new Error("SQL query timed out");
    }, 10000); 

    const [result] = await connection.query(sql, [
      project_name,
      vendor_name,
      project_description,
      JSON.stringify(doc_upload),
      start_date,
      end_date,
      status,
      comment,
      design_upload,
    ]);

    clearTimeout(timeout);
    console.log("SQL query executed successfully:", result);
    return result;
  } catch (err) {
    console.error("Error executing SQL query:", err);
    throw err; 
  } finally {
    connection.release(); 
  }
};









// const getProjects = async () => {
//   const sql = `
//     SELECT 
//       p.*, 
//       pal.design_upload AS latest_design_upload
//     FROM 
//       projects p
//     LEFT JOIN 
//       project_activity_logs pal 
//     ON 
//       p.project_id = pal.project_id
//     WHERE 
//       pal.timestamp = (
//         SELECT MAX(timestamp) 
//         FROM project_activity_logs 
//         WHERE project_id = p.project_id
//       )
//   `;
//   const [results] = await db.query(sql); 
//   return results;
// };












const getProjects = async () => {
  const sql = `
    SELECT 
      p.*, 
      pal.design_upload AS latest_design_upload
    FROM 
      projects p
    LEFT JOIN 
      project_activity_logs pal 
    ON 
      p.project_id = pal.project_id
    AND pal.timestamp = (
        SELECT MAX(timestamp) 
        FROM project_activity_logs 
        WHERE project_id = p.project_id
      )
  `;
  const [results] = await db.query(sql); 
  return results;
};












const updateProject = async (projectId, projectData) => {
  const sql = `
    UPDATE projects 
    SET 
      project_name = ?, 
      vendor_name = ?, 
      project_description = ?, 
      doc_upload = ?, 
      start_date = ?, 
      end_date = ?, 
      status = ?, 
      comment = ?, 
      updated_at = NOW(),
      design_upload = ?
    WHERE project_id = ?
  `;

  const {
    project_name,
    vendor_name,
    project_description,
    doc_upload,
    start_date,
    end_date,
    status,
    comment,
    design_upload
  } = projectData;

  const params = [
    project_name,
    vendor_name,
    project_description,
    JSON.stringify(doc_upload), 
    start_date,
    end_date,
    status,
    comment,
    design_upload,
    projectId
  ];

  try {
    const [result] = await db.query(sql, params);
    return result;
  } catch (error) {
    console.error('SQL update error:', error);
    throw error;
  }
};



const getProjectsGroupedByVendor = async () => {
  const sql = `
    SELECT vendor_name, JSON_ARRAYAGG(JSON_OBJECT(
      'project_id', project_id,
      'project_name', project_name,
      'project_description', project_description,
      'doc_upload', doc_upload,
      'start_date', start_date,
      'end_date', end_date,
      'status', status,
      'comment', comment,
      'created_at', created_at,
      'updated_at', updated_at,
      'design_upload', design_upload
    )) AS projects
    FROM projects
    GROUP BY vendor_name
  `;
  const [result] = await db.query(sql);
  return result.map(row => ({
    vendor_name: row.vendor_name,
    projects: row.projects,
  }));
};


const addFolderPath = async (folderPath) => {
  const query = 'INSERT INTO store_folder_path (folder_path, timestamp) VALUES (?, ?)';
  const timestamp = new Date(); 

  try {
    await db.query(query, [folderPath, timestamp]);
    return { success: true };
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
};


const addDfxFolderPath = async (folderPath) => {
  const query = 'INSERT INTO store_dfx_folder_path (dfx_folder_path, timestamp) VALUES (?, ?)';
  const timestamp = new Date(); 

  try {
    await db.query(query, [folderPath, timestamp]);
    return { success: true };
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
};


const addLibraryFolderPath = async (folderPath) => { 
  const query = 'INSERT INTO store_library_folder_path (library_folder_path, timestamp) VALUES (?, ?)';
  const timestamp = new Date(); 

  try {
    await db.query(query, [folderPath, timestamp]);
    return { success: true };
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
};


const addOldDfxFolderPath = async (folderPath) => { 
  const query = 'INSERT INTO store_old_dfx_folder_path (old_dfx_folder_path, timestamp) VALUES (?, ?)';
  const timestamp = new Date(); 

  try {
    await db.query(query, [folderPath, timestamp]);
    return { success: true };
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
};



export default { 
  insertProject, getProjects, updateProject, getProjectsGroupedByVendor, 
  addFolderPath, addDfxFolderPath, addLibraryFolderPath, addOldDfxFolderPath };
