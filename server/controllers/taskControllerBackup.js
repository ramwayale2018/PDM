import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import db from '../database/db.js';
import { getUserName } from '../controllers/authController.js';
import taskModel from '../models/taskModel.js';
import moment from 'moment';
import AdmZip from 'adm-zip';
import { fileURLToPath } from 'url';
const { insertProduct, getProjects, assignUsersToProduct, updateProduct } = taskModel;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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



const getProjectById = async (projectId) => {
  const query = 'SELECT * FROM projects WHERE project_id = ?';
  // console.log('Executing SQL:', query, 'With parameters:', [projectId]);

  try {
    const [results] = await db.query(query, [projectId]);
    // console.log('Query results:', results);
    
    return results[0];
    
  } catch (err) {
    console.error('Database error:', err);
    throw err; 
  }
};






// const createProduct = async (req, res) => {
//   const { productName, assignedUser , status = 'pending', comments } = req.body; 
//   console.log('Received request to create product:', req.body);
//   const files = req.files;
//   console.log('Received File:', files);

//   // Validation
//   if (!productName ) {
//     console.error('Validation failed:', { productName });
//     return res.status(400).json({ message: 'Product name is required.' });
//   }

//   let users = [];
//   if (assignedUser ) {
//     try {
//       // Parse the assignedUser  string directly
//       const parsedUsers = JSON.parse(assignedUser );
//       if (Array.isArray(parsedUsers)) {
//         users = parsedUsers.map(user => parseInt(user, 10)).filter(id => !isNaN(id));
//       } else {
//         throw new Error('Assigned users is not a valid array.');
//       }
//     } catch (parseError) {
//       console.error('Error parsing assigned users:', parseError.message);
//       return res.status(400).json({ message: 'Invalid format for assigned users.' });
//     }
//   }

//   console.log('Parsed Users:', users);

//   try {
//     // Fetch base directory dynamically
//     const baseDir = await getBaseDir();

//     // Create folder under base directory
//     const productFolder = path.join(baseDir, productName);
//     if (!fs.existsSync(productFolder)) {
//       fs.mkdirSync(productFolder, { recursive: true });
//     }

//     // Handle file uploads
//     const filePaths = [];
//     for (const file of files) {
//       const filePath = path.join(productFolder, file.originalname);
//       fs.writeFileSync(filePath, file.buffer);
//       filePaths.push(filePath);
//     }

//     // Insert product into the database
//     const productId = await insertProduct(productName, filePaths, status, comments);
//     console.log('Product inserted successfully');
    
//     // Assign users to the product
//     if (users.length > 0) {
//       const assignedUsersResult = await assignUsersToProduct(productId, users);
//       console.log('Assigned Users are: ', assignedUsersResult);
//     }

//     res.status(201).json({ message: `Product "${productName}" created successfully.` });
//   } catch (error) {
//     console.error('Error creating product:', error);
//     res.status(500).json({ message: 'An error occurred while creating the product.' });
//   }
// };






const createProduct = async (req, res) => {
  const { productName, assignedUser, status = 'pending', comments } = req.body;
  console.log('Received request to create product:', req.body);
  const files = req.files;
  console.log('Received File:', files);

  // Validation
  if (!productName) {
    console.error('Validation failed:', { productName });
    return res.status(400).json({ message: 'Product name is required.' });
  }

  let users = [];
  if (assignedUser) {
    try {
      // Parse the assignedUser string directly
      const parsedUsers = JSON.parse(assignedUser);
      if (Array.isArray(parsedUsers)) {
        users = parsedUsers.map(user => parseInt(user, 10)).filter(id => !isNaN(id));
      } else {
        throw new Error('Assigned users is not a valid array.');
      }
    } catch (parseError) {
      console.error('Error parsing assigned users:', parseError.message);
      return res.status(400).json({ message: 'Invalid format for assigned users.' });
    }
  }

  console.log('Parsed Users:', users);

  try {
    // Check if a product with the same name already exists
    const [existingProduct] = await db.query(
      'SELECT product_id FROM products WHERE product_name = ?',
      [productName]
    );

    if (existingProduct.length > 0) {
      return res.status(400).json({ message: 'Product with this name already exists.' });
    }

    // Fetch base directory dynamically
    const baseDir = await getBaseDir();

    // Create folder under base directory
    const productFolder = path.join(baseDir, productName);
    if (!fs.existsSync(productFolder)) {
      fs.mkdirSync(productFolder, { recursive: true });
    }

    // Handle file uploads
    const filePaths = [];
    for (const file of files) {
      const filePath = path.join(productFolder, file.originalname);
      fs.writeFileSync(filePath, file.buffer);
      filePaths.push(filePath);
    }

    // Insert product into the database
    const productId = await insertProduct(productName, filePaths, status, comments);
    console.log('Product inserted successfully');

    // Assign users to the product
    if (users.length > 0) {
      const assignedUsersResult = await assignUsersToProduct(productId, users);
      console.log('Assigned Users are: ', assignedUsersResult);
    }

    res.status(201).json({ message: `Product "${productName}" created successfully.` });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'An error occurred while creating the product.' });
  }
};





















const getProjectByIdAsync = async (projectId) => {
  // console.log('Getting project by ID:', projectId);
  try {
    const project = await getProjectById(projectId);
    // console.log('Project fetched:', project);
    return project; 
  } catch (err) {
    console.error('Error fetching project:', err);
    throw err; 
  }
};






// const uploadDesign = async (req, res) => {
//   const { productId, status = "pending", comment = "" } = req.body;
//   const files = req.files;

//   let userId = req.session?.user?.id || req.body.userId;
//   userId = parseInt(userId, 10);

//   if (isNaN(userId)) {
//     console.error('Validation failed: userId is missing or invalid.', { userId });
//     return res.status(400).json({ message: 'Valid User ID is required.' });
//   }

//   if (!productId || !files || files.length === 0) {
//     console.error('Validation failed:', { productId, files });
//     return res.status(400).json({ message: 'Product ID and design files are required.' });
//   }

//   const extractNestedZip = (zipBuffer, targetPath) => {
//     const zip = new AdmZip(zipBuffer);
//     const zipEntries = zip.getEntries();
//     const extractedFiles = [];

//     zipEntries.forEach((entry) => {
//       const fullPath = path.join(targetPath, entry.entryName);

//       if (entry.isDirectory) {
//         fs.mkdirSync(fullPath, { recursive: true });
//       } else {
//         fs.writeFileSync(fullPath, entry.getData());

//         // Check if the extracted file is a ZIP file
//         if (fullPath.endsWith('.zip')) {
//           const nestedZipBuffer = fs.readFileSync(fullPath);
//           const nestedFiles = extractNestedZip(nestedZipBuffer, path.dirname(fullPath));
//           extractedFiles.push(...nestedFiles);

//           // Delete the intermediate nested ZIP file
//           fs.unlinkSync(fullPath);
//         } else {
//           extractedFiles.push(fullPath);
//         }
//       }
//     });

//     return extractedFiles;
//   };

//   try {
//     const results = await db.query('SELECT product_name FROM products WHERE product_id = ?', [productId]);
//     const product = results[0][0];
//     if (!product || !product.product_name) {
//       return res.status(404).json({ message: 'Product not found or product name is missing.' });
//     }
//     const productName = product.product_name;

//     const baseDir = await getBaseDir();
//     if (!baseDir) throw new Error('Base directory could not be retrieved.');

//     const productFolder = path.join(baseDir, productName);
//     if (!fs.existsSync(productFolder)) {
//       return res.status(404).json({ message: 'Product folder does not exist.' });
//     }

//     // Find the latest version folder
//     const versionFolders = fs.readdirSync(productFolder)
//       .filter((folder) => folder.startsWith('designs_v'))
//       .map((folder) => {
//         const version = parseInt(folder.replace('designs_v', ''), 10);
//         return { folder, version };
//       })
//       .sort((a, b) => b.version - a.version);

//     const latestVersionFolder = versionFolders.length > 0 ? versionFolders[0].folder : null;

//     // Determine the target folder
//     let targetFolderPath;
//     if (latestVersionFolder) {
//       // Use the latest version folder
//       targetFolderPath = path.join(productFolder, latestVersionFolder);
//       console.log(`Using existing version folder: ${latestVersionFolder}`);
//     } else {
//       // Use the default designs folder
//       targetFolderPath = path.join(productFolder, 'designs');
//       console.log(`Using default designs folder: designs`);
//     }

//     // Ensure the target folder exists
//     fs.mkdirSync(targetFolderPath, { recursive: true });

//     const filePaths = [];
//     for (const file of files) {
//       const filePath = path.join(targetFolderPath, file.originalname);

//       if (file.mimetype === 'application/zip' || file.originalname.endsWith('.zip')) {
//         try {
//           const extractedFiles = extractNestedZip(file.buffer, targetFolderPath);
//           filePaths.push(...extractedFiles);

//           console.log(`Extracted nested ZIP file: ${file.originalname}`);
//         } catch (zipError) {
//           console.error('Error extracting nested ZIP file:', zipError.message);
//           throw new Error('Failed to extract nested ZIP file.');
//         }
//       } else {
//         try {
//           fs.writeFileSync(filePath, file.buffer);
//           filePaths.push(filePath);
//         } catch (fsError) {
//           console.error('Error saving file:', filePath, fsError.message);
//           throw new Error('Failed to save design file.');
//         }
//       }
//     }

//     for (const filePath of filePaths) {
//       await insertDesignUpload(productId, userId, filePath, status, comment);
//     }

//     res.status(201).json({ message: 'Designs uploaded successfully. Copy the path and paste it in file explorer for accessing the files' });
//   } catch (error) {
//     console.error('Error uploading design:', error.message);
//     res.status(500).json({ message: 'An error occurred while uploading the designs.' });
//   }
// };





// Function to recursively search for a file in a directory









// Function to recursively search for a file in a directory

















const searchFileInDirectory = (dir, fileName) => {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      try {
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          // Recursively search in subdirectories
          if (searchFileInDirectory(filePath, fileName)) {
            return true;
          }
        } else if (file === fileName) {
          // File found
          return true;
        }
      } catch (err) {
        // Skip inaccessible files or directories
        console.error(`Error accessing ${filePath}:`, err.message);
        continue;
      }
    }
  } catch (err) {
    // Skip inaccessible directories
    console.error(`Error searching in directory ${dir}:`, err.message);
  }
  return false;
};


