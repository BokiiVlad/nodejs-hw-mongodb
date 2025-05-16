import { Schema, model } from 'mongoose';

const contactsSchema = new Schema(
    {
        name: {
            type: String,
            required: false,
        },
        phoneNumber: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: false,
        },
        isFavourite: {
            type: Boolean,
            required: false,
            default: false,
        },
        contactType: {
            type: String,
            enum: ["work", "home", "personal"],
            required: false,
            default: "personal",
        },
    },
    {
        timestamps: true
    },
);
export const ContactCollection = model("contact", contactsSchema);