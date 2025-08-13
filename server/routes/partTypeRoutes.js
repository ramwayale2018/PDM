import express from 'express';
import partTypeController from '../controllers/partTypeController.js'; 

const router = express.Router();
const { getPartTypes, addPartType, updatePartType } = partTypeController;

router.post('/part-types', addPartType);
router.get('/part-types', getPartTypes);
router.put('/part-types/:id', updatePartType);

export default router;