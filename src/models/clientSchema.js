import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    required: [true, "CPF is required"], // Mensagem de erro personalizada
    validate: {
      validator: function (value) {
        // Função de validação personalizada
        return value.trim().length > 0; // Verifica se a string não está vazia
      },
      message: "CPF cannot be an empty string", // Mensagem de erro personalizada para a validação
    },
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
