import db from '../database/db.js';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from  'path';


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


//Old DFX Dir
const getOldDfxDir = async () => {
    try {
      const [rows] = await db.query('SELECT old_dfx_folder_path FROM store_old_dfx_folder_path ORDER BY timestamp DESC LIMIT 1');
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
      const [rows] = await db.query('SELECT old_dfx_folder_path FROM store_old_dfx_folder_path ORDER BY timestamp DESC LIMIT 1');
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
    existsSync: async (filePath) => fs.existsSync(await resolveOldDfxFilePath(filePath)),
    readdirSync: async (dirPath) => fs.readdirSync(await resolveOldDfxFilePath(dirPath)),
    createReadStream: async (filePath, options) => fs.createReadStream(await resolveOldDfxFilePath(filePath), options),
    createWriteStream: async (filePath, options) => fs.createWriteStream(await resolveOldDfxFilePath(filePath), options),
    unlinkSync: async (filePath) => fs.unlinkSync(await resolveOldDfxFilePath(filePath)),
    mkdirSync: async (dirPath, options) => fs.mkdirSync(await resolveOldDfxFilePath(dirPath), options),
    writeFileSync: async (filePath, data, options) => fs.writeFileSync(await resolveOldDfxFilePath(filePath), data, options),
    readFileSync: async (filePath, options) => fs.readFileSync(await resolveOldDfxFilePath(filePath), options),
    statSync: async (filePath) => fs.statSync(await resolveOldDfxFilePath(filePath)),
  };





// const createEcn = async (req, res) => {
//     const { product_id, description, changeDetails } = req.body;
//     const user_id = req.session?.user?.id || req.body.userId;

//     if (!user_id) {
//         return res.status(401).json({ success: false, message: "User not authenticated." });
//     }

//     if (!product_id || !description || !Array.isArray(changeDetails) || changeDetails.length === 0) {
//         return res.status(400).json({ success: false, message: "Missing required fields or invalid change details" });
//     }

//     const connection = await db.getConnection();
//     try {
//         await connection.beginTransaction();

//         const [productRows] = await connection.execute(
//             `SELECT product_id FROM products WHERE product_name = ?`, 
//             [product_id]
//         );

//         if (productRows.length === 0) {
//             throw new Error("Invalid product name provided.");
//         }

//         const actual_product_id = productRows[0].product_id;

//         const [ecnResult] = await connection.execute(
//             `INSERT INTO ecn (product_id, user_id, description, revision, status, ecn_date) VALUES (?, ?, ?, ?, 'requested', NOW())`,
//             [actual_product_id, user_id, description, revision]
//         );
//         const ecn_id = ecnResult.insertId;

//         for (let detail of changeDetails) {
//             if (!detail.description_of_change || !detail.reason_of_change) {
//                 throw new Error("Change details are missing required fields.");
//             }
//             await connection.execute(
//                 `INSERT INTO ecn_change_details (ecn_id, description_of_change, reason_of_change) VALUES (?, ?, ?)`,
//                 [ecn_id, detail.description_of_change, detail.reason_of_change]
//             );
//         }

//         await connection.execute(
//             `INSERT INTO ecn_approval (ecn_id, user_id, action, description, action_at) VALUES (?, ?, 'requested', ?, NOW())`,
//             [ecn_id, user_id, description]
//         );

//         await connection.commit();
//         res.json({ success: true, message: "ECN created successfully", ecn_id });

//     } catch (error) {
//         await connection.rollback();
//         console.error("Error creating ECN:", error);
//         res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
//     } finally {
//         connection.release();
//     }
// };


const createEcn = async (req, res) => {
    const { product_id, description, changeDetails,revision } = req.body;
    const user_id = req.session?.user?.id || req.body.userId;

    if (!user_id) {
        return res.status(401).json({ success: false, message: "User not authenticated." });
    }

    if (!product_id || !description || !revision || !Array.isArray(changeDetails) || changeDetails.length === 0) {
        return res.status(400).json({ success: false, message: "Missing required fields or invalid change details" });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [productRows] = await connection.execute(
            `SELECT product_id FROM products WHERE product_name = ?`, 
            [product_id]
        );

        if (productRows.length === 0) {
            throw new Error("Invalid product name provided.");
        }

        const actual_product_id = productRows[0].product_id;

        const [ecnResult] = await connection.execute(
            `INSERT INTO ecn (product_id, user_id, description,revision, status, ecn_date) VALUES (?, ?, ?, ? , 'requested', NOW())`,
            [actual_product_id, user_id, description,revision]
        );
        const ecn_id = ecnResult.insertId;

        for (let detail of changeDetails) {
            if (!detail.description_of_change || !detail.reason_of_change) {
                throw new Error("Change details are missing required fields.");
            }
            await connection.execute(
                `INSERT INTO ecn_change_details (ecn_id, description_of_change, reason_of_change) VALUES (?, ?, ?)`,
                [ecn_id, detail.description_of_change, detail.reason_of_change]
            );
        }

        await connection.execute(
            `INSERT INTO ecn_approval (ecn_id, user_id, action, description, action_at) VALUES (?, ?, 'requested', ?, NOW())`,
            [ecn_id, user_id, description]
        );

        await connection.commit();
        res.json({ success: true, message: "ECN created successfully", ecn_id });

    } catch (error) {
        await connection.rollback();
        console.error("Error creating ECN:", error);
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    } finally {
        connection.release();
    }
};



// const getEcnDetails = async (req, res) => {
//     const { productId } = req.params; 

//     if (!productId) {
//         return res.status(400).json({ success: false, message: "Product ID is required" });
//     }

//     const connection = await db.getConnection();
//     try {
//         const [ecnRows] = await connection.execute(
//             `SELECT ecn.ecn_id, ecn.description, ecn.product_id, products.product_name
//              FROM ecn 
//              JOIN products ON ecn.product_id = products.product_id
//              WHERE ecn.product_id = ? 
//              ORDER BY ecn.ecn_id DESC 
//              LIMIT 1`,  
//             [productId]
//         );

//         if (ecnRows.length === 0) {
//             return res.status(404).json({ success: false, message: "No ECN found for this product" });
//         }
//         const ecn = ecnRows[0];
//         const [changeDetails] = await connection.execute(
//             `SELECT description_of_change, reason_of_change 
//              FROM ecn_change_details 
//              WHERE ecn_id = ?`,
//             [ecn.ecn_id]
//         );

//         res.json({
//             success: true,
//             ecn: {
//                 ecn_id: ecn.ecn_id,
//                 product_name: ecn.product_name, 
//                 description: ecn.description,
//                 changeDetails
//             }
//         });

//     } catch (error) {
//         console.error("Error fetching ECN details:", error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     } finally {
//         connection.release();
//     }
// };













// const moveProductFolder = async (productFolderName) => {
//   try {
//       const dfxDir = await getDfxDir();
//       const oldDfxDir = await getOldDfxDir();

//       if (!dfxDir || !oldDfxDir) {
//           throw new Error('DFX or Old DFX directory not found.');
//       }

//       const srcPath = path.join(dfxDir, productFolderName);
//       const destPath = path.join(oldDfxDir, productFolderName);

//       if (fs.existsSync(srcPath)) {
//           console.log(`📦 Moving product folder from "${srcPath}" to "${destPath}"...`);
//           await fsPromises.rename(srcPath, destPath);
//           console.log(`✅ Successfully moved folder: ${productFolderName}`);
//       } else {
//           console.warn(`⚠️ Product folder "${srcPath}" does not exist. Skipping move.`);
//       }
//   } catch (err) {
//       console.error('❌ Error moving product folder:', err);
//       throw new Error('Error moving product folder: ' + err.message);
//   }
// };


const getEcnDetails = async (req, res) => {
    const { productId } = req.params; 

    if (!productId) {
        return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const connection = await db.getConnection();
    try {
        const [ecnRows] = await connection.execute(
            `SELECT ecn.ecn_id, ecn.description,ecn.revision, ecn.product_id, products.product_name
             FROM ecn 
             JOIN products ON ecn.product_id = products.product_id
             WHERE ecn.product_id = ? 
             ORDER BY ecn.ecn_id DESC 
             LIMIT 1`,  
            [productId]
        );

        if (ecnRows.length === 0) {
            return res.status(404).json({ success: false, message: "No ECN found for this product" });
        }
        const ecn = ecnRows[0];
        const [changeDetails] = await connection.execute(
            `SELECT description_of_change, reason_of_change 
             FROM ecn_change_details 
             WHERE ecn_id = ?`,
            [ecn.ecn_id]
        );

        res.json({
            success: true,
            ecn: {
                ecn_id: ecn.ecn_id,
                product_name: ecn.product_name, 
                description: ecn.description,
                revision:ecn.revision,
                changeDetails
            }
        });

    } catch (error) {
        console.error("Error fetching ECN details:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    } finally {
        connection.release();
    }
};




const moveProductFolder = async (product_id) => {
  try {
      // console.log(`🔹 Fetching product folder for Product ID: ${product_id}`);

      // Fetch product name from database
      const connection = await db.getConnection();
      const [productResult] = await connection.execute(
          `SELECT product_name FROM products WHERE product_id = ?`,
          [product_id]
      );
      connection.release();

      if (!productResult.length) {
          console.log("⚠️ Product not found in the database. Skipping move.");
          return;
      }

      const product_name = productResult[0].product_name;
      // console.log(`✅ Product found: ${product_name}`);

      // Fetch DFX and Old DFX directories
      const dfxDir = await getDfxDir();
      const oldDfxDir = await getOldDfxDir();

      if (!dfxDir || !oldDfxDir) {
          throw new Error("DFX or Old DFX directory path not found in database.");
      }

      // Use product name instead of product ID
      const productFolderPath = path.join(dfxDir, `${product_name}`);
      const oldProductFolderPath = path.join(oldDfxDir, `${product_name}`);

      // console.log(`📂 Checking if product folder exists: ${productFolderPath}`);

      if (!fs.existsSync(productFolderPath)) {
          console.log("⚠️ Product folder does not exist. Skipping move.");
          return;
      }

      // console.log(`🔹 Moving product folder to Old DFX directory: ${oldProductFolderPath}`);

      // Ensure Old DFX directory exists
      if (!fs.existsSync(oldDfxDir)) {
          await fsPromises.mkdir(oldDfxDir, { recursive: true });
      }

      // Move the folder
      await fsPromises.rename(productFolderPath, oldProductFolderPath);

      // console.log("✅ Product folder moved successfully.");
  } catch (error) {
      console.error("❌ Error moving product folder:", error.message);
  }
};







//Paste this in server ..

const updateEcn = async (req, res) => {
    // console.log("🔹 Received ECN update request");

    const { ecn_id } = req.params;
    const { status, description } = req.body;
    const user_id = req.session?.user?.id || req.body.userId;

    if (!user_id) {
        console.error("❌ User not authenticated");
        return res.status(401).json({ success: false, message: "User not authenticated." });
    }

    if (!status || !description) {
        console.error("❌ Missing required fields: status or description");
        return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const connection = await db.getConnection();
    try {
        // console.log("🔹 Starting database transaction...");
        await connection.beginTransaction();

        // console.log(`🔹 Updating ECN with ID: ${ecn_id}`);
        const [updateResult] = await connection.execute(
            `UPDATE ecn SET status = ?, description = ? WHERE ecn_id = ?`,
            [status, description, ecn_id]
        );

        if (updateResult.affectedRows === 0) {
            throw new Error("ECN not found or no changes applied.");
        }

        if (status.toLowerCase() === 'approved') {
            // console.log(`✅ ECN approved. Fetching product for ECN ID: ${ecn_id}`);

            const [productResult] = await connection.execute(
                `SELECT product_id FROM ecn WHERE ecn_id = ?`,
                [ecn_id]
            );

            if (!productResult.length || !productResult[0].product_id) {
                throw new Error("No product associated with this ECN.");
            }

            const product_id = productResult[0].product_id;
            // console.log(`✅ Product found. ID: ${product_id}`);

            // 🔹 Remove users with the role "designer" from product_assignment
            // console.log("🔹 Fetching designers assigned to the product...");
            const [designerUsers] = await connection.execute(
                `SELECT pa.user_id FROM product_assignments pa
                 JOIN users u ON pa.user_id = u.id
                 WHERE pa.product_id = ? AND u.role = 'designer'`,
                [product_id]
            );

            if (designerUsers.length > 0) {
                // console.log(`✅ Found ${designerUsers.length} designers. Removing assignments...`);

                // Remove designers from product_assignment
                await connection.execute(
                    `DELETE FROM product_assignments WHERE product_id = ? 
                     AND user_id IN (SELECT id FROM users WHERE role = 'designer')`,
                    [product_id]
                );

                // console.log("✅ Designers removed from product_assignment.");

                // Log removals in product_activity_logs
                // console.log("🔹 Logging removal actions in product_activity_logs...");
                // const logInsertPromises = designerUsers.map((designer) =>
                //     connection.execute(
                //         `INSERT INTO product_activity_logs (user_id, product_id, action, added_user_id, timestamp) 
                //          VALUES (?, ?,'remove', ?, CURRENT_TIMESTAMP)`,
                //         [designer.user_id, product_id]
                //     )
                // );


                const logInsertPromises = designerUsers.map((designer) =>
        connection.execute(
        `INSERT INTO product_activity_logs (user_id, product_id, action, added_user_id, timestamp) 
         VALUES (?, ?, 'remove', ?, CURRENT_TIMESTAMP)`,
        [user_id, product_id, designer.user_id]
    )
);

                await Promise.all(logInsertPromises);
                // console.log("✅ Designer removals logged successfully.");
            } else {
                console.log("⚠️ No designers found in product_assignment. Skipping removal.");
            }

            // 🔹 Get the current revision details
            const [revisionResult] = await connection.execute(
                `SELECT r_id, revision_folder_path FROM revision WHERE product_id = ? ORDER BY r_id DESC LIMIT 1`,
                [product_id]
            );

            if (!revisionResult.length) {
                throw new Error("No existing revision found for the product.");
            }

            const { r_id, revision_folder_path } = revisionResult[0];
            // console.log(`✅ Latest revision found. Revision ID: ${r_id}, Folder Path: ${revision_folder_path}`);

            // 🔹 Determine the base directory where the new revision version should be created
            const baseDir = path.dirname(revision_folder_path);
            const revisionName = path.basename(revision_folder_path);

            // 🔹 Fetch the latest version number
            // console.log("🔹 Fetching latest version number...");
            const [latestVersionResult] = await connection.execute(
                `SELECT version FROM revision_version WHERE r_id = ? ORDER BY version DESC LIMIT 1`,
                [r_id]
            );

            let newVersion = 1;
            if (latestVersionResult.length > 0) {
                newVersion = parseInt(latestVersionResult[0].version, 10) + 1;
            }
            // console.log(`✅ New version number: ${newVersion}`);

            // 🔹 Define new revision version folder
            const newVersionFolderName = `${revisionName}_v${newVersion}`;
            const newVersionFolderPath = path.join(baseDir, newVersionFolderName);
            // console.log(`📁 New version folder: ${newVersionFolderPath}`);

            // 🔹 Create the new version folder if it doesn't exist
            if (!fs.existsSync(newVersionFolderPath)) {
                // console.log(`📁 Creating folder: ${newVersionFolderPath}`);
                await fsPromises.mkdir(newVersionFolderPath, { recursive: true });
            }

            // 🔹 Copy "Customer Documents" only (Skipping "design" folder)
            // const customerDocsPath = path.join(revision_folder_path, "Customer Documents");
           const customerDocsPath = path.join(revision_folder_path, "CUSTOMER DATA");
   
            if (fs.existsSync(customerDocsPath)) {
                // console.log(`📁 Copying Customer Documents...`);
                await fsPromises.cp(customerDocsPath, path.join(newVersionFolderPath, "CUSTOMER DATA"), { recursive: true });
            }

            // 🔹 Insert new revision version
            // console.log("📌 Inserting new revision version...");
            const [insertVersionResult] = await connection.execute(
                `INSERT INTO revision_version (r_id, version_folder_path, version) VALUES (?, ?, ?)`,
                [r_id, newVersionFolderPath, newVersion]
            );

            if (insertVersionResult.affectedRows === 0) {
                throw new Error("Failed to insert new revision version.");
            }
            // console.log("✅ New revision version inserted successfully.");

            // ❌ Skip copying design files and inserting into design_upload table when status is approved
            // console.log("⚠️ Skipping design folder copy and design_upload insertion (Approved Status).");

            // 🔹 Update product status to "pending"
            // console.log(`📌 Updating product status to 'pending' for Product ID: ${product_id}`);
            const [productUpdateResult] = await connection.execute(
                `UPDATE products SET status = 'pending' WHERE product_id = ?`,
                [product_id]
            );

            if (productUpdateResult.affectedRows === 0) {
                throw new Error("Product status could not be updated.");
            }
            console.log("✅ Product status updated successfully.");
            await moveProductFolder(product_id);
        }

        // 🔹 Log ECN approval action
        // console.log("📌 Logging ECN approval action...");
        await connection.execute(
            `INSERT INTO ecn_approval (ecn_id, user_id, action, description, action_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
            [ecn_id, user_id, status, description]
        );

        // console.log("✅ ECN approval logged successfully.");

        await connection.commit();
        // console.log("✅ Transaction committed successfully.");

        res.json({ success: true, message: "ECN updated and new revision version created (without design folder copy)." });

    } catch (error) {
        await connection.rollback();
        console.error("❌ Error updating ECN:", error);
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    } finally {
        connection.release();
        // console.log("🔹 Database connection released.");
    }
};












const getECNParts = async (req, res) => {
    try {
      const [results] = await db.query(`
        SELECT 
          e.ecn_id, 
          p.product_id,
          p.product_name, 
          e.user_id, 
          e.description, 
          e.status, 
          e.ecn_date,
          p.type,
          p.revision,
          p.product_version,
          GROUP_CONCAT(u.name) AS assignedUsers,
          GROUP_CONCAT(u.role) AS assignedRoles
        FROM ecn e
        JOIN products p ON e.product_id = p.product_id
        LEFT JOIN product_assignments pa ON p.product_id = pa.product_id
        LEFT JOIN users u ON pa.user_id = u.id
        GROUP BY e.ecn_id, p.product_id
        ORDER BY e.ecn_date DESC
      `);
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'No ECN records found.' });
      }
  
      res.status(200).json({ success: true, data: results });
    } catch (error) {
      console.error('Error fetching ECN details:', error.message);
      res.status(500).json({ message: 'An error occurred while fetching ECN details.' });
    }
}; 
const getRequestedECNParts = async (req, res) => {
    try {
      const [results] = await db.query(`
        SELECT 
          e.ecn_id, 
          p.product_name, 
          p.product_id,
          e.user_id, 
          e.description, 
          e.status, 
          e.ecn_date,
          p.type,
          p.revision,
          p.product_version,
          GROUP_CONCAT(u.name) AS assignedUsers,
          GROUP_CONCAT(u.role) AS assignedRoles
        FROM ecn e
        JOIN products p ON e.product_id = p.product_id
        LEFT JOIN product_assignments pa ON p.product_id = pa.product_id
        LEFT JOIN users u ON pa.user_id = u.id
        WHERE e.status = 'Requested'
        GROUP BY e.ecn_id, p.product_id
        ORDER BY e.ecn_date DESC
      `);
  
      if (results.length === 0) {
        return res.status(404).json({ message: "No ECN parts found with status 'Requested'." });
      }
  
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching requested ECN parts:", error.message);
      res.status(500).json({ message: "An error occurred while fetching requested ECN parts." });
    }
};
const getApprovedECNParts = async (req, res) => {
    try {
      const [results] = await db.query(`
        SELECT 
          e.ecn_id, 
          p.product_name, 
          p.product_id,
          e.user_id, 
          e.description, 
          e.status, 
          e.ecn_date,
          p.type,
          p.revision,
          p.product_version,
          GROUP_CONCAT(u.name) AS assignedUsers,
          GROUP_CONCAT(u.role) AS assignedRoles
        FROM ecn e
        JOIN products p ON e.product_id = p.product_id
        LEFT JOIN product_assignments pa ON p.product_id = pa.product_id
        LEFT JOIN users u ON pa.user_id = u.id
        WHERE e.status = 'approved'
        GROUP BY e.ecn_id, p.product_id
        ORDER BY e.ecn_date DESC
      `);
  
      if (results.length === 0) {
        return res.status(404).json({ message: "No ECN parts found with status 'Requested'." });
      }
  
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching requested ECN parts:", error.message);
      res.status(500).json({ message: "An error occurred while fetching requested ECN parts." });
    }
};
const getRejectedECNParts = async (req, res) => {
    try {
      const [results] = await db.query(`
        SELECT 
          e.ecn_id, 
          p.product_name, 
          p.product_id,
          e.user_id, 
          e.description, 
          e.status, 
          e.ecn_date,
          p.type,
          p.revision,
          p.product_version,
          GROUP_CONCAT(u.name) AS assignedUsers,
          GROUP_CONCAT(u.role) AS assignedRoles
        FROM ecn e
        JOIN products p ON e.product_id = p.product_id
        LEFT JOIN product_assignments pa ON p.product_id = pa.product_id
        LEFT JOIN users u ON pa.user_id = u.id
        WHERE e.status = 'reject'
        GROUP BY e.ecn_id, p.product_id
        ORDER BY e.ecn_date DESC
      `);
  
      if (results.length === 0) {
        return res.status(404).json({ message: "No ECN parts found with status 'Requested'." });
      }
  
      res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching requested ECN parts:", error.message);
      res.status(500).json({ message: "An error occurred while fetching requested ECN parts." });
    }
};
const getEcnStatusApproval = async (req, res) => {
    const { ecn_id } = req.params; 

    if (!ecn_id) {
        return res.status(400).json({ success: false, message: "ECN ID is required." });
    }

    const connection = await db.getConnection();
    try {
        const [results] = await connection.execute(
            `SELECT ea.ecn_approval_id, ea.ecn_id, ea.user_id, u.name AS user_name, u.role,
                    ea.action, ea.description, ea.action_at 
             FROM ecn_approval ea
             JOIN users u ON ea.user_id = u.id
             WHERE ea.ecn_id = ?
             ORDER BY ea.action_at DESC`,
            [ecn_id]
        );

        res.json({ success: true, data: results });
    } catch (error) {
        console.error("Error fetching ECN status approvals:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    } finally {
        connection.release();
    }
};
const getRequestedECNCount = async (req, res) => {
    try {
      const [results] = await db.query(`
        SELECT COUNT(*) AS requestedCount
        FROM ecn e
        WHERE e.status = 'Requested'
      `);

      if (results.length === 0) {
        return res.status(404).json({ message: "No ECN parts found with status 'Requested'." });
      }

      res.status(200).json({ requestedCount: results[0].requestedCount });
    } catch (error) {
      console.error("Error fetching requested ECN count:", error.message);
      res.status(500).json({ message: "An error occurred while fetching requested ECN count." });
    }
};






//fuction added by ram
const getECNStatus = async (req, res) => {
  const { productId } = req.params;
  try {
    const [result] = await db.query(
      'SELECT status FROM ecn WHERE product_id = ? ORDER BY ecn_date DESC LIMIT 1',
      [productId]
    );

    if (result.length === 0) {
      return res.status(200).json({ status: "not_available" });
    }

    return res.status(200).json({ success: true, status: result[0].status });
  } catch (error) {
    console.error('Error fetching ECN status:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};



const getLatestRevisionByProductId = async (req, res) => {
  const { productId } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT * FROM revision WHERE product_id = ? ORDER BY revision DESC LIMIT 1',
      [productId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No revision found for this product_id' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching revision:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



const getProductDescription = async (req, res) => {
  const { partNo } = req.query;

  if (!partNo) {
    return res.status(400).json({ success: false, message: "Missing partNo" });
  }

  try {
    const [rows] = await db.query(
      "SELECT comments AS description, product_id FROM products WHERE product_name = ? LIMIT 1",
      [partNo]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ 
      success: true, 
      description: rows[0].description, 
      product_id: rows[0].product_id 
    });
  } catch (error) {
    console.error("Error fetching product description:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};







export default { createEcn, updateEcn, getEcnDetails, getECNParts, 
    getRequestedECNParts, getApprovedECNParts, getRejectedECNParts,
    getEcnStatusApproval, getRequestedECNCount,getECNStatus,getLatestRevisionByProductId,getProductDescription,
};