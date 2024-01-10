import jwt from "jsonwebtoken";

// "5m" "30d"

const generateToken = (id: any) => {
    const JWT_SECRET: any =  process.env.JWT_SECRET
    const tokenGen =  jwt.sign({ id }, JWT_SECRET , { expiresIn: "6h" });
    return tokenGen;
}

export default generateToken;