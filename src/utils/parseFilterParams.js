// Чекбокс чи обрані чи ні
const parseIsFavourite = (value) => {

    if (value === "true") {
        return true;
    };
    return undefined;
};

// Селект між ["work", "home", "personal"]
const parseType = (type) => {
    const allowedTypes = ["work", "home", "personal"];
    return allowedTypes.includes(type) ? type : undefined;
};

export const parseFilterParams = (query) => {
    const { isFavourite, contactType } = query;
    const parsedIsFavourite = parseIsFavourite(isFavourite);
    const parsedContactType = parseType(contactType);

    return {
        isFavourite: parsedIsFavourite,
        contactType: parsedContactType,
    };
};