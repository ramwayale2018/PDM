  import express from 'express';
  import multer from 'multer';
  import fs from 'fs';
  import path from 'path';
  import { fileURLToPath } from 'url';
  import taskController from '../controllers/taskController.js';

  const {
    createProduct,
    fetchProjects,
    fetchProducts,
    openFile,
    openFolder,
    fetchUsers,
    updateProductStatus,
    fetchTaskUserHistory,
    getPendingTaskCount,
    fetchProductStatusActivity,
    fetchDesignStatusActivity,
    copyFilePath,
    copyFolderPath,
    fetchProjectWiseTasks,
    fetchTaskWiseFilePaths,
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
    openCustDocFile,
    laserUploadNewVersion,
    fetchRevisionsWithVersions,
    uploadCustomerDocuments,
    checkProducts,
    deletePdfDocument,
    deleteCustomerDocDocument,
    deleteLaserDesign,
    getAllProductStatuses,
    downloadLatestDesignVersionZip
  } = taskController;

  const authMiddleware = (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
    next();
  };

  // const upload = multer({ storage: multer.memoryStorage() });
  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 4 * 1024 * 1024 * 1024 } //4gb
  }).array('files', 100);

  const router = express.Router();


  const uploadSingle = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 4 * 1024 * 1024 * 1024 }, // 4GBc
  }).single('file');



//new routes
router.get('/tasks',  fetchProducts);
router.get('/checkProducts', checkProducts);
router.get('/products/:productId/documents/:revisionId?', getProductDocuments);
router.get('/downloadProductDocument/:fileId', downloadProductDocuments);
router.get('/users', fetchUsers);
router.get('/copy-folder-path/:projectName', copyFolderPath);
// router.get('/product/:productId/uploads/:revisionId', fetchUploadedDesigns);
router.get('/product/:productId/uploads/:revisionId/:version?', fetchUploadedDesigns);
router.get('/product/:productId/revisions', fetchProductRevisions);
router.get('/revisions/:revisionId/versions', fetchRevisionsWithVersions);
router.get('/download/:fileId', downloadDesign);
router.get('/downloadLaser/:fileId', downloadLaserDesign);
router.get('/download-by-path', downloadFileByPath);
router.get('/download-latest-design-version-zip/:productId/:revisionId', downloadLatestVersionZip);
router.get('/download-latest-laser-design-version-zip/:productId/:revisionId', downloadLatestDesignVersionZip);
// router.get('/product/:productId/laserUploads/:revisionId?', fetchLaserDesigns);
router.get('/product/:productId/laserUploads/:revisionId/:version?', fetchLaserDesigns);
router.get('/task/:productId/activity-logs', getProductActivityLogs);
router.get('/copy-file-path/:productId', copyFilePath);
router.get('/tasks/pending', fetchPendingProducts);
router.get('/tasks/inProgress', fetchInProgressProducts);
router.get('/tasks/underReview', fetchUnderReviewProducts);
router.get('/tasks/onHold', fetchOnHoldProducts);
router.get('/tasks/completed', fetchCompletedProducts);
router.get('/product/pendingAndInProgress', fetchPendingAndInProgressProducts);
router.get('/tasks/:productId/status-activity', fetchProductStatusActivity);
router.get('/product/:duId/design-status-activity', fetchDesignStatusActivity);
router.get('/product/:du_id/designUploadVersions', fetchDesignUploadVersions);
router.get('/users/:userId', fetchUserByID);
router.get('/design-upload-versions', getAllDesignUploadVersions);
router.get('/latest-design-upload', getLatestDesignUploadVersions);
router.get('/fetch-library-files', fetchLibraryFiles);
router.get('/downloadLibrary/:fileId', downloadLibraryDesign);
router.get('/products/suggestions', getProductSuggestions);
router.get('/dfx-files/:productId/:revisionId?', getDfxFiles);
router.get('/copy-dfx-path/:dfxId', copyDfxPath);
// router.get('/products/:productId/pdf-documents/:revisionId?', getProductPdfDocuments);
router.get('/product/:productId/pdf-documents/:revisionId/:version?', getProductPdfDocuments);
router.get('/downloadPdfDocument/:pdfId', downloadPDFDocument);
router.get('/open-file/:pdfId', openPdfFile);
router.get('/open-cust-doc/:pdId', openCustDocFile);
router.get('/download-customer-documents-zip/:productId/:revisionId?', downloadProductDocumentsZip);


router.get('/statuses', getAllProductStatuses);



router.delete('/delete-pdf/:pdfId', deletePdfDocument);
router.delete('/delete-cust-doc/:pdId', deleteCustomerDocDocument);
router.delete('/delete-laser/:lduId', deleteLaserDesign);

router.post('/create-task', upload, createProduct);
router.post("/upload-customer-documents", upload, uploadCustomerDocuments);
router.post('/upload-design', upload, uploadDesign);
router.post('/laser_upload-design', upload, laserUploadDesign);
router.post('/upload-library-files', upload, uploadLibraryFiles);
router.post('/tasks/:productId/users', addUserToProduct);
router.post('/upload/:fileId', uploadSingle, uploadNewVersion);
router.post('/uploadLaser/:fileId', uploadSingle, laserUploadNewVersion);
router.post('/pdf-upload', upload, pdfUpload);
router.post('/add-revision', upload, handleAddRevisionSubmit);

router.put('/tasks/:productId/users', updateProductUsers);
router.put('/tasks/:product_id', updateProductDetails);
router.put('/product/uploads/:du_id', updateDesignUpload);

router.patch('/tasks/status', updateProductStatus);

router.delete('/tasks/:productId/users/:userId', removeUserFromProduct);








router.get('/projects', fetchProjects);
router.get('/open-file/:projectName/:taskName', openFile);
router.get('/open-folder/:projectName', openFolder);
router.get('/tasks/:taskId/user-history', fetchTaskUserHistory);
router.get('/tasks/pending-count', getPendingTaskCount);
router.get('/tasks/project/:projectId', fetchProjectWiseTasks);
router.get('/task/activity/:taskId', fetchTaskWiseFilePaths);

export default router;
