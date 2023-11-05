import listClientSchema from "../models/listClientSchema.js";
import client from "../models/clientSchema.js";

//READ

const getListClientAll = async (req, res) => {
  try {
    const listClients = await listClientSchema
      .find()
      .populate({
        path: "client",
        model: "Client",
        select: "name cpf",
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
    // Criar o nome e ID do cliente
    const newClient = new client({
      name: req.body.clientName,
      cpf: req.body.clientCpf,
    });

    newClient.save((err) => {
      if (err) {
        console.error(err);
        res.status(500).send({
          message: err.message,
        });
      } else {
        console.log("Cliente salvo com sucesso");

        const newListClient = new listClientSchema({
          client: newClient._id, // Associa o ID do cliente ao campo 'client' do listClientSchema
          state: req.body.state,
        });

        newListClient.save((err) => {
          if (err) {
            console.error(err);
            res.status(500).send({
              message: err.message,
            });
          } else {
            console.log("ListClient salvo com sucesso");
            res.status(201).send({
              message: "List Client Created",
              statusCode: 201,
              data: {
                client: req.body.clientName,
                _id: newListClient._id,
                __v: newListClient.__v,
              },
            });
          }
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: error.message,
    });
  }
};

export default {
  getListClientAll,
  createListClient,
};
