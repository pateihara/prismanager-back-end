import listClientSchema from "../models/listClientSchema.js";
import client from "../models/clientSchema.js";

//READ
const getListClientAll = async (req, res) => {
  try {
    const listClients = await listClientSchema
      .find()
      .populate({
        path: "client",
        select: "name CPF", // Inclua os campos "name" e "CPF" que você deseja preencher
      })
      .populate({
        path: "state",
        model: "Status",
        select: "state",
      })
      .exec();

    res.status(200).json(listClients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createListClient = async (req, res) => {
  try {
    // Criar o nome e ID do cliente
    const newClient = new client({
      name: req.body.name, // Use o nome do corpo da solicitação
      CPF: req.body.CPF, // Use o CPF do corpo da solicitação
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
        client: req.body.name, // Use diretamente o nome do cliente do corpo da solicitação
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
