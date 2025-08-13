// server/index.js

import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js'
import dotenv from 'dotenv'; 
import session from 'express-session';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import partTypeRoutes from './routes/partTypeRoutes.js';
import ecnRoutes from './routes/ecnRoutes.js';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3003;

const corsOptions = {
  origin: ['http://localhost:5173','http://localhost:5174', 'https://akash.myospaz.in', 'http://192.168.1.8:5173','http://mpst-004:8089'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '4gb' })); 
app.use(express.urlencoded({limit: '4gb', extended: true }));

app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRETE, 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));


resave: false,

app.use('/api', userRoutes); 
app.use('/api', projectRoutes);
app.use('/api', taskRoutes);
app.use('/api', vendorRoutes);
app.use('/auth', authRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', partTypeRoutes);
app.use('/api', ecnRoutes);

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
