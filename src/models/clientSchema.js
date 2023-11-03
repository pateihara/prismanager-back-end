const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  CPF: {
    type: String,
    required: true,
  },
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
