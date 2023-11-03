import listClientSchema from "../models/listClientSchema.js";
import client from "../models/clientSchema.js";

//READ
const getListClientAll = async (req, res) => {
  try {
    const { name, CPF, statusId } = req.body; // Certifique-se de que o corpo da solicitação contenha esses campos

    // Primeiro, crie um novo documento ListClient
    const newListClient = new ListClient({ name, CPF, status: statusId });

    // Em seguida, crie um novo documento Client associado ao ListClient
    const newClient = new Client({ listClient: newListClient._id });

    // Salve o documento ListClient no banco de dados
    await newListClient.save();

    // Salve o documento Client no banco de dados
    await newClient.save();

    // Envie uma resposta de sucesso
    return res
      .status(201)
      .json({ success: true, message: "ListClient criado com sucesso" });
  } catch (error) {
    console.error("Erro ao criar ListClient:", error);
    return res
      .status(500)
      .json({ success: false, message: "Erro ao criar ListClient" });
  }
};

const createListClient = async (req, res) => {
  try {
    // Criar o nome e ID do cliente
    const newClient = new client({
      name: req.body.clientName,
      state: req.body.state,
    });
    const savedClient = await newClient.save();

    const newListClient = new listClientSchema({
      client: savedClient._id, // Associa o ID do cliente ao campo 'client' do listClientSchema
      state: req.body.state,
    });
    const savedListClient = await newListClient.save();

    res.status(201).send({
      message: "List Client Created",
      statusCode: 201,
      data: {
        client: req.body.clientName, // Use diretamente o nome do cliente do corpo da solicitação
        _id: savedListClient._id, // Manter o ID do listClientSchema
        __v: savedListClient.__v, // Incluir o __v, se necessário
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error.message,
    });
  }
};

export default {
  getListClientAll,
  createListClient,
};
