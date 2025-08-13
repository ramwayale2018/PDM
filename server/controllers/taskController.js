import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import db from '../database/db.js';
import taskModel from '../models/taskModel.js';
import moment from 'moment';
import AdmZip from 'adm-zip';
import { fileURLToPath } from 'url';
const { insertProduct, getProjects, assignUsersToProduct, updateProduct } =
  taskModel;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Base Dir
const getBaseDir = async () => {
  try {
    const [rows] = await db.query(
      'SELECT folder_path FROM store_folder_path ORDER BY timestamp DESC LIMIT 1',
    );
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

const resolveFilePath = async (filePath) => {
  try {
    const [rows] = await db.query(
      'SELECT folder_path FROM store_folder_path ORDER BY timestamp DESC LIMIT 1',
    );
    if (rows.length === 0) {
      throw new Error('Base directory not found in the database.');
    }

    const localBaseDir = rows[0].folder_path;

    const folderName = path.basename(localBaseDir);

    const networkBaseDir = `\\\\MPST-004\\${folderName}`;

    // Convert local path to network path
    if (filePath.startsWith(localBaseDir)) {
      return filePath.replace(localBaseDir, networkBaseDir);
    }

    // If the path is already a network path, return it as is
    if (filePath.startsWith(networkBaseDir)) {
      return filePath;
    }

    // If the path is relative, resolve it against the network base directory
    return path.join(networkBaseDir, filePath);
  } catch (err) {
    console.error('Error resolving file path:', err);
    throw new Error('Error resolving file path: ' + err.message);
  }
};

const fsWrapper = {
  existsSync: async (filePath) =>
    fs.existsSync(await resolveFilePath(filePath)),
  readdirSync: async (dirPath) =>
    fs.readdirSync(await resolveFilePath(dirPath)),
  createReadStream: async (filePath, options) =>
    fs.createReadStream(await resolveFilePath(filePath), options),
  createWriteStream: async (filePath, options) =>
    fs.createWriteStream(await resolveFilePath(filePath), options),
  unlinkSync: async (filePath) =>
    fs.unlinkSync(await resolveFilePath(filePath)),
  mkdirSync: async (dirPath, options) =>
    fs.mkdirSync(await resolveFilePath(dirPath), options),
  writeFileSync: async (filePath, data, options) =>
    fs.writeFileSync(await resolveFilePath(filePath), data, options),
  readFileSync: async (filePath, options) =>
    fs.readFileSync(await resolveFilePath(filePath), options),
  statSync: async (filePath) => fs.statSync(await resolveFilePath(filePath)),
};

//DFX Dir
const getDfxDir = async () => {
  try {
    const [rows] = await db.query(
      'SELECT dfx_folder_path FROM store_dfx_folder_path ORDER BY timestamp DESC LIMIT 1',
    );
    if (rows.length > 0) {
      return rows[0].dfx_folder_path;
    } else {
      throw new Error('Base directory not found in the database.');
    }
  } catch (err) {
    console.error('Error fetching BASE_DIR:', err);
    throw new Error('Error fetching the base directory: ' + err.message);
  }
};

const resolveDfxFilePath = async (filePath) => {
  try {
    const [rows] = await db.query(
      'SELECT dfx_folder_path FROM store_dfx_folder_path ORDER BY timestamp DESC LIMIT 1',
    );
    if (rows.length === 0) {
      throw new Error('Base directory not found in the database.');
    }

    const localBaseDir = rows[0].dfx_folder_path;

    const folderName = path.basename(localBaseDir);

    const networkBaseDir = `\\\\MPST-004\\${folderName}`;

    // Convert local path to network path
    if (filePath.startsWith(localBaseDir)) {
      return filePath.replace(localBaseDir, networkBaseDir);
    }

    // If the path is already a network path, return it as is
    if (filePath.startsWith(networkBaseDir)) {
      return filePath;
    }

    // If the path is relative, resolve it against the network base directory
    return path.join(networkBaseDir, filePath);
  } catch (err) {
    console.error('Error resolving file path:', err);
    throw new Error('Error resolving file path: ' + err.message);
  }
};

const dfxFsWrapper = {
  existsSync: async (filePath) =>
    fs.existsSync(await resolveDfxFilePath(filePath)),
  readdirSync: async (dirPath) =>
    fs.readdirSync(await resolveDfxFilePath(dirPath)),
  createReadStream: async (filePath, options) =>
    fs.createReadStream(await resolveDfxFilePath(filePath), options),
  createWriteStream: async (filePath, options) =>
    fs.createWriteStream(await resolveDfxFilePath(filePath), options),
  unlinkSync: async (filePath) =>
    fs.unlinkSync(await resolveDfxFilePath(filePath)),
  mkdirSync: async (dirPath, options) =>
    fs.mkdirSync(await resolveDfxFilePath(dirPath), options),
  writeFileSync: async (filePath, data, options) =>
    fs.writeFileSync(await resolveDfxFilePath(filePath), data, options),
  readFileSync: async (filePath, options) =>
    fs.readFileSync(await resolveDfxFilePath(filePath), options),
  statSync: async (filePath) => fs.statSync(await resolveDfxFilePath(filePath)),
};

//Library Dir
const getLibraryDir = async () => {
  try {
    const [rows] = await db.query(
      'SELECT library_folder_path FROM store_library_folder_path ORDER BY timestamp DESC LIMIT 1',
    );
    if (rows.length > 0) {
      return rows[0].library_folder_path;
    } else {
      throw new Error('Base directory not found in the database.');
    }
  } catch (err) {
    console.error('Error fetching BASE_DIR:', err);
    throw new Error('Error fetching the base directory: ' + err.message);
  }
};

const resolveLibraryFilePath = async (filePath) => {
  try {
    const [rows] = await db.query(
      'SELECT library_folder_path FROM store_library_folder_path ORDER BY timestamp DESC LIMIT 1',
    );
    if (rows.length === 0) {
      throw new Error('Base directory not found in the database.');
    }

    const localBaseDir = rows[0].library_folder_path;

    const folderName = path.basename(localBaseDir);

    const networkBaseDir = `\\\\MPST-004\\${folderName}`;

    // Convert local path to network path
    if (filePath.startsWith(localBaseDir)) {
      return filePath.replace(localBaseDir, networkBaseDir);
    }

    // If the path is already a network path, return it as is
    if (filePath.startsWith(networkBaseDir)) {
      return filePath;
    }

    // If the path is relative, resolve it against the network base directory
    return path.join(networkBaseDir, filePath);
  } catch (err) {
    console.error('Error resolving file path:', err);
    throw new Error('Error resolving file path: ' + err.message);
  }
};

const LibraryFsWrapper = {
  existsSync: async (filePath) =>
    fs.existsSync(await resolveLibraryFilePath(filePath)),
  readdirSync: async (dirPath) =>
    fs.readdirSync(await resolveLibraryFilePath(dirPath)),
  createReadStream: async (filePath, options) =>
    fs.createReadStream(await resolveLibraryFilePath(filePath), options),
  createWriteStream: async (filePath, options) =>
    fs.createWriteStream(await resolveLibraryFilePath(filePath), options),
  unlinkSync: async (filePath) =>
    fs.unlinkSync(await resolveLibraryFilePath(filePath)),
  mkdirSync: async (dirPath, options) =>
    fs.mkdirSync(await resolveLibraryFilePath(dirPath), options),
  writeFileSync: async (filePath, data, options) =>
    fs.writeFileSync(await resolveLibraryFilePath(filePath), data, options),
  readFileSync: async (filePath, options) =>
    fs.readFileSync(await resolveLibraryFilePath(filePath), options),
  statSync: async (filePath) =>
    fs.statSync(await resolveLibraryFilePath(filePath)),
};

//Old DFX Dir
const getOldDfxDir = async () => {
  try {
    const [rows] = await db.query(
      'SELECT old_dfx_folder_path FROM store_old_dfx_folder_path ORDER BY timestamp DESC LIMIT 1',
    );
    if (rows.length > 0) {
      return rows[0].old_dfx_folder_path;
    } else {
      throw new Error('Base directory not found in the database.');
    }
  } catch (err) {
    console.error('Error fetching BASE_DIR:', err);
    throw new Error('Error fetching the base directory: ' + err.message);
  }
};

const resolveOldDfxFilePath = async (filePath) => {
  try {
    const [rows] = await db.query(
      'SELECT old_dfx_folder_path FROM store_old_dfx_folder_path ORDER BY timestamp DESC LIMIT 1',
    );
    if (rows.length === 0) {
      throw new Error('Base directory not found in the database.');
    }

    const localBaseDir = rows[0].old_dfx_folder_path;

    const folderName = path.basename(localBaseDir);

    const networkBaseDir = `\\\\MPST-004\\${folderName}`;

    // Convert local path to network path
    if (filePath.startsWith(localBaseDir)) {
      return filePath.replace(localBaseDir, networkBaseDir);
    }

    // If the path is already a network path, return it as is
    if (filePath.startsWith(networkBaseDir)) {
      return filePath;
    }

    // If the path is relative, resolve it against the network base directory
    return path.join(networkBaseDir, filePath);
  } catch (err) {
    console.error('Error resolving file path:', err);
    throw new Error('Error resolving file path: ' + err.message);
  }
};

const OldDfxFsWrapper = {
  existsSync: async (filePath) =>
    fs.existsSync(await resolveOldDfxFilePath(filePath)),
  readdirSync: async (dirPath) =>
    fs.readdirSync(await resolveOldDfxFilePath(dirPath)),
  createReadStream: async (filePath, options) =>
    fs.createReadStream(await resolveOldDfxFilePath(filePath), options),
  createWriteStream: async (filePath, options) =>
    fs.createWriteStream(await resolveOldDfxFilePath(filePath), options),
  unlinkSync: async (filePath) =>
    fs.unlinkSync(await resolveOldDfxFilePath(filePath)),
  mkdirSync: async (dirPath, options) =>
    fs.mkdirSync(await resolveOldDfxFilePath(dirPath), options),
  writeFileSync: async (filePath, data, options) =>
    fs.writeFileSync(await resolveOldDfxFilePath(filePath), data, options),
  readFileSync: async (filePath, options) =>
    fs.readFileSync(await resolveOldDfxFilePath(filePath), options),
  statSync: async (filePath) =>
    fs.statSync(await resolveOldDfxFilePath(filePath)),
};

const uploadLibraryFiles = async (req, res) => {
  const { userId: bodyUserId, replace } = req.body;
  const files = req.files;

  let userId = req.session?.user?.id || bodyUserId;

  if (!userId) {
    console.error('Validation failed: userId is missing.', { userId });
    return res.status(400).json({ message: 'User ID is required.' });
  }

  userId = parseInt(userId, 10);
  if (isNaN(userId)) {
    console.error('Validation failed: userId is invalid.', { userId });
    return res.status(400).json({ message: 'Valid User ID is required.' });
  }

  if (!files || files.length === 0) {
    console.error('Validation failed:', { files });
    return res.status(400).json({ message: 'Library files are required.' });
  }

  try {
    // Get the library directory
    const libraryDir = await getLibraryDir();
    if (!libraryDir) {
      throw new Error('Library directory could not be retrieved.');
    }

    // Ensure the library directory exists
    if (!(await LibraryFsWrapper.existsSync(libraryDir))) {
      await LibraryFsWrapper.mkdirSync(libraryDir, { recursive: true });
    }

    const filePaths = [];

    for (const file of files) {
      const filePath = path.join(libraryDir, file.originalname);

      // Check if the file already exists
      if ((await LibraryFsWrapper.existsSync(filePath)) && !replace) {
        return res.status(409).json({
          message: `File ${file.originalname} already exists. Do you want to replace it?`,
        });
      }

      if (
        file.mimetype === 'application/zip' ||
        file.originalname.endsWith('.zip')
      ) {
        try {
          const zip = new AdmZip(file.buffer);
          const zipEntries = zip.getEntries();

          zipEntries.forEach((entry) => {
            if (!entry.isDirectory) {
              const fullPath = path.join(libraryDir, entry.entryName);
              filePaths.push(fullPath);

              // Extract the file
              zip.extractEntryTo(entry, libraryDir, false, true);
            }
          });

          console.log(`Extracted zip file: ${file.originalname}`);
        } catch (zipError) {
          console.error('Error extracting zip file:', zipError.message);
          throw new Error('Failed to extract zip file.');
        }
      } else {
        try {
          // Save the file
          await LibraryFsWrapper.writeFileSync(filePath, file.buffer);
          filePaths.push(filePath);
        } catch (fsError) {
          console.error('Error saving file:', fsError.message);
          throw new Error('Failed to save library file.');
        }
      }
    }

    // Insert file paths into the library_files table
    for (const filePath of filePaths) {
      await insertLibraryFile(userId, filePath);
    }

    res.status(201).json({ message: 'Library files uploaded successfully.' });
  } catch (error) {
    console.error('Error uploading library files:', error.message);
    res.status(500).json({
      message: 'An error occurred while uploading the library files.',
    });
  }
};

const insertLibraryFile = async (userId, filePath) => {
  try {
    console.log('Inserting library file:', { userId, filePath });

    const sql = `
      INSERT INTO library_files (user_id, library_file_path)
      VALUES (?, ?)
    `;

    console.log('Executing SQL for insertLibraryFile:', sql);
    console.log('With parameters:', [userId, filePath]);

    await db.query(sql, [userId, filePath]);

    console.log('Library file inserted successfully.');
  } catch (error) {
    throw new Error(`Failed to insert library file: ${error.message}`);
  }
};

const fetchLibraryFiles = async (req, res) => {
  try {
    // Fetch all library files from the database
    const [results] = await db.query('SELECT * FROM library_files');

    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'No library files found.' });
    }

    // Return the list of library files
    res.status(200).json({
      message: 'Library files fetched successfully.',
      files: results,
    });
  } catch (error) {
    console.error('Error fetching library files:', error.message);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching library files.' });
  }
};

const downloadLibraryDesign = async (req, res) => {
  const { fileId } = req.params;

  // Validate fileId
  if (!fileId || isNaN(parseInt(fileId, 10))) {
    console.error('Validation failed: fileId is missing or invalid.', {
      fileId,
    });
    return res.status(400).json({ message: 'Valid File ID is required.' });
  }

  try {
    // Fetch the file path from the database
    const [results] = await db.query(
      'SELECT library_file_path FROM library_files WHERE l_id = ?',
      [fileId],
    );

    if (results.length === 0) {
      console.error('File not found in the database for fileId:', fileId);
      return res
        .status(404)
        .json({ message: 'File not found in the database.' });
    }

    const filePath = results[0].library_file_path;
    console.log('Retrieved filePath from database:', filePath);

    // Check if the file exists
    if (!(await LibraryFsWrapper.existsSync(filePath))) {
      console.error('File does not exist:', filePath);
      return res.status(404).json({ message: 'File not found on the server.' });
    }

    // Download the file
    res.download(filePath, (err) => {
      if (err) {
        console.error('Error downloading file:', err.message);
        res
          .status(500)
          .json({ message: 'An error occurred while downloading the file.' });
      }
    });
  } catch (error) {
    console.error('Error fetching file:', error.message);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching the file.' });
  }
};

// const pdfUpload = async (req, res) => {
//   const { productId, revision } = req.body;
//   const files = req.files;

//   let userId = req.session?.user?.id || req.body.userId;
//   userId = parseInt(userId, 10);
//   const userRole = req.session?.user?.role;

//   if (isNaN(userId)) {
//     console.error('Validation failed: userId is missing or invalid.', {
//       userId,
//     });
//     return res.status(400).json({ message: 'Valid User ID is required.' });
//   }

//   if (!productId || !files || files.length === 0 || !revision) {
//     console.error('Validation failed:', { productId, files, revision });
//     return res
//       .status(400)
//       .json({ message: 'Product ID, revision, and PDF files are required.' });
//   }

//   try {
//     // Fetch product name
//     const results = await db.query(
//       'SELECT product_name FROM products WHERE product_id = ?',
//       [productId],
//     );
//     const product = results[0][0];
//     if (!product || !product.product_name) {
//       return res
//         .status(404)
//         .json({ message: 'Product not found or product name is missing.' });
//     }
//     const productName = product.product_name;

//     const baseDir = await getBaseDir();
//     if (!baseDir) throw new Error('Base directory could not be retrieved.');

//     const productFolder = path.join(baseDir, productName);
//     if (!fs.existsSync(productFolder)) {
//       return res
//         .status(404)
//         .json({ message: 'Product folder does not exist.' });
//     }

//     // Fetch the latest revision_id
//     const [revisionResults] = await db.query(
//       'SELECT r_id FROM revision WHERE product_id = ? ORDER BY timestamp DESC LIMIT 1',
//       [productId],
//     );

//     if (revisionResults.length === 0) {
//       return res
//         .status(404)
//         .json({ message: 'No revisions found for the given product.' });
//     }

//     const revisionId = revisionResults[0].r_id;
//     console.log(`Revision ID: ${revisionId}`);

//     // Check for existing version folders inside the product folder
//     const revisionBasePath = path.join(productFolder, revision);
//     const revisionFolders = fs
//       .readdirSync(productFolder)
//       .filter((folder) => folder.startsWith(`${revision}_v`))
//       .map((folder) => ({
//         folder,
//         version: parseInt(folder.replace(`${revision}_v`, ''), 10),
//       }))
//       .sort((a, b) => b.version - a.version); // Sort in descending order

//     let targetRevisionFolder;
//     let versionNumber = 0;

//     if (revisionFolders.length > 0) {
//       // Use the latest version folder
//       targetRevisionFolder = path.join(
//         productFolder,
//         revisionFolders[0].folder,
//       );
//       versionNumber = revisionFolders[0].version;
//       console.log(
//         `Using existing revision version folder: ${revisionFolders[0].folder} (Version: ${versionNumber})`,
//       );
//     } else {
//       // Use the default revision folder
//       targetRevisionFolder = revisionBasePath;
//       console.log(
//         `No revision version folder found. Using base revision folder: ${revision}`,
//       );
//     }

//     // Create 'pdf_documents' folder inside the chosen revision folder
//     const pdfFolder = path.join(targetRevisionFolder, 'pdf_documents');
//     if (!fs.existsSync(pdfFolder)) {
//       fs.mkdirSync(pdfFolder, { recursive: true });
//     }

//     console.log(`PDF documents will be uploaded to: ${pdfFolder}`);
//     console.log(`File Not Found in the System: ${pdfFolder}`);

//     const filePaths = [];
//     for (const file of files) {
//       if (file.mimetype !== 'application/pdf') {
//         return res.status(400).json({ message: 'Only PDF files are allowed.' });
//       }

//       const fileName = file.originalname;
//       const filePath = path.join(pdfFolder, fileName);

//       try {
//         fs.writeFileSync(filePath, file.buffer);
//         filePaths.push(filePath);
//       } catch (fsError) {
//         console.error('Error saving file:', filePath, fsError.message);
//         throw new Error('Failed to save PDF file.');
//       }
//     }

//     console.log('Uploaded PDF files:', filePaths);

//     // Insert records into the database with version number
//     for (const filePath of filePaths) {
//       await insertPdfDocument(
//         productId,
//         revisionId,
//         userId,
//         filePath,
//         versionNumber,
//       );
//     }

//     if (userRole === 'designer') {
//       await db.query(
//         "UPDATE products SET status = 'under_review' WHERE product_id = ?",
//         [productId],
//       );
//     }

//     res.status(201).json({ message: 'PDF files uploaded successfully.' });
//   } catch (error) {
//     console.error('Error uploading PDF:', error.message);
//     res
//       .status(500)
//       .json({ message: 'An error occurred while uploading the PDF files.' });
//   }
// };

