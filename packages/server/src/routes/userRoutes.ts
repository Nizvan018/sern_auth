import { getUserById } from "@/controllers/userController";
import userAuth from "@/middleware/userAuth";
import express from "express";

const userRouter = express.Router();

userRouter.get("/data", userAuth, getUserById);

export default userRouter;