const checkFileExistsInSystem = async (fileName) => {
  const baseDir = await getBaseDir();
  if (!baseDir) {
    throw new Error('Base directory could not be retrieved.');
  }

  // Search for the file within the base directory
  return searchFileInDirectory(baseDir, fileName);
};

const uploadDesign = async (req, res) => {
  const { productId, status = "pending", comment = "" } = req.body;
  const files = req.files;

  let userId = req.session?.user?.id || req.body.userId;
  userId = parseInt(userId, 10);

  if (isNaN(userId)) {
    console.error('Validation failed: userId is missing or invalid.', { userId });
    return res.status(400).json({ message: 'Valid User ID is required.' });
  }

  if (!productId || !files || files.length === 0) {
    console.error('Validation failed:', { productId, files });
    return res.status(400).json({ message: 'Product ID and design files are required.' });
  }

  const extractNestedZip = (zipBuffer, targetPath) => {
    const zip = new AdmZip(zipBuffer);
    const zipEntries = zip.getEntries();
    const extractedFiles = [];

    zipEntries.forEach((entry) => {
      const fullPath = path.join(targetPath, entry.entryName);

      if (entry.isDirectory()) {
        fs.mkdirSync(fullPath, { recursive: true });
      } else {
        fs.writeFileSync(fullPath, entry.getData());

        // Check if the extracted file is a ZIP file
        if (fullPath.endsWith('.zip')) {
          const nestedZipBuffer = fs.readFileSync(fullPath);
          const nestedFiles = extractNestedZip(nestedZipBuffer, path.dirname(fullPath));
          extractedFiles.push(...nestedFiles);

          // Delete the intermediate nested ZIP file
          fs.unlinkSync(fullPath);
        } else {
          extractedFiles.push(fullPath);
        }
      }
    });

    return extractedFiles;
  };

  try {
    const results = await db.query('SELECT product_name FROM products WHERE product_id = ?', [productId]);
    const product = results[0][0];
    if (!product || !product.product_name) {
      return res.status(404).json({ message: 'Product not found or product name is missing.' });
    }
    const productName = product.product_name;

    const baseDir = await getBaseDir();
    if (!baseDir) throw new Error('Base directory could not be retrieved.');

    const productFolder = path.join(baseDir, productName);
    if (!fs.existsSync(productFolder)) {
      return res.status(404).json({ message: 'Product folder does not exist.' });
    }

    // Find the latest version folder
    const versionFolders = fs.readdirSync(productFolder)
      .filter((folder) => folder.startsWith('designs_v'))
      .map((folder) => {
        const version = parseInt(folder.replace('designs_v', ''), 10);
        return { folder, version };
      })
      .sort((a, b) => b.version - a.version);

    const latestVersionFolder = versionFolders.length > 0 ? versionFolders[0].folder : null;

    // Determine the target folder
    let targetFolderPath;
    if (latestVersionFolder) {
      // Use the latest version folder
      targetFolderPath = path.join(productFolder, latestVersionFolder);
      console.log(`Using existing version folder: ${latestVersionFolder}`);
    } else {
      // Use the default designs folder
      targetFolderPath = path.join(productFolder, 'designs');
      console.log(`Using default designs folder: designs`);
    }

    // Ensure the target folder exists
    fs.mkdirSync(targetFolderPath, { recursive: true });

    const filePaths = [];
    for (const file of files) {
      const fileName = file.originalname;

      // Check if the file already exists in the base directory
      if (await checkFileExistsInSystem(fileName)) {
        return res.status(400).json({ message: `File '${fileName}' already exists in the system.` });
      }

      const filePath = path.join(targetFolderPath, fileName);

      if (file.mimetype === 'application/zip' || file.originalname.endsWith('.zip')) {
        try {
          const extractedFiles = extractNestedZip(file.buffer, targetFolderPath);
          filePaths.push(...extractedFiles);

          console.log(`Extracted nested ZIP file: ${fileName}`);
        } catch (zipError) {
          console.error('Error extracting nested ZIP file:', zipError.message);
          throw new Error('Failed to extract nested ZIP file.');
        }
      } else {
        try {
          fs.writeFileSync(filePath, file.buffer);
          filePaths.push(filePath);
        } catch (fsError) {
          console.error('Error saving file:', filePath, fsError.message);
          throw new Error('Failed to save design file.');
        }
      }
    }

    for (const filePath of filePaths) {
      await insertDesignUpload(productId, userId, filePath, status, comment);
    }

    res.status(201).json({ message: 'Designs uploaded successfully. Copy the path and paste it in file explorer for accessing the files' });
  } catch (error) {
    console.error('Error uploading design:', error.message);
    res.status(500).json({ message: 'An error occurred while uploading the designs.' });
  }
};












const insertDesignUpload = async (productId, userId, filePath, status, comment) => {
  try {
    const [userResults] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
    if (userResults.length === 0) {
      throw new Error(`User  ID ${userId} does not exist.`);
    }

    await db.query('INSERT INTO design_upload (product_id, user_id, design_path, status, comment) VALUES (?, ?, ?, ?, ?)', [
      productId,
      userId,
      filePath,
      status, 
      comment,
    ]);
    console.log('Design upload record inserted successfully');
  } catch (error) {
    console.error('Error inserting design upload record:', error.message);
    throw new Error('Failed to insert design upload record');
  }
};




const fetchUploadedDesigns = async (req, res) => {
  const { productId } = req.params;

  // Validate productId
  if (!productId || isNaN(parseInt(productId, 10))) {
    console.error('Validation failed: productId is missing or invalid.', { productId });
    return res.status(400).json({ message: 'Valid Product ID is required.' });
  }

  try {
    // Fetch the uploaded files from the database for the given product ID
    const results = await db.query(
      'SELECT du_id, design_path, status, comment, version FROM design_upload WHERE product_id = ?',
      [productId]
    );

    const uploadedFiles = results[0];
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(404).json({ message: 'No uploaded designs found for the given product.' });
    }

    res.status(200).json({
      message: 'Uploaded designs fetched successfully.',
      files: uploadedFiles.map(file => ({
        du_id: file.du_id,
        designPath: file.design_path,
        status: file.status,
        comment: file.comment,
        version: file.version,
      })),
    });
  } catch (error) {
    console.error('Error fetching uploaded designs:', error.message);
    res.status(500).json({ message: 'An error occurred while fetching uploaded designs.' });
  }
};




const downloadDesign = async (req, res) => {
  const { fileId } = req.params;

  if (!fileId || isNaN(parseInt(fileId, 10))) {
    console.error('Validation failed: fileId is missing or invalid.', { fileId });
    return res.status(400).json({ message: 'Valid File ID is required.' });
  }

  try {
    const [results] = await db.query(
      'SELECT design_path FROM design_upload WHERE du_id = ?',
      [fileId]
    );

    if (results.length === 0) {
      console.error('File not found in the database for fileId:', fileId);
      return res.status(404).json({ message: 'File not found in the database.' });
    }

    const filePath = results[0].design_path;
    console.log('Retrieved filePath from database:', filePath);

    const fileBaseName = path.basename(filePath, path.extname(filePath));
    console.log('Base name of the file:', fileBaseName);

    const dirPath = path.dirname(filePath);
    console.log('Directory path:', dirPath);

    if (!fs.existsSync(dirPath)) {
      console.error('Directory does not exist:', dirPath);
      return res.status(404).json({ message: 'File not found on the server.' });
    }

    const files = fs.readdirSync(dirPath);
    console.log('Files in directory:', files);

    // Remove the version suffix from the base name
    const baseNameWithoutVersion = fileBaseName.replace(/_v\d+$/, '');
    console.log('Base name without version:', baseNameWithoutVersion);

    // Filter files based on base name without version
    let matchingFiles = files.filter(file => file.startsWith(baseNameWithoutVersion));

    if (matchingFiles.length === 0) {
      console.error('No files found for base name:', baseNameWithoutVersion);
      return res.status(404).json({ message: 'File not found on the server.' });
    }

    // Sort files by version (if any)
    matchingFiles.sort((a, b) => {
      const versionA = parseInt(a.match(/_v(\d+)/)?.[1] || 0);
      const versionB = parseInt(b.match(/_v(\d+)/)?.[1] || 0);
      return versionB - versionA;
    });

    const latestFile = path.join(dirPath, matchingFiles[0]);
    console.log('Latest file to download:', latestFile);

    res.download(latestFile, (err) => {
      if (err) {
        console.error('Error downloading file:', err.message);
        res.status(500).json({ message: 'An error occurred while downloading the file.' });
      }
    });
  } catch (error) {
    console.error('Error fetching file:', error.message);
    res.status(500).json({ message: 'An error occurred while fetching the file.' });
  }
};




const downloadFileByPath = async (req, res) => {
  const { filePath } = req.query;

  if (!filePath) {
    console.error('Validation failed: filePath is missing.');
    return res.status(400).json({ message: 'File path is required.' });
  }

  try {
    // Decode the file path
    const decodedFilePath = decodeURIComponent(filePath);

    // Check if the file exists
    if (!fs.existsSync(decodedFilePath)) {
      console.error('File not found:', decodedFilePath);
      return res.status(404).json({ message: 'File not found on the server.' });
    }

    // Send the file for download
    res.download(decodedFilePath, (err) => {
      if (err) {
        console.error('Error downloading file:', err.message);
        res.status(500).json({ message: 'An error occurred while downloading the file.' });
      }
    });
  } catch (error) {
    console.error('Error fetching file:', error.message);
    res.status(500).json({ message: 'An error occurred while fetching the file.' });
  }
};