const pdfUpload1 = async (req, res) => {
  const { productId, revision } = req.body;
  const files = req.files;

  let userId = req.session?.user?.id || req.body.userId;
  userId = parseInt(userId, 10);
  const userRole = req.session?.user?.role;

  if (isNaN(userId)) {
    console.error('Validation failed: userId is missing or invalid.', {
      userId,
    });
    return res.status(400).json({ message: 'Valid User ID is required.' });
  }

  if (!productId || !files || files.length === 0 || !revision) {
    console.error('Validation failed:', { productId, files, revision });
    return res
      .status(400)
      .json({ message: 'Product ID, revision, and PDF files are required.' });
  }

  try {
    // Fetch product name
    const results = await db.query(
      'SELECT product_name FROM products WHERE product_id = ?',
      [productId],
    );
    const product = results[0][0];
    if (!product || !product.product_name) {
      return res
        .status(404)
        .json({ message: 'Product not found or product name is missing.' });
    }
    const productName = product.product_name;

    const baseDir = await getBaseDir();
    if (!baseDir) throw new Error('Base directory could not be retrieved.');

    const productFolder = path.join(baseDir, productName);
    if (!fs.existsSync(productFolder)) {
      return res
        .status(404)
        .json({ message: 'Product folder does not exist.' });
    }

    // Fetch the latest revision_id
    const [revisionResults] = await db.query(
      'SELECT r_id FROM revision WHERE product_id = ? ORDER BY timestamp DESC LIMIT 1',
      [productId],
    );

    if (revisionResults.length === 0) {
      return res
        .status(404)
        .json({ message: 'No revisions found for the given product.' });
    }

    const revisionId = revisionResults[0].r_id;
    console.log(`Revision ID: ${revisionId}`);

    // Check for existing version folders inside the product folder
    const revisionBasePath = path.join(productFolder, revision);
    const revisionFolders = fs
      .readdirSync(productFolder)
      .filter((folder) => folder.startsWith(`${revision}_v`))
      .map((folder) => ({
        folder,
        version: parseInt(folder.replace(`${revision}_v`, ''), 10),
      }))
      .sort((a, b) => b.version - a.version); // Sort in descending order

    let targetRevisionFolder;
    let versionNumber = 0;

    if (revisionFolders.length > 0) {
      // Use the latest version folder
      targetRevisionFolder = path.join(
        productFolder,
        revisionFolders[0].folder,
      );
      versionNumber = revisionFolders[0].version;
      console.log(
        `Using existing revision version folder: ${revisionFolders[0].folder} (Version: ${versionNumber})`,
      );
    } else {
      // Use the default revision folder
      targetRevisionFolder = revisionBasePath;
      console.log(
        `No revision version folder found. Using base revision folder: ${revision}`,
      );
    }

    // Create 'pdf_documents' folder inside the chosen revision folder
    const pdfFolder = path.join(targetRevisionFolder, 'PDF DATA');
    if (!fs.existsSync(pdfFolder)) {
      fs.mkdirSync(pdfFolder, { recursive: true });
    }

    console.log(`PDF documents will be uploaded to: ${pdfFolder}`);
    console.log(`File Not Found in the System: ${pdfFolder}`);

    const filePaths = [];
    const newlyUploadedFiles = [];
    for (const file of files) {
      if (file.mimetype !== 'application/pdf') {
        return res.status(400).json({ message: 'Only PDF files are allowed.' });
      }

      const fileName = file.originalname;
      const filePath = path.join(pdfFolder, fileName);

      const fileAlreadyExists = fs.existsSync(filePath);

      try {
        fs.writeFileSync(filePath, file.buffer);
        filePaths.push(filePath);

        if (!fileAlreadyExists) {
          newlyUploadedFiles.push(filePath); // Only push if file was not already existing
        }
      } catch (fsError) {
        console.error('Error saving file:', filePath, fsError.message);
        throw new Error('Failed to save PDF file.');
      }
    }

    console.log('Uploaded PDF files:', filePaths);

    // Insert records into the database with version number
    for (const filePath of newlyUploadedFiles) {
      await insertPdfDocument(
        productId,
        revisionId,
        userId,
        filePath,
        versionNumber,
      );
    }

    if (userRole === 'designer') {
      await db.query(
        "UPDATE products SET status = 'under_review' WHERE product_id = ?",
        [productId],
      );
    }

    res.status(201).json({ message: 'PDF files uploaded successfully.' });
  } catch (error) {
    console.error('Error uploading PDF:', error.message);
    res
      .status(500)
      .json({ message: 'An error occurred while uploading the PDF files.' });
  }
};

const pdfUpload2 = async (req, res) => {
  const { productId, revision, overwrite = 'false' } = req.body; // <-- corrected key name
  const files = req.files;

  let userId = req.session?.user?.id || req.body.userId;
  userId = parseInt(userId, 10);
  const userRole = req.session?.user?.role;

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Valid User ID is required.' });
  }

  if (!productId || !files || files.length === 0 || !revision) {
    return res.status(400).json({
      message: 'Product ID, revision, and PDF files are required.',
    });
  }

  try {
    const results = await db.query(
      'SELECT product_name FROM products WHERE product_id = ?',
      [productId],
    );
    const product = results[0][0];
    if (!product || !product.product_name) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const productName = product.product_name;
    const baseDir = await getBaseDir();
    if (!baseDir) throw new Error('Base directory could not be retrieved.');

    const productFolder = path.join(baseDir, productName);
    if (!fs.existsSync(productFolder)) {
      return res
        .status(404)
        .json({ message: 'Product folder does not exist.' });
    }

    const [revisionResults] = await db.query(
      'SELECT r_id FROM revision WHERE product_id = ? ORDER BY timestamp DESC LIMIT 1',
      [productId],
    );
    if (revisionResults.length === 0) {
      return res
        .status(404)
        .json({ message: 'No revisions found for the given product.' });
    }

    const revisionId = revisionResults[0].r_id;
    const revisionBasePath = path.join(productFolder, revision);

    const revisionFolders = fs
      .readdirSync(productFolder)
      .filter((folder) => folder.startsWith(`${revision}_v`))
      .map((folder) => ({
        folder,
        version: parseInt(folder.replace(`${revision}_v`, ''), 10),
      }))
      .sort((a, b) => b.version - a.version);

    let targetRevisionFolder;
    let versionNumber = 0;

    if (revisionFolders.length > 0) {
      targetRevisionFolder = path.join(
        productFolder,
        revisionFolders[0].folder,
      );
      versionNumber = revisionFolders[0].version;
    } else {
      targetRevisionFolder = revisionBasePath;
    }

    const pdfFolder = path.join(targetRevisionFolder, 'PDF DATA');
    if (!fs.existsSync(pdfFolder)) {
      fs.mkdirSync(pdfFolder, { recursive: true });
    }

    const filePaths = [];
    const newlyUploadedFiles = [];
    const duplicateFiles = [];

    for (const file of files) {
      if (file.mimetype !== 'application/pdf') {
        return res.status(400).json({ message: 'Only PDF files are allowed.' });
      }

      const fileName = file.originalname;
      const filePath = path.join(pdfFolder, fileName);

      const fileAlreadyExists = fs.existsSync(filePath);

      // if (fileAlreadyExists && overwrite !== 'true') {
      //   duplicateFiles.push(fileName);
      //   continue; // Skip writing
      // }

      if (fileAlreadyExists) {
        if (overwrite === 'true') {
          // Proceed to overwrite the file
          console.log(`Overwriting existing file: ${fileName}`);
        } else {
          duplicateFiles.push(fileName);
          continue; // Skip writing
        }
      }

      try {
        fs.writeFileSync(filePath, file.buffer);
        filePaths.push(filePath);
        if (!fileAlreadyExists) {
          newlyUploadedFiles.push(filePath);
        }
      } catch (fsError) {
        console.error('Error saving file:', filePath, fsError.message);
        throw new Error('Failed to save PDF file.');
      }
    }

    if (duplicateFiles.length > 0 && overwrite !== 'true') {
      return res.status(409).json({
        message: 'Some files already exist.',
        duplicates: duplicateFiles,
      });
    }

    for (const filePath of newlyUploadedFiles) {
      await insertPdfDocument(
        productId,
        revisionId,
        userId,
        filePath,
        versionNumber,
      );
    }

    if (userRole === 'designer') {
      const [[designExists]] = await db.query(
        'SELECT 1 FROM design_upload WHERE product_id = ? LIMIT 1',
        [productId],
      );

      const [[laserExists]] = await db.query(
        'SELECT 1 FROM laser_design_upload WHERE product_id = ? LIMIT 1',
        [productId],
      );

      if (designExists && laserExists) {
        await db.query(
          "UPDATE products SET status = 'under_review' WHERE product_id = ?",
          [productId],
        );
        console.log('Product status updated to under_review');
      } else {
        console.log(
          'Product ID not found in both design_upload and laser_design_upload. Skipping status update.',
        );
      }
    }

    res.status(201).json({ message: 'PDF files uploaded successfully.' });
  } catch (error) {
    console.error('Error uploading PDF:', error.message);
    res
      .status(500)
      .json({ message: 'An error occurred while uploading the PDF files.' });
  }
};


const pdfUpload = async (req, res) => {
  const { productId, revision, overwrite = 'false' } = req.body;
  const files = req.files;

  let userId = req.session?.user?.id || req.body.userId;
  userId = parseInt(userId, 10);
  const userRole = req.session?.user?.role;

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Valid User ID is required.' });
  }

  if (!productId || !files || files.length === 0 || !revision) {
    return res.status(400).json({
      message: 'Product ID, revision, and PDF files are required.',
    });
  }

  try {
    const results = await db.query(
      'SELECT product_name FROM products WHERE product_id = ?',
      [productId]
    );
    const product = results[0][0];
    if (!product || !product.product_name) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const productName = product.product_name;
    const baseDir = await getBaseDir();
    if (!baseDir) throw new Error('Base directory could not be retrieved.');

    const productFolder = path.join(baseDir, productName);
    if (!fs.existsSync(productFolder)) {
      return res.status(404).json({ message: 'Product folder does not exist.' });
    }

    const [revisionResults] = await db.query(
      'SELECT r_id FROM revision WHERE product_id = ? ORDER BY timestamp DESC LIMIT 1',
      [productId]
    );
    if (revisionResults.length === 0) {
      return res.status(404).json({ message: 'No revisions found for the given product.' });
    }

    const revisionId = revisionResults[0].r_id;
    const revisionBasePath = path.join(productFolder, revision);

    const revisionFolders = fs
      .readdirSync(productFolder)
      .filter((folder) => folder.startsWith(`${revision}_v`))
      .map((folder) => ({
        folder,
        version: parseInt(folder.replace(`${revision}_v`, ''), 10),
      }))
      .sort((a, b) => b.version - a.version);

    let targetRevisionFolder;
    let versionNumber = 0;

    if (revisionFolders.length > 0) {
      targetRevisionFolder = path.join(productFolder, revisionFolders[0].folder);
      versionNumber = revisionFolders[0].version;
    } else {
      targetRevisionFolder = revisionBasePath;
    }

    const pdfFolder = path.join(targetRevisionFolder, 'PDF DATA');
    if (!fs.existsSync(pdfFolder)) {
      fs.mkdirSync(pdfFolder, { recursive: true });
    }

    const duplicateFiles = [];
    const allSavedFiles = [];

    for (const file of files) {
      if (file.mimetype !== 'application/pdf') {
        return res.status(400).json({ message: 'Only PDF files are allowed.' });
      }

      const fileName = file.originalname;
      const filePath = path.join(pdfFolder, fileName);
      const fileAlreadyExists = fs.existsSync(filePath);

      if (fileAlreadyExists && overwrite !== 'true') {
        duplicateFiles.push(fileName);
        continue;
      }

      try {
        fs.writeFileSync(filePath, file.buffer); // overwrite or write new
        allSavedFiles.push(filePath); // track both new and overwritten
      } catch (fsError) {
        console.error('Error saving file:', filePath, fsError.message);
        throw new Error('Failed to save PDF file.');
      }
    }

    if (duplicateFiles.length > 0 && overwrite !== 'true') {
      return res.status(409).json({
        message: 'Some files already exist.',
        duplicates: duplicateFiles,
      });
    }

    // Save all files (both new and overwritten) in DB
    for (const filePath of allSavedFiles) {
      // Optional: check if already exists in DB
      const [existing] = await db.query(
        'SELECT pdf_file_path FROM pdf_documents WHERE pdf_file_path = ?',
        [filePath]
      );
      if (existing.length === 0) {
        await insertPdfDocument(productId, revisionId, userId, filePath, versionNumber);
      } else {
        console.log('Skipping DB insert (already exists):', filePath);
      }
    }

    // Auto-update product status if needed
    if (userRole === 'designer') {
      const [[designExists]] = await db.query(
        'SELECT 1 FROM design_upload WHERE product_id = ? LIMIT 1',
        [productId]
      );

      const [[laserExists]] = await db.query(
        'SELECT 1 FROM laser_design_upload WHERE product_id = ? LIMIT 1',
        [productId]
      );

      if (designExists && laserExists) {
        await db.query(
          "UPDATE products SET status = 'under_review' WHERE product_id = ?",
          [productId]
        );
        console.log('Product status updated to under_review');
      } else {
        console.log('Design/Laser upload missing. Skipping status update.');
      }
    }

    res.status(201).json({ message: 'PDF files uploaded successfully.' });
  } catch (error) {
    console.error('Error uploading PDF:', error.message);
    res.status(500).json({ message: 'An error occurred while uploading the PDF files.' });
  }
};






const deleteCustomerDocDocument = async (req, res) => {
  const { pdId } = req.params;

  if (!pdId || isNaN(parseInt(pdId, 10))) {
    return res.status(400).json({ message: 'Valid PD ID is required.' });
  }

  try {
    const query = 'SELECT file_path FROM product_documents WHERE pd_id = ?';
    const [result] = await db.query(query, [pdId]);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: 'Customer document not found.' });
    }

    const custDocFilePath = result[0].file_path.trim();

    if (fs.existsSync(custDocFilePath)) {
      fs.unlinkSync(custDocFilePath);
      console.log(`✅ Deleted file: ${custDocFilePath}`);
    } else {
      console.warn(`⚠️ File not found: ${custDocFilePath}`);
    }

    // Delete the record from the database
    const deleteQuery = 'DELETE FROM product_documents WHERE pd_id = ?';
    await db.query(deleteQuery, [pdId]);

    res
      .status(200)
      .json({ message: 'Customer document deleted successfully.' });
  } catch (error) {
    console.error('❌ Error deleting customer document:', error.message);
    res
      .status(500)
      .json({
        message: 'An error occurred while deleting the customer document.',
      });
  }
};

const insertPdfDocument = async (
  productId,
  revisionId,
  userId,
  filePath,
  version,
) => {
  try {
    const [userResults] = await db.query('SELECT id FROM users WHERE id = ?', [
      userId,
    ]);
    if (userResults.length === 0) {
      throw new Error(`User ID ${userId} does not exist.`);
    }

    await db.query(
      'INSERT INTO pdf_documents (product_id, revision_id, user_id, pdf_file_path, version) VALUES (?, ?, ?, ?, ?)',
      [productId, revisionId, userId, filePath, version],
    );

    console.log(
      `PDF document record inserted successfully with version ${version}`,
    );
  } catch (error) {
    console.error('Error inserting PDF document record:', error.message);
    throw new Error('Failed to insert PDF document record');
  }
};

const getProductPdfDocuments = async (req, res) => {
  const { productId, revisionId, version } = req.params;

  if (!productId || isNaN(parseInt(productId, 10))) {
    return res.status(400).json({ message: 'Valid Product ID is required.' });
  }

  let selectedRevisionId = revisionId;
  let selectedVersion = version;

  try {
    if (!revisionId || isNaN(parseInt(revisionId, 10))) {
      const latestRevisionQuery = `
        SELECT r_id FROM revision
        WHERE product_id = ? 
        ORDER BY timestamp DESC 
        LIMIT 1
      `;
      const [latestRevisionResult] = await db.query(latestRevisionQuery, [
        productId,
      ]);

      if (!latestRevisionResult || latestRevisionResult.length === 0) {
        return res
          .status(404)
          .json({ message: 'No revisions found for this product.' });
      }

      selectedRevisionId = latestRevisionResult[0].r_id;
    }

    if (!version) {
      const latestVersionQuery = `
        SELECT version FROM pdf_documents
        WHERE product_id = ? AND revision_id = ?
        ORDER BY version DESC 
        LIMIT 1
      `;
      const [latestVersionResult] = await db.query(latestVersionQuery, [
        productId,
        selectedRevisionId,
      ]);

      if (latestVersionResult.length > 0) {
        selectedVersion = latestVersionResult[0].version;
      } else {
        selectedVersion = null;
      }
    } else {
      const versionExistsQuery = `
        SELECT version FROM pdf_documents
        WHERE product_id = ? AND revision_id = ? AND version = ?
      `;
      const [versionExistsResult] = await db.query(versionExistsQuery, [
        productId,
        selectedRevisionId,
        version,
      ]);

      if (versionExistsResult.length === 0) {
        return res.status(404).json({
          message:
            'The specified version does not exist for the selected revision.',
        });
      }
    }

    let query = `
      SELECT p.pdf_id, p.product_id, p.revision_id, p.user_id, p.pdf_file_path, p.version, p.upload_timestamp, r.revision 
      FROM pdf_documents p
      JOIN revision r ON p.revision_id = r.r_id
      WHERE p.product_id = ? AND p.revision_id = ?
    `;

    const queryParams = [productId, selectedRevisionId];

    if (version) {
      query += ` AND version = ?`;
      queryParams.push(version);
    }

    query += ` ORDER BY upload_timestamp DESC`;

    const [results] = await db.query(query, queryParams);

    if (!results || results.length === 0) {
      return res.status(404).json({
        message:
          'No PDF documents found for the selected revision and version.',
      });
    }

    res.status(200).json({
      message: 'PDF documents fetched successfully.',
      revisionId: selectedRevisionId,
      version: selectedVersion || 'latest',
      files: results,
    });
  } catch (error) {
    console.error('Error fetching PDF documents:', error.message);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching PDF documents.' });
  }
};

const deletePdfDocument = async (req, res) => {
  const { pdfId } = req.params;

  if (!pdfId || isNaN(parseInt(pdfId, 10))) {
    return res.status(400).json({ message: 'Valid PDF ID is required.' });
  }

  try {
    const query = 'SELECT pdf_file_path FROM pdf_documents WHERE pdf_id = ?';
    const [result] = await db.query(query, [pdfId]);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: 'PDF document not found.' });
    }

    const pdfFilePath = result[0].pdf_file_path.trim();

    if (fs.existsSync(pdfFilePath)) {
      fs.unlinkSync(pdfFilePath);
      console.log(`✅ Deleted file: ${pdfFilePath}`);
    } else {
      console.warn(`⚠️ File not found: ${pdfFilePath}`);
    }

    // Delete the record from the database
    const deleteQuery = 'DELETE FROM pdf_documents WHERE pdf_id = ?';
    await db.query(deleteQuery, [pdfId]);

    res.status(200).json({ message: 'PDF document deleted successfully.' });
  } catch (error) {
    console.error('❌ Error deleting PDF document:', error.message);
    res
      .status(500)
      .json({ message: 'An error occurred while deleting the PDF document.' });
  }
};

