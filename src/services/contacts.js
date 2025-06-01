import { ContactCollection } from "../db/models/contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const getAllContacts = async ({ page, perPage, sortBy, sortOrder, filter, userId }) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;
    const contactsQuery = ContactCollection.find();

    contactsQuery.where("userId").equals(userId);

    if (filter.contactType) {
        contactsQuery.where("contactType").equals(filter.contactType);
    };

    if (filter.isFavourite) {
        contactsQuery.where("isFavourite").equals(filter.isFavourite);
    };

    const contactCount = await ContactCollection.countDocuments(contactsQuery.getFilter());

    const students = await contactsQuery.skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).exec();
    const paginationData = calculatePaginationData(contactCount, perPage, page);

    return {
        data: students,
        ...paginationData,
    };
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
