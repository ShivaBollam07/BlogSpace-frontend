import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useState, createContext } from 'react';
import AnimationWrapper from '../common/page-animation';
import Loader from '../components/loader.component';
import BlogInteraction from '../components/blog-interaction.component';

export const blogStructure = {
    title: '',
    content: [],
    banner: '',
    des: '',
    tags: [],
    author: {
        personal_info: {},
    },
    publishedAt: '',
};

export const BlogContext = createContext({});

const BlogPage = () => {
    let { blog_id } = useParams();

    const [blog, setBlog] = useState(blogStructure);
    const [similarblogs, setSimilarBlogs] = useState(null);
    const [loading, setLoading] = useState(true);
    const [islikedByUser, setIsLikedByUser] = useState(false);

    let {
        title,
        content,
        banner,
        des,
        author: {
            personal_info: { fullname, username: author_username, profile_img },
        },
        publishedAt,
        tags,
    } = blog;

    const fetchBlog = () => {
        axios
            .post(import.meta.env.VITE_SERVER_DOMAIN + '/get-blog', { blog_id: blog_id })
            .then(({ data: { blog } }) => {
                setBlog(blog);

                if (blog.tags.length > 0) {
                    axios
                        .post(import.meta.env.VITE_SERVER_DOMAIN + '/search-blogs', { tag: blog.tags[0] })
                        .then(({ data }) => {
                            setSimilarBlogs(data);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }

                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        resetStates();
        fetchBlog();
    }, []);

    const resetStates = () => {
        setBlog(blogStructure);
        setSimilarBlogs(null);
        setLoading(true);
        setIsLikedByUser(false);
    };

    return (
        <AnimationWrapper>
            {loading ? (
                <Loader />
            ) : (
                <BlogContext.Provider value={{ blog, setBlog, islikedByUser, setIsLikedByUser }}>
                    <div className='max-w-[900px] center py-10 max-lg:px-[5vw]'>
                        <img src={banner} className='aspect-video' />

                        <div className='mt-12'>
                            <h2 className='text-3xl font-bold'>{title}</h2>

                            <div className='flex max-sm:flex-col justify-between my-8 '>
                                <div className='flex gap-5 items-start'>
                                    <img src={profile_img} className='w-12 h-12 rounded-full' />

                                    <p className='text-sm font-gelasio capitalize'>
                                        {fullname}
                                        <br />
                                        <Link
                                            to={`/user/${author_username}`}
                                            className='text-sm font-gelasio text-gray-500 hover:underline'
                                        >
                                            @{author_username}
                                        </Link>
                                    </p>
                                </div>
                                <p className='text-dark-gray opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5'>
                                    Published on {new Date(publishedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <BlogInteraction />

                        {content.map((item, index) => (
                            <div key={index} className='mt-8'>
                                {item.type === 'text' && <p className='text-dark-gray'>{item.value}</p>}
                                {item.type === 'list' && (
                                    <ul className='list-disc list-inside'>
                                        {item.value.map((listItem, listIndex) => (
                                            <li key={listIndex} className='text-dark-gray'>
                                                {listItem}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {item.type === 'image' && (
                                    <img
                                        src={item.value}
                                        className='my-6 w-full max-w-[500px] mx-auto'
                                        alt='Blog Image'
                                    />
                                )}
                                {item.type === 'header' && <h2 className='text-2xl font-bold'>{item.value}</h2>}
                                {item.type === 'quote' && (
                                    <blockquote className='text-gray-500 italic border-l-4 border-gray-500 pl-4'>
                                        {item.value}
                                    </blockquote>
                                )}
                            </div>
                        ))}

                        {similarblogs !== null && similarblogs.length ? (
                            <>
                                <h1 className='text-2xl mt-14 mb-10 font-medium'>Similar blogs</h1>
                                {similarblogs.map((blog) => {
                                    if (blog.blog_id === blog_id) return null;

                                    return (
                                        <div key={blog.blog_id} className='flex gap-5 items-center mb-10'>
                                            <img src={blog.banner} className='w-24 h-24 rounded-md' />
                                            <div>
                                                <Link
                                                    to={`/blog/${blog.blog_id}`}
                                                    className='text-xl font-medium hover:underline'
                                                    onClick={() => history.push(`/blog/${blog.blog_id}`)}
                                                >
                                                    {blog.title}
                                                </Link>
                                                <p className='text-dark-gray opacity-75'>{blog.des}</p>

                                                <div className='flex gap-4 mt-2'>
                                                    <span className='ml-3 flex items-center gap-2 text-dark-grey'>
                                                        <i className='fi fi-rr-heart text-xl'></i>
                                                        {blog.activity.total_likes}
                                                    </span>
                                                    {/* Add more details like reads if available */}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        ) : (
                            <h1>No similar blogs exist with the tags of the present blog</h1>
                        )}
                    </div>
                </BlogContext.Provider>
            )}
        </AnimationWrapper>
    );
};

export default BlogPage;