export const deleteLaserDesign = async (req, res) => {
  const { lduId } = req.params;

  // Validate ID
  if (!lduId || !Number.isInteger(Number(lduId))) {
    return res.status(400).json({
      success: false,
      error: 'Invalid laser design ID format',
    });
  }

  try {
    // Check if file exists in database
    const [result] = await db.query(
      'SELECT laser_design_path FROM laser_design_upload WHERE ldu_id = ?',
      [lduId],
    );

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Laser design not found in database',
      });
    }

    const filePath = result[0].laser_design_path.trim();

    // Delete physical file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);
    } else {
      console.warn(`File not found at: ${filePath}`);
    }

    // Delete database record
    await db.query('DELETE FROM laser_design_upload WHERE ldu_id = ?', [lduId]);

    return res.status(200).json({
      success: true,
      message: 'Laser design deleted successfully',
      data: {
        deletedId: lduId,
        filePath: filePath,
      },
    });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message,
    });
  }
};

const downloadPDFDocument = async (req, res) => {
  const { pdfId } = req.params;

  try {
    const [results] = await db.query(
      'SELECT pdf_file_path FROM pdf_documents WHERE pdf_id = ?',
      [pdfId],
    );

    if (results.length === 0) {
      return res.status(404).json({ message: 'PDF document not found.' });
    }

    const filePath = results[0].pdf_file_path;
    res.download(filePath);
  } catch (error) {
    console.error('Error downloading PDF document:', error);
    res.status(500).json({
      message: 'An error occurred while downloading the PDF document.',
    });
  }
};

// PDF OPEN FILE

// const openPdfFile = async (req, res) => {
//   const { pdfId } = req.params;

//   if (!pdfId || isNaN(parseInt(pdfId, 10))) {
//     return res.status(400).json({ message: 'Valid PDF ID is required.' });
//   }

//   try {
//     const query = 'SELECT pdf_file_path FROM pdf_documents WHERE pdf_id = ?';
//     const [result] = await db.query(query, [pdfId]);

//     if (!result || result.length === 0) {
//       return res.status(404).json({ message: 'File not found.' });
//     }

//     let pdfFilePath = result[0].pdf_file_path.trim();
//     const baseDir = await getBaseDir();

//     if (!path.isAbsolute(pdfFilePath)) {
//       pdfFilePath = path.join(baseDir, pdfFilePath);
//     }

//     const resolvedPath = await resolveFilePath(pdfFilePath);

//     exec(`start "" "${resolvedPath}"`, (err) => {
//       if (err) {
//         console.error('Error opening file:', err);
//         return res.status(500).json({ message: 'Error opening the file.' });
//       }
//       res.status(200).json({ message: 'File opened successfully.' });
//     });
//   } catch (error) {
//     console.error('Error opening file:', error.message);
//     res.status(500).json({ message: 'An error occurred while opening the file.' });
//   }
// };

// const openPdfFile = async (req, res) => {
//   const { pdfId } = req.params;

//   if (!pdfId || isNaN(parseInt(pdfId, 10))) {
//     return res.status(400).json({ message: 'Valid PDF ID is required.' });
//   }

//   try {
//     const query = 'SELECT pdf_file_path FROM pdf_documents WHERE pdf_id = ?';
//     const [result] = await db.query(query, [pdfId]);

//     if (!result || result.length === 0) {
//       return res.status(404).json({ message: 'File not found.' });
//     }

//     let pdfFilePath = result[0].pdf_file_path.trim();
//     const baseDir = await getBaseDir();

//     if (!path.isAbsolute(pdfFilePath)) {
//       pdfFilePath = path.join(baseDir, pdfFilePath);
//     }
//     const relativePath = pdfFilePath.replace(baseDir,   "").replace(/\\/g, "/");

//     const fileUrl = `http://0.0.0.0:3003/${path.basename(pdfFilePath)}`;
//     res.status(200).json({ fileUrl });

//   } catch (error) {
//     console.error('Error opening file:', error.message);
//     res.status(500).json({ message: 'An error occurred while opening the file.' });
//   }
// };

// const openPdfFile = async (req, res) => {
//   const { pdfId } = req.params;

//   if (!pdfId || isNaN(parseInt(pdfId, 10))) {
//     return res.status(400).json({ message: 'Valid PDF ID is required.' });
//   }

//   try {
//     const query = 'SELECT pdf_file_path FROM pdf_documents WHERE pdf_id = ?';
//     const [result] = await db.query(query, [pdfId]);

//     if (!result || result.length === 0) {
//       return res.status(404).json({ message: 'File not found.' });
//     }

//     let pdfFilePath = result[0].pdf_file_path.trim();
//     const baseDir = await getBaseDir();  // Fetch base directory

//     if (!path.isAbsolute(pdfFilePath)) {
//       pdfFilePath = path.join(baseDir, pdfFilePath);  // Append base directory
//     }

//     // Convert Windows \ to / for URL compatibility
//     const relativePath = pdfFilePath.replace(baseDir, "").replace(/\\/g, "/");

//     const fileUrl = `http://0.0.0.0:3003/${path.basename(pdfFilePath)}`;
//     res.status(200).json({ fileUrl });

//   } catch (error) {
//     console.error('Error opening file:', error.message);
//     res.status(500).json({ message: 'An error occurred while opening the file.' });
//   }
// };

// 0 changes
// const openPdfFile = async (req, res) => {
//   const { pdfId } = req.params;

//   if (!pdfId || isNaN(parseInt(pdfId, 10))) {
//     return res.status(400).json({ message: 'Valid PDF ID is required.' });
//   }

//   try {
//     const query = 'SELECT pdf_file_path FROM pdf_documents WHERE pdf_id = ?';
//     const [result] = await db.query(query, [pdfId]);

//     if (!result || result.length === 0) {
//       return res.status(404).json({ message: 'File not found.' });
//     }

//     let pdfFilePath = result[0].pdf_file_path.trim();
//     const baseDir = await getBaseDir();  // Fetch base directory

//     if (!path.isAbsolute(pdfFilePath)) {
//       pdfFilePath = path.join(baseDir, pdfFilePath);  // Append base directory
//     }

//     // Convert Windows \ to / for URL compatibility
//     const relativePath = pdfFilePath.replace(baseDir, "").replace(/\\/g, "/");
//     console.log("PATH :",relativePath)
//     const fileUrl = `http://0.0.0.0:3003${relativePath}`;
//     res.status(200).json({ fileUrl });
//     console.log("PATH :",relativePath)

//   } catch (error) {
//     console.error('Error opening file:', error.message);
//     res.status(500).json({ message: 'An error occurred while opening the file.' });
//   }
// };

//1 chnage
// const openPdfFile = async (req, res) => {
//   const { pdfId } = req.params;

//   if (!pdfId || isNaN(parseInt(pdfId, 10))) {
//     return res.status(400).json({ message: 'Valid PDF ID is required.' });
//   }

//   try {
//     const query = 'SELECT pdf_file_path FROM pdf_documents WHERE pdf_id = ?';
//     const [result] = await db.query(query, [pdfId]);

//     if (!result || result.length === 0) {
//       return res.status(404).json({ message: 'File not found.' });
//     }

//     let pdfFilePath = result[0].pdf_file_path.trim();
//     const baseDir = await getBaseDir();

//     console.log("📂 Base Directory:", baseDir);
//     console.log("📄 PDF Path from DB:", pdfFilePath);

//     if (!path.isAbsolute(pdfFilePath)) {
//       pdfFilePath = path.join(baseDir, pdfFilePath);
//     }

//     console.log("✅ Resolved PDF Path:", pdfFilePath);

//     // Ensure the file exists before responding
//     if (!fs.existsSync(pdfFilePath)) {
//       return res.status(404).json({ message: "File does not exist on the server." });
//     }

//     // Convert Windows `\` to `/` and remove baseDir for URL
//     const relativePath = pdfFilePath.replace(baseDir, "").replace(/\\/g, "/");
//     console.log("🌍 URL Path:", relativePath);

//     // const fileUrl = `http://0.0.0.0:${port}${relativePath}`;
//     const fileUrl = `${req.protocol}://${req.get('host')}${relativePath}`;

//     res.status(200).json({ fileUrl });

//   } catch (error) {
//     console.error('❌ Error opening file:', error.message);
//     res.status(500).json({ message: 'An error occurred while opening the file.' });
//   }
// };

const openPdfFile = async (req, res) => {
  const { pdfId } = req.params;

  if (!pdfId || isNaN(parseInt(pdfId, 10))) {
    return res.status(400).json({ message: 'Valid PDF ID is required.' });
  }

  try {
    const query = 'SELECT pdf_file_path FROM pdf_documents WHERE pdf_id = ?';
    const [result] = await db.query(query, [pdfId]);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: 'File not found.' });
    }

    let pdfFilePath = result[0].pdf_file_path.trim();
    const baseDir = await getBaseDir();

    if (!path.isAbsolute(pdfFilePath)) {
      pdfFilePath = path.join(baseDir, pdfFilePath);
    }

    // Ensure the file exists before responding
    if (!fs.existsSync(pdfFilePath)) {
      return res
        .status(404)
        .json({ message: 'File does not exist on the server.' });
    }

    // Instead of returning a URL, stream the file with correct headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'inline; filename="' + path.basename(pdfFilePath) + '"',
    );
    fs.createReadStream(pdfFilePath).pipe(res);
  } catch (error) {
    console.error('❌ Error opening file:', error.message);
    res
      .status(500)
      .json({ message: 'An error occurred while opening the file.' });
  }
};

// 0 change

// const openCustDocFile = async (req, res) => {
//   const { pdId } = req.params;
//   if (!pdId || isNaN(parseInt(pdId, 10))) {
//     return res.status(400).json({ message: 'Valid PDF ID is required.' });
//   }
//   try {
//     const query = 'SELECT file_path FROM product_documents WHERE pd_id = ?';
//     const [result] = await db.query(query, [pdId]);
//     if (!result || result.length === 0) {
//       return res.status(404).json({ message: 'File not found.' });
//     }
//     let pdfFilePath = result[0].file_path.trim();
//     const baseDir = await getBaseDir();
//     if (!path.isAbsolute(pdfFilePath)) {
//       pdfFilePath = path.join(baseDir, pdfFilePath);
//     }
//     const relativePath = path
//       .relative(baseDir, pdfFilePath)
//       .replace(/\\/g, '/');
//     const fileUrl = `http://192.168.0.105:8080/PDM_DATA/${relativePath}`;
//     return res.status(200).json({ fileUrl });
//   } catch (error) {
//     console.error(' Error getting file URL:', error.message);
//     res
//       .status(500)
//       .json({ message: 'An error occurred while getting the file URL.' });
//   }
// };

// I added this for local path

const openCustDocFile = async (req, res) => {
  const { pdId } = req.params;
  if (!pdId || isNaN(parseInt(pdId, 10))) {
    return res.status(400).json({ message: 'Valid PDF ID is required.' });
  }

  try {
    const query = 'SELECT file_path FROM product_documents WHERE pd_id = ?';
    const [result] = await db.query(query, [pdId]);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: 'File not found.' });
    }

    let pdfFilePath = result[0].file_path.trim();
    const baseDir = await getBaseDir();

    if (!path.isAbsolute(pdfFilePath)) {
      pdfFilePath = path.join(baseDir, pdfFilePath);
    }

    if (!fs.existsSync(pdfFilePath)) {
      return res
        .status(404)
        .json({ message: 'File does not exist on the server.' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'inline; filename="' + path.basename(pdfFilePath) + '"',
    );
    fs.createReadStream(pdfFilePath).pipe(res);
  } catch (error) {
    console.error('❌ Error opening file:', error.message);
    res
      .status(500)
      .json({ message: 'An error occurred while opening the file.' });
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

const createProduct = async (req, res) => {
  const {
    productName,
    assignedUser,
    status = 'pending',
    comments,
    revision,
    partType,
  } = req.body;
  console.log('Received request to create product:', req.body);
  const files = req.files;
  console.log('Received File:', files);

  // Get the logged-in user's ID from the session
  let userId = req.session?.user?.id || req.body.userId;
  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated.' });
  }

  console.log('User ID from session:', userId);

  if (!productName || !revision || !partType) {
    return res
      .status(400)
      .json({ message: 'Product name, revision, and part type are required.' });
  }

  let users = [userId];
  if (assignedUser) {
    try {
      const parsedUsers = JSON.parse(assignedUser);
      if (Array.isArray(parsedUsers)) {
        users = [
          ...new Set([
            ...users,
            ...parsedUsers
              .map((user) => parseInt(user, 10))
              .filter((id) => !isNaN(id)),
          ]),
        ];
      } else {
        throw new Error('Assigned users is not a valid array.');
      }
    } catch (parseError) {
      console.error('Error parsing assigned users:', parseError.message);
      return res
        .status(400)
        .json({ message: 'Invalid format for assigned users.' });
    }
  }

  console.log('Final Assigned Users:', users);

  try {
    const baseDir = await getBaseDir();

    // Create product and folder structure
    const productFolder = path.join(baseDir, productName);
    if (!fs.existsSync(productFolder))
      fs.mkdirSync(productFolder, { recursive: true });

    const revisionFolder = path.join(productFolder, revision);
    if (!fs.existsSync(revisionFolder))
      fs.mkdirSync(revisionFolder, { recursive: true });

    const customerDocumentsFolder = path.join(revisionFolder, 'CUSTOMER DATA');
    if (!fs.existsSync(customerDocumentsFolder))
      fs.mkdirSync(customerDocumentsFolder, { recursive: true });

    // Save uploaded files
    const filePaths = [];
    for (const file of files) {
      const filePath = path.join(customerDocumentsFolder, file.originalname);
      fs.writeFileSync(filePath, file.buffer);
      filePaths.push(filePath);
    }

    // Insert product into database
    const productId = await insertProduct(
      productName,
      status,
      comments,
      userId,
      revision,
      partType,
    );
    console.log('Product inserted successfully with ID:', productId);

    // Insert into revision table
    const [revisionResult] = await db.query(
      `INSERT INTO revision (product_id, user_id, revision, revision_folder_path)
       VALUES (?, ?, ?, ?)`,
      [productId, userId, revision, revisionFolder],
    );
    const revisionId = revisionResult.insertId;

    // Insert document paths
    for (const filePath of filePaths) {
      await insertProductDocument(productId, revisionId, filePath);
    }

    // Assign all users (including creator) to the product
    await assignUsersToProduct(productId, users);

    res
      .status(201)
      .json({ message: `Product "${productName}" created successfully.` });
  } catch (error) {
    console.error('Error creating product:', error);
    res
      .status(500)
      .json({ message: 'An error occurred while creating the product.' });
  }
};

const insertProductDocument = async (productId, revisionId, filePath) => {
  try {
    console.log('Inserting or replacing product document:', {
      productId,
      revisionId,
      filePath,
    });

    const checkQuery = `
      SELECT * FROM product_documents 
      WHERE product_id = ? AND revision_id = ? AND file_path = ?
    `;
    const [rows] = await db.query(checkQuery, [
      productId,
      revisionId,
      filePath,
    ]);

    if (rows.length > 0) {
      // Entry exists — replace it
      const updateQuery = `
        UPDATE product_documents 
        SET file_path = ?, created_at = NOW()
        WHERE product_id = ? AND revision_id = ? AND file_path = ?
      `;
      await db.query(updateQuery, [filePath, productId, revisionId, filePath]);
      console.log('Document replaced in database');
    } else {
      // Insert new record
      const insertQuery = `
        INSERT INTO product_documents (product_id, revision_id, file_path)
        VALUES (?, ?, ?)
      `;
      await db.query(insertQuery, [productId, revisionId, filePath]);
      console.log('Document inserted in database');
    }
  } catch (error) {
    console.error('DB error in insertOrUpdateProductDocument:', error.message);
    throw new Error(
      `Failed to insert or update product document: ${error.message}`,
    );
  }
};

// export const uploadCustomerDocuments = async (req, res) => {
//   const { productId, revision } = req.body;
//   const files = req.files;

//   let userId = req.session?.user?.id || req.body.userId;
//   userId = parseInt(userId, 10);

//   if (isNaN(userId)) {
//     return res.status(400).json({ message: 'Valid User ID is required.' });
//   }

//   if (!productId || !files || files.length === 0) {
//     return res
//       .status(400)
//       .json({ message: 'Product ID and documents are required.' });
//   }

//   try {
//     const results = await db.query(
//       'SELECT product_name FROM products WHERE product_id = ?',
//       [productId],
//     );
//     const product = results[0][0];
//     if (!product || !product.product_name) {
//       return res.status(404).json({ message: 'Product not found.' });
//     }
//     const productName = product.product_name;

//     const baseDir = await getBaseDir();
//     if (!baseDir) throw new Error('Base directory not found.');

//     const productFolder = path.join(baseDir, productName);
//     if (!fs.existsSync(productFolder)) {
//       return res.status(404).json({ message: 'Product folder does not exist.' });
//     }

//     // Get latest revision ID
//     const [revisionResults] = await db.query(
//       `SELECT r_id FROM revision WHERE product_id = ? ORDER BY timestamp DESC LIMIT 1`,
//       [productId],
//     );

//     let revisionId;
//     let targetRevisionFolder;

//     if (revisionResults.length > 0) {
//       revisionId = revisionResults[0].r_id;

//       const revisionBasePath = path.join(productFolder, revision);

//       const revisionFolders = fs
//         .readdirSync(productFolder)
//         .filter((folder) => folder.startsWith(`${revision}_v`))
//         .map((folder) => ({
//           folder,
//           version: parseInt(folder.replace(`${revision}_v`, ''), 10),
//         }))
//         .sort((a, b) => b.version - a.version);

//       targetRevisionFolder = revisionFolders.length > 0
//         ? path.join(productFolder, revisionFolders[0].folder)
//         : revisionBasePath;

//     } else {
//       revisionId = null;
//       targetRevisionFolder = path.join(productFolder, revision);
//       if (!fs.existsSync(targetRevisionFolder)) {
//         fs.mkdirSync(targetRevisionFolder, { recursive: true });
//       }
//     }

//     // Create or use "Customer Data" folder
//     const customerDocumentsFolder = path.join(targetRevisionFolder, 'CUSTOMER DATA');
//     if (!fs.existsSync(customerDocumentsFolder)) {
//       fs.mkdirSync(customerDocumentsFolder, { recursive: true });
//     }

//     console.log(`Customer documents path: ${customerDocumentsFolder}`);

//     const filePaths = [];

//     for (const file of files) {
//       const fileName = file.originalname;
//       const filePath = path.join(customerDocumentsFolder, fileName);

//       try {
//         // ✅ Replace file if exists
//         if (fs.existsSync(filePath)) {
//           console.log(`File already exists, replacing: ${filePath}`);
//         }

//         fs.writeFileSync(filePath, file.buffer); // always writes new or overwrites
//         filePaths.push(filePath);
//       } catch (fsError) {
//         console.error('Error writing file:', filePath, fsError.message);
//         throw new Error('Failed to save document.');
//       }
//     }

//     for (const filePath of filePaths) {
//       await insertProductDocument(productId, revisionId, filePath);
//     }

//     res.status(201).json({ message: 'Customer documents uploaded successfully.' });
//   } catch (error) {
//     console.error('Upload error:', error.message);
//     res.status(500).json({ message: 'An error occurred during upload.' });
//   }
// };

export const uploadCustomerDocuments = async (req, res) => {
  const { productId, revision, replace } = req.body;
  const files = req.files;

  let userId = req.session?.user?.id || req.body.userId;
  userId = parseInt(userId, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Valid User ID is required.' });
  }

  if (!productId || !files || files.length === 0) {
    return res
      .status(400)
      .json({ message: 'Product ID and documents are required.' });
  }

  try {
    const results = await db.query(
      'SELECT product_name FROM products WHERE product_id = ?',
      [productId],
    );
    const product = results[0][0];
    if (!product?.product_name) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    const productName = product.product_name;

    const baseDir = await getBaseDir();
    if (!baseDir) throw new Error('Base directory not found.');

    const productFolder = path.join(baseDir, productName);
    if (!fs.existsSync(productFolder)) {
      return res
        .status(404)
        .json({ message: 'Product folder does not exist.' });
    }

    // Get latest revision ID
    const [revisionResults] = await db.query(
      `SELECT r_id FROM revision WHERE product_id = ? ORDER BY timestamp DESC LIMIT 1`,
      [productId],
    );

    let revisionId;
    let targetRevisionFolder;

    if (revisionResults.length > 0) {
      revisionId = revisionResults[0].r_id;

      const revisionBasePath = path.join(productFolder, revision);

      const revisionFolders = fs
        .readdirSync(productFolder)
        .filter((folder) => folder.startsWith(`${revision}_v`))
        .map((folder) => ({
          folder,
          version: parseInt(folder.replace(`${revision}_v`, ''), 10),
        }))
        .sort((a, b) => b.version - a.version);

      targetRevisionFolder =
        revisionFolders.length > 0
          ? path.join(productFolder, revisionFolders[0].folder)
          : revisionBasePath;
    } else {
      revisionId = null;
      targetRevisionFolder = path.join(productFolder, revision);
      if (!fs.existsSync(targetRevisionFolder)) {
        fs.mkdirSync(targetRevisionFolder, { recursive: true });
      }
    }

    // Create or use "CUSTOMER DATA" folder
    const customerDocumentsFolder = path.join(
      targetRevisionFolder,
      'CUSTOMER DATA',
    );
    if (!fs.existsSync(customerDocumentsFolder)) {
      fs.mkdirSync(customerDocumentsFolder, { recursive: true });
    }

    console.log(`Customer documents path: ${customerDocumentsFolder}`);

    const filePaths = [];

    for (const file of files) {
      const fileName = file.originalname;
      const filePath = path.join(customerDocumentsFolder, fileName);

      const fileExists = fs.existsSync(filePath);
      if (fileExists && !replace) {
        return res.status(409).json({
          message: `File "${fileName}" already exists. Do you want to replace it?`,
          fileName,
        });
      }

      try {
        fs.writeFileSync(filePath, file.buffer);
        filePaths.push(filePath);
      } catch (fsError) {
        console.error('Error writing file:', filePath, fsError.message);
        throw new Error('Failed to save document.');
      }
    }

    for (const filePath of filePaths) {
      await insertProductDocument(productId, revisionId, filePath, userId);
    }

    res
      .status(201)
      .json({ message: 'Customer documents uploaded successfully.' });
  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({ message: 'An error occurred during upload.' });
  }
};

const handleAddRevisionSubmit = async (req, res) => {
  const { productId, revision } = req.body;
  const files = req.files;
  const userId = req.session?.user?.id;

  if (!productId || !revision || !files || files.length === 0) {
    return res
      .status(400)
      .json({ message: 'Product ID, revision, and files are required.' });
  }

  try {
    const baseDir = await getBaseDir();
    const productFolder = path.join(baseDir, req.body.productName);
    const revisionFolder = path.join(productFolder, revision);
    // const customerDocsFolder = path.join(revisionFolder, 'Customer Documents');
    const customerDocsFolder = path.join(revisionFolder, 'CUSTOMER DATA');

    if (!fs.existsSync(revisionFolder)) {
      fs.mkdirSync(revisionFolder, { recursive: true });
    }

    if (!fs.existsSync(customerDocsFolder)) {
      fs.mkdirSync(customerDocsFolder, { recursive: true });
    }

    const [revisionResult] = await db.query(
      `INSERT INTO revision (product_id, user_id, revision, revision_folder_path)
       VALUES (?, ?, ?, ?)`,
      [productId, userId, revision, revisionFolder],
    );
    const revisionId = revisionResult.insertId;

    for (const file of files) {
      const filePath = path.join(customerDocsFolder, file.originalname);
      fs.writeFileSync(filePath, file.buffer);
      await insertProductDocument(productId, revisionId, filePath);
    }

    await db.query(`UPDATE products SET revision = ? WHERE product_id = ?`, [
      revision,
      productId,
    ]);

    const [updateStatusResult] = await db.query(
      `UPDATE products SET status = 'pending' WHERE product_id = ?`,
      [productId],
    );

    if (updateStatusResult.affectedRows === 0) {
      console.error('Product status update failed for product_id:', productId);
      return res
        .status(500)
        .json({ message: 'Failed to update product status.' });
    }

    res.status(201).json({ message: 'Revision added successfully!' });
  } catch (error) {
    console.error('Error adding revision:', error);
    res.status(500).json({ message: 'Failed to add revision.' });
  }
};

const getProductSuggestions = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required.' });
  }

  try {
    const [results] = await db.query(
      'SELECT product_name FROM products WHERE product_name LIKE ? LIMIT 10',
      [`%${query}%`],
    );

    const suggestions = results.map((row) => row.product_name);
    res.status(200).json(suggestions);
  } catch (error) {
    console.error('Error fetching product suggestions:', error);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching suggestions.' });
  }
};

