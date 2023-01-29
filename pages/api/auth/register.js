import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"
import sendMail from "../../../utilities/nodemailer"
import generateToken from "../../../utilities/token_generation";

const prisma = new PrismaClient();

async function register(req, res) {
  if (req.method === "POST") {
    const {name, mail, pass} = req.body
    if (!name || !mail || !pass || name.length === 0 || mail.length === 0 || pass.length === 0) {
      // burada ayrıca arındır
      return res.status(400).json({error:"missing information"})
    }
    const existingUser = await prisma.User.findUnique({
      where: {
        email: mail
      },
      select: {
        name: true
      }
    });
    if (existingUser) {
      return res.status(400).json({error:"user already exists"})
    }
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(pass, salt);
    const {expire, token} = generateToken()
    const user = await prisma.User.create({
      data: {
        name: name,
        email: mail,
        password: hash,
        verified: false,
        expire: expire,
        token: token
      },
    });
    const tokenURL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/verify?token=${token}`
    const emailTemplate = `<h3>Verify Your Account</h3><p>This <a href="${tokenURL}" target="_blank"> link </a> will expire in 1 hour.</p><br><p>${tokenURL}</p>`

    sendMail({
      from: process.env.SMTP_USER,
      to: mail,
      subject: "Verify Your Account",
      html: emailTemplate,
    })

    return res.status(200).json(user)
  }
  return res.status(400).json({error:"something went wrong"})
}

export default register