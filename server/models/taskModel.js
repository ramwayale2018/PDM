import mysql from 'mysql2';
import db from '../database/db.js';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import moment from 'moment';
import AdmZip from 'adm-zip';
import { fileURLToPath } from 'url';

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



const resolveFilePath = async (filePath) => {
  try {
    const [rows] = await db.query('SELECT folder_path FROM store_folder_path ORDER BY timestamp DESC LIMIT 1');
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
  existsSync: async (filePath) => fs.existsSync(await resolveFilePath(filePath)),
  readdirSync: async (dirPath) => fs.readdirSync(await resolveFilePath(dirPath)),
  createReadStream: async (filePath, options) => fs.createReadStream(await resolveFilePath(filePath), options),
  createWriteStream: async (filePath, options) => fs.createWriteStream(await resolveFilePath(filePath), options),
  unlinkSync: async (filePath) => fs.unlinkSync(await resolveFilePath(filePath)),
  mkdirSync: async (dirPath, options) => fs.mkdirSync(await resolveFilePath(dirPath), options),
  writeFileSync: async (filePath, data, options) => fs.writeFileSync(await resolveFilePath(filePath), data, options),
  readFileSync: async (filePath, options) => fs.readFileSync(await resolveFilePath(filePath), options),
  statSync: async (filePath) => fs.statSync(await resolveFilePath(filePath)),
};







//DFX Dir
const getDfxDir = async () => {
  try {
    const [rows] = await db.query('SELECT dfx_folder_path FROM store_dfx_folder_path ORDER BY timestamp DESC LIMIT 1');
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
    const [rows] = await db.query('SELECT dfx_folder_path FROM store_dfx_folder_path ORDER BY timestamp DESC LIMIT 1');
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
  existsSync: async (filePath) => fs.existsSync(await resolveDfxFilePath(filePath)),
  readdirSync: async (dirPath) => fs.readdirSync(await resolveDfxFilePath(dirPath)),
  createReadStream: async (filePath, options) => fs.createReadStream(await resolveDfxFilePath(filePath), options),
  createWriteStream: async (filePath, options) => fs.createWriteStream(await resolveDfxFilePath(filePath), options),
  unlinkSync: async (filePath) => fs.unlinkSync(await resolveDfxFilePath(filePath)),
  mkdirSync: async (dirPath, options) => fs.mkdirSync(await resolveDfxFilePath(dirPath), options),
  writeFileSync: async (filePath, data, options) => fs.writeFileSync(await resolveDfxFilePath(filePath), data, options),
  readFileSync: async (filePath, options) => fs.readFileSync(await resolveDfxFilePath(filePath), options),
  statSync: async (filePath) => fs.statSync(await resolveDfxFilePath(filePath)),
};





const insertProduct = async (productName, status, comments, userId, revision, partType) => {
  try {
    console.log('Inserting product:', { productName, status, comments, userId, revision, partType });

    const sqlProduct = `
      INSERT INTO products (product_name, status, comments, created_at, updated_at, user_id, revision, type)
      VALUES (?, ?, ?, NOW(), NOW(), ?, ?, ?)
    `;

    console.log('Executing SQL for insertProduct:', sqlProduct);
    console.log('With parameters:', [productName, status, comments, userId, revision, partType]);

    // Execute query and get result directly
    const [result] = await db.query(sqlProduct, [productName, status, comments, userId, revision, partType]);

    const productId = result.insertId;
    console.log('Inserted Product ID:', productId);
    return productId;
  } catch (error) {
    throw new Error(`Failed to insert product: ${error.message}`);
  }
};








const assignUsersToProduct = async (productId, userIds) => {
  try {
    console.log('Assigning users to product:', { productId, userIds });

    for (const userId of userIds) {
      const [existingAssignment] = await db.query(
        'SELECT * FROM product_assignments WHERE product_id = ? AND user_id = ?',
        [productId, userId]
      );

      if (existingAssignment.length === 0) {
        await db.query(
          'INSERT INTO product_assignments (product_id, user_id, assigned_at) VALUES (?, ?, NOW())',
          [productId, userId]
        );
        console.log(`Assigned user ${userId} to product ${productId}`);
      } else {
        console.log(`User ${userId} is already assigned to product ${productId}`);
      }
    }
  } catch (error) {
    console.error('Error assigning users:', error.message);
    throw new Error(`Failed to assign users: ${error.message}`);
  }
};










const getProjects = (callback) => {
  const sql = 'SELECT * FROM projects';
  db.query(sql, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};



const updateTask = async (taskId, taskName, projectId, filePath, startDate, endDate, priority, newStatus, comments, userId) => {
  try {
    // Fetch the previous status of the task
    const [task] = await db.query('SELECT status FROM tasks WHERE task_id = ?', [taskId]);
    if (!task.length) {
      throw new Error('Task not found');
    }

    const previousStatus = task[0].status;

    // Update the task
    const sqlTask = `
      UPDATE tasks
      SET 
        task_name = ?, 
        project_id = ?, 
        start_date = ?, 
        end_date = ?, 
        priority = ?, 
        status = ?, 
        comments = ?, 
        updated_at = NOW()
      WHERE task_id = ?
    `;
    const [result] = await db.query(sqlTask, [taskName, projectId, JSON.stringify({ filePath }), startDate, endDate, priority, newStatus, comments, taskId]);

    if (result.affectedRows === 0) {
      throw new Error('Task not found or no changes made');
    }

    // Log the status change in task_status_activity
    const sqlLog = `
      INSERT INTO task_status_activity (task_id, user_id, previous_status, updated_status, timestamp)
      VALUES (?, ?, ?, ?, NOW())
    `;
    await db.query(sqlLog, [taskId, userId, previousStatus, newStatus]);

    return taskId;
  } catch (error) {
    throw new Error(`Failed to update task: ${error.message}`);
  }
};









// const updateProduct = async (productId, updates, userId) => {
//   try {
//     console.log(`Fetching previous status for product_id: ${productId}`);
//     const [product] = await db.query('SELECT status FROM products WHERE product_id = ?', [productId]);

//     if (!product.length) {
//       throw new Error('Product not found');
//     }

//     const previousStatus = product[0].status;
//     console.log(`Previous Status: ${previousStatus}`);

//     // Build the update query dynamically
//     const updateFields = [];
//     const params = [];

//     for (const [key, value] of Object.entries(updates)) {
//       if (value !== undefined) {
//         updateFields.push(`${key} = ?`);
//         params.push(value);
//       }
//     }

//     if (updateFields.length === 0) {
//       throw new Error('No fields to update');
//     }

//     const sqlProduct = `
//       UPDATE products
//       SET ${updateFields.join(', ')}, updated_at = NOW()
//       WHERE product_id = ?
//     `;
//     params.push(productId);

//     console.log(`Updating product with query: ${sqlProduct}, Params: ${params}`);
//     const [result] = await db.query(sqlProduct, params);

//     if (result.affectedRows === 0) {
//       throw new Error('Product not found or no changes made');
//     }

//     // Log the status change if applicable
//     if (updates.status && updates.status !== previousStatus) {
//       console.log(`Logging status change: ${previousStatus} → ${updates.status}`);

//       const sqlLog = `
//         INSERT INTO product_status_activity (product_id, user_id, previous_status, updated_status, activity_timestamp)
//         VALUES (?, ?, ?, ?, NOW())
//       `;
//       await db.query(sqlLog, [productId, userId, previousStatus, updates.status]);

//       // If the status is changed to "completed", copy the DFX folder from BaseDir to DfxDir
//       if (updates.status.toLowerCase() === "completed") {
//         const baseDir = await getBaseDir();
//         const dfxDir = await getDfxDir();

//         if (!baseDir || !dfxDir) {
//           throw new Error('Base directory or DFX directory could not be retrieved.');
//         }

//         // Fetch product name from the database
//         const [productResults] = await db.query('SELECT product_name FROM products WHERE product_id = ?', [productId]);
//         const productName = productResults[0].product_name;

//         // Fetch the latest revision for the product
//         const [revisionResults] = await db.query('SELECT revision FROM revision WHERE product_id = ? ORDER BY timestamp DESC LIMIT 1', [productId]);
//         const revision = revisionResults[0].revision;

//         if (!productName || !revision) {
//           throw new Error('Product name or revision not found.');
//         }

//         // Define paths for BaseDir and DfxDir
//         const baseProductFolder = path.join(baseDir, productName);
//         const baseRevisionFolder = path.join(baseProductFolder, revision);
//         const baseDfxFolder = path.join(baseRevisionFolder, 'DFX');

//         const dfxProductFolder = path.join(dfxDir, productName);
//         const dfxRevisionFolder = path.join(dfxProductFolder, revision);
//         const dfxDfxFolder = path.join(dfxRevisionFolder, 'DFX');

//         // Check if the DFX folder exists in BaseDir
//         if (fs.existsSync(baseDfxFolder)) {
//           // Create the same folder structure in DfxDir if it doesn't exist
//           if (!fs.existsSync(dfxProductFolder)) {
//             fs.mkdirSync(dfxProductFolder, { recursive: true });
//           }
//           if (!fs.existsSync(dfxRevisionFolder)) {
//             fs.mkdirSync(dfxRevisionFolder, { recursive: true });
//           }
//           if (!fs.existsSync(dfxDfxFolder)) {
//             fs.mkdirSync(dfxDfxFolder, { recursive: true });
//           }

//           // Copy files from BaseDir DFX folder to DfxDir DFX folder
//           const files = fs.readdirSync(baseDfxFolder);
//           files.forEach((file) => {
//             const sourceFilePath = path.join(baseDfxFolder, file);
//             const destinationFilePath = path.join(dfxDfxFolder, file);

//             fs.copyFileSync(sourceFilePath, destinationFilePath);
//             console.log(`Copied file: ${file} from BaseDir to DfxDir`);
//           });

//           console.log(`All files copied from BaseDir to DfxDir for product: ${productName}, revision: ${revision}`);
//         } else {
//           console.log(`No DFX folder found in BaseDir for product: ${productName}, revision: ${revision}`);
//         }
//       }
//     }

//     // If the status is changed to "complete", remove designers and log actions
//     if (updates.status && updates.status.toLowerCase() === "completed") {
//       console.log(`Status changed to 'complete', removing designers from product_id: ${productId}`);

//       // Fetch designers assigned to the product
//       const [assignedDesigners] = await db.query(`
//         SELECT pa.user_id
//         FROM product_assignments pa
//         JOIN users u ON pa.user_id = u.id
//         WHERE pa.product_id = ? AND u.role = 'designer'
//       `, [productId]);

//       console.log(`Assigned Designers:`, assignedDesigners);

//       if (assignedDesigners.length > 0) {
//         // Extract user IDs
//         const designerIds = assignedDesigners.map(d => d.user_id);
//         console.log(`Designer IDs to remove:`, designerIds);

//         // DELETE query fix: Use join for proper formatting
//         const sqlDelete = `
//           DELETE FROM product_assignments WHERE product_id = ? AND user_id IN (${designerIds.map(() => '?').join(',')})
//         `;
//         console.log(`Executing delete query: ${sqlDelete}`);
        
//         await db.query(sqlDelete, [productId, ...designerIds]);

//         console.log(`Designers successfully removed.`);

//         // Log the removal in product_activity_logs
//         const logEntries = assignedDesigners.map(({ user_id }) => [
//           user_id,
//           productId,
//           'remove',
//           null,  // file_path is null as per the table structure
//           new Date()
//         ]);

//         console.log(`Logging removal in product_activity_logs:`, logEntries);

//         await db.query(`
//           INSERT INTO product_activity_logs (user_id, product_id, action, file_path, timestamp)
//           VALUES ?
//         `, [logEntries]);

//         console.log(`Removal logged successfully.`);
//       } else {
//         console.log(`No designers found to remove.`);
//       }
//     }

//     return productId;
//   } catch (error) {
//     console.error(`Error updating product: ${error.message}`);
//     throw new Error(`Failed to update product: ${error.message}`);
//   }
// };




const updateProduct = async (productId, updates, userId) => {
  try {
    console.log(`Fetching previous status for product_id: ${productId}`);
    const [product] = await db.query('SELECT status FROM products WHERE product_id = ?', [productId]);

    if (!product.length) {
      throw new Error('Product not found');
    }

    const previousStatus = product[0].status;
    console.log(`Previous Status: ${previousStatus}`);

    // Build the update query dynamically
    const updateFields = [];
    const params = [];

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        updateFields.push(`${key} = ?`);
        params.push(value);
      }
    }

    if (updateFields.length === 0) {
      throw new Error('No fields to update');
    }

    const sqlProduct = `
      UPDATE products
      SET ${updateFields.join(', ')}, updated_at = NOW()
      WHERE product_id = ?
    `;
    params.push(productId);

    console.log(`Updating product with query: ${sqlProduct}, Params: ${params}`);
    const [result] = await db.query(sqlProduct, params);

    if (result.affectedRows === 0) {
      throw new Error('Product not found or no changes made');
    }

    // Log status change if applicable
    if (updates.status && updates.status !== previousStatus) {
      console.log(`Logging status change: ${previousStatus} → ${updates.status}`);

      const sqlLog = `
        INSERT INTO product_status_activity (product_id, user_id, previous_status, updated_status, activity_timestamp)
        VALUES (?, ?, ?, ?, NOW())
      `;
      await db.query(sqlLog, [productId, userId, previousStatus, updates.status]);

      // ✅ On status == 'completed', move DFX files without nesting "DFX DATA"
      if (updates.status.toLowerCase() === "completed") {
        const baseDir = await getBaseDir();
        const dfxDir = await getDfxDir();

        if (!baseDir || !dfxDir) {
          throw new Error('Base directory or DFX directory could not be retrieved.');
        }

        const [productResults] = await db.query('SELECT product_name FROM products WHERE product_id = ?', [productId]);
        const productName = productResults[0].product_name;

        const [revisionResults] = await db.query(`
          SELECT revision FROM revision WHERE product_id = ? ORDER BY timestamp DESC LIMIT 1
        `, [productId]);

        if (!revisionResults.length) {
          throw new Error('No revisions found.');
        }

        const revision = revisionResults[0].revision;

        const productFolder = path.join(baseDir, productName);
        const revisionFolders = fs.readdirSync(productFolder)
          .filter(folder => folder.startsWith(`${revision}_v`))
          .map(folder => ({
            folder,
            version: parseInt(folder.replace(`${revision}_v`, ""), 10)
          }))
          .sort((a, b) => b.version - a.version);

        const revisionFolderName = revisionFolders.length > 0 ? revisionFolders[0].folder : revision;
        const targetRevisionFolder = path.join(productFolder, revisionFolderName);
        const baseDfxFolder = path.join(targetRevisionFolder, 'DXF DATA');
        const dfxRevisionFolder = path.join(dfxDir, productName, revisionFolderName); // no nested DFX DATA

        if (fs.existsSync(baseDfxFolder)) {
          if (!fs.existsSync(dfxRevisionFolder)) {
            fs.mkdirSync(dfxRevisionFolder, { recursive: true });
          }

          const files = fs.readdirSync(baseDfxFolder);
          files.forEach(file => {
            const sourceFilePath = path.join(baseDfxFolder, file);
            const destinationFilePath = path.join(dfxRevisionFolder, file);
            fs.copyFileSync(sourceFilePath, destinationFilePath);
            console.log(`Copied file: ${file} from ${baseDfxFolder} to ${dfxRevisionFolder}`);
          });

          console.log(`Files moved directly to ${dfxRevisionFolder} for product: ${productName}, revision: ${revisionFolderName}`);
        } else {
          console.log(`No DFX folder found in ${baseDfxFolder} for product: ${productName}, revision: ${revision}`);
        }
      }
    }

    // Remove designers if completed
    if (updates.status && updates.status.toLowerCase() === "completed") {
      console.log(`Status changed to 'complete', removing designers from product_id: ${productId}`);

      const [assignedDesigners] = await db.query(`
        SELECT pa.user_id
        FROM product_assignments pa
        JOIN users u ON pa.user_id = u.id
        WHERE pa.product_id = ? AND u.role = 'designer'
      `, [productId]);

      if (assignedDesigners.length > 0) {
        const designerIds = assignedDesigners.map(d => d.user_id);

        const sqlDelete = `
          DELETE FROM product_assignments WHERE product_id = ? AND user_id IN (${designerIds.map(() => '?').join(',')})
        `;
        await db.query(sqlDelete, [productId, ...designerIds]);

        const logEntries = assignedDesigners.map(({ user_id }) => [
          user_id,
          productId,
          'remove',
          userId,
          new Date()
        ]);

        await db.query(`
          INSERT INTO product_activity_logs (user_id, product_id, action, added_user_id, timestamp)
          VALUES ?
        `, [logEntries]);

        console.log(`Designers removed and logged.`);
      } else {
        console.log(`No designers found to remove.`);
      }
    }

    // Assign viewers
    const [viewers] = await db.query(`SELECT id FROM users WHERE role = 'viewer'`);
    if (viewers.length > 0) {
      const assignmentEntries = viewers.map(({ id }) => [
        productId,
        id,
        new Date()
      ]);

      await db.query(`
        INSERT INTO product_assignments (product_id, user_id, assigned_at)
        VALUES ?
      `, [assignmentEntries]);

      const logEntries = viewers.map(({ id }) => [
        id,
        productId,
        'add',
        userId,
        new Date()
      ]);

      await db.query(`
        INSERT INTO product_activity_logs (user_id, product_id, action, added_user_id, timestamp)
        VALUES ?
      `, [logEntries]);

      console.log(`Viewers assigned and logged.`);
    }

    return productId;
  } catch (error) {
    console.error(`Error updating product: ${error.message}`);
    throw new Error(`Failed to update product: ${error.message}`);
  }
};


// const updateProduct = async (productId, updates, userId) => {
//   try {
//     console.log(`Fetching previous status for product_id: ${productId}`);
//     const [product] = await db.query('SELECT status FROM products WHERE product_id = ?', [productId]);

//     if (!product.length) {
//       throw new Error('Product not found');
//     }

//     const previousStatus = product[0].status;
//     console.log(`Previous Status: ${previousStatus}`);

//     // Build the update query dynamically
//     const updateFields = [];
//     const params = [];

//     for (const [key, value] of Object.entries(updates)) {
//       if (value !== undefined) {
//         updateFields.push(`${key} = ?`);
//         params.push(value);
//       }
//     }

//     if (updateFields.length === 0) {
//       throw new Error('No fields to update');
//     }

//     const sqlProduct = `
//       UPDATE products
//       SET ${updateFields.join(', ')}, updated_at = NOW()
//       WHERE product_id = ?
//     `;
//     params.push(productId);

//     console.log(`Updating product with query: ${sqlProduct}, Params: ${params}`);
//     const [result] = await db.query(sqlProduct, params);

//     if (result.affectedRows === 0) {
//       throw new Error('Product not found or no changes made');
//     }

//     // Log the status change if applicable
//     if (updates.status && updates.status !== previousStatus) {
//       console.log(`Logging status change: ${previousStatus} → ${updates.status}`);

//       const sqlLog = `
//         INSERT INTO product_status_activity (product_id, user_id, previous_status, updated_status, activity_timestamp)
//         VALUES (?, ?, ?, ?, NOW())
//       `;
//       await db.query(sqlLog, [productId, userId, previousStatus, updates.status]);

//       // If the status is changed to "completed", copy the DFX folder from the appropriate revision folder
//       if (updates.status.toLowerCase() === "completed") {
//         const baseDir = await getBaseDir();
//         const dfxDir = await getDfxDir();

//         if (!baseDir || !dfxDir) {
//           throw new Error('Base directory or DFX directory could not be retrieved.');
//         }

//         // Fetch product name from the database
//         const [productResults] = await db.query('SELECT product_name FROM products WHERE product_id = ?', [productId]);
//         const productName = productResults[0].product_name;

//         // Fetch the latest revision for the product
//         const [revisionResults] = await db.query(`
//           SELECT revision FROM revision WHERE product_id = ? ORDER BY timestamp DESC LIMIT 1
//         `, [productId]);

//         if (!revisionResults.length) {
//           throw new Error('No revisions found.');
//         }

//         const revision = revisionResults[0].revision;

//         // Check for the latest revision version folder
//         const productFolder = path.join(baseDir, productName);
//         const revisionFolders = fs.readdirSync(productFolder)
//           .filter(folder => folder.startsWith(`${revision}_v`))
//           .map(folder => ({
//             folder,
//             version: parseInt(folder.replace(`${revision}_v`, ""), 10)
//           }))
//           .sort((a, b) => b.version - a.version); // Sort in descending order

//         let targetRevisionFolder;

//         if (revisionFolders.length > 0) {
//           // Use the latest version folder
//           targetRevisionFolder = path.join(productFolder, revisionFolders[0].folder);
//           console.log(`Using existing revision version folder: ${revisionFolders[0].folder}`);
//         } else {
//           // Use the default revision folder
//           targetRevisionFolder = path.join(productFolder, revision);
//           console.log(`No revision version folder found. Using base revision folder: ${revision}`);
//         }

//         const baseDfxFolder = path.join(targetRevisionFolder,'DFX DATA');

//         // Update to use the full revision name (A_v4 instead of just A)
//         const dfxProductFolder = path.join(dfxDir, productName);
//         const dfxRevisionFolder = path.join(dfxProductFolder, revisionFolders.length > 0 ? revisionFolders[0].folder : revision);
//         const dfxDfxFolder = path.join(dfxRevisionFolder,'DFX DATA');

//         // Check if the DFX folder exists in the selected target folder
//         if (fs.existsSync(baseDfxFolder)) {
//           // Create the same folder structure in DfxDir if it doesn't exist
//           if (!fs.existsSync(dfxProductFolder)) {
//             fs.mkdirSync(dfxProductFolder, { recursive: true });
//           }
//           if (!fs.existsSync(dfxRevisionFolder)) {
//             fs.mkdirSync(dfxRevisionFolder, { recursive: true });
//           }
//           if (!fs.existsSync(dfxDfxFolder)) {
//             fs.mkdirSync(dfxDfxFolder, { recursive: true });
//           }

//           // Copy files from selected DFX folder to DfxDir
//           const files = fs.readdirSync(baseDfxFolder);
//           files.forEach((file) => {
//             const sourceFilePath = path.join(baseDfxFolder, file);
//             const destinationFilePath = path.join(dfxDfxFolder, file);

//             fs.copyFileSync(sourceFilePath, destinationFilePath);
//             console.log(`Copied file: ${file} from ${baseDfxFolder} to ${dfxDfxFolder}`);
//           });

//           console.log(`All files copied from ${baseDfxFolder} to ${dfxDfxFolder} for product: ${productName}, revision: ${revisionFolders.length > 0 ? revisionFolders[0].folder : revision}`);
//         } else {
//           console.log(`No DFX folder found in ${baseDfxFolder} for product: ${productName}, revision: ${revision}`);
//         }
//       }
//     }

//     // If the status is changed to "complete", remove designers and log actions
//     if (updates.status && updates.status.toLowerCase() === "completed") {
//       console.log(`Status changed to 'complete', removing designers from product_id: ${productId}`);

//       // Fetch designers assigned to the product
//       const [assignedDesigners] = await db.query(`
//         SELECT pa.user_id
//         FROM product_assignments pa
//         JOIN users u ON pa.user_id = u.id
//         WHERE pa.product_id = ? AND u.role = 'designer'
//       `, [productId]);

//       console.log(`Assigned Designers:`, assignedDesigners);

//       if (assignedDesigners.length > 0) {
//         // Extract user IDs
//         const designerIds = assignedDesigners.map(d => d.user_id);
//         console.log(`Designer IDs to remove:`, designerIds);

//         // DELETE query fix: Use join for proper formatting
//         const sqlDelete = `
//           DELETE FROM product_assignments WHERE product_id = ? AND user_id IN (${designerIds.map(() => '?').join(',')})
//         `;
//         console.log(`Executing delete query: ${sqlDelete}`);
        
//         await db.query(sqlDelete, [productId, ...designerIds]);

//         console.log(`Designers successfully removed.`);

//         // Log the removal in product_activity_logs
//         const logEntries = assignedDesigners.map(({ user_id }) => [
//           user_id,
//           productId,
//           'remove',
//           userId,  
//           new Date()
//         ]);

//         console.log(`Logging removal in product_activity_logs:`, logEntries);

//         await db.query(`
//           INSERT INTO product_activity_logs (user_id, product_id, action, added_user_id, timestamp)
//           VALUES ?
//         `, [logEntries]);

//         console.log(`Removal logged successfully.`);
//       } else {
//         console.log(`No designers found to remove.`);
//       }
//     }

//      const [viewers] = await db.query(`
//           SELECT id FROM users WHERE role = 'viewer'
//         `);

//         console.log(`Fetched viewers:`, viewers);

//         if (viewers.length > 0) {
//           // Assign viewers to the product
//           const assignmentEntries = viewers.map(({ id }) => [
//             productId,
//             id,
//             new Date()
//           ]);

//           console.log(`Assigning viewers to product:`, assignmentEntries);

//           await db.query(`
//             INSERT INTO product_assignments (product_id, user_id, assigned_at)
//             VALUES ?
//           `, [assignmentEntries]);

//           console.log(`Viewers assigned successfully.`);

//           // Log assignments in product_activity_logs
//           const logEntries = viewers.map(({ id }) => [
//             id,
//             productId,
//             'add',
//             userId,  // file_path is null
//             new Date()
//           ]);

//           console.log(`Logging viewer assignments in product_activity_logs:`, logEntries);

//           await db.query(`
//             INSERT INTO product_activity_logs (user_id, product_id, action, added_user_id, timestamp)
//             VALUES ?
//           `, [logEntries]);

//           console.log(`Viewer assignments logged successfully.`);
//         } else {
//           console.log(`No viewers found to assign.`);
//         }
      
    

//     return productId;
//   } catch (error) {
//     console.error(`Error updating product: ${error.message}`);
//     throw new Error(`Failed to update product: ${error.message}`);
//   }
// };








const getPendingTaskCount = async (userRole, userId) => {
  try {
    const query = `
      SELECT COUNT(*) AS pendingTaskCount 
      FROM tasks 
      JOIN task_assignments ON tasks.task_id = task_assignments.task_id
      WHERE task_assignments.user_id = ? AND tasks.status = 'pending';
    `;

    const [rows] = await db.execute(query, [userId]);
    return rows[0]?.pendingTaskCount || 0; // Return the count or 0 if no pending tasks
  } catch (error) {
    console.error('Error in fetchPendingTasks model:', error);
    throw error; // Re-throw the error to handle it in the controller
  }
};
const fetchDesignStatusActivity = async (duId) => {
  const query = `
    SELECT
      dsa.dsa_id AS activityId,
      dsa.previous_status AS previousStatus,
      dsa.updated_status AS updatedStatus,
      dsa.activity_timestamp AS timestamp,
      u.name AS userName,
      u.role AS role
    FROM design_status_activity dsa
    INNER JOIN users u ON dsa.user_id = u.id
    WHERE dsa.du_id = ?
    ORDER BY dsa.activity_timestamp DESC;
  `;

  try {
    const [results] = await db.query(query, [duId]);
    return results;
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
};
const fetchProductStatusActivity = async (productId) => {
  const query = `
    SELECT
      psa.psa_id AS activityId,
      psa.previous_status AS previousStatus,
      psa.updated_status AS updatedStatus,
      psa.activity_timestamp AS timestamp,
      u.name AS userName,
      u.role AS role
    FROM product_status_activity psa
    INNER JOIN users u ON psa.user_id = u.id
    WHERE psa.product_id = ?
    ORDER BY psa.activity_timestamp DESC;
  `;

  try {
    const [results] = await db.query(query, [productId]);
    return results;
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
};
const fetchProjectWiseTasks = async (loggedInUserRole, loggedInUserId, projectId) => {
  let query = `
    SELECT
      tasks.task_id AS id,
      tasks.task_name AS taskName,
      projects.project_name AS projectName,
      tasks.start_date AS startDate,
      tasks.end_date AS endDate,
      tasks.priority AS priority,
      tasks.status AS status,
      tasks.comments AS comments,
      tasks.created_at AS createdAt,
      tasks.updated_at AS updatedAt,
      GROUP_CONCAT(users.name) AS assignedUsers,
      GROUP_CONCAT(users.role) AS assignedRoles
    FROM tasks
    INNER JOIN projects ON tasks.project_id = projects.project_id
    LEFT JOIN task_assignments ON tasks.task_id = task_assignments.task_id
    LEFT JOIN users ON task_assignments.user_id = users.id
    WHERE tasks.project_id = ? 
  `;

  const queryParams = [projectId];
  if (loggedInUserRole !== 'admin') {
    query += ` AND users.id = ? `;
    queryParams.push(loggedInUserId);
  }

  query += ` GROUP BY tasks.task_id;`;  // Keep this only once

  try {
    const [results] = await db.query(query, queryParams);
    return results;
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
};
const fetchTaskWiseFilePaths = async (loggedInUserRole, loggedInUserId, taskId) => {
  let query = `
    SELECT
      task_id AS taskId,
      file_path AS filePath,
      action,
      timestamp
    FROM task_activity_logs
    WHERE task_id = ?
  `;

  const queryParams = [taskId];
  if (loggedInUserRole !== 'admin') {
    query += ` AND user_id = ? `;
    queryParams.push(loggedInUserId);
  }

  try {
    const [results] = await db.query(query, queryParams);
    return results;
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
};
const fetchPendingProducts = async (loggedInUserRole, loggedInUserId) => {
  let query = `
    SELECT
      products.product_id AS product_id,
      products.product_name AS productName,
      products.comments AS comments,
      products.created_at AS createdAt,
      products.updated_at AS updatedAt,
      products.status AS status,
      products.product_version AS product_version,
      products.revision AS revision,
      products.type AS type,
      GROUP_CONCAT(users.name) AS assignedUsers,
      GROUP_CONCAT(users.role) AS assignedRoles
    FROM products
    LEFT JOIN product_assignments ON products.product_id = product_assignments.product_id
    LEFT JOIN users ON product_assignments.user_id = users.id
    WHERE products.status = 'pending'
  `;

  const queryParams = [];
  if (loggedInUserRole !== 'admin') {
    query += ` AND users.id = ? `;
    queryParams.push(loggedInUserId);
  }

  query += ` GROUP BY products.product_id ORDER BY products.created_at DESC;`;

  try {
    const [results] = await db.query(query, queryParams);
    return results;
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
}
const fetchInProgressProducts = async (loggedInUserRole, loggedInUserId) => {
  let query = `
    SELECT
      products.product_id AS product_id,
      products.product_name AS productName,
      products.comments AS comments,
      products.created_at AS createdAt,
      products.updated_at AS updatedAt,
      products.status AS status,
      products.product_version AS product_version,
      products.revision AS revision,
      products.type AS type,
      GROUP_CONCAT(users.name) AS assignedUsers,
      GROUP_CONCAT(users.role) AS assignedRoles
    FROM products
    LEFT JOIN product_assignments ON products.product_id = product_assignments.product_id
    LEFT JOIN users ON product_assignments.user_id = users.id
    WHERE products.status = 'in_progress'
  `;

  const queryParams = [];
  if (loggedInUserRole !== 'admin') {
    query += ` AND users.id = ? `;
    queryParams.push(loggedInUserId);
  }

  query += ` GROUP BY products.product_id ORDER BY products.created_at DESC;`;

  try {
    const [results] = await db.query(query, queryParams);
    return results;
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
};
const fetchUnderReviewProducts = async (loggedInUserRole, loggedInUserId) => {
  let query = `
    SELECT
      products.product_id AS product_id,
      products.product_name AS productName,
      products.comments AS comments,
      products.created_at AS createdAt,
      products.updated_at AS updatedAt,
      products.status AS status,
      products.product_version AS product_version,
      products.revision AS revision,
      products.type AS type,
      GROUP_CONCAT(users.name) AS assignedUsers,
      GROUP_CONCAT(users.role) AS assignedRoles
    FROM products
    LEFT JOIN product_assignments ON products.product_id = product_assignments.product_id
    LEFT JOIN users ON product_assignments.user_id = users.id
    WHERE products.status = 'under_review'
  `;

  const queryParams = [];
  if (loggedInUserRole !== 'admin') {
    query += ` AND users.id = ? `;
    queryParams.push(loggedInUserId);
  }

  query += ` GROUP BY products.product_id ORDER BY products.created_at DESC;`;

  try {
    const [results] = await db.query(query, queryParams);
    return results;
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
};
const fetchOnHoldProducts = async (loggedInUserRole, loggedInUserId) => {
  let query = `
    SELECT
      products.product_id AS product_id,
      products.product_name AS productName,
      products.comments AS comments,
      products.created_at AS createdAt,
      products.updated_at AS updatedAt,
      products.status AS status,
      products.product_version AS product_version,
      products.revision AS revision,
      products.type AS type,
      GROUP_CONCAT(users.name) AS assignedUsers,
      GROUP_CONCAT(users.role) AS assignedRoles
    FROM products
    LEFT JOIN product_assignments ON products.product_id = product_assignments.product_id
    LEFT JOIN users ON product_assignments.user_id = users.id
    WHERE products.status = 'on_hold'
  `;

  const queryParams = [];
  if (loggedInUserRole !== 'admin') {
    query += ` AND users.id = ? `;
    queryParams.push(loggedInUserId);
  }

  query += ` GROUP BY products.product_id ORDER BY products.created_at DESC;`;

  try {
    const [results] = await db.query(query, queryParams);
    return results;
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
};
const fetchCompletedProducts = async (loggedInUserRole, loggedInUserId) => {
  let query = `
    SELECT
      products.product_id AS product_id,
      products.product_name AS productName,
      products.comments AS comments,
      products.created_at AS createdAt,
      products.updated_at AS updatedAt,
      products.status AS status,
      products.product_version AS product_version,
      products.revision AS revision,
      products.type AS type,
      GROUP_CONCAT(users.name) AS assignedUsers,
      GROUP_CONCAT(users.role) AS assignedRoles
    FROM products
    LEFT JOIN product_assignments ON products.product_id = product_assignments.product_id
    LEFT JOIN users ON product_assignments.user_id = users.id
    WHERE products.status = 'completed'
  `;

  const queryParams = [];
  if (loggedInUserRole !== 'admin') {
    query += ` AND users.id = ? `;
    queryParams.push(loggedInUserId);
  }

  query += ` GROUP BY products.product_id ORDER BY products.created_at DESC;`;

  try {
    const [results] = await db.query(query, queryParams);
    return results;
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
};
const fetchPendingAndInProgressProducts = async (loggedInUserRole, loggedInUserId) => {
  let query = `
    SELECT
      products.product_id AS product_id,
      products.product_name AS productName,
      products.comments AS comments,
      products.created_at AS createdAt,
      products.updated_at AS updatedAt,
      products.status AS status,
      products.product_version AS product_version,
      products.revision AS revision,
      products.type AS type,
      GROUP_CONCAT(users.name) AS assignedUsers,
      GROUP_CONCAT(users.role) AS assignedRoles
    FROM products
    LEFT JOIN product_assignments ON products.product_id = product_assignments.product_id
    LEFT JOIN users ON product_assignments.user_id = users.id
    WHERE products.status IN ('pending', 'in_progress')
  `;

  const queryParams = [];
  if (loggedInUserRole !== 'admin') {
    query += ` AND users.id = ? `;
    queryParams.push(loggedInUserId);
  }

  query += ` GROUP BY products.product_id ORDER BY products.created_at DESC;`;

  try {
    const [results] = await db.query(query, queryParams);
    return results;
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
};


export default { insertProduct, getProjects, assignUsersToProduct, updateProduct,
  fetchPendingProducts,fetchInProgressProducts,fetchUnderReviewProducts,fetchOnHoldProducts,
  fetchCompletedProducts, fetchProductStatusActivity,fetchDesignStatusActivity,
  
  updateTask,
   getPendingTaskCount, fetchProjectWiseTasks, fetchTaskWiseFilePaths, fetchPendingAndInProgressProducts };
