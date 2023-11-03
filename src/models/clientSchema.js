import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  contacts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
    },
  ],
  order: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});
export default mongoose.model("Client", clientSchema);
