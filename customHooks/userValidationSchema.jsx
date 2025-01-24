import * as yup from "yup";

const userValidationSchema = {
    name: yup.object({
        first: yup.string().required().min(2).max(256),
        middle: yup.string().min(2).max(256),
        last: yup.string().required().min(2).max(256),
    }).required(),
    phone: yup.string().required().matches(/^05[0-9]{1}-?[0-9]{7}$/, "Must be a valid phone number").min(9).max(11),
    image: yup.object({
        url: yup.string().url().min(14),
        alt: yup.string().min(2).max(256),
    }),
    address: yup.object({
        state: yup.string().min(2).max(256),
        country: yup.string().required().min(2).max(256),
        city: yup.string().required().min(2).max(256),
        street: yup.string().required().min(2).max(256),
        houseNumber: yup.number().required().min(1),
        zip: yup.number().required().min(1),
    }).required(),
    isBusiness: yup.boolean().required()
};

const userValidationSchemaForRegister = {
    name: yup.object({
        first: yup.string().required().min(2).max(256),
        middle: yup.string().min(2).max(256),
        last: yup.string().required().min(2).max(256),
    }).required(),
    phone: yup.string().required().matches(/^05[0-9]{1}-?[0-9]{7}$/, "Must be a valid phone number").min(9).max(11),
    email: yup.string().email().matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "must be a valid email").required(),
    password: yup.string().required().matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*\-]).+$/, "Password must be at least 7 characters long and contain an uppercase letter, a lowercase letter, a number and one of the following characters !@#$%^&*-").min(7).max(20),
    image: yup.object({
        url: yup.string().url().min(14),
        alt: yup.string().min(2).max(256),
    }),
    address: yup.object({
        state: yup.string().min(2).max(256),
        country: yup.string().required().min(2).max(256),
        city: yup.string().required().min(2).max(256),
        street: yup.string().required().min(2).max(256),
        houseNumber: yup.number().required().min(1),
        zip: yup.number().required().min(1),
    }).required(),
    isBusiness: yup.boolean().required()
};

export { userValidationSchema, userValidationSchemaForRegister };