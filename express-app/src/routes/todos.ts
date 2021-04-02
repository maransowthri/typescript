import { Router } from "express";
import { addTodo, getTodos, patchTodo, removeTodo } from "../controllers/todos";

const router = Router();

router.post("/", addTodo);
router.get("/", getTodos);
router.patch("/:id", patchTodo);
router.delete("/:id", removeTodo);

export default router;
