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
    // Crie o ListClient com os campos name e CPF
    const newListClient = new listClientSchema({
      name: req.body.name,
      CPF: req.body.CPF,
      state: req.body.state,
    });

    const savedListClient = await newListClient.save();

    // Crie o cliente no clientSchema
    const newClient = new client({
      name: req.body.name,
      CPF: req.body.CPF,
    });

    const savedClient = await newClient.save();

    // Associe o cliente ao listClient
    savedListClient.client = savedClient._id;
    await savedListClient.save();

    res.status(201).send({
      message: "List Client Created",
      statusCode: 201,
      data: {
        client: savedClient,
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
