const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Correção: deve ser "required", não "require"
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
