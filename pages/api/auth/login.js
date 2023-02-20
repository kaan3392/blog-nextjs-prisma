import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"

const prisma = new PrismaClient();

async function login(req, res) {
  if (req.method === "POST") {
    const {username, password} = req.body
    if (!username || !password || username.length === 0 || password.length === 0) {
      // burada ayrıca email ve password arındır
      return res.status(400).json(null)
    }
    const user = await prisma.User.findUnique({
      where: {
        email: username
      },
      select: {
        id: true,
        role: true,
        name: true,
        email: true,
        password: true,
        verified: true,
      }
    });
    if (!user || !user.verified) {
      return res.status(400).json(null)
    }
    const confirmed = bcrypt.compareSync(password, user.password)
    if (!confirmed) {
      return res.status(400).json(null)
    }
    delete user["password"]
    return res.status(200).json(user)
  }
  return res.status(400).json(null)
}

export default login