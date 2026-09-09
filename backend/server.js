const express      = require('express');
const dotenv       = require('dotenv');
const cors         = require('cors');
const connectDB    = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load .env variables FIRST
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ── Middleware ──────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/products',  require('./routes/products'));
app.use('/api/orders',    require('./routes/orders'));
app.use('/api/payments',  require('./routes/payments'));
app.use('/api/search',    require('./routes/search'));
app.use('/api/recommend', require('./routes/recommend'));
app.use('/api/behavior',  require('./routes/behavior'));
app.use('/api/admin',     require('./routes/admin'));

// ── Health check ────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Smart Commerce API is running' });
});

// ── 404 handler ─────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global error handler (always last) ──────────────
app.use(errorHandler);

// ── Start server ────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});