const express = require("express");
const { User } = require("../db/db");
const router = express.Router();

module.exports = (io) => {
  router.post("/signup", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const checkIfExists = await User.findOne({ where: { email } });

      if (!checkIfExists) {
        const user = await User.create({ name, email, password });
        return res.status(201).json({
          message: "user created",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        });
      } else {
        return res.status(201).json({
          message: "user already registered",
        });
      }
    } catch (err) {
      return res.status(500).send({
        message: "signup failed",
        err,
      });
    }
  });

  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      //add check for duplicate
      const user = await User.findOne({ where: { email, password } });

      return res.status(200).json({
        message: "login success",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (err) {
      return res.status(500).send({
        message: "Login failed",
        err,
      });
    }
  });

  router.get("/users", async (req, res) => {
    try {
      //add check for duplicate
      const users = await User.findAll({
        attributes: { exclude: ["password"] },
      });
      return res.status(200).json(users);
    } catch (err) {
      return res.status(500).send({
        message: "Login failed",
        err,
      });
    }
  });

  router.get("/user/:id", async (req, res) => {
    try {
      const { id } = req.params;
      //add check for duplicate
      const users = await User.findOne({
        where: { id },
        attributes: { exclude: ["password"] },
      });
      return res.status(200).json({
        ...users.dataValues,
      });
    } catch (err) {
      return res.status(500).send({
        message: "Internal server error",
        err,
      });
    }
  });

  return router;
};
