import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { BlogContext } from "../pages/blog.page";


const BlogInteraction = () => {
    const navigate = useNavigate(); // Use the useNavigate hook

    let {
        blog: {
            _id,
            title,
            blog_id,
            activity,
            activity: { total_likes, total_comments },
            author: {
                personal_info: { username: author_username },
            },
        },
        setBlog,
        islikedByUser,
        setIsLikedByUser,
    } = useContext(BlogContext);

    const { userAuth: { username, access_token } } = useContext(UserContext);

    useEffect(() => {
        if (access_token) {
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/isliked-by-user", { _id }, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
                .then(({ data: { result } }) => {
                    setIsLikedByUser(Boolean(result));
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, []);

    const handleLike = () => {
        if (access_token) {
            setIsLikedByUser(prevVal => !prevVal);

            total_likes = !islikedByUser ? total_likes + 1 : total_likes - 1;

            setBlog(blog => ({ ...blog, activity: { ...blog.activity, total_likes } }));

            axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/like-blog', { _id, islikedByUser }, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
                .then(({ data }) => {
                    console.log(data);
                })
                .catch((err) => {
                    console.log(err);
                });

        } else {
            toast.error("Please Login to like the blog");
        }
    };

    return (
        <>
            <Toaster />
            <hr className="border-grey my-2" />
            <div className="flex gap-6 items-center">
                <button
                    className={"w-10 h-10 rounded-full flex items-center justify-center "
                        + (islikedByUser ? "bg-red" : "bg-grey/80")
                    }
                    onClick={handleLike}
                >
                    <i className="fi fi-rr-heart"></i>
                </button>
                <p className="text-xl text-dark-grey">{total_likes}</p>

            

                <div className="flex gap-6 items-center">
                    <Link
                        to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}
                    >
                        <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
                    </Link>
                </div>
            </div>

            <hr className="border-grey my-2" />
        </>
    );
};

export default BlogInteraction;
