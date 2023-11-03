import Client from "../models/clientSchema.js";
import Contact from "../models/contactSchema.js";
import Address from "../models/addressSchema.js";
import ListClient from "../models/listClientSchema.js";

//READ
const getClientAll = async (req, res) => {
  try {
    const listClients = await ListClient.find().populate({
      path: "client",
      populate: {
        path: "contacts",
        select: "email telephone address",
        populate: {
          path: "address",
          model: "Address",
        },
      },
    });

    // Acessar os clientes associados aos listClients
    const clients = listClients.map((listClient) => listClient.client);

    res.status(200).send(clients);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

const createClient = async (req, res) => {
  try {
    // Primeiro, crie o cliente como você fez anteriormente
    const newClient = new Client({
      name: req.body.name,
      CPF: req.body.CPF,
    });
    const savedClient = await newClient.save();
    const newListClient = new listClientSchema({
      client: savedClient._id, // Associa o ID do cliente ao campo 'client' do listClientSchema
      state: req.body.state,
    });
    const savedListClient = await newListClient.save();
    // Agora, crie os contatos e associe-os ao cliente
    const contactIds = [];
    for (const contactData of req.body.contacts) {
      const newAddress = new Address({
        state: contactData.address.state,
        city: contactData.address.city,
        neighborhood: contactData.address.neighborhood,
        street: contactData.address.street,
        number: contactData.address.number,
        complement: contactData.address.complement,
      });

      const savedAddress = await newAddress.save();

      const newContact = new Contact({
        email: contactData.email,
        telephone: contactData.telephone,
        address: savedAddress._id,
      });

      const savedContact = await newContact.save();
      contactIds.push(savedContact._id);
    }

    // Associe os IDs dos contatos ao cliente
    savedClient.contacts = contactIds;
    await savedClient.save();

    // Agora, você pode usar populate para obter os detalhes completos dos contatos e endereços
    const clientePopulado = await Client.populate(savedClient, {
      path: "contacts",
      populate: {
        path: "address",
      },
    });

    res.status(201).send({
      message: "Client Created",
      statusCode: 201,
      data: clientePopulado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: error.message,
    });
  }
};

// UPDATED
const updateClientById = async (req, res) => {
  try {
    // Primeiro, atualize os campos de nome e CPF
    const updateData = {
      name: req.body.name,
      CPF: req.body.CPF,
    };

    // Em seguida, atualize os campos de contato e endereço
    if (req.body.contacts && req.body.contacts.length > 0) {
      const updatedContacts = [];

      for (const contactData of req.body.contacts) {
        const updatedContact = await Contact.findByIdAndUpdate(
          contactData._id, // Use o ID do contato para atualização
          {
            email: contactData.email,
            telephone: contactData.telephone,
          },
          { new: true } // Para obter o objeto atualizado
        );

        if (!updatedContact) {
          return res.status(404).send({ message: "Contato não encontrado" });
        }

        // Atualize o endereço do contato
        const updatedAddress = await Address.findByIdAndUpdate(
          updatedContact.address, // Use o ID do endereço associado ao contato
          {
            state: contactData.address.state,
            city: contactData.address.city,
            neighborhood: contactData.address.neighborhood,
            street: contactData.address.street,
            number: contactData.address.number,
            complement: contactData.address.complement,
          },
          { new: true } // Para obter o objeto atualizado
        );

        if (!updatedAddress) {
          return res.status(404).send({ message: "Endereço não encontrado" });
        }

        updatedContacts.push(updatedContact);
      }

      updateData.contacts = updatedContacts.map((contact) => contact._id);
    }

    // Agora, atualize o cliente com os novos dados
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).send({ message: "Cliente não encontrado" });
    }

    res.status(200).send({
      message: "Cliente atualizado",
      data: updatedClient,
      statusCode: 200,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

//DELETE
async function removeClientById(req, res) {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.status(200).send({
      message: "Client deleted",
      statusCode: 200,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
}

export default {
  getClientAll,
  updateClientById,
  removeClientById,
  createClient,
};
