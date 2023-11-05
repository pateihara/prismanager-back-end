import express from "express";
const router = express.Router();

import controller from "../controllers/orderController.js";

// READ - leitura de todos os usuários
router.get("/", controller.getAllOrders);
router.get("/:id", controller.getOrderById);
// CREATE - criação de novos usuários
router.post("/:id", controller.createOrder);

export default router;