const getDfxFiles = async (req, res) => {
  const { productId, revisionId } = req.params;

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required.' });
  }

  let selectedRevisionId = revisionId;

  try {
    // If revisionId is not provided, fetch the latest revision ID
    if (!revisionId || isNaN(parseInt(revisionId, 10))) {
      const [latestRevision] = await db.query(
        'SELECT MAX(revision_id) AS latest_revision FROM dfx_files WHERE product_id = ?',
        [productId],
      );

      if (
        !latestRevision ||
        latestRevision.length === 0 ||
        !latestRevision[0].latest_revision
      ) {
        return res
          .status(404)
          .json({ message: 'No DFX files found for this product.' });
      }

      selectedRevisionId = latestRevision[0].latest_revision;
    }

    // Fetch DFX files with the selected revision ID
    const [results] = await db.query(
      'SELECT * FROM dfx_files WHERE product_id = ? AND revision_id = ? ORDER BY upload_timestamp DESC',
      [productId, selectedRevisionId],
    );

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: 'No DFX files found for this product.' });
    }

    res.status(200).json({
      message: 'DFX files fetched successfully.',
      revisionId: selectedRevisionId, // Send back the used revisionId
      data: results,
    });
  } catch (error) {
    console.error('Error fetching DFX files:', error.message);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching DFX files.' });
  }
};

const copyDfxPath = async (req, res) => {
  const { dfxId } = req.params;

  if (!dfxId) {
    return res.status(400).json({ message: 'DFX ID is required.' });
  }

  try {
    // Fetch the file path from the database
    const [results] = await db.query(
      'SELECT dfx_file_path FROM dfx_files WHERE dfx_id = ?',
      [dfxId],
    );

    if (results.length === 0) {
      return res.status(404).json({ message: 'DFX file not found.' });
    }

    const filePath = results[0].dfx_file_path;

    // Resolve the file path to its network equivalent
    const resolvedFilePath = await resolveDfxFilePath(filePath);

    // Return the resolved network path
    res.status(200).json({ resolvedFilePath });
  } catch (error) {
    console.error('Error copying DFX file path:', error);
    res
      .status(500)
      .json({ message: 'An error occurred while copying the DFX file path.' });
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

const getProductDocuments = async (req, res) => {
  const { productId, revisionId } = req.params;

  // Validate productId
  if (!productId || isNaN(parseInt(productId, 10))) {
    console.error('Validation failed: productId is missing or invalid.', {
      productId,
    });
    return res.status(400).json({ message: 'Valid Product ID is required.' });
  }

  let selectedRevisionId = revisionId;

  try {
    // If revisionId is not provided, fetch the latest revision ID
    if (!revisionId || isNaN(parseInt(revisionId, 10))) {
      const latestRevisionQuery = `
        SELECT revision_id FROM revisions
        WHERE product_id = ? 
        ORDER BY created_at DESC 
        LIMIT 1
      `;
      const [latestRevisionResult] = await db.query(latestRevisionQuery, [
        productId,
      ]);

      if (!latestRevisionResult || latestRevisionResult.length === 0) {
        return res
          .status(404)
          .json({ message: 'No revisions found for this product.' });
      }

      selectedRevisionId = latestRevisionResult[0].revision_id;
    }

    // Fetch the documents along with the revision details
    const query = `
      SELECT pd.pd_id, pd.product_id, pd.revision_id, pd.file_path, pd.created_at, r.revision
      FROM product_documents pd
      JOIN revision r ON pd.revision_id = r.r_id
      WHERE pd.product_id = ? AND pd.revision_id = ?
      ORDER BY pd.created_at DESC
    `;

    const [results] = await db.query(query, [productId, selectedRevisionId]);

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ message: 'No documents found for this revision.' });
    }

    res.status(200).json({
      message: 'Documents fetched successfully.',
      revisionId: selectedRevisionId, // Send back the used revisionId
      files: results,
    });
  } catch (error) {
    console.error('Error fetching documents:', error.message);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching documents.' });
  }
};

const downloadProductDocuments = async (req, res) => {
  const { fileId } = req.params;

  // Validate fileId
  if (!fileId || isNaN(parseInt(fileId, 10))) {
    console.error('Validation failed: fileId is missing or invalid.', {
      fileId,
    });
    return res.status(400).json({ message: 'Valid File ID is required.' });
  }

  try {
    // Fetch the file path from the database
    const [results] = await db.query(
      'SELECT file_path FROM product_documents WHERE pd_id = ?',
      [fileId],
    );

    if (results.length === 0) {
      console.error('File not found in the database for fileId:', fileId);
      return res
        .status(404)
        .json({ message: 'File not found in the database.' });
    }

    const filePath = results[0].file_path;
    console.log('Retrieved filePath from database:', filePath);

    // Check if the file exists
    if (!(await fsWrapper.existsSync(filePath))) {
      console.error('File does not exist:', filePath);
      return res.status(404).json({ message: 'File not found on the server.' });
    }

    // Download the file
    res.download(filePath, (err) => {
      if (err) {
        console.error('Error downloading file:', err.message);
        res
          .status(500)
          .json({ message: 'An error occurred while downloading the file.' });
      }
    });
  } catch (error) {
    console.error('Error fetching file:', error.message);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching the file.' });
  }
};

// 0 changes

// const downloadProductDocumentsZip = async (req, res) => {
//   const { productId, revisionId } = req.params; // Expect revisionId in the request params
//   const userRole = req.session?.user?.role;

//   if (!productId || isNaN(parseInt(productId, 10))) {
//     console.error('Validation failed: productId is missing or invalid.', {
//       productId,
//     });
//     return res.status(400).json({ message: 'Valid Product ID is required.' });
//   }

//   try {
//     if (userRole === 'designer') {
//       await db.query('UPDATE products SET status = ? WHERE product_id = ?', [
//         'in_progress',
//         productId,
//       ]);
//     }

//     // If revisionId is not provided, get the latest revision ID
//     let selectedRevisionId = revisionId;
//     if (!selectedRevisionId) {
//       const [latestRevision] = await db.query(
//         'SELECT MAX(revision_id) AS latest_revision FROM product_documents WHERE product_id = ?',
//         [productId],
//       );

//       if (
//         !latestRevision ||
//         latestRevision.length === 0 ||
//         !latestRevision[0].latest_revision
//       ) {
//         return res
//           .status(404)
//           .json({ message: 'No documents found for this Part.' });
//       }

//       selectedRevisionId = latestRevision[0].latest_revision;
//     }

//     // Fetch documents for the selected revision ID
//     const [documents] = await db.query(
//       'SELECT file_path FROM product_documents WHERE product_id = ? AND revision_id = ?',
//       [productId, selectedRevisionId],
//     );

//     if (!documents || documents.length === 0) {
//       return res
//         .status(404)
//         .json({ message: 'No documents found for the selected revision.' });
//     }

//     // Create a new ZIP file
//     const zip = new AdmZip();

//     // Add each document to the ZIP file
//     documents.forEach((doc) => {
//       const filePath = doc.file_path;
//       if (fs.existsSync(filePath)) {
//         const fileName = path.basename(filePath); // Extract the file name
//         zip.addLocalFile(filePath, '', fileName); // Add file to the root of the ZIP
//       } else {
//         console.warn(`File not found: ${filePath}`);
//       }
//     });

//     // Generate the ZIP file name
//     const zipFileName = `customer_documents_${productId}_revision_${selectedRevisionId}.zip`;
//     const zipFilePath = path.join(__dirname, '..', 'temp', zipFileName); // Save in a temp folder

//     // Ensure the temp directory exists
//     if (!fs.existsSync(path.dirname(zipFilePath))) {
//       fs.mkdirSync(path.dirname(zipFilePath), { recursive: true });
//     }

//     // Save the ZIP file
//     fs.writeFileSync(zipFilePath, zip.toBuffer());

//     // Send the ZIP file for download
//     res.download(zipFilePath, zipFileName, (err) => {
//       if (err) {
//         console.error('Error downloading zip file:', err.message);
//         res
//           .status(500)
//           .json({
//             message: 'An error occurred while downloading the zip file.',
//           });
//       }

//       // Delete the temporary ZIP file after download
//       fs.unlinkSync(zipFilePath);
//     });
//   } catch (error) {
//     console.error('Error creating zip file:', error.message);
//     res
//       .status(500)
//       .json({ message: 'An error occurred while creating the zip file.' });
//   }
// };

const downloadProductDocumentsZip = async (req, res) => {
  const { productId, revisionId } = req.params;
  const userRole = req.session?.user?.role;

  if (!productId || isNaN(parseInt(productId, 10))) {
    console.error('Validation failed: productId is missing or invalid.', {
      productId,
    });
    return res.status(400).json({ message: 'Valid Product ID is required.' });
  }

  try {
    // Update status if user is designer
    if (userRole === 'designer') {
      await db.query('UPDATE products SET status = ? WHERE product_id = ?', [
        'in_progress',
        productId,
      ]);
      console.log(
        `Status updated to 'in_progress' for product ID ${productId}`,
      );
    }

    // Determine selected revision
    let selectedRevisionId = revisionId;
    if (selectedRevisionId === undefined || selectedRevisionId === null) {
      const [latestRevision] = await db.query(
        'SELECT MAX(r_id) AS latest_revision_id FROM revision WHERE product_id = ?',
        [productId],
      );

      if (
        !latestRevision ||
        latestRevision.length === 0 ||
        !latestRevision[0].latest_revision_id
      ) {
        return res
          .status(404)
          .json({ message: 'No revisions found for this product.' });
      }

      selectedRevisionId = latestRevision[0].latest_revision_id;
    }

    console.log(`Selected revision ID: ${selectedRevisionId}`);

    // Fetch documents for the selected revision ID
    const [documents] = await db.query(
      'SELECT file_path FROM product_documents WHERE product_id = ? AND revision_id = ?',
      [productId, selectedRevisionId],
    );

    if (!documents || documents.length === 0) {
      return res
        .status(404)
        .json({ message: 'No documents found for the selected revision.' });
    }

    console.log(`Number of documents found: ${documents.length}`);

    // Fetch product details
    const [[productDetails]] = await db.query(
      'SELECT product_name FROM products WHERE product_id = ?',
      [productId],
    );

    if (!productDetails) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Fetch actual revision number from revision table
    const [[revisionDetails]] = await db.query(
      'SELECT revision FROM revision WHERE r_id = ? AND product_id = ?',
      [selectedRevisionId, productId],
    );

    if (!revisionDetails) {
      return res
        .status(404)
        .json({ message: 'Revision info not found for this product.' });
    }

    const actualRevisionNumber = revisionDetails.revision;

    const productName = productDetails.product_name.replace(/\s+/g, '_');
    const zipFileName = `${productName}_revision_${actualRevisionNumber}.zip`;
    console.log(`Creating ZIP file: ${zipFileName}`);

    // Create the zip
    const zip = new AdmZip();
    documents.forEach((doc) => {
      const filePath = doc.file_path;
      if (fs.existsSync(filePath)) {
        const fileName = path.basename(filePath);
        console.log(`Adding file to zip: ${fileName}`);
        zip.addLocalFile(filePath, '', fileName);
      } else {
        console.warn(`File not found: ${filePath}`);
      }
    });

    const zipFilePath = path.join(__dirname, '..', 'temp', zipFileName);

    // Ensure temp directory exists
    const tempDir = path.dirname(zipFilePath);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Write zip file to disk
    fs.writeFileSync(zipFilePath, zip.toBuffer());
    console.log(`ZIP file saved at: ${zipFilePath}`);

    // Send zip for download
    res.download(zipFilePath, zipFileName, (err) => {
      if (err) {
        console.error('Error downloading zip file:', err.message);
        return res
          .status(500)
          .json({
            message: 'An error occurred while downloading the zip file.',
          });
      }

      console.log(`ZIP file ${zipFileName} sent for download.`);

      // Delete zip after sending
      fs.unlink(zipFilePath, (unlinkErr) => {
        if (unlinkErr) {
          console.warn('Failed to delete temp zip file:', unlinkErr.message);
        } else {
          console.log(`Temporary ZIP file deleted: ${zipFilePath}`);
        }
      });
    });
  } catch (error) {
    console.error('Error creating zip file:', error.message);
    res
      .status(500)
      .json({ message: 'An error occurred while creating the zip file.' });
  }
};

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

// const uploadDesign = async (req, res) => {
//     const { productId, revision, status = "pending", comment = "" } = req.body;
//     const files = req.files;

//     let userId = req.session?.user?.id || req.body.userId;
//     userId = parseInt(userId, 10);
//     const userRole = req.session?.user?.role;

//     if (isNaN(userId)) {
//         console.error("Validation failed: userId is missing or invalid.", { userId });
//         return res.status(400).json({ message: "Valid User ID is required." });
//     }

//     if (!productId || !files || files.length === 0) {
//         console.error("Validation failed:", { productId, files });
//         return res.status(400).json({ message: "Product ID and design files are required." });
//     }

//     try {
//         // Fetch product name
//         const results = await db.query("SELECT product_name FROM products WHERE product_id = ?", [productId]);
//         const product = results[0][0];
//         if (!product || !product.product_name) {
//             return res.status(404).json({ message: "Product not found or product name is missing." });
//         }
//         const productName = product.product_name;

//         const baseDir = await getBaseDir();
//         if (!baseDir) throw new Error("Base directory could not be retrieved.");

//         const productFolder = path.join(baseDir, productName);
//         if (!fs.existsSync(productFolder)) {
//             return res.status(404).json({ message: "Product folder does not exist." });
//         }

//         // Fetch the latest revision_id
//         const [revisionResults] = await db.query(
//             `SELECT r_id FROM revision WHERE product_id = ? ORDER BY timestamp DESC LIMIT 1`,
//             [productId]
//         );

//         if (revisionResults.length === 0) {
//             return res.status(404).json({ message: "No revisions found for the given product." });
//         }

//         const revisionId = revisionResults[0].r_id;
//         console.log(`Revision ID: ${revisionId}`);

//         // Check for existing version folders inside the product folder
//         const revisionBasePath = path.join(productFolder, revision);
//         const revisionFolders = fs.readdirSync(productFolder)
//             .filter(folder => folder.startsWith(`${revision}_v`))
//             .map(folder => ({
//                 folder,
//                 version: parseInt(folder.replace(`${revision}_v`, ""), 10)
//             }))
//             .sort((a, b) => b.version - a.version);

//         let targetRevisionFolder;
//         let versionNumber = 0;

//         if (revisionFolders.length > 0) {
//             // Use the latest version folder
//             targetRevisionFolder = path.join(productFolder, revisionFolders[0].folder);
//             versionNumber = revisionFolders[0].version;
//             console.log(`Using existing revision version folder: ${revisionFolders[0].folder} (Version: ${versionNumber})`);
//         } else {
//             // Use the default revision folder
//             targetRevisionFolder = revisionBasePath;
//             console.log(`No revision version folder found. Using base revision folder: ${revision}`);
//         }

