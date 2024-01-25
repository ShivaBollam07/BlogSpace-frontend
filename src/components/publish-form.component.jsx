import { Toaster, toast } from "react-hot-toast";
import AnimationWrapper from "../common/page-animation";
import { EditorContext } from "../pages/editor.pages";
import { useContext, useEffect } from "react";
import defaultBanner from "../imgs/blog banner.png";
import Tag from "./tags.component";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

const PublishForm = () => {
  const caracterLimit = 200;
  const tagLimit = 10;

  const {
    blog,
    blog: { banner, title, description, tags, content },
    setBlog,
    setEditorState,
    textEditor,
    setTextEditor,
  } = useContext(EditorContext);

  const { access_token } = useContext(UserContext).userAuth;
  const navigate = useNavigate();

  const handleCloseEvent = () => {
    setEditorState("editor");
  };

  const handleBlogDescriptionChange = (e) => {
    const input = e.target;
    setBlog((prevBlog) => ({
      ...prevBlog,
      description: input.value,
    }));
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();

      const tag = e.target.value;

      if (tags.length < tagLimit) {
        if (tags.includes(tag)) {
          toast.error(`You have already added ${tag} topic`);
        }

        if (!tags.includes(tag) && tag.length) {
          setBlog({ ...blog, tags: [...tags, tag] });
        }
      } else {
        toast.error(`You can add only ${tagLimit} topics`);
      }

      e.target.value = "";
    }
  };

  const publishBlog = async () => {
    console.log(blog);
  
    // Check all validations for title, description, tags, and content
    if (blog.title.length < 3) {
        return toast.error("Title must be at least 3 characters long");
    }
  
    if (!blog.description.length) {
        return toast.error("Please add a description");
    }
  
    if (blog.tags.length < 1) {
        return toast.error("Please add at least one topic");
    }
  
    let loadingToast = toast.loading("Publishing Blog....");
  
    try {
        // Assuming access_token is defined somewhere in your code
        const response = await axios.post(
            `${import.meta.env.VITE_SERVER_DOMAIN}/create-blog`,
            blog,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );

        
  
        toast.dismiss(loadingToast);
        toast.success("Blog Published Successfully");
  
        setTimeout(() => {
            navigate("/");
        }, 500); 
    } catch (error) {
        toast.dismiss(loadingToast);
        toast.error(error.response.data.error);
    }
};


  return (
    <AnimationWrapper>
      <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
        <Toaster />
       

        <div className="max-w-[550px] center">
          <p className="text-dark-grey mb-1">Preview</p>
          <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
            <img src={blog.banner || defaultBanner} alt="banner" className="" />
          </div>

          <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-1">
            {blog.title}
          </h1>
          <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4 ">
            {blog.description}
          </p>
        </div>

        <div className="">
          <p className="text-dark-grey mb-2 mt-9">Blog Title</p>

          <input
            type="text"
            className="input-box pl-4"
            defaultValue={blog.title}
            placeholder="Blog Title"
            onChange={(e) => {
              setBlog({ ...blog, title: e.target.value });
            }}
          />

          <p className="text-dark-grey mb-2 mt-9">Short Description of the blog</p>

          <textarea
            maxLength={caracterLimit}
            defaultValue={blog.description}
            className="h-40 resize-none leading-7 input-box pl-4 "
            onChange={handleBlogDescriptionChange}
            onKeyDown={handleTitleKeyDown}
          ></textarea>

          <p className="text-dark-grey text-right mt-1 text-sm">
            {caracterLimit - blog.description.length} characters left
          </p>

          <p className="text-dark-grey mb-2 mt-9">Topics - ( Helps in searching your blog post )</p>

          <div className="relative input-box pl-2 py-2 pb-4">
            <input
              type="text"
              placeholder="Add a topic"
              className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
              onKeyDown={handleKeyDown}
            />
            {tags.map((tag, index) => (
              <Tag key={index} tag={tag} />
            ))}
          </div>

          <p className="text-dark-grey text-right mt-1 text-sm">
            {tagLimit - tags.length} Tags left
          </p>

          <button
            className="btn-dark px-8"
            onClick={publishBlog}
          >
            Publish
          </button>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default PublishForm;
