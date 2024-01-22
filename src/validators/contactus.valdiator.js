import joi from "joi";

const contactFormValidationSchema = joi.object({
    name: joi.string().min(4).max(20).required().messages({
        "any.required": "Please enter your name",
        "string.min": "Name should be 4 characters long at least",
        "string.max": "Name should not exceed 20 characters",
        "string.empty": "Please enter your name",
        "string.base": "Invalid name",
    }),
    email: joi.string().email().required().messages({
        "any.required": "Please enter your email",
        "string.empty": "Please enter your email",
        "string.base": "Invalid email",
        "string.email": "Invalid email",
    }),
    message: joi.string().min(50).max(2000).required().messages({
        "any.required": "Please enter your message",
        "string.min": "Message should be 50 characters long at least",
        "string.max": "Name should not exceed 2000 characters",
        "string.empty": "Please enter your message",
        "string.base": "Invalid message format",
    })
})

export default function contactValidator(data) {
    const err = contactFormValidationSchema.validate(data, { abortEarly: false });
    if (!err) return null;
    return err.details
}
