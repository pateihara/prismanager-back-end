import listClientSchema from "../models/listClientSchema.js";
import client from "../models/clientSchema.js";

//READ

function maskLast3DigitsOfCPF(cpf) {
  // Remove caracteres não numéricos do CPF
  cpf = cpf.replace(/\D/g, "");

  // Mantém apenas os 3 últimos dígitos e aplica a máscara "###.###.###-##"
  cpf = cpf.slice(-3).replace(/(\d{3})(\d{3})(\d{3})/, "$1.$2.$3-");

  return cpf;
}

const getListClientAll = async (req, res) => {
  try {
    const listClients = await listClientSchema
      .find()
      .populate({
        path: "client",
        model: "Client",
        select: "name CPF",
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
      CPF: maskLast3DigitsOfCPF(req.body.CPF), // Aplicar a máscara
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
        CPF: maskLast3DigitsOfCPF(req.body.CPF), // Aplicar a máscara
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
