import Client from "../models/clientSchema.js";
import Contact from "../models/contactSchema.js";
import Address from "../models/addressSchema.js";
import ListClient from "../models/listClientSchema.js";

//READ
const getClientAll = async (req, res) => {
  try {
    const listClients = await ListClient.find()
      .populate({
        path: "client",
        model: "Client",
        select: "name CPF",
      })
      .populate({
        path: "client.contacts",
        select: "email telephone address",
        populate: {
          path: "address",
          model: "Address",
        },
      });

    res.status(200).send(listClients);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

const createClient = async (req, res) => {
  try {
    // Adicione um log para verificar os dados recebidos na solicitação
    console.log("Dados da solicitação:", req.body);

    // Primeiro, crie o cliente como você fez anteriormente
    const newClient = new Client({
      name: req.body.name,
      CPF: req.body.CPF,
    });

    // Adicione um log para verificar o novo cliente antes de salvá-lo
    console.log("Novo cliente a ser salvo:", newClient);

    const savedClient = await newClient.save();

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

      // Adicione um log para verificar o novo endereço antes de salvá-lo
      console.log("Novo endereço a ser salvo:", newAddress);

      const savedAddress = await newAddress.save();

      const newContact = new Contact({
        email: contactData.email,
        telephone: contactData.telephone,
        address: savedAddress._id,
      });

      // Adicione um log para verificar o novo contato antes de salvá-lo
      console.log("Novo contato a ser salvo:", newContact);

      const savedContact = await newContact.save();
      contactIds.push(savedContact._id);
    }

    // Adicione um log para verificar os IDs dos contatos antes de associá-los ao cliente
    console.log("IDs dos contatos a serem associados ao cliente:", contactIds);

    // Associe os IDs dos contatos ao cliente
    savedClient.contacts = contactIds;
    await savedClient.save();

    // Use populate para obter os detalhes completos dos contatos
    const clientePopulado = await Client.populate(savedClient, "contacts");
    const addressPopulate = await Address.populate(
      savedClient,
      "contacts.address"
    );

    // Adicione logs para verificar os resultados finais
    console.log("Cliente salvo:", savedClient);
    console.log("Cliente com contatos populados:", clientePopulado);
    console.log("Endereço populado:", addressPopulate);

    res.status(201).send({
      message: "Client Created",
      statusCode: 201,
      data: clientePopulado,
      addressData: addressPopulate,
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
