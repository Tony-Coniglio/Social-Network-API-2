const { Schema, model, Types } = require("mongoose");

const ReactionSchema = new Schema(
  {
    reactionId: 
    {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },

    reactionBody: 
    {
      type: String,
      required: true,
      maxlength: 200,
    },

    username: 
    {
      type: String,
      required: true,
    },

  },

  {
    toJSON: 
    {
      getters: true,
    },
    id: false,
  }
);

const ThoughtSchema = new Schema(
  {
    thoughtText: 
    {
      type: String,
      required: "Must Enter Thought",
      minlength: 1,
      maxlength: 200,
    },
    
    username: 
    {
      type: String,
      required: true,
    },

    reactions: [ReactionSchema],
  },
  {
    toJSON: 
    {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

ThoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model("Thought", ThoughtSchema);

module.exports = Thought;