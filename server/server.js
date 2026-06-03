import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import productRoutes from './routes/product.routes.js';
import authRoutes from './routes/otp.routes.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();


// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    // Dynamically allow any origin to avoid CORS blocks on deployment
    callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));
app.use(express.json());

// Routes Linking Layer
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Catch-all route for handling unmatched routing requests
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Requested API Path Resource Route Not Found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});