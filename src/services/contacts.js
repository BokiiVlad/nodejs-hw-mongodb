import { ContactCollection } from "../db/models/contact.js";

export const getAllContacts = async () => {
    const contacts = await ContactCollection.find();
    return contacts;
};

export const getContactById = async (contactId) => {
    const contact = await ContactCollection.findById(contactId);
    return contact;
};

export const createContact = async (payload) => {
    const contact = await ContactCollection.create(payload);
    return contact;
};

export const deleteContact = async (contactId) => {
    const contact = await ContactCollection.findByIdAndDelete(contactId);
    return contact;
};
export const patchContact = async (contactId, payload) => {
    const contact = await ContactCollection.findByIdAndUpdate(contactId, payload, {
        new: true,
        upsert: true,
    });
    return contact;
};