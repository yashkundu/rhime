import Joi from "joi";

export const userSchema = Joi.object({
    // firstName: Joi.string().required().trim().min(2).max(20).pattern(/^[a-zA-Z]+$/).lowercase(),
    // lastName: Joi.string().allow('').trim().max(20).pattern(/^[a-zA-Z]*$/).lowercase(),
    userName: Joi.string().required().trim().min(2).max(20).pattern(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,20}$/),
    email: Joi.string().required().trim().pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),

    //Minimum seven characters, at least one letter, one number and one special character
    password: Joi.string().required().trim().min(7).max(20).pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{7,}$/)
})


