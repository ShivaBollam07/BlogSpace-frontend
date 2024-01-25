import { useState, useRef, useContext, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";
import { uploadImage } from "../common/aws";
import { UserContext } from "../App";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";
import logo from "../imgs/logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


const BlogEditor = () => {
  const blogBannerRef = useRef();
  const editorRef = useRef(null);

  let {
    blog,
    blog: { title, banner, content, tags, description },
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
  } = useContext(EditorContext);

  let { userAuth } = useContext(UserContext);
  let access_token = userAuth?.access_token;

  let navigate = useNavigate();

  useEffect(() => {
    const initializeTextEditor = async () => {
      try {
        const editorInstance = new EditorJS({
          holder: "textEditor",
          placeholder: "Write something...",
          tools: tools,
          data: content,
        });

        setTextEditor({
          instance: editorInstance,
          isReady: true,
        });
      } catch (error) {
        console.error("Error initializing the text editor:", error);
      }
    };

    if (!textEditor.isReady) {
      initializeTextEditor();
    }

    return () => {
      if (textEditor && textEditor.instance) {
        textEditor.instance.destroy();
      }
    };
  }, [textEditor]);

  const handleBannerUpload = (e) => {
    let file = e.target.files[0];

    if (file) {
      let loadingToast = toast.loading("Uploading Banner....");

      uploadImage(file)
        .then((url) => {
          toast.dismiss(loadingToast);
          toast.success("Banner Uploaded");
          setBlog({ ...blog, banner: url });
        })
        .catch((err) => {
          toast.dismiss(loadingToast);
          toast.error(err);
        });
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleTitleChange = (e) => {
    const input = e.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
    setBlog({ ...blog, title: input.value });
  };

  const handleError = (e) => {
    const img = e.target;
    img.src = defaultBanner;
  };

  const handlePublishEvent = async () => {
    console.log("Blog before publish:", blog);
  
    if (!banner.length) {
      console.error("Error: Upload a blog banner to publish it");
      return toast.error("Upload a blog banner to publish it");
    }
  
    if (!title.length) {
      console.error("Error: Write a title to publish it");
      return toast.error("Write a title to publish it");
    }
  
    // Check if textEditor is ready and has an instance
    if (textEditor && textEditor.isReady && textEditor.instance) {
      try {
        // Save the content from the text editor
        const data = await textEditor.instance.save();
        console.log("Text Editor Data:", data);
  
        // Extract different content types (text, image, list)
        const content = data.blocks.map((block) => {
          switch (block.type) {
              case "paragraph":
                  return { type: "text", value: block.data.text };
              case "image":
                  return { type: "image", value: block.data.file.url };
              case "list":
                  return { type: "list", value: block.data.items };
              case "header":
                  return { type: "header", value: block.data.text };
              case "marker":
                  return { type: "marker", value: block.data.text };
              case "quote":
                  return { type: "quote", value: block.data.text };
              default:
                  if (AllTools[block.type]) {
                      return { type: block.type, value: block.data }; 
                  }
                  return null;
          }
      }).filter(Boolean); 
      
  
        if (content.length > 0) {
          setBlog({ ...blog, content });
          setEditorState("publish");
          console.log("Blog after publish:", blog);

          
        } else {
          console.error("Error: Write something in your blog to publish it");
          toast.error("Write something in your blog to publish it");
        }
      } catch (err) {
        console.error("Error:", err);
        toast.error(err);
      }
    } else {
      toast.error("Text editor is not ready");
    }
  };
  

  
  
  

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={logo} alt="logo" className="" />
        </Link>

        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {blog.title.length ? blog.title : "New Blog"}
        </p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2" onClick={handlePublishEvent}>
            Publish
          </button>
       
        </div>
      </nav>
      <Toaster />
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video bg-white border-4 border-grey hover:opacity-4">
              <label htmlFor="uploadBanner">
                <img
                  src={blog.banner || defaultBanner}
                  alt="banner"
                  className="z-20"
                  onError={handleError}
                />
                <input
                  type="file"
                  accept=".png , .jpg , .jpeg"
                  hidden
                  id="uploadBanner"
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            <textarea
              defaultValue={title}
              placeholder="Blog Title"
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>

            <hr className="w-full opacity-10 my-5 "></hr>

            <div id="textEditor" className="font-gelasio">

            </div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
