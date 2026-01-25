import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import testRoutes from './routes/testRoutes.js';

const app = express();
app.use(cors());

app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/test",testRoutes);

app.get("/",(req,res)=>{
    console.log("Welcome to Disaster Preparedness Platform");
    res.send("API is running...");
})

export default app;