//         // Create 'design' folder inside the chosen revision folder
//         const designFolder = path.join(targetRevisionFolder, "designs");
//         if (!fs.existsSync(designFolder)) {
//             fs.mkdirSync(designFolder, { recursive: true });
//         }

//         console.log(`Designs will be uploaded to: ${designFolder}`);

//         const filePaths = [];
//         for (const file of files) {
//             const fileName = file.originalname;
//             const filePath = path.join(designFolder, fileName);

//             try {
//                 fs.writeFileSync(filePath, file.buffer);
//                 filePaths.push(filePath);
//             } catch (fsError) {
//                 console.error("Error saving file:", filePath, fsError.message);
//                 throw new Error("Failed to save design file.");
//             }
//         }

//         console.log("Uploaded files:", filePaths);

//         // Insert records into the database with version number
//         for (const filePath of filePaths) {
//             await insertDesignUpload(productId, revisionId, userId, filePath, status, comment, versionNumber);
//         }

//         if (userRole === "designer") {
//             await db.query("UPDATE products SET status = 'under_review' WHERE product_id = ?", [productId]);
//         }

//         res.status(201).json({ message: "Designs uploaded successfully." });

//     } catch (error) {
//         console.error("Error uploading design:", error.message);
//         res.status(500).json({ message: "An error occurred while uploading the designs." });
//     }
// };



const uploadDesign1 = async (req, res) => {
  const {
    productId,
    revision,
    status = 'pending',
    comment = '',
    replace,
  } = req.body;
  const files = req.files;

  let userId = req.session?.user?.id || req.body.userId;
  userId = parseInt(userId, 10);
  const userRole = req.session?.user?.role;

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Valid User ID is required.' });
  }

  if (!productId || !files || files.length === 0) {
    return res.status(400).json({ message: 'Product ID and design files are required.' });
  }

  try {
    // Get product name
    const [productRows] = await db.query(
      'SELECT product_name FROM products WHERE product_id = ?',
      [productId]
    );
    const product = productRows[0];
    if (!product || !product.product_name) {
      return res.status(404).json({ message: 'Product not found or name missing.' });
    }

    const productName = product.product_name;
    const baseDir = await getBaseDir();
    if (!baseDir) throw new Error('Base directory not available.');

    const productFolder = path.join(baseDir, productName);
    if (!fs.existsSync(productFolder)) {
      return res.status(404).json({ message: 'Product folder does not exist.' });
    }

    // Get latest revision ID
    const [revisionResults] = await db.query(
      `SELECT r_id FROM revision WHERE product_id = ? ORDER BY timestamp DESC LIMIT 1`,
      [productId]
    );
    if (revisionResults.length === 0) {
      return res.status(404).json({ message: 'No revisions found for this product.' });
    }

    const revisionId = revisionResults[0].r_id;
    const revisionBasePath = path.join(productFolder, revision);

    // Find the latest version folder
    const revisionFolders = fs.readdirSync(productFolder)
      .filter(folder => folder.startsWith(`${revision}_v`))
      .map(folder => ({
        folder,
        version: parseInt(folder.replace(`${revision}_v`, ''), 10),
      }))
      .sort((a, b) => b.version - a.version);

    let targetRevisionFolder;
    let versionNumber = 0;

    if (revisionFolders.length > 0) {
      targetRevisionFolder = path.join(productFolder, revisionFolders[0].folder);
      versionNumber = revisionFolders[0].version;
    } else {
      targetRevisionFolder = revisionBasePath;
    }

    const designFolder = path.join(targetRevisionFolder, 'DESIGN DATA');
    if (!fs.existsSync(designFolder)) {
      fs.mkdirSync(designFolder, { recursive: true });
    }

    const filePaths = [];
    const newlyUploadedFiles = [];
    const duplicateFiles = [];

    for (const file of files) {
      const fileName = file.originalname;
      const filePath = path.join(designFolder, fileName);
      const alreadyExists = fs.existsSync(filePath);

      if (alreadyExists && !replace) {
        duplicateFiles.push(fileName);
        continue;
      }

      try {
        fs.writeFileSync(filePath, file.buffer);
        filePaths.push(filePath);
        if (!alreadyExists) {
          newlyUploadedFiles.push(filePath);
        }
      } catch (err) {
        console.error(`Error writing file ${fileName}:`, err);
        return res.status(500).json({ message: `Failed to save file ${fileName}` });
      }
    }

    if (duplicateFiles.length > 0 && !replace) {
      return res.status(409).json({
        message: `The following files already exist: ${duplicateFiles.join(', ')}. Do you want to replace them?`,
        duplicates: duplicateFiles
      });
    }

    // Insert newly uploaded files
    for (const filePath of newlyUploadedFiles) {
      await insertDesignUpload(
        productId,
        revisionId,
        userId,
        filePath,
        status,
        comment,
        versionNumber
      );
    }

    // Auto-update status if designer uploads and other required data exists
    if (userRole === 'designer') {
      const [[laserExists]] = await db.query(
        'SELECT 1 FROM laser_design_upload WHERE product_id = ? LIMIT 1',
        [productId]
      );
      const [[pdfExists]] = await db.query(
        'SELECT 1 FROM pdf_documents WHERE product_id = ? LIMIT 1',
        [productId]
      );

      if (laserExists && pdfExists) {
        await db.query(
          "UPDATE products SET status = 'under_review' WHERE product_id = ?",
          [productId]
        );
      }
    }

    res.status(201).json({ message: 'Designs uploaded successfully.' });
  } catch (error) {
    console.error('Upload Design Error:', error.message);
    res.status(500).json({ message: 'Error uploading designs.' });
  }
};



const uploadDesign = async (req, res) => {
  const {
    productId,
    revision,
    status = 'pending',
    comment = '',
    replace,
  } = req.body;
  const files = req.files;

  let userId = req.session?.user?.id || req.body.userId;
  userId = parseInt(userId, 10);
  const userRole = req.session?.user?.role;

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Valid User ID is required.' });
  }

  if (!productId || !files || files.length === 0) {
    return res.status(400).json({ message: 'Product ID and design files are required.' });
  }

  try {
    const [productRows] = await db.query(
      'SELECT product_name FROM products WHERE product_id = ?',
      [productId]
    );
    const product = productRows[0];
    if (!product || !product.product_name) {
      return res.status(404).json({ message: 'Product not found or name missing.' });
    }

    const productName = product.product_name;
    const baseDir = await getBaseDir();
    if (!baseDir) throw new Error('Base directory not available.');

    const productFolder = path.join(baseDir, productName);
    if (!fs.existsSync(productFolder)) {
      return res.status(404).json({ message: 'Product folder does not exist.' });
    }

    const [revisionResults] = await db.query(
      `SELECT r_id FROM revision WHERE product_id = ? ORDER BY timestamp DESC LIMIT 1`,
      [productId]
    );
    if (revisionResults.length === 0) {
      return res.status(404).json({ message: 'No revisions found for this product.' });
    }

    const revisionId = revisionResults[0].r_id;
    const revisionBasePath = path.join(productFolder, revision);

    const revisionFolders = fs.readdirSync(productFolder)
      .filter(folder => folder.startsWith(`${revision}_v`))
      .map(folder => ({
        folder,
        version: parseInt(folder.replace(`${revision}_v`, ''), 10),
      }))
      .sort((a, b) => b.version - a.version);

    let targetRevisionFolder;
    let versionNumber = 0;

    if (revisionFolders.length > 0) {
      targetRevisionFolder = path.join(productFolder, revisionFolders[0].folder);
      versionNumber = revisionFolders[0].version;
    } else {
      targetRevisionFolder = revisionBasePath;
    }

    const designFolder = path.join(targetRevisionFolder, 'DESIGN DATA');
    if (!fs.existsSync(designFolder)) {
      fs.mkdirSync(designFolder, { recursive: true });
    }

    const filePathsToInsert = [];
    const duplicateFiles = [];

    for (const file of files) {
      const fileName = file.originalname;
      const filePath = path.join(designFolder, fileName);
      const alreadyExists = fs.existsSync(filePath);

      if (alreadyExists) {
        duplicateFiles.push(fileName);
      }
    }

    // If duplicates exist and replace is not confirmed
    if (duplicateFiles.length > 0 && replace !== 'true' && replace !== true) {
      return res.status(409).json({
        message: `The following files already exist: ${duplicateFiles.join(', ')}. Do you want to replace them?`,
        confirmationRequired: true,
        duplicates: duplicateFiles,
      });
    }

    // Process all files now (confirmed or no duplicates)
    for (const file of files) {
      const fileName = file.originalname;
      const filePath = path.join(designFolder, fileName);
      const alreadyExists = fs.existsSync(filePath);

      if (alreadyExists) {
        // Replace but do not insert again
        fs.writeFileSync(filePath, file.buffer);
      } else {
        fs.writeFileSync(filePath, file.buffer);
        filePathsToInsert.push(filePath);
      }
    }

    // Insert only new files
    for (const filePath of filePathsToInsert) {
      await insertDesignUpload(
        productId,
        revisionId,
        userId,
        filePath,
        status,
        comment,
        versionNumber
      );
    }

    if (userRole === 'designer') {
      const [[laserExists]] = await db.query(
        'SELECT 1 FROM laser_design_upload WHERE product_id = ? LIMIT 1',
        [productId]
      );
      const [[pdfExists]] = await db.query(
        'SELECT 1 FROM pdf_documents WHERE product_id = ? LIMIT 1',
        [productId]
      );

      if (laserExists && pdfExists) {
        await db.query(
          "UPDATE products SET status = 'under_review' WHERE product_id = ?",
          [productId]
        );
      }
    }

    res.status(201).json({ message: 'Design files uploaded successfully.' });
  } catch (error) {
    console.error('Upload Design Error:', error.message);
    res.status(500).json({ message: 'Error uploading designs.' });
  }
};



const insertDesignUpload = async (
  productId,
  revisionId,
  userId,
  filePath,
  status,
  comment,
  version,
) => {
  try {
    const [userResults] = await db.query('SELECT id FROM users WHERE id = ?', [
      userId,
    ]);
    if (userResults.length === 0) {
      throw new Error(`User ID ${userId} does not exist.`);
    }

    await db.query(
      'INSERT INTO design_upload (product_id, revision_id, user_id, design_path, status, comment, version) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [productId, revisionId, userId, filePath, status, comment, version],
    );

    console.log(
      `Design upload record inserted successfully with version ${version}`,
    );
  } catch (error) {
    console.error('Error inserting design upload record:', error.message);
    throw new Error('Failed to insert design upload record');
  }
};

const fetchProductRevisions = async (req, res) => {
  const { productId } = req.params;

  // Validate productId
  if (!productId || isNaN(parseInt(productId, 10))) {
    console.error('Validation failed: productId is missing or invalid.', {
      productId,
    });
    return res.status(400).json({ message: 'Valid Product ID is required.' });
  }

  try {
    // Fetch revisions for the given product
    const revisionsQuery = `
          SELECT r.r_id, r.revision
          FROM revision r
          WHERE r.product_id = ?
          ORDER BY r.timestamp DESC
      `;

    const [revisionsResult] = await db.query(revisionsQuery, [productId]);

    if (!revisionsResult || revisionsResult.length === 0) {
      return res
        .status(404)
        .json({ message: 'No revisions found for the given product.' });
    }

    res.status(200).json({
      message: 'Revisions fetched successfully.',
      revisions: revisionsResult,
    });
  } catch (error) {
    console.error('Error fetching revisions:', error.message);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching revisions.' });
  }
};

const fetchUploadedDesigns = async (req, res) => {
  const { productId, revisionId, version } = req.params;

  // Validate the productId
  if (!productId || isNaN(parseInt(productId, 10))) {
    console.error('Validation failed: productId is missing or invalid.', {
      productId,
    });
    return res.status(400).json({ message: 'Valid Product ID is required.' });
  }

  let selectedRevisionId = revisionId;
  let selectedVersion = version;

  try {
    // 🔹 If no revisionId is provided, fetch the latest revision
    if (!revisionId || isNaN(parseInt(revisionId, 10))) {
      const latestRevisionQuery = `
        SELECT r_id FROM revision
        WHERE product_id = ? 
        ORDER BY timestamp DESC 
        LIMIT 1
      `;
      const [latestRevisionResult] = await db.query(latestRevisionQuery, [
        productId,
      ]);

      if (!latestRevisionResult || latestRevisionResult.length === 0) {
        return res
          .status(404)
          .json({ message: 'No revisions found for this product.' });
      }

      selectedRevisionId = latestRevisionResult[0].r_id;
    }

    if (!version) {
      const latestVersionQuery = `
        SELECT version FROM design_upload
        WHERE product_id = ? AND revision_id = ?
        ORDER BY version DESC 
        LIMIT 1
      `;
      const [latestVersionResult] = await db.query(latestVersionQuery, [
        productId,
        selectedRevisionId,
      ]);

      if (latestVersionResult.length > 0) {
        selectedVersion = latestVersionResult[0].version;
      } else {
        selectedVersion = null;
      }
    }
    // if (!version) {
    //   selectedVersion = null;
    // }
    else {
      const versionExistsQuery = `
        SELECT version FROM design_upload
        WHERE product_id = ? AND revision_id = ? AND version = ?
      `;
      const [versionExistsResult] = await db.query(versionExistsQuery, [
        productId,
        selectedRevisionId,
        version,
      ]);

      if (versionExistsResult.length === 0) {
        return res.status(404).json({
          message:
            'The specified version does not exist for the selected revision.',
        });
      }
    }

    let designFilesQuery = `
      SELECT du.du_id, du.design_path, du.status, du.comment, du.version, r.revision
      FROM design_upload du
      JOIN revision r ON du.revision_id = r.r_id
      WHERE du.product_id = ? AND du.revision_id = ?
    `;

    const queryParams = [productId, selectedRevisionId];

    // if (selectedVersion !== null) {
    //   designFilesQuery += ` AND du.version = ?`;
    //   queryParams.push(selectedVersion);
    // }

    if (version) {
      designFilesQuery += ` AND du.version = ?`;
      queryParams.push(version);
    }

    const [designFilesResult] = await db.query(designFilesQuery, queryParams);

    if (!designFilesResult || designFilesResult.length === 0) {
      return res.status(404).json({
        message:
          'No uploaded designs found for the selected revision and version.',
      });
    }

    // 🔹 Return the design files
    res.status(200).json({
      message: 'Uploaded designs fetched successfully.',
      revisionId: selectedRevisionId,
      version: selectedVersion || 'latest',
      files: designFilesResult.map((file) => ({
        du_id: file.du_id,
        designPath: file.design_path,
        status: file.status,
        comment: file.comment,
        version: file.version,
        revision: file.revision,
      })),
    });
  } catch (error) {
    console.error('Error fetching uploaded designs:', error.message);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching uploaded designs.' });
  }
};

const fetchRevisionsWithVersions = async (req, res) => {
  const { revisionId } = req.params;

  // Validate the revisionId
  if (!revisionId || isNaN(parseInt(revisionId, 10))) {
    console.error('Validation failed: revisionId is missing or invalid.', {
      revisionId,
    });
    return res.status(400).json({ message: 'Valid Revision ID is required.' });
  }

  try {
    // Fetch the revision details
    const revisionQuery = `
      SELECT r_id, product_id, user_id, revision, revision_folder_path, timestamp
      FROM revision
      WHERE r_id = ?
    `;
    const [revisionResult] = await db.query(revisionQuery, [revisionId]);

    if (!revisionResult || revisionResult.length === 0) {
      return res.status(404).json({ message: 'Revision not found.' });
    }

    // Fetch the versions for the selected revision
    const versionQuery = `
      SELECT rvid, r_id, version_folder_path, timestamp, version
      FROM revision_version
      WHERE r_id = ? ORDER BY version DESC
    `;
    const [versionResult] = await db.query(versionQuery, [revisionId]);

    if (!versionResult || versionResult.length === 0) {
      return res
        .status(404)
        .json({ message: 'No versions found for the specified revision.' });
    }

    // Return the revision and versions details
    res.status(200).json({
      message: 'Revision and versions fetched successfully.',
      revision: revisionResult[0], // Return the revision details
      versions: versionResult.map((version) => ({
        rvid: version.rvid,
        version: version.version,
        versionFolderPath: version.version_folder_path,
        timestamp: version.timestamp,
      })),
    });
  } catch (error) {
    console.error('Error fetching revisions and versions:', error.message);
    res.status(500).json({
      message: 'An error occurred while fetching revisions and versions.',
    });
  }
};

const downloadDesign = async (req, res) => {
  const { fileId } = req.params;

  // Validate fileId
  if (!fileId || isNaN(parseInt(fileId, 10))) {
    console.error('Validation failed: fileId is missing or invalid.', {
      fileId,
    });
    return res.status(400).json({ message: 'Valid File ID is required.' });
  }

  const userRole = req.session?.user?.role;
  const userId = req.session?.user?.id;

  console.log('User role:', userRole);
  console.log('User ID:', userId);

  try {
    const [results] = await db.query(
      'SELECT design_path, status FROM design_upload WHERE du_id = ?',
      [fileId],
    );

    if (results.length === 0) {
      console.error('File not found in the database for fileId:', fileId);
      return res
        .status(404)
        .json({ message: 'File not found in the database.' });
    }

    const filePath = results[0].design_path;
    const currentStatus = results[0].status;

    console.log('Retrieved filePath from database:', filePath);
    console.log('Current status of the file:', currentStatus);

    if (userRole === 'designer' && currentStatus !== 'in_progress') {
      await db.query(
        'UPDATE design_upload SET status = ?, user_id = ? WHERE du_id = ?',
        ['in_progress', userId, fileId],
      );
      console.log('File status updated to "in_progress" for designer.');
    }

    const fileBaseName = path.basename(filePath, path.extname(filePath));
    console.log('Base name of the file:', fileBaseName);

    const dirPath = path.dirname(filePath);
    console.log('Directory path:', dirPath);

    if (!(await fsWrapper.existsSync(dirPath))) {
      console.error('Directory does not exist:', dirPath);
      return res.status(404).json({ message: 'File not found on the server.' });
    }

    const files = await fsWrapper.readdirSync(dirPath);
    console.log('Files in directory:', files);

    // Remove the version suffix from the base name
    const baseNameWithoutVersion = fileBaseName.replace(/_v\d+$/, '');
    console.log('Base name without version:', baseNameWithoutVersion);

    // Filter files based on base name without version
    let matchingFiles = files.filter((file) =>
      file.startsWith(baseNameWithoutVersion),
    );

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

    // Download the file
    res.download(latestFile, (err) => {
      if (err) {
        console.error('Error downloading file:', err.message);
        res
          .status(500)
          .json({ message: 'An error occurred while downloading the file.' });
      }
    });
  } catch (error) {
    console.error('Error fetching or updating file:', error.message);
    res.status(500).json({
      message: 'An error occurred while fetching or updating the file.',
    });
  }
};

const downloadLaserDesign = async (req, res) => {
  const { fileId } = req.params;

  // Validate fileId
  if (!fileId || isNaN(parseInt(fileId, 10))) {
    console.error('Validation failed: fileId is missing or invalid.', {
      fileId,
    });
    return res.status(400).json({ message: 'Valid File ID is required.' });
  }

  try {
    // Fetch the file path from the database
    const [results] = await db.query(
      'SELECT laser_design_path FROM laser_design_upload WHERE ldu_id = ?',
      [fileId],
    );

    if (results.length === 0) {
      console.error('File not found in the database for fileId:', fileId);
      return res
        .status(404)
        .json({ message: 'File not found in the database.' });
    }

    const filePath = results[0].laser_design_path; // Corrected field name
    console.log('Retrieved filePath from database:', filePath);

    // Check if the file exists
    if (!(await fsWrapper.existsSync(filePath))) {
      console.error('File does not exist:', filePath);
      return res.status(404).json({ message: 'File not found on the server.' });
    }

    // Download the file
    res.download(filePath, (err) => {
      if (err) {
        console.error('Error downloading file:', err.message);
        res
          .status(500)
          .json({ message: 'An error occurred while downloading the file.' });
      }
    });
  } catch (error) {
    console.error('Error fetching file:', error.message);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching the file.' });
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
    if (!(await fsWrapper.existsSync(decodedFilePath))) {
      console.error('File not found:', decodedFilePath);
      return res.status(404).json({ message: 'File not found on the server.' });
    }

    // Send the file for download
    res.download(decodedFilePath, (err) => {
      if (err) {
        console.error('Error downloading file:', err.message);
        res
          .status(500)
          .json({ message: 'An error occurred while downloading the file.' });
      }
    });
  } catch (error) {
    console.error('Error fetching file:', error.message);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching the file.' });
  }
};

const downloadLatestVersionZip = async (req, res) => {
  const { productId, revisionId } = req.params;

  if (!productId || isNaN(parseInt(productId, 10))) {
    console.error('Validation failed: productId is missing or invalid.', {
      productId,
    });
    return res.status(400).json({ message: 'Valid Product ID is required.' });
  }

  try {
    console.log('Fetching product name for productId:', productId);

    const [productResults] = await db.query(
      'SELECT product_name FROM products WHERE product_id = ?',
      [productId],
    );

    if (productResults.length === 0) {
      console.error('Product not found for productId:', productId);
      return res.status(404).json({ message: 'Product not found.' });
    }

    const productName = productResults[0].product_name;
    console.log('Product found:', productName);

    console.log('Fetching latest design path for revision:', revisionId);

    const latestVersionQuery = `
      SELECT design_path, version FROM design_upload 
      WHERE product_id = ? AND revision_id = ? 
      ORDER BY version DESC 
      LIMIT 1
    `;
    const [latestVersionResult] = await db.query(latestVersionQuery, [
      productId,
      revisionId,
    ]);

    if (latestVersionResult.length === 0) {
      console.error('No designs found for revisionId:', revisionId);
      return res
        .status(404)
        .json({ message: 'No designs found for the selected revision.' });
    }

    const filePath = latestVersionResult[0].design_path;
    const version = latestVersionResult[0].version || 'latest';

    console.log('Retrieved file path:', filePath);

    // Resolve network base directory
    const baseDir = await getBaseDir();
    const resolvedBaseDir = await resolveFilePath(baseDir);

    // Ensure filePath doesn't contain the baseDir path again
    let sanitizedFilePath = filePath
      .replace(/^([A-Z]:\\)/i, '')
      .replace(/\\/g, '/');

    // Prevent duplicate baseDir
    if (sanitizedFilePath.startsWith(path.basename(resolvedBaseDir))) {
      sanitizedFilePath = sanitizedFilePath.replace(
        path.basename(resolvedBaseDir) + '/',
        '',
      );
    }

    // Get parent directory (`designs/` folder)
    const designFolder = path.dirname(
      path.join(resolvedBaseDir, sanitizedFilePath),
    );

    console.log('Zipping entire folder:', designFolder);

    const fileStats = fs.statSync(designFolder); // Use fs.statSync instead of fsWrapper

    const zip = new AdmZip();

    if (fileStats.isDirectory()) {
      zip.addLocalFolder(designFolder); // Zip the entire `designs/` folder
    } else {
      console.error('Expected a directory but found a file:', designFolder);
      return res
        .status(400)
        .json({ message: 'Expected a folder, but found a file.' });
    }

    const zipFileName = `${productName}_revision_${revisionId}_v${version}.zip`;
    const zipFilePath = path.join(resolvedBaseDir, 'temp', zipFileName);

    console.log('Ensuring temp directory exists:', path.dirname(zipFilePath));

    if (!fs.existsSync(path.dirname(zipFilePath))) {
      fs.mkdirSync(path.dirname(zipFilePath), { recursive: true });
    }

    console.log('Saving zip file at:', zipFilePath);

    fs.writeFileSync(zipFilePath, zip.toBuffer());

    console.log('Zip file saved. Sending for download:', zipFileName);

    res.download(zipFilePath, zipFileName, (err) => {
      if (err) {
        console.error('Error downloading zip file:', err.message);
        res.status(500).json({
          message: 'An error occurred while downloading the zip file.',
        });
      }

      console.log('Deleting temp zip file:', zipFilePath);
      fs.unlinkSync(zipFilePath);
    });
  } catch (error) {
    console.error('Error creating zip file:', error.message);
    res
      .status(500)
      .json({ message: 'An error occurred while creating the zip file.' });
  }
};


const downloadLatestDesignVersionZip = async (req, res) => {
  const { productId, revisionId } = req.params;

  if (!productId || isNaN(parseInt(productId, 10))) {
    console.error('Validation failed: productId is missing or invalid.', {
      productId,
    });
    return res.status(400).json({ message: 'Valid Product ID is required.' });
  }

  try {
    console.log('Fetching product name for productId:', productId);

    const [productResults] = await db.query(
      'SELECT product_name FROM products WHERE product_id = ?',
      [productId],
    );

    if (productResults.length === 0) {
      console.error('Product not found for productId:', productId);
      return res.status(404).json({ message: 'Product not found.' });
    }

    const productName = productResults[0].product_name;
    console.log('Product found:', productName);

    console.log('Fetching latest design path for revision:', revisionId);

    const latestVersionQuery = `
      SELECT laser_design_path, version FROM laser_design_upload 
      WHERE product_id = ? AND revision_id = ? 
      ORDER BY version DESC 
      LIMIT 1
    `;
    const [latestVersionResult] = await db.query(latestVersionQuery, [
      productId,
      revisionId,
    ]);

    if (latestVersionResult.length === 0) {
      console.error('No designs found for revisionId:', revisionId);
      return res
        .status(404)
        .json({ message: 'No designs found for the selected revision.' });
    }

    const filePath = latestVersionResult[0].laser_design_path;
    const version = latestVersionResult[0].version || 'latest';

    console.log('Retrieved file path:', filePath);

    // Resolve network base directory
    const baseDir = await getBaseDir();
    const resolvedBaseDir = await resolveFilePath(baseDir);

    // Ensure filePath doesn't contain the baseDir path again
    let sanitizedFilePath = filePath
      .replace(/^([A-Z]:\\)/i, '')
      .replace(/\\/g, '/');

    // Prevent duplicate baseDir
    if (sanitizedFilePath.startsWith(path.basename(resolvedBaseDir))) {
      sanitizedFilePath = sanitizedFilePath.replace(
        path.basename(resolvedBaseDir) + '/',
        '',
      );
    }

    // Get parent directory (`designs/` folder)
    const designFolder = path.dirname(
      path.join(resolvedBaseDir, sanitizedFilePath),
    );

    console.log('Zipping entire folder:', designFolder);

    const fileStats = fs.statSync(designFolder); // Use fs.statSync instead of fsWrapper

    const zip = new AdmZip();

    if (fileStats.isDirectory()) {
      zip.addLocalFolder(designFolder); // Zip the entire `designs/` folder
    } else {
      console.error('Expected a directory but found a file:', designFolder);
      return res
        .status(400)
        .json({ message: 'Expected a folder, but found a file.' });
    }

    const zipFileName = `${productName}_revision_${revisionId}_v${version}.zip`;
    const zipFilePath = path.join(resolvedBaseDir, 'temp', zipFileName);

    console.log('Ensuring temp directory exists:', path.dirname(zipFilePath));

    if (!fs.existsSync(path.dirname(zipFilePath))) {
      fs.mkdirSync(path.dirname(zipFilePath), { recursive: true });
    }

    console.log('Saving zip file at:', zipFilePath);

    fs.writeFileSync(zipFilePath, zip.toBuffer());

    console.log('Zip file saved. Sending for download:', zipFileName);

    res.download(zipFilePath, zipFileName, (err) => {
      if (err) {
        console.error('Error downloading zip file:', err.message);
        res.status(500).json({
          message: 'An error occurred while downloading the zip file.',
        });
      }

      console.log('Deleting temp zip file:', zipFilePath);
      fs.unlinkSync(zipFilePath);
    });
  } catch (error) {
    console.error('Error creating zip file:', error.message);
    res
      .status(500)
      .json({ message: 'An error occurred while creating the zip file.' });
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
      return res
        .status(404)
        .json({ message: 'No records found in design_upload_version table.' });
    }

    // Return the records
    res.status(200).json({
      message: 'Records fetched successfully.',
      data: results,
    });
  } catch (error) {
    console.error(
      'Error fetching records from design_upload_version table:',
      error.message,
    );
    res
      .status(500)
      .json({ message: 'An error occurred while fetching records.' });
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
      return res
        .status(404)
        .json({ message: 'No records found in design_upload_version table.' });
    }

    res.status(200).json({
      message: 'Records fetched successfully.',
      data: results,
    });
  } catch (error) {
    console.error(
      'Error fetching records from design_upload_version table:',
      error.message,
    );
    res
      .status(500)
      .json({ message: 'An error occurred while fetching records.' });
  }
};

const uploadNewVersion = async (req, res) => {
  const { fileId } = req.params;
  const { comment } = req.body;
  const file = req.file;

  if (!fileId || isNaN(parseInt(fileId, 10))) {
    return res.status(400).json({ message: 'Valid File ID is required.' });
  }
  if (!file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const loggedInUserId = req.session.user.id;
    const loggedInUserRole = req.session.user.role;

    const [results] = await db.query(
      'SELECT design_path, product_id, version, status FROM design_upload WHERE du_id = ?',
      [fileId],
    );

    if (results.length === 0) {
      console.error('File not found in database.');
      return res.status(404).json({ message: 'File not found.' });
    }

    const oldFilePath = results[0].design_path;
    const productId = results[0].product_id;
    const latestFileVersionFromResults = results[0].version || 0;
    const currentStatus = results[0].status;

    const oldFileName = path.basename(oldFilePath);
    const oldFileBaseName = path.parse(oldFileName).name;
    const oldFileExtension = path.extname(oldFileName);

    const uploadedFileName = file.originalname;
    const uploadedFileBaseName = path.parse(uploadedFileName).name;
    const uploadedFileExtension = path.extname(uploadedFileName);

    if (
      uploadedFileBaseName !== oldFileBaseName ||
      uploadedFileExtension !== oldFileExtension
    ) {
      console.error(
        'Uploaded file name does not match the existing file name.',
      );
      return res.status(400).json({
        message: `Uploaded file must have the same name as the existing file: ${oldFileName}`,
      });
    }

    const [productResults] = await db.query(
      'SELECT product_name, revision FROM products WHERE product_id = ?',
      [productId],
    );

    if (productResults.length === 0) {
      console.error('Product not found in database.');
      return res.status(404).json({ message: 'Product not found.' });
    }

    const productName = productResults[0].product_name;
    const revision = productResults[0].revision || 'default';

    const baseDir = await getBaseDir();
    const productFolder = path.join(baseDir, productName);
    const revisionFolder = path.join(productFolder, revision);
    const designFolder = path.join(revisionFolder, 'design');

    const [latestFileResults] = await db.query(
      'SELECT version FROM design_upload WHERE du_id = ? ORDER BY version DESC LIMIT 1',
      [fileId],
    );

    const latestFileVersionFromLatestResults =
      latestFileResults[0]?.version || 0;

    const newFileVersion = latestFileVersionFromLatestResults + 1;

    const newVersionFolder = path.join(
      designFolder,
      `designs_v${newFileVersion}`,
    );
    fs.mkdirSync(newVersionFolder, { recursive: true });

    let sourceFolder;
    if (latestFileVersionFromLatestResults > 0) {
      sourceFolder = path.join(
        designFolder,
        `designs_v${latestFileVersionFromLatestResults}`,
      );
    } else {
      sourceFolder = path.join(designFolder, 'DESIGN DATA');
    }
    copyFolderRecursive(sourceFolder, newVersionFolder);
    const relativePath = path.relative(sourceFolder, oldFilePath);
    const newFilePath = path.join(newVersionFolder, relativePath);

    fs.mkdirSync(path.dirname(newFilePath), { recursive: true });

    fs.writeFileSync(newFilePath, file.buffer);

    await db.query(
      'UPDATE design_upload SET design_path = ?, version = ? WHERE du_id = ?',
      [newFilePath, newFileVersion, fileId],
    );

    await db.query(
      'INSERT INTO design_upload_version (du_id, product_id, user_id, file_path, version, comment) VALUES (?, ?, ?, ?, ?, ?)',
      [fileId, productId, loggedInUserId, newFilePath, newFileVersion, comment],
    );

    await db.query(
      'UPDATE products SET product_version = product_version + 1 WHERE product_id = ?',
      [productId],
    );

    if (loggedInUserRole === 'designer') {
      await db.query('UPDATE design_upload SET status = ? WHERE du_id = ?', [
        'under_review',
        fileId,
      ]);
    }
    res
      .status(200)
      .json({ message: 'File uploaded successfully.', newFilePath });
  } catch (error) {
    console.error('Error uploading new version:', error.message);
    res
      .status(500)
      .json({ message: 'An error occurred while uploading the file.' });
  }
};

const laserUploadNewVersion = async (req, res) => {
  const { fileId } = req.params;
  const { comment } = req.body;
  const file = req.file;
  console.log('fileId: '.fileId);

  if (!fileId || isNaN(parseInt(fileId, 10))) {
    return res.status(400).json({ message: 'Valid File ID is required.' });
  }
  if (!file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const loggedInUserId = req.session.user.id;
    const loggedInUserRole = req.session.user.role;

    const [results] = await db.query(
      'SELECT laser_design_path, product_id, version FROM laser_design_upload WHERE ldu_id = ?',
      [fileId],
    );

    if (results.length === 0) {
      console.error('File not found in database.');
      return res.status(404).json({ message: 'File not found.' });
    }

    const oldFilePath = results[0].laser_design_path;
    const productId = results[0].product_id;
    const latestFileVersionFromResults = results[0].version || 0;
    // const currentStatus = results[0].status;

    const oldFileName = path.basename(oldFilePath);
    const oldFileBaseName = path.parse(oldFileName).name;
    const oldFileExtension = path.extname(oldFileName);

    const uploadedFileName = file.originalname;
    const uploadedFileBaseName = path.parse(uploadedFileName).name;
    const uploadedFileExtension = path.extname(uploadedFileName);

    if (
      uploadedFileBaseName !== oldFileBaseName ||
      uploadedFileExtension !== oldFileExtension
    ) {
      console.error(
        'Uploaded file name does not match the existing file name.',
      );
      return res.status(400).json({
        message: `Uploaded file must have the same name as the existing file: ${oldFileName}`,
      });
    }

    const [productResults] = await db.query(
      'SELECT product_name, revision FROM products WHERE product_id = ?',
      [productId],
    );

    if (productResults.length === 0) {
      console.error('Product not found in database.');
      return res.status(404).json({ message: 'Product not found.' });
    }

    const productName = productResults[0].product_name;
    const revision = productResults[0].revision || 'default';

    const baseDir = await getBaseDir();
    const productFolder = path.join(baseDir, productName);
    const revisionFolder = path.join(productFolder, revision);
    const dfxFolder = path.join(revisionFolder, 'DFX');

    const [latestFileResults] = await db.query(
      'SELECT version FROM laser_design_upload WHERE ldu_id = ? ORDER BY version DESC LIMIT 1',
      [fileId],
    );

    const latestFileVersionFromLatestResults =
      latestFileResults[0]?.version || 0;

    const newFileVersion = latestFileVersionFromLatestResults + 1;

    const newVersionFolder = path.join(dfxFolder, `DFX_v${newFileVersion}`);
    fs.mkdirSync(newVersionFolder, { recursive: true });

    let sourceFolder;
    if (latestFileVersionFromLatestResults > 0) {
      sourceFolder = path.join(
        dfxFolder,
        `DFX_v${latestFileVersionFromLatestResults}`,
      );
    } else {
      sourceFolder = path.join(dfxFolder, 'DFX');
    }
    copyFolderRecursive(sourceFolder, newVersionFolder);
    const relativePath = path.relative(sourceFolder, oldFilePath);
    const newFilePath = path.join(newVersionFolder, relativePath);

    fs.mkdirSync(path.dirname(newFilePath), { recursive: true });

    fs.writeFileSync(newFilePath, file.buffer);

    await db.query(
      'UPDATE laser_design_upload SET laser_design_path = ?, version = ? WHERE ldu_id = ?',
      [newFilePath, newFileVersion, fileId],
    );

    await db.query(
      'INSERT INTO laser_upload_version (ldu_id, product_id, user_id, file_path, version, comment) VALUES (?, ?, ?, ?, ?, ?)',
      [fileId, productId, loggedInUserId, newFilePath, newFileVersion, comment],
    );

    res
      .status(200)
      .json({ message: 'File uploaded successfully.', newFilePath });
  } catch (error) {
    console.error('Error uploading new version:', error.message);
    res
      .status(500)
      .json({ message: 'An error occurred while uploading the file.' });
  }
};

const copyFolderRecursive = (source, destination) => {
  // Create the destination folder if it doesn't exist
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  // Read the contents of the source folder
  const items = fs.readdirSync(source);

  items.forEach((item) => {
    const sourcePath = path.join(source, item);
    const destinationPath = path.join(destination, item);

    // Check if the item is a directory
    if (fs.lstatSync(sourcePath).isDirectory()) {
      // Recursively copy the directory
      copyFolderRecursive(sourcePath, destinationPath);
    } else {
      // Copy the file
      fs.copyFileSync(sourcePath, destinationPath);
      // console.log('Copied file:', sourcePath, 'to', destinationPath);
    }
  });
};

const findCatProductFiles = (folder) => {
  const catProductFiles = [];

  const searchFolder = (dir) => {
    const items = fs.readdirSync(dir);

    items.forEach((item) => {
      const itemPath = path.join(dir, item);

      if (fs.lstatSync(itemPath).isDirectory()) {
        // Recursively search nested folders
        searchFolder(itemPath);
      } else if (item.endsWith('.CATProduct')) {
        // Add .CATProduct files to the list
        catProductFiles.push(itemPath);
      }
    });
  };

  searchFolder(folder);
  return catProductFiles;
};

const fetchDesignUploadVersions = async (req, res) => {
  const { du_id } = req.params;

  // Validate du_id
  if (!du_id || isNaN(parseInt(du_id, 10))) {
    console.error('Validation failed: du_id is missing or invalid.', { du_id });
    return res
      .status(400)
      .json({ message: 'Valid Design Upload ID (du_id) is required.' });
  }

  try {
    // Fetch all versions for the given du_id from the design_upload_version table
    const [results] = await db.query(
      `SELECT duv_id, du_id, product_id, user_id, file_path, timestamp, version 
       FROM design_upload_version 
       WHERE du_id = ? 
       ORDER BY version ASC`, // Order by version to get versions in ascending order
      [du_id],
    );

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ message: 'No versions found for the given Design Upload ID.' });
    }

    // Group versions by du_id (though there's only one du_id in this case)
    const versions = results.map((version) => ({
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
    res.status(500).json({
      message: 'An error occurred while fetching design upload versions.',
    });
  }
};

const updateDesignUpload = async (req, res) => {
  const { du_id } = req.params;
  const { status, comment } = req.body;

  if (!du_id) {
    return res
      .status(400)
      .json({ message: 'Design upload ID (du_id) is required.' });
  }

  const updateFields = {};
  updateFields.status = status || 'pending';

  if (comment !== undefined) {
    updateFields.comment = comment;
  }

  try {
    // Fetch the current status of the design upload
    const [designUpload] = await db.query(
      'SELECT status FROM design_upload WHERE du_id = ?',
      [du_id],
    );
    if (!designUpload.length) {
      return res
        .status(404)
        .json({ message: 'Design upload record not found.' });
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
      ],
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: 'Design upload record not found.' });
    }

    // Log the status change if the status was updated
    if (status && status !== previousStatus) {
      const userId = req.session?.user?.id || req.body.userId;
      if (!userId) {
        return res.status(401).json({
          message: 'User authentication is required to log activity.',
        });
      }

      const sqlLog = `
        INSERT INTO design_status_activity (du_id, user_id, previous_status, updated_status, activity_timestamp)
        VALUES (?, ?, ?, ?, NOW())
      `;
      await db.query(sqlLog, [du_id, userId, previousStatus, status]);
    }

    res.status(200).json({
      message: 'Design upload status and comment updated successfully.',
    });
  } catch (error) {
    console.error('Error updating design upload:', error.message);
    res
      .status(500)
      .json({ message: 'An error occurred while updating the design upload.' });
  }
};

// const laserUploadDesign = async (req, res) => {
//   const { productId, userId: bodyUserId, replace, revision, comment = "" } = req.body;
//   const files = req.files;

//   let userId = req.session?.user?.id || bodyUserId;
//   const userRole = req.session?.user?.role;

//   if (!userId) {
//       return res.status(400).json({ message: 'User ID is required.' });
//   }

//   userId = parseInt(userId, 10);
//   if (isNaN(userId)) {
//       return res.status(400).json({ message: 'Valid User ID is required.' });
//   }

//   if (!productId || !files || files.length === 0 || !revision) {
//       return res.status(400).json({ message: 'Product ID, revision, and design files are required.' });
//   }

//   const invalidFiles = files.filter(file => !file.originalname.toLowerCase().endsWith('.dxf'));
//   if (invalidFiles.length > 0) {
//       return res.status(400).json({ message: 'Only DXF files are allowed for upload.' });
//   }

//   try {
//       // Fetch product name
//       const results = await db.query('SELECT product_name FROM products WHERE product_id = ?', [productId]);
//       const product = results[0][0];
//       if (!product || !product.product_name) {
//           return res.status(404).json({ message: 'Product not found or product name is missing.' });
//       }
//       const productName = product.product_name;

//       console.log('Fetched Product Name:', productName);

//       // Get base directory
//       const baseDir = await getBaseDir();
//       if (!baseDir) {
//           throw new Error('Base directory could not be retrieved.');
//       }

//       const productFolder = path.join(baseDir, productName);
//       if (!fs.existsSync(productFolder)) {
//           return res.status(404).json({ message: "Product folder does not exist." });
//       }

//       // Fetch the latest revision_id
//       const [revisionResults] = await db.query(
//           `SELECT r_id FROM revision WHERE product_id = ? ORDER BY timestamp DESC LIMIT 1`,
//           [productId]
//       );

//       if (revisionResults.length === 0) {
//           return res.status(404).json({ message: "No revisions found for the given product." });
//       }

//       const revisionId = revisionResults[0].r_id;
//       console.log(`Revision ID: ${revisionId}`);

//       // Find existing revision version folders
//       const revisionFolders = fs.readdirSync(productFolder)
//           .filter(folder => folder.startsWith(`${revision}_v`))
//           .map(folder => ({
//               folder,
//               version: parseInt(folder.replace(`${revision}_v`, ""), 10)
//           }))
//           .sort((a, b) => b.version - a.version); // Sort in descending order

//       let targetRevisionFolder;
//       let versionNumber = 0;

//       if (revisionFolders.length > 0) {
//           // Use the latest version folder
//           targetRevisionFolder = path.join(productFolder, revisionFolders[0].folder);
//           versionNumber = revisionFolders[0].version;
//           console.log(`Using existing revision version folder: ${revisionFolders[0].folder} (Version: ${versionNumber})`);
//       } else {
//           // Use the default revision folder
//           targetRevisionFolder = path.join(productFolder, revision);
//           console.log(`No revision version folder found. Using base revision folder: ${revision}`);
//       }

//       // Create 'DFX' folder inside the chosen revision folder
//       const dfxFolder = path.join(targetRevisionFolder, "DFX");
//       if (!fs.existsSync(dfxFolder)) {
//           fs.mkdirSync(dfxFolder, { recursive: true });
//       }

//       console.log(`DXF files will be uploaded to: ${dfxFolder}`);

//       const filePaths = [];
//       for (const file of files) {
//           const fileName = file.originalname;
//           const filePath = path.join(dfxFolder, fileName);

//           if (fs.existsSync(filePath) && !replace) {
//               return res.status(409).json({ message: `File ${fileName} already exists. Do you want to replace it?` });
//           }

//           try {
//               fs.writeFileSync(filePath, file.buffer);
//               filePaths.push(filePath);
//           } catch (fsError) {
//               console.error("Error saving file:", filePath, fsError.message);
//               throw new Error("Failed to save DXF file.");
//           }
//       }

//       console.log("Uploaded DXF files:", filePaths);

//       // Insert records into the database with version number
//       for (const filePath of filePaths) {
//           await insertLaserDesignUpload(productId, userId, revisionId, filePath, comment, versionNumber);
//       }

//       if (userRole === "designer") {
//         await db.query("UPDATE products SET status = 'under_review' WHERE product_id = ?", [productId]);
//     }

//       res.status(201).json({ message: "DXF files uploaded successfully." });

//   } catch (error) {
//       console.error("Error uploading DXF files:", error.message);
//       res.status(500).json({ message: "An error occurred while uploading the DXF files." });
//   }
// };

const laserUploadDesign1 = async (req, res) => {
  const {
    productId,
    userId: bodyUserId,
    replace,
    revision,
    comment = '',
  } = req.body;
  const files = req.files;

  let userId = req.session?.user?.id || bodyUserId;
  const userRole = req.session?.user?.role;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  userId = parseInt(userId, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Valid User ID is required.' });
  }

  if (!productId || !files || files.length === 0 || !revision) {
    return res.status(400).json({
      message: 'Product ID, revision, and design files are required.',
    });
  }

  const invalidFiles = files.filter(
    (file) => !file.originalname.toLowerCase().endsWith('.dxf'),
  );
  if (invalidFiles.length > 0) {
    return res
      .status(400)
      .json({ message: 'Only DXF files are allowed for upload.' });
  }

  try {
    // Fetch product name
    const results = await db.query(
      'SELECT product_name FROM products WHERE product_id = ?',
      [productId],
    );
    const product = results[0][0];
    if (!product || !product.product_name) {
      return res
        .status(404)
        .json({ message: 'Product not found or product name is missing.' });
    }
    const productName = product.product_name;

    console.log('Fetched Product Name:', productName);

    // Get base directory
    const baseDir = await getBaseDir();
    if (!baseDir) {
      throw new Error('Base directory could not be retrieved.');
    }

    const productFolder = path.join(baseDir, productName);
    if (!fs.existsSync(productFolder)) {
      return res
        .status(404)
        .json({ message: 'Product folder does not exist.' });
    }

    // Fetch the latest revision_id
    const [revisionResults] = await db.query(
      `SELECT r_id FROM revision WHERE product_id = ? ORDER BY timestamp DESC LIMIT 1`,
      [productId],
    );

    if (revisionResults.length === 0) {
      return res
        .status(404)
        .json({ message: 'No revisions found for the given product.' });
    }

    const revisionId = revisionResults[0].r_id;
    console.log(`Revision ID: ${revisionId}`);

    // Find existing revision version folders
    const revisionFolders = fs
      .readdirSync(productFolder)
      .filter((folder) => folder.startsWith(`${revision}_v`))
      .map((folder) => ({
        folder,
        version: parseInt(folder.replace(`${revision}_v`, ''), 10),
      }))
      .sort((a, b) => b.version - a.version); // Sort in descending order

    let targetRevisionFolder;
    let versionNumber = 0;

    if (revisionFolders.length > 0) {
      // Use the latest version folder
      targetRevisionFolder = path.join(
        productFolder,
        revisionFolders[0].folder,
      );
      versionNumber = revisionFolders[0].version;
      console.log(
        `Using existing revision version folder: ${revisionFolders[0].folder} (Version: ${versionNumber})`,
      );
    } else {
      // Use the default revision folder
      targetRevisionFolder = path.join(productFolder, revision);
      console.log(
        `No revision version folder found. Using base revision folder: ${revision}`,
      );
    }

    // Create 'DFX' folder inside the chosen revision folder
    const dfxFolder = path.join(targetRevisionFolder, 'DXF DATA');
    if (!fs.existsSync(dfxFolder)) {
      fs.mkdirSync(dfxFolder, { recursive: true });
    }

    console.log(`DXF files will be uploaded to: ${dfxFolder}`);

    const filePaths = [];
    const newlyUploadedFiles = [];
    for (const file of files) {
      const fileName = file.originalname;
      const filePath = path.join(dfxFolder, fileName);

      const fileAlreadyExists = fs.existsSync(filePath);

      if (fileAlreadyExists && !replace) {
        return res.status(409).json({
          message: `File ${fileName} already exists. Do you want to replace it?`,
        });
      }

      try {
        fs.writeFileSync(filePath, file.buffer);
        filePaths.push(filePath);

        if (!fileAlreadyExists) {
          newlyUploadedFiles.push(filePath); // Only push if it's a new file
        }
      } catch (fsError) {
        console.error('Error saving file:', filePath, fsError.message);
        throw new Error('Failed to save DXF file.');
      }
    }

    console.log('Uploaded DXF files:', filePaths);

    // Insert records into the database with version number
    for (const filePath of newlyUploadedFiles) {
      await insertLaserDesignUpload(
        productId,
        userId,
        revisionId,
        filePath,
        comment,
        versionNumber,
      );
    }

    // if (userRole === 'designer') {
    //   await db.query(
    //     "UPDATE products SET status = 'under_review' WHERE product_id = ?",
    //     [productId],
    //   );
    // }

    if (userRole === 'designer') {
      const [[designExists]] = await db.query(
        'SELECT 1 FROM design_upload WHERE product_id = ? LIMIT 1',
        [productId],
      );

      const [[pdfExists]] = await db.query(
        'SELECT 1 FROM pdf_documents WHERE product_id = ? LIMIT 1',
        [productId],
      );

      if (designExists && pdfExists) {
        await db.query(
          "UPDATE products SET status = 'under_review' WHERE product_id = ?",
          [productId],
        );
        console.log('Product status updated to under_review');
      } else {
        console.log(
          'Product ID not found in both design_upload and pdf_documents. Skipping status update.',
        );
      }
    }

    res.status(201).json({ message: 'DXF files uploaded successfully.' });
  } catch (error) {
    console.error('Error uploading DXF files:', error.message);
    res
      .status(500)
      .json({ message: 'An error occurred while uploading the DXF files.' });
  }
};


const laserUploadDesign = async (req, res) => {
  const {
    productId,
    userId: bodyUserId,
    replace,
    revision,
    comment = '',
  } = req.body;
  const files = req.files;

  let userId = req.session?.user?.id || bodyUserId;
  const userRole = req.session?.user?.role;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  userId = parseInt(userId, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Valid User ID is required.' });
  }

  if (!productId || !files || files.length === 0 || !revision) {
    return res.status(400).json({
      message: 'Product ID, revision, and design files are required.',
    });
  }

  const invalidFiles = files.filter(
    (file) => !file.originalname.toLowerCase().endsWith('.dxf'),
  );
  if (invalidFiles.length > 0) {
    return res
      .status(400)
      .json({ message: 'Only DXF files are allowed for upload.' });
  }

  try {
    // Get product name
    const results = await db.query(
      'SELECT product_name FROM products WHERE product_id = ?',
      [productId],
    );
    const product = results[0][0];
    if (!product?.product_name) {
      return res
        .status(404)
        .json({ message: 'Product not found or product name is missing.' });
    }
    const productName = product.product_name;

    // Get base dir
    const baseDir = await getBaseDir();
    if (!baseDir) {
      throw new Error('Base directory could not be retrieved.');
    }

    const productFolder = path.join(baseDir, productName);
    if (!fs.existsSync(productFolder)) {
      return res
        .status(404)
        .json({ message: 'Product folder does not exist.' });
    }

    // Get latest revision_id
    const [revisionResults] = await db.query(
      `SELECT r_id FROM revision WHERE product_id = ? ORDER BY timestamp DESC LIMIT 1`,
      [productId],
    );

    if (revisionResults.length === 0) {
      return res
        .status(404)
        .json({ message: 'No revisions found for the given product.' });
    }

    const revisionId = revisionResults[0].r_id;

    // Determine target revision folder
    const revisionFolders = fs
      .readdirSync(productFolder)
      .filter((folder) => folder.startsWith(`${revision}_v`))
      .map((folder) => ({
        folder,
        version: parseInt(folder.replace(`${revision}_v`, ''), 10),
      }))
      .sort((a, b) => b.version - a.version);

    let targetRevisionFolder;
    let versionNumber = 0;

    if (revisionFolders.length > 0) {
      targetRevisionFolder = path.join(productFolder, revisionFolders[0].folder);
      versionNumber = revisionFolders[0].version;
    } else {
      targetRevisionFolder = path.join(productFolder, revision);
    }

    // Ensure DXF folder exists
    const dfxFolder = path.join(targetRevisionFolder, 'DXF DATA');
    if (!fs.existsSync(dfxFolder)) {
      fs.mkdirSync(dfxFolder, { recursive: true });
    }

    const filePaths = [];
    const newlyUploadedFiles = [];
    const duplicateFiles = [];

    // Check for duplicates
    for (const file of files) {
      const filePath = path.join(dfxFolder, file.originalname);
      if (fs.existsSync(filePath) && !replace) {
        duplicateFiles.push(file.originalname);
      }
    }

    // If any duplicates found and not replacing, return conflict
    if (duplicateFiles.length > 0 && !replace) {
      return res.status(409).json({
        message: `The following file(s) already exist: ${duplicateFiles.join(', ')}. Do you want to replace them?`,
      });
    }

    // Save files
    for (const file of files) {
      const fileName = file.originalname;
      const filePath = path.join(dfxFolder, fileName);
      const fileAlreadyExists = fs.existsSync(filePath);

      try {
        fs.writeFileSync(filePath, file.buffer);
        filePaths.push(filePath);

        if (!fileAlreadyExists) {
          newlyUploadedFiles.push(filePath);
        }
      } catch (fsError) {
        console.error('Error saving file:', filePath, fsError.message);
        throw new Error('Failed to save DXF file.');
      }
    }

    // Insert records into database
    for (const filePath of newlyUploadedFiles) {
      await insertLaserDesignUpload(
        productId,
        userId,
        revisionId,
        filePath,
        comment,
        versionNumber,
      );
    }

    // Update product status if needed
    if (userRole === 'designer') {
      const [[designExists]] = await db.query(
        'SELECT 1 FROM design_upload WHERE product_id = ? LIMIT 1',
        [productId],
      );
      const [[pdfExists]] = await db.query(
        'SELECT 1 FROM pdf_documents WHERE product_id = ? LIMIT 1',
        [productId],
      );

      if (designExists && pdfExists) {
        await db.query(
          "UPDATE products SET status = 'under_review' WHERE product_id = ?",
          [productId],
        );
      }
    }

    res.status(201).json({ message: 'DXF files uploaded successfully.' });
  } catch (error) {
    console.error('Error uploading DXF files:', error.message);
    res
      .status(500)
      .json({ message: 'An error occurred while uploading the DXF files.' });
  }
};


const insertDfxFile = async (productId, userId, dfxFilePath, revisionId) => {
  try {
    const sql = `
      INSERT INTO dfx_files (product_id, user_id, dfx_file_path, revision_id)
      VALUES (?, ?, ?, ?)
    `;

    await db.query(sql, [productId, userId, dfxFilePath, revisionId]);

    console.log('DFX file inserted successfully.');
  } catch (error) {
    throw new Error(`Failed to insert DFX file: ${error.message}`);
  }
};

const insertLaserDesignUpload = async (
  productId,
  userId,
  revisionId,
  filePath,
  comment,
  version,
) => {
  try {
    const [userResults] = await db.query('SELECT id FROM users WHERE id = ?', [
      userId,
    ]);
    if (userResults.length === 0) {
      throw new Error(`User ID ${userId} does not exist.`);
    }

    await db.query(
      'INSERT INTO laser_design_upload (product_id, user_id, revision_id, laser_design_path, comment, version) VALUES (?, ?, ?, ?, ?, ?)',
      [productId, userId, revisionId, filePath, comment, version],
    );

    console.log(
      `Laser design upload record inserted successfully with version ${version}`,
    );
  } catch (error) {
    console.error('Error inserting laser design upload record:', error.message);
    throw new Error('Failed to insert laser design upload record');
  }
};

// const fetchLaserDesigns = async (req, res) => {
//   const { productId, revisionId } = req.params;

//   if (!productId || isNaN(parseInt(productId, 10))) {
//     console.error('Validation failed: productId is missing or invalid.', { productId });
//     return res.status(400).json({ message: 'Valid Product ID is required.' });
//   }

//   let selectedRevisionId = revisionId;

//   try {
//     if (!revisionId || isNaN(parseInt(revisionId, 10))) {
//       const [latestRevisionResult] = await db.query(
//         `SELECT MAX(r_id) AS latest_revision FROM revision WHERE product_id = ?`,
//         [productId]
//       );

//       if (!latestRevisionResult || latestRevisionResult.length === 0 || !latestRevisionResult[0].latest_revision) {
//         return res.status(404).json({ message: 'No revisions found for the given product.' });
//       }

//       selectedRevisionId = latestRevisionResult[0].latest_revision;
//     }

//     const [laserDesignFilesResult] = await db.query(
//       `SELECT ldu.ldu_id, ldu.laser_design_path, ldu.upload_timestamp, ldu.comment, ldu.version
//        FROM laser_design_upload ldu
//        WHERE ldu.product_id = ? AND ldu.revision_id = ?
//        ORDER BY ldu.upload_timestamp DESC`,
//       [productId, selectedRevisionId]
//     );

//     if (!laserDesignFilesResult || laserDesignFilesResult.length === 0) {
//       return res.status(404).json({ message: 'No laser design files found for the selected revision.' });
//     }

//     res.status(200).json({
//       message: 'Laser design files fetched successfully.',
//       revisionId: selectedRevisionId,
//       files: laserDesignFilesResult.map(file => ({
//         ldu_id: file.ldu_id,
//         laserDesignPath: file.laser_design_path,
//         uploadTimestamp: file.upload_timestamp,
//         comment: file.comment,
//         version: file.version,
//       })),
//     });
//   } catch (error) {
//     console.error('Error fetching laser design files:', error.message);
//     res.status(500).json({ message: 'An error occurred while fetching laser design files.' });
//   }
// };