const downloadLatestVersionZip = async (req, res) => {
  const { productId } = req.params;

  if (!productId || isNaN(parseInt(productId, 10))) {
    console.error('Validation failed: productId is missing or invalid.', { productId });
    return res.status(400).json({ message: 'Valid Product ID is required.' });
  }

  try {
    // Fetch the product name to construct the folder path
    const [productResults] = await db.query(
      'SELECT product_name FROM products WHERE product_id = ?',
      [productId]
    );

    if (productResults.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const productName = productResults[0].product_name;

    // Fetch the base directory
    const baseDir = await getBaseDir();
    const productFolder = path.join(baseDir, productName);

    // Check if the product folder exists
    if (!fs.existsSync(productFolder)) {
      console.error('Product folder does not exist:', productFolder);
      return res.status(404).json({ message: 'Product folder not found on the server.' });
    }

    // Get all version folders
    const versionFolders = fs.readdirSync(productFolder)
      .filter((folder) => folder.startsWith('designs_v'))
      .sort((a, b) => {
        const versionA = parseInt(a.replace('designs_v', ''), 10);
        const versionB = parseInt(b.replace('designs_v', ''), 10);
        return versionB - versionA; // Sort in descending order
      });

    if (versionFolders.length === 0) {
      return res.status(404).json({ message: 'No version folders found.' });
    }

    // Get the latest version folder
    const latestVersionFolder = versionFolders[0];
    const latestVersionFolderPath = path.join(productFolder, latestVersionFolder);

    // Check if the latest version folder exists
    if (!fs.existsSync(latestVersionFolderPath)) {
      console.error('Latest version folder does not exist:', latestVersionFolderPath);
      return res.status(404).json({ message: 'Latest version folder not found on the server.' });
    }

    // Create a zip file
    const zip = new AdmZip();
    zip.addLocalFolder(latestVersionFolderPath);

    // Set the zip file name
    const zipFileName = `${productName}_${latestVersionFolder}.zip`;
    const zipFilePath = path.join(baseDir, 'temp', zipFileName);

    // Ensure the temp directory exists
    if (!fs.existsSync(path.dirname(zipFilePath))) {
      fs.mkdirSync(path.dirname(zipFilePath), { recursive: true });
    }

    // Save the zip file
    fs.writeFileSync(zipFilePath, zip.toBuffer());

    // Send the zip file for download
    res.download(zipFilePath, zipFileName, (err) => {
      if (err) {
        console.error('Error downloading zip file:', err.message);
        res.status(500).json({ message: 'An error occurred while downloading the zip file.' });
      }

      // Delete the temporary zip file after download
      fs.unlinkSync(zipFilePath);
    });
  } catch (error) {
    console.error('Error creating zip file:', error.message);
    res.status(500).json({ message: 'An error occurred while creating the zip file.' });
  }
};





const getAllDesignUploadVersions = async (req, res) => {
  try {
    const query = `
      SELECT 
        duv.duv_id, 
        duv.du_id, 
        duv.product_id, 
        duv.user_id, 
        duv.file_path, 
        duv.timestamp, 
        duv.version, 
        duv.comment, 
        u.name AS user_name,
        p.product_name
      FROM design_upload_version duv
      LEFT JOIN users u ON duv.user_id = u.id
      LEFT JOIN products p ON duv.product_id = p.product_id
      ORDER BY duv.duv_id DESC
    `;

    const [results] = await db.query(query);

    // Check if records exist
    if (results.length === 0) {
      return res.status(404).json({ message: 'No records found in design_upload_version table.' });
    }

    // Return the records
    res.status(200).json({
      message: 'Records fetched successfully.',
      data: results,
    });
  } catch (error) {
    console.error('Error fetching records from design_upload_version table:', error.message);
    res.status(500).json({ message: 'An error occurred while fetching records.' });
  }
};




const getLatestDesignUploadVersions = async (req, res) => {
  try {
    const query = `
      SELECT 
        du.du_id, 
        du.product_id, 
        du.user_id, 
        du.design_path, 
        du.upload_timestamp, 
        du.version, 
        u.name AS user_name,
        p.product_name
      FROM design_upload du
      LEFT JOIN users u ON du.user_id = u.id
      LEFT JOIN products p ON du.product_id = p.product_id
      ORDER BY du.du_id DESC
    `;

    const [results] = await db.query(query);

    if (results.length === 0) {
      return res.status(404).json({ message: 'No records found in design_upload_version table.' });
    }

    res.status(200).json({
      message: 'Records fetched successfully.',
      data: results,
    });
  } catch (error) {
    console.error('Error fetching records from design_upload_version table:', error.message);
    res.status(500).json({ message: 'An error occurred while fetching records.' });
  }
};

























// const uploadNewVersion = async (req, res) => {
//   const { fileId } = req.params; // ID of the file being replaced
//   const file = req.file; // Uploaded file

//   // Validate fileId and file
//   if (!fileId || isNaN(parseInt(fileId, 10))) {
//     return res.status(400).json({ message: 'Valid File ID is required.' });
//   }
//   if (!file) {
//     return res.status(400).json({ message: 'No file uploaded.' });
//   }

//   try {
//     // Check if the user is logged in
//     if (!req.session.user) {
//       return res.status(401).json({ message: 'Unauthorized. Please log in.' });
//     }

//     // Get the logged-in user's user_id
//     const loggedInUserId = req.session.user.id;

//     // Fetch the existing file details from the database
//     const [results] = await db.query(
//       'SELECT design_path, product_id, user_id, status, comment, version FROM design_upload WHERE du_id = ?',
//       [fileId]
//     );

//     if (results.length === 0) {
//       return res.status(404).json({ message: 'File not found.' });
//     }

//     const oldFilePath = results[0].design_path;
//     const productId = results[0].product_id;
//     const userId = results[0].user_id;
//     const status = results[0].status;
//     const comment = results[0].comment;
//     const latestFileVersionFromResults = results[0].version || 0; // Renamed to avoid conflict

//     // Fetch the product name and product_version to construct the folder path
//     const [productResults] = await db.query(
//       'SELECT product_name, product_version FROM products WHERE product_id = ?',
//       [productId]
//     );

//     if (productResults.length === 0) {
//       return res.status(404).json({ message: 'Product not found.' });
//     }

//     const productName = productResults[0].product_name;
//     const productVersion = productResults[0].product_version || 0;

//     // Increment the product_version
//     const newProductVersion = productVersion + 1;

//     // Update the product_version in the products table
//     await db.query(
//       'UPDATE products SET product_version = ? WHERE product_id = ?',
//       [newProductVersion, productId]
//     );

//     const baseDir = await getBaseDir(); // Function to get the base directory
//     const productFolder = path.join(baseDir, productName);

//     // Log folder paths for debugging
//     console.log('Product Folder:', productFolder);

//     // Get the name of the file being replaced
//     const oldFileName = path.basename(oldFilePath);

//     // Fetch the latest version of the file from the database
//     const [latestFileResults] = await db.query(
//       'SELECT du_id, version FROM design_upload WHERE du_id = ? ORDER BY version DESC LIMIT 1',
//       [fileId]
//     );

//     if (latestFileResults.length === 0) {
//       return res.status(404).json({ message: 'Latest version of the file not found.' });
//     }

//     const latestFileId = latestFileResults[0].du_id;
//     const latestFileVersionFromLatestResults = latestFileResults[0].version || 0; // Renamed to avoid conflict

//     // Check if the file being uploaded is the latest version
//     if (parseInt(fileId) !== latestFileId) {
//       return res.status(400).json({ message: 'Please upload the file against the latest version.' });
//     }

//     // Increment the file version based on du_id
//     const newFileVersion = latestFileVersionFromLatestResults + 1;

//     // Create the new version folder
//     const newVersionFolder = path.join(productFolder, `designs_v${newProductVersion}`);
//     fs.mkdirSync(newVersionFolder, { recursive: true });

//     // Log new version folder for debugging
//     console.log('New Version Folder:', newVersionFolder);

//     // Determine the source folder for copying files
//     let sourceFolder;
//     if (productVersion > 0) {
//       sourceFolder = path.join(productFolder, `designs_v${productVersion}`);
//     } else {
//       sourceFolder = path.join(productFolder, 'designs');
//     }

//     // Log source folder for debugging
//     console.log('Source Folder:', sourceFolder);

//     // Check if the source folder exists
//     if (!fs.existsSync(sourceFolder)) {
//       return res.status(404).json({ message: 'Source folder not found.' });
//     }

//     // Copy all files from the source folder to the new version folder
//     fs.readdirSync(sourceFolder).forEach((file) => {
//       const sourcePath = path.join(sourceFolder, file);
//       const destinationPath = path.join(newVersionFolder, file);

//       console.log('Copying file:', sourcePath, 'to', destinationPath);

//       try {
//         fs.copyFileSync(sourcePath, destinationPath);
//       } catch (copyError) {
//         console.error('Error copying file:', copyError.message);
//         throw new Error(`Failed to copy file from ${sourcePath} to ${destinationPath}`);
//       }
//     });

//     // Extract the base name without any version suffix
//     const baseNameWithoutVersion = oldFileName.replace(/_v\d+/, ''); // Remove _v1, _v2, etc.
//     const baseName = path.parse(baseNameWithoutVersion).name; // Get the base name without extension
//     const extension = path.extname(oldFileName); // Get the file extension

//     // Save the new file with the base name in the new version folder
//     const newFilePath = path.join(newVersionFolder, `${baseName}${extension}`); // Save as base name locally
//     fs.writeFileSync(newFilePath, file.buffer);

//     // Create a versioned file name for the database
//     const versionedFileName = `${baseName}${extension}`;

//     // Store the full path in the database
//     const fullFilePath = path.join(newVersionFolder, versionedFileName);

//     // Update the existing record in the design_upload table
//     await db.query(
//       'UPDATE design_upload SET design_path = ?, version = ? WHERE du_id = ?',
//       [fullFilePath, newFileVersion, fileId]
//     );

//     // Insert a new record into the design_upload_version table with the logged-in user's user_id
//     await db.query(
//       'INSERT INTO design_upload_version (du_id, product_id, user_id, file_path, version) VALUES (?, ?, ?, ?, ?)',
//       [fileId, productId, loggedInUserId, fullFilePath, newFileVersion]
//     );

//     // Handle .CATProduct files
//     const catProductFiles = fs.readdirSync(newVersionFolder).filter((file) => file.endsWith('.CATProduct'));

//     if (catProductFiles.length > 0) {
//       console.log('Found .CATProduct files:', catProductFiles);

//       for (const catProductFile of catProductFiles) {
//         const catProductFilePath = path.join(newVersionFolder, catProductFile);

//         // Fetch the existing .CATProduct file record from the database using product_id and file extension
//         const [catProductResults] = await db.query(
//           'SELECT du_id, version FROM design_upload WHERE product_id = ? AND design_path LIKE ? ORDER BY version DESC LIMIT 1',
//           [productId, `%.CATProduct`]
//         );

//         if (catProductResults.length > 0) {
//           const catProductDuId = catProductResults[0].du_id;
//           const latestCatProductVersion = catProductResults[0].version || 0;

//           // Set the version of the .CATProduct file to match the product_version
//           const newCatProductVersion = newProductVersion;

//           // Update the existing .CATProduct file record in the design_upload table
//           await db.query(
//             'UPDATE design_upload SET version = ? WHERE du_id = ?',
//             [newCatProductVersion, catProductDuId]
//           );

//           // Insert a new record into the design_upload_version table for the .CATProduct file with the logged-in user's user_id
//           await db.query(
//             'INSERT INTO design_upload_version (du_id, product_id, user_id, file_path, version) VALUES (?, ?, ?, ?, ?)',
//             [catProductDuId, productId, loggedInUserId, catProductFilePath, newCatProductVersion]
//           );

//           console.log('Updated .CATProduct file version in database:', catProductFilePath);
//         } else {
//           console.error('No matching .CATProduct file found in the database:', catProductFile);
//         }
//       }
//     }

//     res.status(200).json({ message: 'File uploaded successfully.', newFilePath });
//   } catch (error) {
//     console.error('Error uploading new version:', error.message);
//     res.status(500).json({ message: 'An error occurred while uploading the file.' });
//   }
// };




const uploadNewVersion = async (req, res) => {
  console.log('Request params:', req.params); // Log the request params
  console.log('Request body:', req.body); // Log the request body
  console.log('Request file:', req.file); // Log the uploaded file

  const { fileId } = req.params; // Extract fileId from the URL params
  const { comment } = req.body; // Extract comment from the request body
  const file = req.file; // Uploaded file

  // Validate fileId and file
  if (!fileId || isNaN(parseInt(fileId, 10))) {
    console.error('Invalid fileId:', fileId);
    return res.status(400).json({ message: 'Valid File ID is required.' });
  }
  if (!file) {
    console.error('No file uploaded.');
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    // Check if the user is logged in
    if (!req.session.user) {
      console.error('User not logged in.');
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    // Get the logged-in user's user_id
    const loggedInUserId = req.session.user.id;
    console.log('Logged-in user ID:', loggedInUserId);

    // Fetch the existing file details from the database
    const [results] = await db.query(
      'SELECT design_path, product_id, user_id, status, version FROM design_upload WHERE du_id = ?',
      [fileId]
    );

    if (results.length === 0) {
      console.error('File not found in database.');
      return res.status(404).json({ message: 'File not found.' });
    }

    const oldFilePath = results[0].design_path;
    const productId = results[0].product_id;
    const userId = results[0].user_id;
    const status = results[0].status;
    const latestFileVersionFromResults = results[0].version || 0;

    console.log('Existing file details:', {
      oldFilePath,
      productId,
      userId,
      status,
      latestFileVersionFromResults,
    });

    // Fetch the product name and product_version to construct the folder path
    const [productResults] = await db.query(
      'SELECT product_name, product_version FROM products WHERE product_id = ?',
      [productId]
    );

    if (productResults.length === 0) {
      console.error('Product not found in database.');
      return res.status(404).json({ message: 'Product not found.' });
    }

    const productName = productResults[0].product_name;
    const productVersion = productResults[0].product_version || 0;

    console.log('Product details:', {
      productName,
      productVersion,
    });

    // Extract the base name and extension from the old file path
    const oldFileName = path.basename(oldFilePath);
    const baseName = path.parse(oldFileName).name; // Get the base name without extension
    const extension = path.extname(oldFileName); // Get the file extension

    // Validate that the uploaded file has the same name as the old file
    const uploadedFileName = file.originalname;
    const uploadedBaseName = path.parse(uploadedFileName).name; // Get the base name of the uploaded file
    const uploadedExtension = path.extname(uploadedFileName); // Get the extension of the uploaded file

    if (uploadedBaseName !== baseName || uploadedExtension !== extension) {
      console.error('Uploaded file name does not match the existing file name.');
      return res.status(400).json({
        message: `Uploaded file must have the same name as the existing file: ${oldFileName}`,
      });
    }

    // Increment the product_version
    const newProductVersion = productVersion + 1;

    // Update the product_version in the products table
    await db.query(
      'UPDATE products SET product_version = ? WHERE product_id = ?',
      [newProductVersion, productId]
    );

    const baseDir = await getBaseDir();
    const productFolder = path.join(baseDir, productName);

    console.log('Base directory:', baseDir);
    console.log('Product folder:', productFolder);

    // Fetch the latest version of the file from the database
    const [latestFileResults] = await db.query(
      'SELECT du_id, version FROM design_upload WHERE du_id = ? ORDER BY version DESC LIMIT 1',
      [fileId]
    );

    if (latestFileResults.length === 0) {
      console.error('Latest version of the file not found.');
      return res.status(404).json({ message: 'Latest version of the file not found.' });
    }

    const latestFileId = latestFileResults[0].du_id;
    const latestFileVersionFromLatestResults = latestFileResults[0].version || 0;

    console.log('Latest file details:', {
      latestFileId,
      latestFileVersionFromLatestResults,
    });

    // Check if the file being uploaded is the latest version
    if (parseInt(fileId) !== latestFileId) {
      console.error('File being uploaded is not the latest version.');
      return res.status(400).json({ message: 'Please upload the file against the latest version.' });
    }

    // Increment the file version based on du_id
    const newFileVersion = latestFileVersionFromLatestResults + 1;

    // Create the new version folder
    const newVersionFolder = path.join(productFolder, `designs_v${newProductVersion}`);
    fs.mkdirSync(newVersionFolder, { recursive: true });

    console.log('New version folder:', newVersionFolder);

    // Determine the source folder for copying files
    let sourceFolder;
    if (productVersion > 0) {
      sourceFolder = path.join(productFolder, `designs_v${productVersion}`);
    } else {
      sourceFolder = path.join(productFolder, 'designs');
    }

    console.log('Source folder:', sourceFolder);

    // Check if the source folder exists
    if (!fs.existsSync(sourceFolder)) {
      console.error('Source folder not found:', sourceFolder);
      return res.status(404).json({ message: 'Source folder not found.' });
    }

    // Copy all files from the source folder to the new version folder
    fs.readdirSync(sourceFolder).forEach((file) => {
      const sourcePath = path.join(sourceFolder, file);
      const destinationPath = path.join(newVersionFolder, file);

      console.log('Copying file:', sourcePath, 'to', destinationPath);

      try {
        fs.copyFileSync(sourcePath, destinationPath);
      } catch (copyError) {
        console.error('Error copying file:', copyError.message);
        throw new Error(`Failed to copy file from ${sourcePath} to ${destinationPath}`);
      }
    });

    // Save the new file with the base name in the new version folder
    const newFilePath = path.join(newVersionFolder, `${baseName}${extension}`);
    fs.writeFileSync(newFilePath, file.buffer);

    console.log('New file path:', newFilePath);

    // Update the existing record in the design_upload table
    await db.query(
      'UPDATE design_upload SET design_path = ?, version = ? WHERE du_id = ?',
      [newFilePath, newFileVersion, fileId]
    );

    // Insert a new record into the design_upload_version table with the logged-in user's user_id and comment
    await db.query(
      'INSERT INTO design_upload_version (du_id, product_id, user_id, file_path, version, comment) VALUES (?, ?, ?, ?, ?, ?)',
      [fileId, productId, loggedInUserId, newFilePath, newFileVersion, comment]
    );

    console.log('File uploaded successfully.');
    res.status(200).json({ message: 'File uploaded successfully.', newFilePath });
  } catch (error) {
    console.error('Error uploading new version:', error.message);
    res.status(500).json({ message: 'An error occurred while uploading the file.' });
  }
};

















const fetchDesignUploadVersions = async (req, res) => {
  const { du_id } = req.params;

  // Validate du_id
  if (!du_id || isNaN(parseInt(du_id, 10))) {
    console.error('Validation failed: du_id is missing or invalid.', { du_id });
    return res.status(400).json({ message: 'Valid Design Upload ID (du_id) is required.' });
  }

  try {
    // Fetch all versions for the given du_id from the design_upload_version table
    const [results] = await db.query(
      `SELECT duv_id, du_id, product_id, user_id, file_path, timestamp, version 
       FROM design_upload_version 
       WHERE du_id = ? 
       ORDER BY version ASC`, // Order by version to get versions in ascending order
      [du_id]
    );

    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'No versions found for the given Design Upload ID.' });
    }

    // Group versions by du_id (though there's only one du_id in this case)
    const versions = results.map(version => ({
      duv_id: version.duv_id,
      du_id: version.du_id,
      product_id: version.product_id,
      user_id: version.user_id,
      file_path: version.file_path,
      timestamp: version.timestamp,
      version: version.version,
    }));

    res.status(200).json({
      message: 'Design upload versions fetched successfully.',
      versions: versions,
    });
  } catch (error) {
    console.error('Error fetching design upload versions:', error.message);
    res.status(500).json({ message: 'An error occurred while fetching design upload versions.' });
  }
};





