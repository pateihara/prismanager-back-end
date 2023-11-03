import listClientSchema from "../models/listClientSchema.js";
import client from "../models/clientSchema.js";

//READ
const getListClientAll = async (req, res) => {
  try {
    const listClients = await listClientSchema
      .find()
      .populate({
        path: "client", // Campo a ser preenchido com os detalhes do cliente
        model: "Client", // Nome do modelo do cliente
        select: "name", // Campo do cliente que você deseja retornar (name)
      })
      .populate({
        path: "state", // Campo a ser preenchido com os detalhes do status
        model: "Status", // Nome do modelo do status
        select: "state", // Campo do status que você deseja retornar (state)
      })
      .exec();

    res.status(200).json(listClients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createListClient = async (req, res) => {
  try {
    // Criar um novo Client
    const newClient = new Client({
      name: req.body.clientName,
      CPF: req.body.clientCPF,
      // Outros campos do Client, se aplicável
    });
    const savedClient = await newClient.save();

    // Criar um novo ListClient e associá-lo ao Client
    const newListClient = new ListClient({
      client: savedClient._id,
      state: req.body.state,
      // Outros campos específicos do ListClient
    });
    const savedListClient = await newListClient.save();

    res.status(201).send({
      message: "List Client Created",
      data: {
        client: savedClient,
        listClient: savedListClient,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export default {
  getListClientAll,
  createListClient,
};
