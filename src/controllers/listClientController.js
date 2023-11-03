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
    // Crie o nome e ID do cliente
    const newClient = new client({
      name: req.body.name,
      CPF: req.body.CPF,
    });
    const savedClient = await newClient.save();

    // Agora, crie o ListClient e associe-o ao cliente
    const newListClient = new listClientSchema({
      client: {
        id: savedClient._id,
        name: savedClient.name,
        CPF: savedClient.CPF,
      },
      state: req.body.state,
    });

    const savedListClient = await newListClient.save();

    // Preencha os detalhes do cliente
    await savedListClient.populate("client").execPopulate();

    res.status(201).send({
      message: "List Client Created",
      statusCode: 201,
      data: {
        client: savedListClient.client, // Retornar o objeto do cliente
        _id: savedListClient._id,
        __v: savedListClient.__v,
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
