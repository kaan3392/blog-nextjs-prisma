import Head from "next/head";
import React, { useEffect, useState, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styles from "../../styles/Editor.module.css";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt"
import { useRouter } from 'next/router'

export default function Editor({post}) {
  const [id, setId] = useState("")
  const [title, setTitle] = useState("")
  const [short, setShort] = useState("")
  const [image, setImage] = useState("")
  const [story, setStory] = useState("")
  const [contents, updatecontents] = useState([]);
  const [numberOfCard, setNumberOfCard] = useState(0);
  const [tags, setTags] = useState([])
  const [searchedTag, setSearchedTag] = useState("")
  const [suggestedTags, setSuggestedTags] = useState([])
  const [tagsToSearch, setTagsToSearch] = useState(["Javascript","Java","Mongo"])


  const bottomRef = useRef();
  const router = useRouter()

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(contents);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updatecontents(items);
  }

  const handleChangeTitle = (e, id) => {
    updatecontents(
      contents.map((item) => {
        return item.id === id ? { ...item, title: e.target.value } : item;
      })
    );
  };
  const handleChangeEmbed = (e, id) => {
    updatecontents(
      contents.map((item) => {
        return item.id === id ? { ...item, embed: e.target.value } : item;
      })
    );
  };
  const handleChangeStory = (e, id) => {
    updatecontents(
      contents.map((item) => {
        return item.id === id ? { ...item, story: e.target.value } : item;
      })
    );
  };

  const handleDeleteCard = (id) => {
    updatecontents(
      contents.filter((item) => {
        return item.id !== id;
      })
    );
  };

  const handleNewContent = () => {
    updatecontents([
      ...contents,
      { title: "", embed: "", story: "", id: String(Date.now()) },
    ]);
  };

  const savePage = async () => {
    const body = {id, title, short, image, story, content: contents, tags}
    const res = await fetch("../api/edit", {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" }
    })
    const data = await res.json()
    if (data && "id" in data) {
      //setId(data.id)
      router.push('/author')
    }
  }

  const deletePage = async () => {
    const body = {id}
    const res = await fetch("../api/edit", {
      method: 'DELETE',
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" }
    })
    const data = await res.json()
    if (data && data.success) {
      //setId(data.id)
      router.push('/author')
    }
  }

  const addTag = (tagToAdd) => {
    if (!tags.includes(tagToAdd)) {
      setTags([...tags, tagToAdd])
      setSearchedTag("") // !! doesn't reset defaultValue, doesn't hover on suggested
    }
  }

  const deleteTag = (tagToRemove) => {
    setTags(
      tags.filter((item) => {
        return item !== tagToRemove;
      })
    );
    if (searchedTag.length >= 3) {
      const regexp = new RegExp("^"+searchedTag, "i")
      const found = tagsToSearch.filter(tag => {
        return tag.match(regexp) && (tag === tagToRemove || !tags.includes(tag))
      })
      if (found.length > 5) {
        found.length = 5
      }
      setSuggestedTags(found)
    } else if (suggestedTags.length !== 0) {
      setSuggestedTags([])
    }
  };

  useEffect(() => {
    if (post) {
      setId(post.id)
      setTitle(post.title)
      setShort(post.short)
      setImage(post.image)
      setStory(post.story)
      updatecontents(post.content)
      setTags(post.tags)
    }
  }, [])

  useEffect(() => {
    if (searchedTag.length >= 3) {
      const regexp = new RegExp("^"+searchedTag, "i")
      const found = tagsToSearch.filter(tag => {
        return tag.match(regexp) && !tags.includes(tag)
      })
      if (found.length > 5) {
        found.length = 5
      }
      setSuggestedTags(found)
    } else if (suggestedTags.length !== 0) {
      setSuggestedTags([])
    }
  }, [searchedTag])

  useEffect(() => {
    if (contents.length !== numberOfCard) {
      setNumberOfCard(contents.length);
      if (contents.length > numberOfCard) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [contents]);

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    // padding: grid * 2,
    // margin: `0 0 ${grid}px 0`,
  
    // change background colour if dragging
    background: isDragging ? "orange" : "white",
  
    // styles we need to apply on draggables
    ...draggableStyle
  });
  
  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "white" : "white",
    // padding: grid,
    // width: 250
  });

  return (
    <>
      <Head>
        <title>Editor</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.App}>
        <div className={styles.App_header}>
          <div className={styles.mainWrapper}>
            <input className={styles.title} placeholder="Title..." defaultValue={title} onChange={(e) => setTitle(e.target.value)} />
            <input className={styles.embed} placeholder="Image URL" defaultValue={image} onChange={(e) => setImage(e.target.value)} />
            <textarea className={styles.story} placeholder="Story..." defaultValue={story} onChange={(e) => setStory(e.target.value)} />
          </div>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="contents">
              {(provided, snapshot) => (
                <ul
                  className={styles.contents}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {contents.map(({ id, title, story, embed }, index) => {
                    return (
                      <Draggable key={id} draggableId={id} index={index}>
                        {(provided, snapshot) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            
                            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                          >
                            <div style={{display:"flex", width:"100%"}}>
                              <svg
                                onClick={() => handleDeleteCard(id)}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 352 512"
                              >
                                <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" />
                              </svg>
                            </div>
                            <input className={styles.card_title}
                                onChange={(e) => handleChangeTitle(e, id)}
                                defaultValue={title}
                                placeholder="Title..."
                              />
                            <input className={styles.card_embed}
                              onChange={(e) => handleChangeEmbed(e, id)}
                              defaultValue={embed}
                              placeholder="Embed URL"
                            />
                            <textarea
                              onChange={(e) => handleChangeStory(e, id)}
                              defaultValue={story}
                              placeholder="Paragraph..."
                            />
                          </li>
                        )}
                      </Draggable>
                    );
                  })}

                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
          <div ref={bottomRef} className={styles.bottom}>
            <div />
            <svg onClick={handleNewContent} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" /></svg>
          </div>
          <div className={styles.tagsStuffWrapper}>
            <div className={styles.suggestedTags}>
              {suggestedTags.map((tag,i) => {return(
                <div key={i} className={styles.suggestedTag} onClick={() => addTag(tag)}>{tag}</div>
              )})}
            </div>
            <input className={styles.tagSearch} placeholder="Search existing tags..." value={searchedTag} onChange={(e) => setSearchedTag(e.target.value)} />
          </div>
          <div className={styles.tags}>
            <div style={{fontWeight:"bold"}}>Tags: </div>
            {tags.map((tag, i) => { return (
              <div key={i} className={styles.tag}>
                <div>{tag}</div>
                <svg onClick={() => deleteTag(tag)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/></svg>
              </div>
            )})}
          </div>
          <input className={styles.short} placeholder="Short description... (Optional)" value={short} onChange={(e) => setShort(e.target.value)} />
          <div className={styles.buttonWrapper}>
            <button onClick={deletePage} className={styles.delete_button}>DELETE PAGE</button>
            <button onClick={savePage} className={styles.save_button}>SAVE PAGE</button>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const token = await getToken({req:context.req})
  const postId = context.query.id
  if (!token) {
    // redirect
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  if (postId) {
    const prisma = new PrismaClient();
    const post = await prisma.Post.findUnique({
      where: {
        id: postId
      },
    });
    if (post && post.authorId === token.sub) {
      return {props:{post}}
    } else {
      return {
        redirect: {
          destination: '/404',
          permanent: false,
        },
      }
    }
  }
  return {
    redirect: {
      destination: '/404',
      permanent: false,
    },
  }
}
