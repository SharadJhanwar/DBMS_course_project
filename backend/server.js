import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import itemRoutes from "./routes/itemRoutes.js"; 
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from './routes/cartRoutes.js';


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/items", itemRoutes); 
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use('/api/cart', cartRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
