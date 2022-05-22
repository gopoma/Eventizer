const express = require("express");
const User = require("../../models/User");

function usersAPI(app) {
  const router = express.Router();
  app.use("/api/users", router);

  router.get("/:username", async (req, res) => {
    const [user] = await User.getByUsername(req.params.username);

    if(!user) {
      return res.status(404).json({message:"User Not Found o.O"});
    }

    const userWithNoSensitiveData = {
      id: user.id,
      name: user.name,
      username: user.username,
      birthday: user.birthday,
      profilePic: user.profilePic,
    };
    return res.status(200).json(userWithNoSensitiveData);
  });
}

module.exports = usersAPI;