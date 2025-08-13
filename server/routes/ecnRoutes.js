import express from 'express';
import ecnController from '../controllers/ecnController.js'; 

const router = express.Router();

const { createEcn, updateEcn, getEcnDetails, getECNParts, 
    getRequestedECNParts, getApprovedECNParts, getRejectedECNParts,
    getEcnStatusApproval, getRequestedECNCount,getProductDescription,getECNStatus,getLatestRevisionByProductId,
} = ecnController;

router.get("/ecn/product/:productId", getEcnDetails);
router.get('/ecnParts', getECNParts);
router.get('/ecnParts/requested', getRequestedECNParts);
router.get('/ecnParts/approved', getApprovedECNParts);
router.get('/ecnParts/rejected', getRejectedECNParts);
router.get("/ecn/activity/:ecn_id", getEcnStatusApproval);
router.get('/ecnParts/requested/count', getRequestedECNCount);

router.post("/ecn", createEcn);

router.put("/ecn/update/:ecn_id", updateEcn);


//added route by ram 
router.get("/products/description", getProductDescription);
router.get("/ecn-status/:productId", getECNStatus);
router.get('/latest-revision/:productId', getLatestRevisionByProductId);

export default router;
