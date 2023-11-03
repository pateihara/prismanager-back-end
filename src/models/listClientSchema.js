import mongoose from "mongoose";

const listClientSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
  },
  name: {
    type: String,
    required: true,
  },
  CPF: {
    type: String,
    required: true,
  },
  state: {
    ref: "Status",
    required: true,
  },
});

export default mongoose.model("ListClient", listClientSchema);