const updateDesignUpload = async (req, res) => {
  const { du_id } = req.params;
  const { status, comment } = req.body;

  if (!du_id) {
    return res.status(400).json({ message: 'Design upload ID (du_id) is required.' });
  }

  const updateFields = {};
  updateFields.status = status || 'pending';

  if (comment !== undefined) {
    updateFields.comment = comment;
  }

  try {
    // Fetch the current status of the design upload
    const [designUpload] = await db.query('SELECT status FROM design_upload WHERE du_id = ?', [du_id]);
    if (!designUpload.length) {
      return res.status(404).json({ message: 'Design upload record not found.' });
    }

    const previousStatus = designUpload[0].status;

    // Update the design upload record
    const result = await db.query(
      `UPDATE design_upload 
       SET status = ?, comment = ? 
       WHERE du_id = ?`,
      [
        updateFields.status,
        updateFields.comment !== undefined ? updateFields.comment : '',
        du_id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Design upload record not found.' });
    }

    // Log the status change if the status was updated
    if (status && status !== previousStatus) {
      const userId = req.session?.user?.id || req.body.userId;
      if (!userId) {
        return res.status(401).json({ message: 'User authentication is required to log activity.' });
      }

      const sqlLog = `
        INSERT INTO design_status_activity (du_id, user_id, previous_status, updated_status, activity_timestamp)
        VALUES (?, ?, ?, ?, NOW())
      `;
      await db.query(sqlLog, [du_id, userId, previousStatus, status]);
    }

    res.status(200).json({ message: 'Design upload status and comment updated successfully.' });
  } catch (error) {
    console.error('Error updating design upload:', error.message);
    res.status(500).json({ message: 'An error occurred while updating the design upload.' });
  }
};



const laserUploadDesign = async (req, res) => {
  const { productId } = req.body;
  const files = req.files;

  let userId = req.session?.user?.id || req.body.userId;
  const userName = req.session?.user?.username; 

  // Validate userId
  userId = parseInt(userId, 10);
  if (isNaN(userId)) {
    console.error('Validation failed: userId is missing or invalid.', { userId });
    return res.status(400).json({ message: 'Valid User ID is required.' });
  }

  if (!userName) {
    console.error('Validation failed: userName is missing.');
    return res.status(400).json({ message: 'User name is required.' });
  }

  if (!productId || !files || files.length === 0) {
    console.error('Validation failed:', { productId, files });
    return res.status(400).json({ message: 'Product ID and design files are required.' });
  }

  try {
    console.log('Received productId:', productId);

    // Fetch product name from the database
    const results = await db.query('SELECT product_name FROM products WHERE product_id = ?', [productId]);
    const product = results[0][0];
    if (!product || !product.product_name) {
      return res.status(404).json({ message: 'Product not found or product name is missing.' });
    }
    const productName = product.product_name;

    console.log('Fetched Product Name:', productName);

    const baseDir = await getBaseDir();
    if (!baseDir) throw new Error('Base directory could not be retrieved.');

    const productFolder = path.join(baseDir, productName);
    if (!fs.existsSync(productFolder)) {
      return res.status(404).json({ message: 'Product folder does not exist.' });
    }

    // Create user-specific document folder
    const userDocumentsFolder = `${userName}_documents`;
    const designFolderPath = path.join(productFolder, userDocumentsFolder);
    fs.mkdirSync(designFolderPath, { recursive: true });

    const filePaths = [];
    for (const file of files) {
      const filePath = path.join(designFolderPath, file.originalname);

      if (file.mimetype === 'application/zip' || file.originalname.endsWith('.zip')) {
        try {
          const zip = new AdmZip(file.buffer);
          const zipEntries = zip.getEntries();

          zipEntries.forEach((entry) => {
            if (!entry.isDirectory) {
              const fullPath = path.join(designFolderPath, entry.entryName);
              filePaths.push(fullPath);
              zip.extractEntryTo(entry, designFolderPath, false, true);
            }
          });

          console.log(`Extracted zip file: ${file.originalname}`);
        } catch (zipError) {
          console.error('Error extracting zip file:', zipError.message);
          throw new Error('Failed to extract zip file.');
        }
      } else {
        try {
          fs.writeFileSync(filePath, file.buffer);
          filePaths.push(filePath);
        } catch (fsError) {
          console.error('Error saving file:', filePath, fsError.message);
          throw new Error('Failed to save design file.');
        }
      }
    }

    for (const filePath of filePaths) {
      await insertLaserDesignUpload(productId, userId, filePath);
    }

    res.status(201).json({ message: 'Documents uploaded successfully.' });
  } catch (error) {
    console.error('Error uploading documents:', error.message);
    res.status(500).json({ message: 'An error occurred while uploading the documents.' });
  }
};



const fetchLaserDesigns = async (req, res) => {
  const { productId } = req.params;

  // Validate productId
  if (!productId || isNaN(parseInt(productId, 10))) {
    console.error('Validation failed: productId is missing or invalid.', { productId });
    return res.status(400).json({ message: 'Valid Product ID is required.' });
  }

  try {
    // Fetch the uploaded files from the database for the given product ID
    const results = await db.query(
      'SELECT laser_design_path FROM laser_design_upload WHERE product_id = ?',
      [productId]
    );

    const uploadedFiles = results[0];
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(404).json({ message: 'No documents found for the given product.' });
    }

    // Return the list of uploaded files
    res.status(200).json({
      message: 'documents fetched successfully.',
      files: uploadedFiles.map(file => file.laser_design_path),
    });
  } catch (error) {
    console.error('Error fetching documents:', error.message);
    res.status(500).json({ message: 'An error occurred while fetching documents.' });
  }
};



