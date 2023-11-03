import mongoose from "mongoose";

const listClientSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    require: true,
  },
  CPF: {
    type: String,
    require: true,
  },
  state: {
    ref: "Status",
    required: true,
  },
});

export default mongoose.model("ListClient", listClientSchema);
