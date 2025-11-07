import express from "express";
import { bootstrap } from "./app.controller.js";
import schedule from "node-schedule";
import { User } from "./DB/models/user.model.js";
import { deleteFolder } from "./utils/cloud/cloudinary.config.js";
import { Message } from "./DB/models/message.model.js";
schedule.scheduleJob("1 2 3 * * *", async () => {
  const user = await User.find({
    deletedAt: { $lte: Date.now() - 3 * 30 * 24 * 60 * 60 * 1000 },
  });
  for (const user of user) {
    if (user.profilePicture.public_id) {
      await deleteFolder(`sara7a_app/user/${user._id}`);
    }
  }
  await User.deleteMany({
    deletedAt: { $lte: Date.now() - 3 * 30 * 24 * 60 * 60 * 1000 },
  });
  await Message.deleteMany({
    receiver: { $in: user.map((user) => user._id) },
  });
});
const app = express();
const port = process.env.PORT;
bootstrap(app, express);
app.listen(port, () => {
  console.log("Server started on port ", port);
});
