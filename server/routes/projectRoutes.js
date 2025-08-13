import express from 'express';
import multer from 'multer';
import projectController from '../controllers/projectController.js';
import fs from 'fs';
import path from 'path';
import db from '../database/db.js';

const { createProject, fetchProjects, editProject, getProjectsByVendor,
   getProjectActivityLogs, openDesignFile, addFolderPath, addDfxFolderPath, 
   addLibraryFolderPath, addOldDfxFolderPath} = projectController;

const router = express.Router();


const getBaseDir = async () => {
  try {
    const [rows] = await db.query('SELECT folder_path FROM store_folder_path ORDER BY timestamp DESC LIMIT 1');
    if (rows.length > 0) {
      return rows[0].folder_path;
    } else {
      throw new Error('Base directory not found in the database.');
    }
  } catch (err) {
    console.error('Error fetching BASE_DIR:', err);
    throw new Error('Error fetching the base directory: ' + err.message);
  }
};



const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const baseDir = await getBaseDir();
      const projectName = req.body.project_name; 
      let dir = path.join(baseDir, projectName, 'documents');

      if (file.fieldname === 'design_upload') {
        dir = path.join(baseDir, projectName, 'design');
      }

      fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) {
          console.error('Error creating directory:', err);
          return cb(err);
        }
        cb(null, dir); 
      });
    } catch (err) {
      console.error('Error fetching base directory:', err);
      cb(err); 
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); 
  },
});

const upload = multer({ storage });
const multipleUpload = upload.fields([
  { name: 'doc_upload', maxCount: 10 },
  { name: 'design_upload', maxCount: 1 },
]);

// Route to create a project
router.post('/create-project', multipleUpload, createProject);

// Route to get all projects
router.get('/projects', fetchProjects);

// Route to edit a project
router.put('/project/:id', multipleUpload, editProject);

// Route to get projects by vendor
router.get('/project/projectsByVendor', getProjectsByVendor);

// Route to get project activity logs
router.get('/project/project-logs/:projectId', getProjectActivityLogs);

router.post('/add-folder-path', addFolderPath);
router.post('/add-dfx-folder-path', addDfxFolderPath);
router.post('/add-library-folder-path', addLibraryFolderPath);
router.post('/add-old-dfx-folder-path', addOldDfxFolderPath);


export default router;
