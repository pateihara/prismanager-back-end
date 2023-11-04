import mongoose from "mongoose";

const listClientSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  CPF: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client", // Referência ao modelo Client
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Status",
    default: null,
  },
});

export default mongoose.model("ListClient", listClientSchema);
