import bcrypt from 'bcryptjs'


export const encrypt = async (password: string) => {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    return hash
}


export const verifyPassword = (pass: string, hashedPass: string) => {
    try {
        const isValid = bcrypt.compare(pass, hashedPass)
        return isValid
    } catch (error) {
        return false
    }
}