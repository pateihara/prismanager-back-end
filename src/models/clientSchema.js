import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    require: true,
  },
  CPF: {
    type: String,
    require: true,
  },
  contacts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
    },
  ],
});
export default mongoose.model("Client", clientSchema);