const fetchLaserDesigns = async (req, res) => {
  const { productId, revisionId, version } = req.params;

  // Validate productId
  if (!productId || isNaN(parseInt(productId, 10))) {
    console.error('Validation failed: productId is missing or invalid.', {
      productId,
    });
    return res.status(400).json({ message: 'Valid Product ID is required.' });
  }

  let selectedRevisionId = revisionId;
  let selectedVersion = version;

  try {
    // 🔹 If no revisionId is provided, fetch the latest revision
    if (!revisionId || isNaN(parseInt(revisionId, 10))) {
      const latestRevisionQuery = `
        SELECT r_id FROM revision
        WHERE product_id = ? 
        ORDER BY timestamp DESC 
        LIMIT 1
      `;
      const [latestRevisionResult] = await db.query(latestRevisionQuery, [
        productId,
      ]);

      if (!latestRevisionResult || latestRevisionResult.length === 0) {
        return res
          .status(404)
          .json({ message: 'No revisions found for this product.' });
      }

      selectedRevisionId = latestRevisionResult[0].r_id;
    }

    // 🔹 If no version is provided, fetch the latest version
    if (!version) {
      const latestVersionQuery = `
        SELECT version FROM laser_design_upload
        WHERE product_id = ? AND revision_id = ?
        ORDER BY version DESC 
        LIMIT 1
      `;
      const [latestVersionResult] = await db.query(latestVersionQuery, [
        productId,
        selectedRevisionId,
      ]);

      if (latestVersionResult.length > 0) {
        selectedVersion = latestVersionResult[0].version;
      } else {
        selectedVersion = null;
      }
    } else {
      // Check if the specified version exists
      const versionExistsQuery = `
        SELECT version FROM laser_design_upload
        WHERE product_id = ? AND revision_id = ? AND version = ?
      `;
      const [versionExistsResult] = await db.query(versionExistsQuery, [
        productId,
        selectedRevisionId,
        version,
      ]);

      if (versionExistsResult.length === 0) {
        return res.status(404).json({
          message:
            'The specified version does not exist for the selected revision.',
        });
      }
    }

    // 🔹 Fetch laser design files based on the revision and version filter
    let laserDesignFilesQuery = `
      SELECT ldu.ldu_id, ldu.laser_design_path, ldu.upload_timestamp, ldu.comment, ldu.version, r.revision
      FROM laser_design_upload ldu
      JOIN revision r ON ldu.revision_id = r.r_id
      WHERE ldu.product_id = ? AND ldu.revision_id = ?
    `;

    const queryParams = [productId, selectedRevisionId];

    if (version) {
      laserDesignFilesQuery += ` AND ldu.version = ?`;
      queryParams.push(version);
    }

    laserDesignFilesQuery += ` ORDER BY ldu.upload_timestamp DESC`;

    const [laserDesignFilesResult] = await db.query(
      laserDesignFilesQuery,
      queryParams,
    );

    if (!laserDesignFilesResult || laserDesignFilesResult.length === 0) {
      return res.status(404).json({
        message:
          'No laser design files found for the selected revision and version.',
      });
    }

    res.status(200).json({
      message: 'Laser design files fetched successfully.',
      revisionId: selectedRevisionId,
      version: selectedVersion || 'latest',
      files: laserDesignFilesResult.map((file) => ({
        ldu_id: file.ldu_id,
        laserDesignPath: file.laser_design_path,
        uploadTimestamp: file.upload_timestamp,
        comment: file.comment,
        version: file.version,
        revision: file.revision,
      })),
    });
  } catch (error) {
    console.error('Error fetching laser design files:', error.message);
    res.status(500).json({
      message: 'An error occurred while fetching laser design files.',
    });
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
      SELECT p.product_id, p.product_name, p.status, p.comments, p.created_at, p.product_version, revision, type,
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

    const [products] = await db.query(
      query,
      loggedInUserRole !== 'admin' ? [loggedInUserId] : [],
    );

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching products.',
    });
  }
};

const checkProducts = async (req, res) => {
  try {
    const query = 'SELECT * FROM products';
    const [rows] = await db.execute(query);

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

const openFile = async (req, res) => {
  const { projectName, taskName } = req.params;

  try {
    const baseDir = await getBaseDir();

    const taskFolder = path.join(baseDir, projectName, taskName);

    fs.readdir(taskFolder, (err, files) => {
      if (err) {
        console.error('Error reading directory:', err);
        return res.status(500).json({ message: 'Error reading task folder' });
      }

      const versionPattern = new RegExp(`_v(\\d+)\\.`);
      let newestVersionFile = null;
      let highestVersion = 0;

      files.forEach((file) => {
        const match = file.match(versionPattern);
        if (match) {
          const version = parseInt(match[1], 10);
          if (version > highestVersion) {
            highestVersion = version;
            newestVersionFile = file;
          }
        }
      });

      const copyFile = files.find((file) => file.startsWith('copy_of_'));
      const fileToOpen = newestVersionFile || copyFile;

      if (!fileToOpen) {
        return res.status(404).json({ message: 'No file found to open' });
      }

      const filePath = path.join(taskFolder, fileToOpen);

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
    const results = await db.query(
      'SELECT product_name FROM products WHERE product_id = ?',
      [productId],
    );
    const product = results[0][0];
    if (!product || !product.product_name) {
      return res
        .status(404)
        .json({ message: 'Product not found or product name is missing.' });
    }
    const productName = product.product_name;

    // Get the base directory
    const baseDir = await getBaseDir();
    if (!baseDir) throw new Error('Base directory could not be retrieved.');

    // Construct the design folder path
    const designFolder = path.join(baseDir, productName, 'DESIGN DATA');
    console.log('Design Folder Path:', designFolder);

    // Check if the design folder exists
    if (!(await fsWrapper.existsSync(designFolder))) {
      console.error('Design folder does not exist:', designFolder);
      return res.status(404).json({ message: 'Design folder not found.' });
    }

    // Read files in the design folder
    const files = await fsWrapper.readdirSync(designFolder);
    if (files.length === 0) {
      console.error('No files found in the design folder:', designFolder);
      return res
        .status(404)
        .json({ message: 'No files found in the design folder.' });
    }

    // Build the file paths
    const filePaths = files.map((file) => path.join(designFolder, file));
    console.log('Files to Copy:', filePaths);

    // Return all file paths
    res.json({ filePaths });
  } catch (error) {
    console.error('Error processing request:', error.message);
    res
      .status(500)
      .json({ message: 'An error occurred while processing the request.' });
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

  if (!productId || !status) {
    return res
      .status(400)
      .json({ message: 'Product ID and status are required.' });
  }

  const query =
    'UPDATE products SET status = ?, updated_at = NOW() WHERE product_id = ?';

  try {
    const [results] = await db.query(query, [status, productId]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // If status is "complete", remove assigned designers and log actions
    if (status.toLowerCase() === 'complete') {
      // Find all assigned designers
      const [assignedDesigners] = await db.query(
        `SELECT pa.user_id 
         FROM product_assignment pa
         JOIN users u ON pa.user_id = u.id
         WHERE pa.product_id = ? AND u.role = 'designer'`,
        [productId],
      );

      if (assignedDesigners.length > 0) {
        // Remove designers from product_assignment
        await db.query(
          'DELETE FROM product_assignment WHERE product_id = ? AND user_id IN (?)',
          [productId, assignedDesigners.map((d) => d.user_id)],
        );

        // Log the removal action in product_activity_logs
        const logEntries = assignedDesigners.map(({ user_id }) => [
          user_id,
          productId,
          'remove',
          null, // No specific file path needed
          new Date(),
        ]);

        await db.query(
          'INSERT INTO product_activity_logs (user_id, product_id, action, file_path, timestamp) VALUES ?',
          [logEntries],
        );
      }
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
  const existingFolders = fs
    .readdirSync(basePath)
    .filter(
      (folder) =>
        folder.startsWith('designs_v') &&
        fs.lstatSync(path.join(basePath, folder)).isDirectory(),
    );

  const versionNumbers = existingFolders
    .map((folder) => {
      const match = folder.match(/designs_v(\d+)/);
      return match ? parseInt(match[1], 10) : null;
    })
    .filter((version) => version !== null);

  if (versionNumbers.length === 0) {
    return null; // No version folders found
  }

  const latestVersion = Math.max(...versionNumbers);
  return path.join(basePath, `designs_v${latestVersion}`);
};

const addUserToProduct = async (req, res) => {
  const { productId } = req.params;
  const { userId } = req.body;

  if (!productId || !userId || !Array.isArray(userId)) {
    return res
      .status(400)
      .json({ message: 'Product ID and an array of User IDs are required.' });
  }

  try {
    const productQuery =
      'SELECT product_name FROM products WHERE product_id = ?';
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
      const [assignmentResults] = await db.query(checkAssignmentQuery, [
        productId,
        user,
      ]);

      if (assignmentResults.length > 0) {
        skippedUsers.push(user);
        continue;
      }

      const assignUserQuery = `
        INSERT INTO product_assignments (product_id, user_id, assigned_at) 
        VALUES (?, ?, NOW())`;
      await db.query(assignUserQuery, [productId, user]);
      addedUsers.push(user);

      // Log the action to product_activity_logs
      const logQuery = `
        INSERT INTO product_activity_logs (user_id, product_id, action, added_user_id, timestamp) 
        VALUES (?, ?, 'add', ?, NOW())`;
      await db.query(logQuery, [user, productId, user]);
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
    return res
      .status(400)
      .json({ message: 'Product ID and User ID are required.' });
  }

  try {
    const checkAssignmentQuery = `
      SELECT * FROM product_assignments 
      WHERE product_id = ? AND user_id = ?`;
    const [assignmentResults] = await db.query(checkAssignmentQuery, [
      productId,
      userId,
    ]);

    if (assignmentResults.length === 0) {
      return res
        .status(404)
        .json({ message: 'User not assigned to this product.' });
    }

    const deleteQuery = `
      DELETE FROM product_assignments 
      WHERE product_id = ? AND user_id = ?`;
    const [deleteResults] = await db.query(deleteQuery, [productId, userId]);

    if (deleteResults.affectedRows === 0) {
      return res
        .status(500)
        .json({ message: 'Failed to remove user from product.' });
    }

    const activityLogQuery = `
      INSERT INTO product_activity_logs (user_id, product_id, action, added_user_id, timestamp) 
      VALUES (?, ?, 'remove', ?, NOW())`;
    await db.query(activityLogQuery, [userId, productId, userId]);

    res
      .status(200)
      .json({ message: 'User removed from product successfully.' });
  } catch (err) {
    console.error('Error removing user from product:', err);
    res
      .status(500)
      .json({
        message: 'An error occurred while removing the user from the product.',
      });
  }
};

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
        const [assignmentResults] = await db.query(checkAssignmentQuery, [
          productId,
          userId,
        ]);

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
      INSERT INTO product_activity_logs (user_id, product_id, action, added_user_id, timestamp)
      VALUES (?, ?, ?, ?, NOW())`;
    for (const log of logs) {
      await db.query(logQuery, [
        log.userId,
        productId,
        log.action,
        log.filePath,
      ]);
    }

    res
      .status(200)
      .json({ message: 'Users updated successfully.', addedUsers });
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
      const newFileName = `${
        path.parse(originalFile).name
      }_${username}${path.extname(originalFile)}`; // New file name with user
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

const logUserAssignmentHistory = (
  taskId,
  previousUserId,
  newUserId,
  callback,
) => {
  const query =
    'INSERT INTO task_user_history (task_id, previous_user_id, new_user_id) VALUES (?, ?, ?)';
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
      return res
        .status(500)
        .json({ message: 'Error fetching user assignment history.' });
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
    const baseDir = await getBaseDir();

    const folderPath = path.join(baseDir, projectName);

    const resolvedFolderPath = await resolveFilePath(folderPath);

    if (!(await fsWrapper.existsSync(folderPath))) {
      return res.status(404).send({ message: 'Folder not found' });
    }

    res.status(200).json({ folderPath: resolvedFolderPath });
  } catch (err) {
    console.error('Error in copyFolderPath:', err);
    res
      .status(500)
      .send({ message: 'Failed to fetch folder path', error: err.message });
  }
};

const updateTaskDetails = async (req, res) => {
  const { task_id } = req.params; // Get task_id from req.params
  const {
    taskName,
    assignedUserIds,
    description,
    startDate,
    endDate,
    priority,
    status,
    comments,
  } = req.body;

  // Ensure user is authenticated
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }

  // Validate task_id
  if (!task_id) {
    return res.status(400).json({ message: 'Task ID is required.' });
  }

  // Ensure assignedUserIds is an array
  const safeAssignedUserIds = Array.isArray(assignedUserIds)
    ? assignedUserIds
    : [];

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

    const updateTaskQuery = `UPDATE tasks SET ${updateQueries.join(
      ', ',
    )} WHERE task_id = ?`;
    params.push(task_id);

    const [result] = await db.query(updateTaskQuery, params);

    if (result.affectedRows > 0) {
      await db.query(
        `
        INSERT INTO task_status_activity (task_id, user_id, previous_status, updated_status, timestamp)
        VALUES (?, ?, ?, ?, NOW())
      `,
        [task_id, req.session.user.id, previousStatus, status || task.status],
      );
    }

    res.json({ success: true, message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ success: false, message: 'Failed to update task' });
  }
};

const updateProductDetails = async (req, res) => {
  const { product_id } = req.params; // Get product_id from req.params
  const { productName, docUpload, status, comments, type } = req.body;

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
      type,
    };

    const updatedProductId = await updateProduct(
      product_id,
      updates,
      req.session.user.id,
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      productId: updatedProductId,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to update product' });
  }
};

const getTaskById = async (task_id) => {
  const [rows] = await db.query('SELECT * FROM tasks WHERE task_id = ?', [
    task_id,
  ]);
  return rows.length > 0 ? rows[0] : null;
};

const fetchPendingTasks = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const tasks = await taskModel.fetchPendingTasks(
      loggedInUserRole,
      loggedInUserId,
    );
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error fetching pending tasks:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch pending tasks' });
  }
};

const fetchInProgressTasks = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const tasks = await taskModel.fetchInProgressTasks(
      loggedInUserRole,
      loggedInUserId,
    );
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error fetching In progress parts:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch In Progress parts' });
  }
};

const fetchOnHoldTasks = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const tasks = await taskModel.fetchOnHoldTasks(
      loggedInUserRole,
      loggedInUserId,
    );
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error fetching In progress parts:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch In Progress parts' });
  }
};

const fetchCompletedTasks = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const tasks = await taskModel.fetchCompletedTasks(
      loggedInUserRole,
      loggedInUserId,
    );
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error fetching In progress parts:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch In Progress parts' });
  }
};

const fetchUnderReviewTasks = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const tasks = await taskModel.fetchUnderReviewTasks(
      loggedInUserRole,
      loggedInUserId,
    );
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error fetching In progress parts:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch In Progress parts' });
  }
};

export const getPendingTaskCount = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const pendingTaskCount = await taskModel.getPendingTaskCount(
      loggedInUserRole,
      loggedInUserId,
    );

    res.json({ success: true, data: { pendingTaskCount } });
  } catch (error) {
    console.error('Error fetching pending tasks:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch pending tasks' });
  }
};

const getProductActivityLogs = async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({ message: 'Task ID is required.' });
  }

  // SQL query to fetch logs along with the user name
  const query = `
    SELECT pal.user_id, u.name, pal.product_id, pal.action, pal.added_user_id, pal.timestamp
    FROM product_activity_logs pal
    JOIN users u ON pal.user_id = u.id
    WHERE pal.product_id = ?
    ORDER BY pal.timestamp DESC
  `;

  try {
    const [logs] = await db.query(query, [productId]);

    if (logs.length === 0) {
      return res
        .status(404)
        .json({ message: 'No activity logs found for this task.' });
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
      return res
        .status(404)
        .json({ message: 'No activity found for this task.' });
    }

    res.json({ success: true, data: activity });
  } catch (error) {
    console.error('Error fetching task status activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task status activity',
    });
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
      return res
        .status(404)
        .json({ message: 'No activity found for this task.' });
    }

    res.json({ success: true, data: activity });
  } catch (error) {
    console.error('Error fetching task status activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task status activity',
    });
  }
};

const fetchProjectWiseTasks = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;
    const { projectId } = req.params; // Assuming you're passing projectId in the URL params

    const tasks = await taskModel.fetchProjectWiseTasks(
      loggedInUserRole,
      loggedInUserId,
      projectId,
    );
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error fetching project wise tasks:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch project-wise tasks' });
  }
};

const fetchTaskWiseFilePaths = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;
    const { taskId } = req.params; // Assuming you're passing taskId in the URL params

    const filePaths = await taskModel.fetchTaskWiseFilePaths(
      loggedInUserRole,
      loggedInUserId,
      taskId,
    );
    res.json({ success: true, data: filePaths });
  } catch (error) {
    console.error('Error fetching task wise file paths:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task-wise file paths',
    });
  }
};

const fetchPendingProducts = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const products = await taskModel.fetchPendingProducts(
      loggedInUserRole,
      loggedInUserId,
    );
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching pending products:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch pending products' });
  }
};

const fetchInProgressProducts = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const products = await taskModel.fetchInProgressProducts(
      loggedInUserRole,
      loggedInUserId,
    );
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching pending products:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch pending products' });
  }
};

const fetchUnderReviewProducts = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const products = await taskModel.fetchUnderReviewProducts(
      loggedInUserRole,
      loggedInUserId,
    );
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching pending products:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch pending products' });
  }
};

const fetchOnHoldProducts = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const products = await taskModel.fetchOnHoldProducts(
      loggedInUserRole,
      loggedInUserId,
    );
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching pending products:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch pending products' });
  }
};

const fetchCompletedProducts = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const products = await taskModel.fetchCompletedProducts(
      loggedInUserRole,
      loggedInUserId,
    );
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching pending products:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch pending products' });
  }
};

const fetchPendingAndInProgressProducts = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    const { id: loggedInUserId, role: loggedInUserRole } = req.session.user;

    const products = await taskModel.fetchPendingAndInProgressProducts(
      loggedInUserRole,
      loggedInUserId,
    );
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching pending products:', error);
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch pending products' });
  }
};

const fetchUserByID = async (req, res) => {
  const { userId } = req.params;
  try {
    const [results] = await db.query('SELECT name FROM users WHERE id = ?', [
      userId,
    ]);
    if (results.length > 0) {
      res.status(200).json({ name: results[0].name });
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching user details.' });
  }
};

const getAllProductStatuses = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT product_id, status FROM products');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching product statuses:', error);
    res.status(500).json({ error: 'Failed to fetch product statuses' });
  }
};

export default {
  createProduct,
  fetchProducts,
  uploadDesign,
  laserUploadDesign,
  addUserToProduct,
  removeUserFromProduct,
  updateProductUsers,
  updateProductDetails,
  fetchUploadedDesigns,
  fetchLaserDesigns,
  getProductActivityLogs,
  updateDesignUpload,
  fetchPendingProducts,
  fetchInProgressProducts,
  fetchUnderReviewProducts,
  fetchOnHoldProducts,
  fetchCompletedProducts,
  fetchPendingAndInProgressProducts,
  fetchProductStatusActivity,
  fetchDesignStatusActivity,
  downloadDesign,
  uploadNewVersion,
  fetchDesignUploadVersions,
  fetchUserByID,
  downloadFileByPath,
  downloadLatestVersionZip,
  getAllDesignUploadVersions,
  getLatestDesignUploadVersions,
  getProductDocuments,
  downloadProductDocuments,
  downloadLaserDesign,
  uploadLibraryFiles,
  fetchLibraryFiles,
  downloadLibraryDesign,
  getProductSuggestions,
  getDfxFiles,
  copyDfxPath,
  pdfUpload,
  getProductPdfDocuments,
  downloadPDFDocument,
  handleAddRevisionSubmit,
  downloadProductDocumentsZip,
  fetchProductRevisions,
  openPdfFile,
  laserUploadNewVersion,
  fetchRevisionsWithVersions,
  uploadCustomerDocuments,
  checkProducts,
  openCustDocFile,
  deletePdfDocument,
  deleteLaserDesign,
  fetchProjects,
  openFile,
  openFolder,
  fetchUsers,
  updateProductStatus,
  updateTaskDetails,
  fetchTaskUserHistory,
  fetchPendingTasks,
  fetchInProgressTasks,
  fetchOnHoldTasks,
  fetchCompletedTasks,
  fetchUnderReviewTasks,
  getPendingTaskCount,
  copyFilePath,
  copyFolderPath,
  fetchProjectWiseTasks,
  fetchTaskWiseFilePaths,
  deleteCustomerDocDocument,
  getAllProductStatuses,
  downloadLatestDesignVersionZip
};
