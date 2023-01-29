import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function forbid(req, res) {
  try {
    if (req.method === "POST") {
      const session = await unstable_getServerSession(req, res, authOptions)
      if (!session || session.role !== "ADMIN") {
        return res.status(400).json("unauthorized")
      }
      const {id} = req.body
      await prisma.Post.update({
        where: {
          id: id
        },
        data: {
          allowed: false,
          checked: true,
          date: Date.now()
        }
      })
      return res.status(200).json("success")
    }
    return res.status(400).json("something went wrong")
  } catch (error) {
    return res.status(500).json("something went wrong")
  }
}

export default forbid