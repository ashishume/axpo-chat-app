const express = require("express");
const { Room, RoomMember } = require("../db/db");
const router = express.Router();

module.exports = (io) => {
  router.post("/room", async (req, res) => {
    try {
      const { senderId, targetId, name, isGroup } = req.body;
      if (!isGroup) {
        const sortedIds = [senderId, targetId].sort((a, b) =>
          a.localeCompare(b)
        );
        const roomName = `DM_${sortedIds[0]}_${sortedIds[1]}`;

        let roomExists = await Room.findOne({
          where: { name: roomName },
        });
        if (!roomExists) {
          const room = await Room.create({ name: roomName, isGroup });
          await RoomMember.bulkCreate([
            { roomId: room.id, userId: sortedIds[0] },
            { roomId: room.id, userId: sortedIds[1] },
          ]);
          return res.status(201).json({
            message: "room created",
            room,
          });
        } else {
          return res.status(200).json({ room: roomExists });
        }
      } else {
        const { userIds } = req.body;
        const room = await Room.create({ name, isGroup });
        await RoomMember.bulkCreate(
          userIds.map((userId) => ({ room_id: room.id, user_id: userId }))
        );
        return res.status(201).json({
          message: "group created",
          room,
        });
      }
    } catch (err) {
      return res.status(500).send({
        message: "Internal server error",
        err,
      });
    }
  });

  return router;
};
