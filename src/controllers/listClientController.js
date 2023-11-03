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
    // Crie o ListClient com os campos name, CPF e state
    const newListClient = new listClientSchema({
      name: req.body.name,
      CPF: req.body.CPF,
      state: req.body.status, // Certifique-se de usar o campo correto do corpo da requisição
    });

    const savedListClient = await newListClient.save();

    res.status(201).send({
      message: "List Client Created",
      statusCode: 201,
      data: {
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
