import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));
app.use(morgan("tiny"));

app.get("/", (req, res) => {
    return res.send("Hello world!!! :)");
});

// API endpoints
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
