import mongoose from "mongoose";

const listClientSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
  },
  name: {
    type: String,
    required: function () {
      return this.client ? false : true; // Permite name quando não há cliente associado
    },
  },
  CPF: {
    type: String,
    required: function () {
      return this.client ? false : true; // Permite CPF quando não há cliente associado
    },
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Status",
    required: true,
  },
});

export default mongoose.model("ListClient", listClientSchema);
