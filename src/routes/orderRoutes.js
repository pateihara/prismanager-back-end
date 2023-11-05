import express from "express";
const router = express.Router();

import controller from "../controllers/orderController.js";

// READ - leitura de todos os usuários
router.get("/:_id", controller.getOrderAll);

// CREATE - criação de novos usuários
router.post("/:_id", controller.createOrder);

export default router;
