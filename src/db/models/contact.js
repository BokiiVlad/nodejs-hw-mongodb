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
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        photo: {
            type: String,
            require: false,
            default: null
        }
    },
    {
        timestamps: true,
        versionKey: false,
    },
);
export const ContactCollection = model("contact", contactsSchema);