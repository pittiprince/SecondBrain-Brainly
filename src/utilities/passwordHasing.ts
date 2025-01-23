import bcrypt from 'bcrypt';
export const passwordHashing = async (password:string):Promise<string> => {
    const hashedPassword = await bcrypt.hash(password,10);
    return hashedPassword;
}

export const passwordMatch = async(password:string , hashedPassword:string):Promise<boolean> =>{
return await bcrypt.compare(password,hashedPassword)
}