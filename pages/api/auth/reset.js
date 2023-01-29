import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"
import sendMail from "../../../utilities/nodemailer"

const prisma = new PrismaClient();

async function reset(req, res) {
  if (req.method === "POST") {
    const {pass, conf, token} = req.body
    if (!token || !conf || !pass || token.length === 0 || conf.length === 0 || pass.length === 0 || conf !== pass) {
      // burada ayrıca arındır
      return res.status(400).json({error:"missing information"})
    }
    const user = await prisma.User.findUnique({
      where: {
        token: token
      },
      select: {
        name: true,
        email: true,
        expire: true,
      }
    });
    if (!user || user.expire <= Date.now()) {
      return res.status(400).json({error:"expired or not found"})
    }
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(pass, salt);
    await prisma.User.update({
      where: {
        email: user.email,
      },
      data: {
        password: hash,
        token: "",
        expire: 0,
        verified: true,
      },
    });
    
    const emailTemplate = `<h3>Password Changed</h3><p>Your password has been changed.</p>`

    sendMail({
      from: process.env.SMTP_USER,
      to: user.email,
      subject: "Password Changed",
      html: emailTemplate,
    })

    return res.status(200).json({name:user.name})
  }
  return res.status(400).json({error:"something went wrong"})
}

export default reset