const insertLaserDesignUpload = async (productId, userId, filePath) => {
  try {
    const [userResults] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
    if (userResults.length === 0) {
      throw new Error(`User  ID ${userId} does not exist.`);
    }

    await db.query('INSERT INTO laser_design_upload (product_id, user_id, laser_design_path) VALUES (?, ?, ?)', [
      productId,
      userId,
      filePath,
    ]);
    console.log('Documents record inserted successfully');
  } catch (error) {
    console.error('Error inserting documents record:', error.message);
    throw new Error('Failed to insert documents record');
  }
};



const fetchProjects = (req, res) => {
  getProjects((err, projects) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching projects.' });
    }
    res.status(200).json(projects);
  });
};



const fetchProducts = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    let query = `
      SELECT p.product_id, p.product_name, p.status, p.comments, p.created_at, p.product_version,
             GROUP_CONCAT(u.name) AS assigned_users
      FROM products p
      LEFT JOIN product_assignments pa ON p.product_id = pa.product_id
      LEFT JOIN users u ON pa.user_id = u.id
    `;

    // Filter based on user role
    if (loggedInUserRole !== 'admin') {
      query += `
        WHERE p.product_id IN (
          SELECT pa.product_id
          FROM product_assignments pa
          WHERE pa.user_id = ?
        )
      `;
    }

    query += `
      GROUP BY p.product_id
    `;

    const [products] = await db.query(query, loggedInUserRole !== 'admin' ? [loggedInUserId] : []);

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'An error occurred while fetching products.' });
  }
};



const openFile = async (req, res) => {
  const { projectName, taskName } = req.params;

  try {
    // Dynamically fetch the base directory
    const baseDir = await getBaseDir();

    // Define the path to the folder containing the file
    const taskFolder = path.join(baseDir, projectName, taskName);

    // Get the list of files in the task folder
    fs.readdir(taskFolder, (err, files) => {
      if (err) {
        console.error('Error reading directory:', err);
        return res.status(500).json({ message: 'Error reading task folder' });
      }

      // Identify the versioned files and the newest one
      const versionPattern = new RegExp(`_v(\\d+)\\.`);
      let newestVersionFile = null;
      let highestVersion = 0;

      files.forEach(file => {
        const match = file.match(versionPattern);
        if (match) {
          const version = parseInt(match[1], 10);
          if (version > highestVersion) {
            highestVersion = version;
            newestVersionFile = file;
          }
        }
      });

      // Fallback to 'copy_of_' file if no versioned file is found
      const copyFile = files.find(file => file.startsWith('copy_of_'));
      const fileToOpen = newestVersionFile || copyFile;

      if (!fileToOpen) {
        return res.status(404).json({ message: 'No file found to open' });
      }

      // Define the full path of the file to open
      const filePath = path.join(taskFolder, fileToOpen);

      // Use exec to open the file in the default application
      exec(`start "" "${filePath}"`, (err) => {
        if (err) {
          console.error('Error opening file:', err);
          return res.status(500).json({ message: 'Error opening file' });
        }
        res.status(204).send();
      });
    });
  } catch (err) {
    console.error('Error fetching base directory:', err);
    res.status(500).json({ message: 'Error fetching base directory' });
  }
};



const copyFilePath = async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    console.error('Product ID is missing.');
    return res.status(400).json({ message: 'Product ID is required.' });
  }

  try {
    // Fetch the product name from the database
    const results = await db.query('SELECT product_name FROM products WHERE product_id = ?', [productId]);
    const product = results[0][0];
    if (!product || !product.product_name) {
      return res.status(404).json({ message: 'Product not found or product name is missing.' });
    }
    const productName = product.product_name;

    // Get the base directory
    const baseDir = await getBaseDir();
    if (!baseDir) throw new Error('Base directory could not be retrieved.');

    // Construct the design folder path
    const designFolder = path.join(baseDir, productName, 'designs');
    console.log('Design Folder Path:', designFolder);

    // Check if the design folder exists
    if (!fs.existsSync(designFolder)) {
      console.error('Design folder does not exist:', designFolder);
      return res.status(404).json({ message: 'Design folder not found.' });
    }

    // Read files in the design folder
    const files = fs.readdirSync(designFolder);
    if (files.length === 0) {
      console.error('No files found in the design folder:', designFolder);
      return res.status(404).json({ message: 'No files found in the design folder.' });
    }

    // Build the file paths
    const filePaths = files.map(file => path.join(designFolder, file));
    console.log('Files to Copy:', filePaths);

    // Return all file paths
    res.json({ filePaths });
  } catch (error) {
    console.error('Error processing request:', error.message);
    res.status(500).json({ message: 'An error occurred while processing the request.' });
  }
};



const fetchUsers = (req, res) => {
  const query = 'SELECT id, fullname, role FROM users';

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching users.' });
    }
    res.status(200).json(results);
  });
};


const updateProductStatus = async (req, res) => {
  const { productId, status } = req.body;

  // Validate input
  if (!productId || !status) {
    return res.status(400).json({ message: 'Product ID and status are required.' });
  }

  // Wrap the database query in a Promise for async/await
  const query = 'UPDATE products SET status = ?, updated_at = NOW() WHERE product_id = ?';

  try {
    const [results] = await db.query(query, [status, productId]);  

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(200).json({ message: 'Product status updated successfully.' });
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ message: 'Database error.' });
  }
};



const getUserById = (userId, callback) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      return callback(err, null);
    }

    if (results.length === 0) {
      return callback(null, null); // No user found
    }

    return callback(null, results[0]); // Return the first user result
  });
};




