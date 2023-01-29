import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function search(req, res) {
  const {text, tags} = req.body
  if (req.method === "POST") {
    if (!text && !tags) {
      return res.status(200).json([])
    }
    const found = await prisma.Post.findMany({
      where: {
        allowed: true,
        title: {
          contains: text,
          mode: 'insensitive',
        }
      },
      select: {
        id: true,
        title: true,
        image: true
      },
      orderBy: {
        date: "desc",
      },
      take: 10
    })
    return res.status(200).json(found)
  }
  return res.status(400).json("something went wrong")
}

export default search