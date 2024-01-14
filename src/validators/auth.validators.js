import joi from "joi"

const signupSchema = joi.object({
    firstname: joi.string().min(5).max(15).required().messages({
        "any.required": "Please enter your first name",
        "string.min": "First name should be 5 characters long at least",
        "string.max": "First name cannot exceed 15 characters",
        "string.empty": "Please enter your first name",
        "string.base": "Enter a valid first name"
    }),

    lastname: joi.string().min(5).max(15).required().messages({
        "any.required": "Please enter your last name",
        "string.min": "Last name should be 5 characters long at least",
        "string.max": "Last name cannot exceed 15 characters",
        "string.empty": "Please enter your last name",
        "string.base": "Enter a valid last name"
    }),

    email: joi.string().email().required().messages({
        "any.required": "Please enter your email",
        "string.empty": "Please enter your email",
        "string.email": "Invalid email",
        "string.base": "Invalid email"
    }),

    password: joi.string().min(10).max(30).required().messages({
        "any.required": "Please enter your password",
        "string.min": "Password should be 10 characters long at least",
        "string.max": "Password cannot exceed 30 characters",
        "string.empty": "Please enter your password",
        "string.base": "Please enter a valid password"
    }),

    confirm_password: joi.valid(joi.ref("password")).required().messages({
        "any.required": "Please confirm your password",
        "any.only": "Passwords do not match"
    }),
})

export { signupSchema };