const copyRecursiveSync = (src, dest) => {
  if (fs.existsSync(src)) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        copyRecursiveSync(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
};



const getLatestVersionFolder = (basePath) => {
  const existingFolders = fs.readdirSync(basePath).filter(folder =>
    folder.startsWith('designs_v') && fs.lstatSync(path.join(basePath, folder)).isDirectory()
  );

  const versionNumbers = existingFolders.map(folder => {
    const match = folder.match(/designs_v(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }).filter(version => version !== null);

  if (versionNumbers.length === 0) {
    return null; // No version folders found
  }

  const latestVersion = Math.max(...versionNumbers);
  return path.join(basePath, `designs_v${latestVersion}`);
};







































// const addUserToProduct = async (req, res) => {
//   const { productId } = req.params;
//   const { userId } = req.body;

//   if (!productId || !userId || !Array.isArray(userId)) {
//     return res.status(400).json({ message: 'Product ID and an array of User IDs are required.' });
//   }

//   try {
//     const productQuery = 'SELECT product_name FROM products WHERE product_id = ?';
//     const [productResults] = await db.query(productQuery, [productId]);

//     if (productResults.length === 0) {
//       return res.status(404).json({ message: 'Product not found.' });
//     }

//     const productName = productResults[0].product_name;
//     const baseDir = await getBaseDir();
//     const productFolder = path.join(baseDir, productName);

//     const addedUsers = [];
//     const skippedUsers = [];

//     for (const user of userId) {
//       const checkAssignmentQuery = `
//         SELECT * FROM product_assignments 
//         WHERE product_id = ? AND user_id = ?`;
//       const [assignmentResults] = await db.query(checkAssignmentQuery, [productId, user]);

//       if (assignmentResults.length > 0) {
//         skippedUsers.push(user);
//         continue;
//       }

//       const assignUserQuery = `
//         INSERT INTO product_assignments (product_id, user_id, assigned_at) 
//         VALUES (?, ?, NOW())`;
//       await db.query(assignUserQuery, [productId, user]);
//       addedUsers.push(user);
//     }

//     const latestVersionFolder = getLatestVersionFolder(productFolder);
//     if (!latestVersionFolder) {
//       return res.status(201).json({
//         message: 'Users assigned successfully. No designs or version folders found.',
//         addedUsers,
//         skippedUsers,
//       });
//     }

//     const existingFolders = fs.readdirSync(productFolder).filter(folder =>
//       folder.startsWith('designs_v') && fs.lstatSync(path.join(productFolder, folder)).isDirectory()
//     );

//     const versionNumbers = existingFolders.map(folder => {
//       const match = folder.match(/designs_v(\d+)/);
//       return match ? parseInt(match[1], 10) : null;
//     }).filter(version => version !== null);

//     const newVersion = versionNumbers.length > 0 ? Math.max(...versionNumbers) + 1 : 1;
//     const newVersionFolder = path.join(productFolder, `designs_v${newVersion}`);

//     fs.mkdirSync(newVersionFolder, { recursive: true });
//     copyRecursiveSync(latestVersionFolder, newVersionFolder);

//     const activityLogQuery = `
//       INSERT INTO product_activity_logs (user_id, product_id, action, file_path, timestamp) 
//       VALUES (?, ?, 'add', ?, NOW())`;
//     for (const user of addedUsers) {
//       await db.query(activityLogQuery, [user, productId, newVersionFolder]);
//     }

//     res.status(201).json({
//       message: 'Users assigned successfully.',
//       addedUsers,
//       skippedUsers,
//       newVersionFolder,
//     });
//   } catch (error) {
//     console.error('Error adding users to product:', error);
//     res.status(500).json({ message: 'An error occurred.' });
//   }
// };


const addUserToProduct = async (req, res) => {
  const { productId } = req.params;
  const { userId } = req.body;

  if (!productId || !userId || !Array.isArray(userId)) {
    return res.status(400).json({ message: 'Product ID and an array of User IDs are required.' });
  }

  try {
    const productQuery = 'SELECT product_name FROM products WHERE product_id = ?';
    const [productResults] = await db.query(productQuery, [productId]);

    if (productResults.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const addedUsers = [];
    const skippedUsers = [];

    for (const user of userId) {
      const checkAssignmentQuery = `
        SELECT * FROM product_assignments 
        WHERE product_id = ? AND user_id = ?`;
      const [assignmentResults] = await db.query(checkAssignmentQuery, [productId, user]);

      if (assignmentResults.length > 0) {
        skippedUsers.push(user);
        continue;
      }

      const assignUserQuery = `
        INSERT INTO product_assignments (product_id, user_id, assigned_at) 
        VALUES (?, ?, NOW())`;
      await db.query(assignUserQuery, [productId, user]);
      addedUsers.push(user);
    }

    res.status(201).json({
      message: 'Users assigned successfully.',
      addedUsers,
      skippedUsers,
    });
  } catch (error) {
    console.error('Error adding users to product:', error);
    res.status(500).json({ message: 'An error occurred.' });
  }
};





const removeUserFromProduct = async (req, res) => {
  const { productId, userId } = req.params;

  if (!productId || !userId) {
    return res.status(400).json({ message: 'Product ID and User ID are required.' });
  }

  try {
    // Check if the user is assigned to the product
    const checkAssignmentQuery = `
      SELECT * FROM product_assignments 
      WHERE product_id = ? AND user_id = ?`;
    const [assignmentResults] = await db.query(checkAssignmentQuery, [productId, userId]);

    if (assignmentResults.length === 0) {
      return res.status(404).json({ message: 'User not assigned to this product.' });
    }

    // Remove the user from the product
    const deleteQuery = `
      DELETE FROM product_assignments 
      WHERE product_id = ? AND user_id = ?`;
    const [deleteResults] = await db.query(deleteQuery, [productId, userId]);

    if (deleteResults.affectedRows === 0) {
      return res.status(500).json({ message: 'Failed to remove user from product.' });
    }

    // Log the action in product_activity_logs
    const activityLogQuery = `
      INSERT INTO product_activity_logs (user_id, product_id, action, file_path, timestamp) 
      VALUES (?, ?, 'remove', NULL, NOW())`;
    await db.query(activityLogQuery, [userId, productId]);

    res.status(200).json({ message: 'User removed from product successfully.' });
  } catch (err) {
    console.error('Error removing user from product:', err);
    res.status(500).json({ message: 'An error occurred while removing the user from the product.' });
  }
};




// const updateProductUsers = async (req, res) => {
//   const { productId } = req.params;
//   const { addUsers, removeUsers } = req.body;

//   if (!productId) {
//     return res.status(400).json({ message: 'Product ID is required.' });
//   }

//   const addedUsers = [];
//   const logs = [];

//   try {
//     if (addUsers && addUsers.length > 0) {
//       const addQuery = `
//         INSERT INTO product_assignments (product_id, user_id, assigned_at)
//         VALUES (?, ?, NOW())`;

//       for (const userId of addUsers) {
//         const checkAssignmentQuery = `
//           SELECT * FROM product_assignments 
//           WHERE product_id = ? AND user_id = ?`;
//         const [assignmentResults] = await db.query(checkAssignmentQuery, [productId, userId]);

//         if (assignmentResults.length > 0) continue;

//         await db.query(addQuery, [productId, userId]);
//         addedUsers.push(userId);
//         logs.push({ userId, action: 'add', filePath: null });
//       }
//     }

//     if (removeUsers && removeUsers.length > 0) {
//       const removeQuery = `
//         DELETE FROM product_assignments 
//         WHERE product_id = ? AND user_id = ?`;

//       for (const userId of removeUsers) {
//         await db.query(removeQuery, [productId, userId]);
//         logs.push({ userId, action: 'remove', filePath: null });
//       }
//     }

//     if (addedUsers.length > 0) {
//       const productQuery = 'SELECT product_name FROM products WHERE product_id = ?';
//       const [productResults] = await db.query(productQuery, [productId]);

//       if (productResults.length === 0) throw new Error('Product not found.');

//       const productName = productResults[0].product_name;
//       const baseDir = await getBaseDir();
//       const productFolder = path.join(baseDir, productName);
//       const designFolderPath = path.join(productFolder, 'designs');

//       if (fs.existsSync(designFolderPath)) {
//         const existingFolders = fs.readdirSync(productFolder).filter(folder =>
//           folder.startsWith('designs_v') && fs.lstatSync(path.join(productFolder, folder)).isDirectory()
//         );

//         const versionNumbers = existingFolders.map(folder => {
//           const match = folder.match(/designs_v(\d+)/);
//           return match ? parseInt(match[1], 10) : null;
//         }).filter(version => version !== null);

//         const newVersion = versionNumbers.length > 0 ? Math.max(...versionNumbers) + 1 : 1;
//         const newVersionFolder = path.join(productFolder, `designs_v${newVersion}`);

//         fs.mkdirSync(newVersionFolder, { recursive: true });
//         copyRecursiveSync(designFolderPath, newVersionFolder);

//         logs.forEach(log => {
//           if (log.action === 'add') log.filePath = newVersionFolder;
//         });
//       }
//     }

//     const logQuery = `
//       INSERT INTO product_activity_logs (user_id, product_id, action, file_path, timestamp)
//       VALUES (?, ?, ?, ?, NOW())`;
//     for (const log of logs) {
//       await db.query(logQuery, [log.userId, productId, log.action, log.filePath]);
//     }

//     res.status(200).json({ message: 'Users updated successfully.', addedUsers });
//   } catch (error) {
//     console.error('Error updating product users:', error);
//     res.status(500).json({ message: 'An error occurred.' });
//   }
// };



const updateProductUsers = async (req, res) => {
  const { productId } = req.params;
  const { addUsers, removeUsers } = req.body;

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required.' });
  }

  const addedUsers = [];
  const logs = [];

  try {
    if (addUsers && addUsers.length > 0) {
      const addQuery = `
        INSERT INTO product_assignments (product_id, user_id, assigned_at)
        VALUES (?, ?, NOW())`;

      for (const userId of addUsers) {
        const checkAssignmentQuery = `
          SELECT * FROM product_assignments 
          WHERE product_id = ? AND user_id = ?`;
        const [assignmentResults] = await db.query(checkAssignmentQuery, [productId, userId]);

        if (assignmentResults.length > 0) continue;

        await db.query(addQuery, [productId, userId]);
        addedUsers.push(userId);
        logs.push({ userId, action: 'add', filePath: null });
      }
    }

    if (removeUsers && removeUsers.length > 0) {
      const removeQuery = `
        DELETE FROM product_assignments 
        WHERE product_id = ? AND user_id = ?`;

      for (const userId of removeUsers) {
        await db.query(removeQuery, [productId, userId]);
        logs.push({ userId, action: 'remove', filePath: null });
      }
    }

    const logQuery = `
      INSERT INTO product_activity_logs (user_id, product_id, action, file_path, timestamp)
      VALUES (?, ?, ?, ?, NOW())`;
    for (const log of logs) {
      await db.query(logQuery, [log.userId, productId, log.action, log.filePath]);
    }

    res.status(200).json({ message: 'Users updated successfully.', addedUsers });
  } catch (error) {
    console.error('Error updating product users:', error);
    res.status(500).json({ message: 'An error occurred.' });
  }
};




















































const copyFileForNewUser = (taskId, assignedUserId, callback) => {
  getUserById(assignedUserId, (err, user) => {
    if (err || !user) {
      console.error('Error fetching user details:', err);
      return callback(new Error('Error fetching user details.'));
    }

    const username = user.fullname;

    getTaskById(taskId, (err, task) => {
      if (err || !task) {
        console.error('Error fetching task details:', err);
        return callback(new Error('Error fetching task details.'));
      }

      const taskFolder = path.dirname(task.file_path); // Task folder path
      const originalFile = path.basename(task.file_path); // Original file name
      const newFileName = `${path.parse(originalFile).name}_${username}${path.extname(originalFile)}`; // New file name with user
      const newFilePath = path.join(taskFolder, newFileName); // New file path

      // Copy the original file to the new location with the username appended
      fs.copyFile(task.file_path, newFilePath, (err) => {
        if (err) {
          console.error('Error copying file:', err);
          return callback(new Error('Error copying file.'));
        }

        console.log(`File copied for new user: ${newFilePath}`);
        callback(null);
      });
    });
  });
};



const logUserAssignmentHistory = (taskId, previousUserId, newUserId, callback) => {
  const query = 'INSERT INTO task_user_history (task_id, previous_user_id, new_user_id) VALUES (?, ?, ?)';
  db.query(query, [taskId, previousUserId, newUserId], (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};



const fetchTaskUserHistory = (req, res) => {
  const { taskId } = req.params;

  if (!taskId) {
    return res.status(400).json({ message: 'Task ID is required.' });
  }

  const query = `
    SELECT 
      tuh.id, 
      tuh.task_id, 
      u1.fullname AS previousUser, 
      u2.fullname AS newUser, 
      tuh.updated_at 
    FROM task_user_history tuh
    INNER JOIN users u1 ON tuh.previous_user_id = u1.id
    INNER JOIN users u2 ON tuh.new_user_id = u2.id
    WHERE tuh.task_id = ?
    ORDER BY tuh.updated_at DESC
  `;

  db.query(query, [taskId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching user assignment history.' });
    }

    res.status(200).json(results);
  });
};


const openFolder = async (req, res) => {
  const { projectName } = req.params;

  try {
    // Dynamically fetch the base directory
    const baseDir = await getBaseDir();

    // Define the path to the project folder
    const folderPath = path.join(baseDir, projectName);

    if (!fs.existsSync(folderPath)) {
      return res.status(404).send();
    }

    // Use exec to open the folder in the default file explorer
    exec(`explorer "${folderPath}"`, (err) => {
      if (err) {
        console.error('Error opening folder:', err);
        return res.status(500).send();
      }
      res.status(204).send();
    });
  } catch (err) {
    console.error('Error fetching base directory:', err);
    res.status(500).json({ message: 'Error fetching base directory' });
  }
};


const copyFolderPath = async (req, res) => {
  try {
    const { projectName } = req.params;

    // Fetch the base directory using getBaseDir
    const baseDir = await getBaseDir();

    // Construct the folder path using the base directory
    const folderPath = path.join(baseDir, projectName);

    // Check if the folder exists
    if (!fs.existsSync(folderPath)) {
      return res.status(404).send({ message: 'Folder not found' });
    }

    // Return the folder path in the response
    res.status(200).json({ folderPath });
  } catch (err) {
    console.error('Error in copyFolderPath:', err);
    res.status(500).send({ message: 'Failed to fetch folder path', error: err.message });
  }
};



const updateTaskDetails = async (req, res) => {
  const { task_id } = req.params; // Get task_id from req.params
  const { taskName, assignedUserIds, description, startDate, endDate, priority, status, comments } = req.body;

  // Ensure user is authenticated
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }

  // Validate task_id
  if (!task_id) {
    return res.status(400).json({ message: 'Task ID is required.' });
  }

  // Ensure assignedUserIds is an array
  const safeAssignedUserIds = Array.isArray(assignedUserIds) ? assignedUserIds : [];

  try {
    const task = await getTaskById(task_id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    const updateQueries = [];
    const params = [];

    let previousStatus = task.status;

    if (taskName !== undefined) {
      updateQueries.push('task_name = ?');
      params.push(taskName);
    }

    if (description !== undefined) {
      updateQueries.push('description = ?');
      params.push(description);
    }

    if (startDate) {
      updateQueries.push('start_date = ?');
      params.push(moment(startDate, 'YYYY-MM-DD').format('YYYY-MM-DD'));
    }

    if (endDate) {
      updateQueries.push('end_date = ?');
      params.push(moment(endDate, 'YYYY-MM-DD').format('YYYY-MM-DD'));
    }

    if (priority !== undefined) {
      updateQueries.push('priority = ?');
      params.push(priority);
    }

    if (status !== undefined) {
      updateQueries.push('status = ?');
      params.push(status);
    }

    if (comments !== undefined) {
      updateQueries.push('comments = ?');
      params.push(comments);
    }

    const updateTaskQuery = `UPDATE tasks SET ${updateQueries.join(', ')} WHERE task_id = ?`;
    params.push(task_id);

    const [result] = await db.query(updateTaskQuery, params);
    
    if (result.affectedRows > 0) {
      await db.query(`
        INSERT INTO task_status_activity (task_id, user_id, previous_status, updated_status, timestamp)
        VALUES (?, ?, ?, ?, NOW())
      `, [task_id, req.session.user.id, previousStatus, status || task.status]); 
    }

    res.json({ success: true, message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ success: false, message: 'Failed to update task' });
  }
};



const updateProductDetails = async (req, res) => {
  const { product_id } = req.params; // Get product_id from req.params
  const { productName, docUpload, status, comments } = req.body;

  // Ensure user is authenticated
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }

  // Validate product_id
  if (!product_id) {
    return res.status(400).json({ message: 'Product ID is required.' });
  }

  try {
    const updates = {
      product_name: productName,
      doc_upload: docUpload,
      status,
      comments,
    };

    const updatedProductId = await updateProduct(product_id, updates, req.session.user.id);

    res.json({ success: true, message: 'Product updated successfully', productId: updatedProductId });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
};




const getTaskById = async (task_id) => {
  const [rows] = await db.query('SELECT * FROM tasks WHERE task_id = ?', [task_id]);
  return rows.length > 0 ? rows[0] : null; 
};




const fetchPendingTasks = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const tasks = await taskModel.fetchPendingTasks(loggedInUserRole, loggedInUserId);
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error fetching pending tasks:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pending tasks' });
  }
};



const fetchInProgressTasks = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const tasks = await taskModel.fetchInProgressTasks(loggedInUserRole, loggedInUserId);
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error fetching In progress parts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch In Progress parts' });
  }
};



