import { Router } from "express";
import { createTask, deleteSingleUserTask, getSingleUserTasks, updateSingleUserTask } from "../controllers/task-controller.js";
import { protectRoutes } from "../middleware/protected-routes.js";


const taskRoutes = Router();

taskRoutes.use(protectRoutes);

taskRoutes.post('/create-task/:id', createTask);
taskRoutes.get('/get-user-task/', getSingleUserTasks);
taskRoutes.put('/update-user-task/:taskId', updateSingleUserTask);
taskRoutes.delete('/delete-user-task/:taskId', deleteSingleUserTask);


export default taskRoutes;