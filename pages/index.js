import Head from "next/head";
import styles from "../styles/Home.module.css";
import { PrismaClient } from "@prisma/client";
import Carousel from "../components/Carousel";
import Cards from "../components/Cards";
import Pagination from "../components/Pagination"
import { useState } from "react";

export default function Home({count, posts, featured}) {

  const [perPage, setPerPage] = useState(2)

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Carousel breakpoints={{}} perPage={1} slides={featured} />
      <Cards cards={posts}/>
      <Pagination count={count} perPage={perPage} />
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const prisma = new PrismaClient();
  const featured = await prisma.Post.findMany({
    where: {
      allowed: true,
    },
    select: {
      id: true,
      title: true,
      image: true,
    },
    orderBy: {
      date: "desc"
    },
    take: 10
  })
  let count = 0
  let posts = []
  let skip = 0
  let take = 20
  if ("size" in context.query) {
    take = +context.query.size
  }
  if ("page" in context.query) {
    skip = (+context.query.page - 1) * take
  }
  let text = null
  if ("text" in context.query) {
    text = context.query.text
  }
  let tags = null
  if ("tags" in context.query) {
    tags = context.query.tags
  }
  if (text && tags) {
    count = await prisma.Post.count({
      where: {
        allowed: true,
        title: {
          contains: text,
          mode: 'insensitive',
        },
        tags: {
          hasEvery: tags,
        },
      },
    })
    posts = await prisma.Post.findMany({
      where: {
        allowed: true,
        title: {
          contains: text,
          mode: 'insensitive',
        },
        tags: {
          hasEvery: tags,
        },
      },
      orderBy: {
        date: "desc",
      },
      select: {
        id: true,
        title: true,
        short: true,
        image: true,
        score: true,
        tags: true,
        date: true,
      },
      skip,
      take,
    });
  } else if (text) {
    count = await prisma.Post.count({
      where: {
        allowed: true,
        title: {
          contains: text,
          mode: 'insensitive',
        },
      },
    })
    posts = await prisma.Post.findMany({
      where: {
        allowed: true,
        title: {
          contains: text,
          mode: 'insensitive',
        },
      },
      orderBy: {
        date: "desc",
      },
      select: {
        id: true,
        title: true,
        short: true,
        image: true,
        score: true,
        tags: true,
        date: true,
      },
      skip,
      take,
    });
  } else if (tags) {
    count = await prisma.Post.count({
      where: {
        allowed: true,
        tags: {
          hasEvery: tags,
        },
      },
    })
    posts = await prisma.Post.findMany({
      where: {
        allowed: true,
        tags: {
          hasEvery: tags,
        },
      },
      orderBy: {
        date: "desc",
      },
      select: {
        id: true,
        title: true,
        short: true,
        image: true,
        score: true,
        tags: true,
        date: true,
      },
      skip,
      take,
    });
  } else {
    count = await prisma.Post.count({
      where: {
        allowed: true,
      },
    })
    posts = await prisma.Post.findMany({
      where: {
        allowed: true,
      },
      orderBy: {
        date: "desc",
      },
      select: {
        id: true,
        title: true,
        short: true,
        image: true,
        score: true,
        tags: true,
        date: true,
      },
      skip,
      take,
    });
  }
  // console.log("count", count)
  // console.log("posts", posts)
  // console.log("date", Date.now())
  return {
    props: {count, posts, featured}
  }
};