const fetchOnHoldTasks = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const tasks = await taskModel.fetchOnHoldTasks(loggedInUserRole, loggedInUserId);
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error fetching In progress parts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch In Progress parts' });
  }
};



const fetchCompletedTasks = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const tasks = await taskModel.fetchCompletedTasks(loggedInUserRole, loggedInUserId);
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error fetching In progress parts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch In Progress parts' });
  }
};



const fetchUnderReviewTasks = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const tasks = await taskModel.fetchUnderReviewTasks(loggedInUserRole, loggedInUserId);
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error fetching In progress parts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch In Progress parts' });
  }
};



export const getPendingTaskCount = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const pendingTaskCount = await taskModel.getPendingTaskCount(loggedInUserRole, loggedInUserId);

    res.json({ success: true, data: { pendingTaskCount } });
  } catch (error) {
    console.error('Error fetching pending tasks:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pending tasks' });
  }
};



const getProductActivityLogs = async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({ message: 'Task ID is required.' });
  }

  // SQL query to fetch logs along with the user name
  const query = `
    SELECT pal.user_id, u.name, pal.product_id, pal.action, pal.file_path, pal.timestamp
    FROM product_activity_logs pal
    JOIN users u ON pal.user_id = u.id
    WHERE pal.product_id = ?
    ORDER BY pal.timestamp DESC
  `;
  
  try {
    const [logs] = await db.query(query, [productId]);

    if (logs.length === 0) {
      return res.status(404).json({ message: 'No activity logs found for this task.' });
    }

    res.status(200).json({
      message: 'Task activity logs retrieved successfully.',
      logs,
    });
  } catch (err) {
    console.error('Error fetching task activity logs:', err);
    res.status(500).json({ message: 'Error fetching task activity logs.' });
  }
};


const fetchProductStatusActivity = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { productId } = req.params; 

    if (!productId) {
      return res.status(400).json({ message: 'Task ID is required.' });
    }

    const activity = await taskModel.fetchProductStatusActivity(productId);
    if (!activity || activity.length === 0) {
      return res.status(404).json({ message: 'No activity found for this task.' });
    }

    res.json({ success: true, data: activity });
  } catch (error) {
    console.error('Error fetching task status activity:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch task status activity' });
  }
};


const fetchDesignStatusActivity = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { duId } = req.params; 

    if (!duId) {
      return res.status(400).json({ message: 'Task ID is required.' });
    }

    const activity = await taskModel.fetchDesignStatusActivity(duId);
    if (!activity || activity.length === 0) {
      return res.status(404).json({ message: 'No activity found for this task.' });
    }

    res.json({ success: true, data: activity });
  } catch (error) {
    console.error('Error fetching task status activity:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch task status activity' });
  }
};



