// server/routes/userRoutes.js

import express from 'express';
import multer from 'multer';
import { createUser, getUsers, removeUser, updateUser, changePassword, importUsers,userResetPassword } from '../controllers/userController.js';

const router = express.Router();

const upload = multer({ dest: 'uploads/' }); 

router.post('/users', createUser);

router.get('/users', getUsers);

router.put('/users/:id', updateUser);

router.delete('/users/:id', removeUser);

router.post('/change-password', changePassword);

router.post('/users/import', upload.single('file'), importUsers)

// Route: PUT /api/users/:id/reset-password
// router.put('/api/users/:id/reset-password', userResetPassword);
router.put('/users/:id/reset-password', userResetPassword);


export default router;