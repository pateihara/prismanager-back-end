import listClientSchema from "../models/listClientSchema.js";
import client from "../models/clientSchema.js";

// READ
const getListClientAll = async (req, res) => {
  try {
    const listClients = await listClientSchema
      .find()
      .populate({
        path: "client",
        model: "Client",
        select: "name CPF", // Adicione todos os campos que deseja exibir
      })
      .populate({
        path: "state",
        model: "Status",
        select: "state color", // Adicione todos os campos que deseja exibir
      })
      .exec();

    // Mapeie os resultados
    const formattedListClients = listClients.map((listClient) => {
      return {
        _id: listClient._id,
        clientName: listClient.client.name,
        clientCPF: listClient.client.CPF,
        state: listClient.state.state,
        stateColor: listClient.state.color,
      };
    });

    res.status(200).json(formattedListClients);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
        clientName: req.body.clientName, // Use diretamente o nome do cliente do corpo da solicitação
        state: req.body.state,
        _id: savedListClient._id, // Manter o ID do listClientSchema
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