const fetchProjectWiseTasks = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;
    const { projectId } = req.params; // Assuming you're passing projectId in the URL params

    const tasks = await taskModel.fetchProjectWiseTasks(loggedInUserRole, loggedInUserId, projectId);
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error fetching project wise tasks:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch project-wise tasks' });
  }
};


const fetchTaskWiseFilePaths = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;
    const { taskId } = req.params; // Assuming you're passing taskId in the URL params

    const filePaths = await taskModel.fetchTaskWiseFilePaths(loggedInUserRole, loggedInUserId, taskId);
    res.json({ success: true, data: filePaths });
  } catch (error) {
    console.error('Error fetching task wise file paths:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch task-wise file paths' });
  }
};



const fetchPendingProducts = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const products = await taskModel.fetchPendingProducts(loggedInUserRole, loggedInUserId);
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching pending products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pending products' });
  }
};



const fetchInProgressProducts = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const products = await taskModel.fetchInProgressProducts(loggedInUserRole, loggedInUserId);
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching pending products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pending products' });
  }
};



const fetchUnderReviewProducts = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const products = await taskModel.fetchUnderReviewProducts(loggedInUserRole, loggedInUserId);
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching pending products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pending products' });
  }
};

const fetchOnHoldProducts = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const products = await taskModel.fetchOnHoldProducts(loggedInUserRole, loggedInUserId);
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching pending products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pending products' });
  }
};

const fetchCompletedProducts = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const products = await taskModel.fetchCompletedProducts(loggedInUserRole, loggedInUserId);
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching pending products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pending products' });
  }
};


  const fetchUserByID = async (req, res) => {
  const { userId } = req.params;
  try {
    const [results] = await db.query('SELECT name FROM users WHERE id = ?', [userId]);
    if (results.length > 0) {
      res.status(200).json({ name: results[0].name });
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'An error occurred while fetching user details.' });
  }
};








// const createProduct = async (req, res) => {
//   const { productName, assignedUser, status = 'pending', comments, revision } = req.body;
//   console.log('Received request to create product:', req.body);
//   const files = req.files;
//   console.log('Received File:', files);

//   // Get the logged-in user's ID from the session
//   let userId = req.session?.user?.id || req.body.userId;
//   if (!userId) {
//     return res.status(401).json({ message: 'User not authenticated.' });
//   }

//   console.log('User ID from session:', userId);

//   // Validation
//   if (!productName) {
//     console.error('Validation failed:', { productName });
//     return res.status(400).json({ message: 'Product name is required.' });
//   }

//   if (!revision) {
//     console.error('Validation failed:', { revision });
//     return res.status(400).json({ message: 'Revision is required.' });
//   }

//   let users = [];
//   if (assignedUser) {
//     try {
//       // Parse the assignedUser string directly
//       const parsedUsers = JSON.parse(assignedUser);
//       if (Array.isArray(parsedUsers)) {
//         users = parsedUsers.map(user => parseInt(user, 10)).filter(id => !isNaN(id));
//       } else {
//         throw new Error('Assigned users is not a valid array.');
//       }
//     } catch (parseError) {
//       console.error('Error parsing assigned users:', parseError.message);
//       return res.status(400).json({ message: 'Invalid format for assigned users.' });
//     }
//   }

//   console.log('Parsed Users:', users);

//   try {
//     const [existingProduct] = await db.query(
//       'SELECT product_id FROM products WHERE product_name = ?',
//       [productName]
//     );

//     if (existingProduct.length > 0) {
//       return res.status(400).json({ message: 'Product with this name already exists.' });
//     }

//     const baseDir = await getBaseDir();

//     // Create the product folder
//     const productFolder = path.join(baseDir, productName);
//     if (!fs.existsSync(productFolder)) {
//       fs.mkdirSync(productFolder, { recursive: true });
//     }

//     // Create the revision folder inside the product folder
//     const revisionFolder = path.join(productFolder, revision);
//     if (!fs.existsSync(revisionFolder)) {
//       fs.mkdirSync(revisionFolder, { recursive: true });
//     }

//     // Create the "Customer Documents" folder inside the revision folder
//     const customerDocumentsFolder = path.join(revisionFolder, 'Customer Documents');
//     if (!fs.existsSync(customerDocumentsFolder)) {
//       fs.mkdirSync(customerDocumentsFolder, { recursive: true });
//     }

//     // Save the uploaded files in the "Customer Documents" folder
//     const filePaths = [];
//     for (const file of files) {
//       const filePath = path.join(customerDocumentsFolder, file.originalname);
//       fs.writeFileSync(filePath, file.buffer);
//       filePaths.push(filePath);
//     }

//     // Insert the product into the database
//     const productId = await insertProduct(productName, status, comments, userId, revision);
//     console.log('Product inserted successfully');

//     // Insert into revision table and get the revision ID
//     const [revisionResult] = await db.query(
//       `INSERT INTO revision (product_id, user_id, revision, revision_folder_path)
//        VALUES (?, ?, ?, ?)`,
//       [productId, userId, revision, revisionFolder]
//     );
//     const revisionId = revisionResult.insertId; // Get the revision ID

//     // Insert the document paths into the database with the revision ID
//     for (const filePath of filePaths) {
//       await insertProductDocument(productId, revisionId, filePath);
//     }

//     // Assign users to the product if any
//     if (users.length > 0) {
//       const assignedUsersResult = await assignUsersToProduct(productId, users);
//       console.log('Assigned Users are: ', assignedUsersResult);
//     }

//     res.status(201).json({ message: `Product "${productName}" created successfully.` });
//   } catch (error) {
//     console.error('Error creating product:', error);
//     res.status(500).json({ message: 'An error occurred while creating the product.' });
//   }
// };


const createProduct = async (req, res) => {
  const { productName, assignedUser, status = 'pending', comments, revision, partType } = req.body;
  console.log('Received request to create product:', req.body);
  const files = req.files;
  console.log('Received File:', files);

  // Get the logged-in user's ID from the session
  let userId = req.session?.user?.id || req.body.userId;
  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated.' });
  }

  console.log('User ID from session:', userId);

  // Validation
  if (!productName) {
    console.error('Validation failed:', { productName });
    return res.status(400).json({ message: 'Product name is required.' });
  }

  if (!revision) {
    console.error('Validation failed:', { revision });
    return res.status(400).json({ message: 'Revision is required.' });
  }

  if (!partType) {
    console.error('Validation failed:', { partType });
    return res.status(400).json({ message: 'Part type is required.' });
  }

  let users = [];
  if (assignedUser) {
    try {
      // Parse the assignedUser string directly
      const parsedUsers = JSON.parse(assignedUser);
      if (Array.isArray(parsedUsers)) {
        users = parsedUsers.map(user => parseInt(user, 10)).filter(id => !isNaN(id));
      } else {
        throw new Error('Assigned users is not a valid array.');
      }
    } catch (parseError) {
      console.error('Error parsing assigned users:', parseError.message);
      return res.status(400).json({ message: 'Invalid format for assigned users.' });
    }
  }

  console.log('Parsed Users:', users);

  try {
    const [existingProduct] = await db.query(
      'SELECT product_id FROM products WHERE product_name = ?',
      [productName]
    );

    if (existingProduct.length > 0) {
      return res.status(400).json({ message: 'Product with this name already exists.' });
    }

    const baseDir = await getBaseDir();

    // Create the product folder
    const productFolder = path.join(baseDir, productName);
    if (!fs.existsSync(productFolder)) {
      fs.mkdirSync(productFolder, { recursive: true });
    }

    // Create the revision folder inside the product folder
    const revisionFolder = path.join(productFolder, revision);
    if (!fs.existsSync(revisionFolder)) {
      fs.mkdirSync(revisionFolder, { recursive: true });
    }

    // Create the "Customer Documents" folder inside the revision folder
    const customerDocumentsFolder = path.join(revisionFolder, 'Customer Documents');
    if (!fs.existsSync(customerDocumentsFolder)) {
      fs.mkdirSync(customerDocumentsFolder, { recursive: true });
    }

    // Save the uploaded files in the "Customer Documents" folder
    const filePaths = [];
    for (const file of files) {
      const filePath = path.join(customerDocumentsFolder, file.originalname);
      fs.writeFileSync(filePath, file.buffer);
      filePaths.push(filePath);
    }

    // Insert the product into the database
    const productId = await insertProduct(productName, status, comments, userId, revision, partType);
    console.log('Product inserted successfully');

    // Insert into revision table and get the revision ID
    const [revisionResult] = await db.query(
      `INSERT INTO revision (product_id, user_id, revision, revision_folder_path)
       VALUES (?, ?, ?, ?)`,
      [productId, userId, revision, revisionFolder]
    );
    const revisionId = revisionResult.insertId; // Get the revision ID

    // Insert the document paths into the database with the revision ID
    for (const filePath of filePaths) {
      await insertProductDocument(productId, revisionId, filePath);
    }

    // Assign users to the product if any
    if (users.length > 0) {
      const assignedUsersResult = await assignUsersToProduct(productId, users);
      console.log('Assigned Users are: ', assignedUsersResult);
    }

    res.status(201).json({ message: `Product "${productName}" created successfully.` });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'An error occurred while creating the product.' });
  }
};



export default { createProduct,fetchProducts, uploadDesign, laserUploadDesign, 
  addUserToProduct,removeUserFromProduct, updateProductUsers, updateProductDetails,
  fetchUploadedDesigns, fetchLaserDesigns, getProductActivityLogs, updateDesignUpload,
  fetchPendingProducts,fetchInProgressProducts,fetchUnderReviewProducts,fetchOnHoldProducts,
  fetchCompletedProducts, fetchProductStatusActivity,fetchDesignStatusActivity,downloadDesign,
  uploadNewVersion, fetchDesignUploadVersions,fetchUserByID,downloadFileByPath, downloadLatestVersionZip,
  getAllDesignUploadVersions, getLatestDesignUploadVersions,

  fetchProjects,  openFile, openFolder, fetchUsers,
  updateProductStatus, updateTaskDetails, fetchTaskUserHistory, 
    fetchPendingTasks, fetchInProgressTasks, fetchOnHoldTasks,
   fetchCompletedTasks, fetchUnderReviewTasks,
     getPendingTaskCount, 
    copyFilePath, copyFolderPath, fetchProjectWiseTasks, fetchTaskWiseFilePaths };