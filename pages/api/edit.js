import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { getToken } from "next-auth/jwt"

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function edit(req, res) {
  if (req.method === "DELETE") {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session) {
      return res.status(400).json("not loggedin")
    }
    const {id} = req.body
    let post = null
    if (id) {
      post = await prisma.Post.findUnique({
        where: {
          id: id,
        },
        select: {
          id: true,
          authorId: true
        }
      });
    }
    if (post && post.authorId === session.user.sub) {
      await prisma.Post.delete({
        where: {
          id: id,
        }
      })
      return res.status(200).json({success:true})
    }
    return res.status(400).json("something went wrong")
  } else if (req.method === "POST") {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session) {
      return res.status(400).json("not loggedin")
    }
    
    // if (!session) {
    //   console.log("user not connected")
    //   //return res.status(400).json("user not connected")
    // } else {
    //   console.log("session", session)
    //   //return res.status(200).json("user connected", session)
    // }
    // const token = await getToken({ req })
    // if (!token) {
    //   console.log("no token found")
    //   return res.status(400).json("no token found")
    // } else {
    //   console.log("token", token)
    //   return res.status(200).json("token found", token)
    // }

    const {id, title, short, image, story, content, tags} = req.body
    //console.log(req.body)
    if (!title || !image || title.length === 0 || image.length === 0) {
      // burada ayrıca title, image, id arındır
      // image kontrol et
      return res.status(400).json("missing main")
    }
    let post = null
    if (id) {
      post = await prisma.Post.findUnique({
        where: {
          id: id,
        },
        select: {
          id: true,
          checked: true,
          allowed: true,
          changed: true,
          authorId: true
        }
      });
    }
    if (!post) {
      const created = await prisma.Post.create({
        data: {
          title,
          short,
          image,
          story,
          content,
          tags,
          date: Date.now(),
          authorId: session.user.sub,
          created: Date.now()
        },
      });
      // return and set id at client, so they may not keep pushing same post as new
      return res.status(200).json(created)
    } else {
      if (post.authorId !== session.user.sub) {
        return res.status(400).json("id unmatch")
      }
      let increment = 0
      if (post.checked === true) {
        increment += 1
      }
      const updated = await prisma.Post.update({
        where: {
          id: id
        },
        data: {
          title,
          short,
          image,
          story,
          content,
          tags,
          checked: false,
          allowed: false,
          changed: post.changed + increment,
          date: Date.now(),
        },
      });
      return res.status(200).json(updated)
    }
  }
  return res.status(400).json("something went wrong")
}

export default edit