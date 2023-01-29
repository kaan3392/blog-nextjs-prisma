import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"
import sendMail from "../../../utilities/nodemailer"
import generateToken from "../../../utilities/token_generation";

const prisma = new PrismaClient();

async function preset(req, res) {
  if (req.method === "POST") {
    const {mail} = req.body
    if (!mail || mail.length === 0) {
      // burada ayrıca arındır
      return res.status(400).json({error:"missing information"})
    }
    const user = await prisma.User.findUnique({
      where: {
        email: mail
      },
      select: {
        name: true,
        expire: true,
        email: true,
      }
    });
    if (user) {
      if (user.expire <= Date.now()) {
        const {expire, token} = generateToken()
        await prisma.user.update({
          where: {
            email: user.email,
          },
          data: {
            token: token,
            expire: expire,
          },
        });
        const tokenURL = `${process.env.NEXTAUTH_URL}/reset?token=${token}`
        const emailTemplate = `<h3>Reset Your Password</h3><p>This <a href="${tokenURL}" target="_blank"> link </a> will expire in 1 hour.</p>`
        sendMail({
          from: process.env.SMTP_USER,
          to: mail,
          subject: "Reset Your Account",
          html: emailTemplate,
        })
      }
    }
    return res.status(200).json({name:user.name})
  }
  return res.status(400).json({error:"something went wrong"})
}

export default preset