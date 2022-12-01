const { User, Thought } = require("../models");

const userController = {
  // GET ALL
  getAllUser(req, res) 
  {
    User.find({})
      .populate({
        path: "friends",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // GET ONE BY ID
  getUserById({ params }, res) 
  {
    User.findOne({ _id: params.id })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .populate({
        path: "friends",
        select: "-__v",
      })
      
      .select("-__v")
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "No USER associated with this ID" });
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // CREATE USER
  createUser({ body }, res) 
  {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.json(err));
  },

  // UPDATE BY ID
  updateUser({ params, body }, res) 
  {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })

      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No USER associated with this ID" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  // DELETE USER
  deleteUser({ params }, res) 
  {
    User.findOneAndDelete({ _id: params.id })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: "No USER associated with this ID" });
        }
        return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
      })

      .then(() => {
        res.json({ message: "User Deleted" });
      })
      .catch((err) => res.json(err));
  },

  // ADD FRIEND
  addFriend({ params }, res) 
  {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { new: true, runValidators: true }
    )

      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No USER associated with this ID" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  // DELETE FRIEND
  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )

      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: "No USER associated with this ID" });
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
};
module.exports = userController;