const { Thought, User } = require("../models");

const thoughtController = {
  // GET ALL
  getAllThought(req, res) 
  {
    Thought.find({})
      .populate({
        path: "reactions",
        select: "-__v",
      })

      .select("-__v")
      .sort({ _id: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // GET ONE BY ID
  getThoughtById({ params }, res) 
  {
    Thought.findOne({ _id: params.id })
      .populate({
        path: "reactions",
        select: "-__v",
      })

      .select("-__v")
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: "No THOUGHT associated with this ID" });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // CREATE
  createThought({ params, body }, res) 
  {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })

      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "No USER with this ID" });
        }

        res.json({ message: "THOUGHT created" });
      })
      .catch((err) => res.json(err));
  },

  // UPDATE BY ID
  updateThought({ params, body }, res) 
  {
    Thought.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No THOUGHT associated with this ID" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  // DELETE
  deleteThought({ params }, res) 
  {
    Thought.findOneAndDelete({ _id: params.id })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res.status(404).json({ message: "No THOUGHT associated with this ID" });
        }
        return User.findOneAndUpdate(
          { thoughts: params.id },
          { $pull: { thoughts: params.id } }, 
          { new: true }
        );
      })

      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "No USER with this ID" });
        }
        res.json({ message: "Thought deleted" });
      })
      .catch((err) => res.json(err));
  },

  // ADD REACTION
  addReaction({ params, body }, res) 
  {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No THOUGHT associated with this ID" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  // DELETE REACTION
  removeReaction({ params }, res) 
  {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtController;