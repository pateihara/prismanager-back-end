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
    const newClient = new client({
      name: req.body.name,
      CPF: req.body.CPF,
    });

    const savedClient = await newClient.save();

    // Agora, crie o "ListClient" e associe-o ao "Client".
    const newListClient = new ListClient({
      client: savedClient._id,
      state: req.body.state, // Certifique-se de que "state" corresponda ao campo correto
    });

    const savedListClient = await newListClient.save();

    res.status(201).send({
      message: "List Client Created",
      statusCode: 201,
      data: {
        client: savedClient, // Inclua os detalhes do "Client" no retorno
        listClient: savedListClient,
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
