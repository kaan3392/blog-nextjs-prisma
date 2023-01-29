import { useState } from "react";
import styles from "../styles/Post.module.css";

const urlType = (url) => {
  if (!url) {
    return "unknown"
  }
  try {
    const valid = new URL(url)
  } catch (error) {
    if (url.match(/iframe/) !== null) {
      const partsOne = url.split('src="')
      if (partsOne.length > 1) {
        const partsTwo = partsOne[1].split('"')
        if (partsTwo.length > 1) {
          return partsTwo[0]
        }
      }
    }
    // else if (url.match(/^.\//) || url.match(/^..\//)) {
    //   if (url.match(/\.(jpeg|jpg|gif|png|webp|bmp|svg)$/) !== null) {
    //     return "localimage"
    //   } else if (url.match(/\.(mp4|webm|mov|ogg)$/) !== null) {
    //     return "localvideo"
    //   } else if (url.match(/\.(wav|wave|mp3|aac)$/) !== null) {
    //     return "localaudio"
    //   }
    // }
    return "unknown"
  }
  if (url.match(/format=(jpeg|jpg|gif|png|webp|bmp|svg)/) !== null) {
    return "image"
  } else if (url.match(/format=(mp4|webm|mov|ogg)/) !== null) {
    return "video"
  } else if (url.match(/format=(wav|wave|mp3|aac)/) !== null) {
    return "audio"
  } else if (url.match(/\.(jpeg|jpg|gif|png|webp|bmp|svg)$/) !== null) {
    return "image"
  } else if (url.match(/\.(mp4|webm|mov|ogg)$/) !== null) {
    return "video"
  } else if (url.match(/\.(wav|wave|mp3|aac)$/) !== null) {
    return "audio"
  } else if (url.match(/embed/)) {
    return url
  } else if (url.match(/\.(jpeg|jpg|gif|png|webp|bmp|svg)/) !== null) {
    return "image"
  } else if (url.match(/\.(mp4|webm|mov|ogg)/) !== null) {
    return "video"
  } else if (url.match(/\.(wav|wave|mp3|aac)/) !== null) {
    return "audio"
  } else if (url.match(/(youtube.com\/watch)/) !== null) {
    const partsOne = url.split('v=')
    if (partsOne.length > 1) {
      const partsTwo = partsOne[1].split('&')
      if (partsTwo.length > 1) {
        return "https://www.youtube.com/embed/"+partsTwo[0]
      } else {
        return "https://www.youtube.com/embed/"+partsOne[1]
      }
    }
  } else if (url.match(/(youtu.be\/)/) !== null) {
    const partsOne = url.split('youtu.be/')
    if (partsOne.length > 1) {
      return "https://www.youtube.com/embed/"+partsOne[1]
    }
  } else if (url.match(/(dailymotion.com\/video)/) !== null) {
    return url.replace(".com/video/", ".com/embed/video/")
  } else if (url.match(/(images.unsplash.com\/photo)/) !== null) {
    return "image"
  }
  return "unknown"
}

const Post = ({post}) => {
  const [width, setWidth] = useState(100)
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.title}>{post.title}</div>
        <div className={styles.imageCon}>
          <img className={styles.image} src={post.embed} alt="" />
        </div>
        <p className={styles.short}>{post.short}</p>
      </div>
      <div className={styles.others}>
        {post.content.map((part, i) => (
          <div key={i} style={{marginTop:"30px", width:"100%"}}>
            <div className={styles.title}>{part.title}</div>
            <div className={styles.imageCon}>
              {/* <img className={styles.image} src={part.embed} alt="" /> */}
              <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", width:"100%"}}>
                {(part.embed && urlType(part.embed) === "image") && <div style={{zIndex:4, position:"relative", width:"100%", aspectRatio:1.77, backgroundColor:"black", backgroundPosition:'center', backgroundRepeat:"no-repeat", backgroundSize:'cover', backgroundImage:'url("'+part.embed+'")', cursor:"pointer"}} >
                  <div style={{zIndex:5, position:"absolute", width:"100%", aspectRatio:1.77, backgroundColor:"rgba(0,0,0,0.75)", backgroundPosition:'center', backgroundRepeat:"no-repeat", backgroundSize:'contain', backgroundImage:'url("'+part.embed+'")', cursor:"pointer"}} />
                </div>}
                {(part.embed && urlType(part.embed) === "video") && <video style={{zIndex:4, width:"100%", aspectRatio:1.77, backgroundColor:"black"}} width="100%" controls ><source src={part.embed} /></video>}
                {(part.embed && urlType(part.embed) === "audio") && <audio style={{zIndex:4, width:"100%", aspectRatio:1.77, backgroundColor:"black"}} controls ><source src={part.embed} /></audio>}
                {(part.embed && !((urlType(part.embed)).match(/^(unknown|image|video|audio)$/))) && <iframe title={part.title} style={{zIndex:4, width:"100%", aspectRatio:1.77, backgroundColor:"black", border:0}} src={urlType(part.embed)} frameBorder="0" allow="fullscreen; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true}></iframe>}
              </div>
            </div>
            <p className={styles.short}>{part.story}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Post;
