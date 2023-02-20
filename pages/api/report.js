import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function report(req, res) {
  try {
    if (req.method === "POST") {
      const session = await getServerSession(req, res, authOptions);
      if (!session) {
        return res.status(400).json("unauthorized");
      }
      const { id } = req.body;

      const isReported = await prisma.Post.findUnique({
        where: {
          id: id,
        },
        select: {
          reported: true,
        },
      });

      if (isReported.reported.findIndex(item => item === session.user.sub) === -1) {
        await prisma.Post.update({
          where: {
            id: id,
          },
          data: {
            reported: [...isReported.reported ,session.user.sub],
            //   allowed: true,
            //   checked: true,
            //   date: Date.now()
          },
        });
      }
      return res.status(200).json("success");
    }
    return res.status(400).json("something went wrong1");
  } catch (error) {
    return res.status(500).json("something went wrong2");
  }
}

export default report;
