import listClientSchema from "../models/listClientSchema.js";
import client from "../models/clientSchema.js";

// READ
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

    // Mapeie os resultados para formatá-los como desejado
    const formattedListClients = listClients.map((listClient) => {
      return {
        _id: listClient._id,
        clientName: listClient.client.name,
        state: listClient.state.state,
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
