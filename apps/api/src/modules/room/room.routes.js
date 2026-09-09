import { extractUser } from "#middlewares/auth.middleware.js";
import { Router } from "express";
import * as roomController from "./room.controller.js";

const router = Router();

router.post("/", extractUser, roomController.createRoom);
router.post("/join", extractUser, roomController.joinRoom);
router.get("/public", extractUser, roomController.getPublicRooms);
router.get("/:code", extractUser, roomController.getRoomByCode);
router.get("/validate/:code", extractUser, roomController.validateRoomCode);
router.patch("/:id", extractUser, roomController.updateRoom);
router.delete("/:id", extractUser, roomController.deleteRoom);

export { router as roomRouter };
