import mongoose from "mongoose";

const listClientSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Status",
  },
});

export default mongoose.model("ListClient", listClientSchema);
