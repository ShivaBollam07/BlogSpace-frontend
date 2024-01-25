import { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigations from "../components/inpage-navigation.component";
import axios from "axios";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MiniimalBlogPost from "../components/nobanner-blog-post.component";
import NoDataMessage from "../components/nodata.component";
 





const HomePage = () => {
    let [blogs, setBlogs] = useState([]);
    let [trendingBlogs, setTrendingBlogs] = useState([]);
    let [pageState, setPageState] = useState("home");
    let [currentPage, setCurrentPage] = useState(1);
    let [loadingMore, setLoadingMore] = useState(false);

    let categories = ["programming", "hollywood", "film making", "social media", "cooking", "tech", "finances", "travel", "lifestyle", "environment", "entertainment","Nature"];

    const fetchLatestBlogs = (page = 1) => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", {
            params: { page },
        })
            .then(({ data }) => {
                // Remove duplicates based on blog_id
                const uniqueBlogs = data.filter((blog) => !blogs.some((existingBlog) => existingBlog.blog_id === blog.blog_id));
                setBlogs((prevBlogs) => [...prevBlogs, ...uniqueBlogs]);
            })
            .catch(err => {
                console.error("Error fetching blogs:", err);
            });
    };

    const fetchLatestBlogsByCategory = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { tag: pageState })
            .then(({ data }) => {
                setBlogs(data || []);
            })
            .catch(err => {
                console.error("Error fetching blogs:", err);
            });
    };

    const fetchTrendingBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
            .then(({ data }) => {
                setTrendingBlogs(data || []);
            })
            .catch(err => {
                console.error("Error fetching blogs:", err);
            });
    };

    const loadBlogByCategory = (e) => {
        let category = e.target.innerText;
        setBlogs([]);

        if (category) {
            category = category.toLowerCase();
            setPageState((prevPageState) => (prevPageState === category ? "home" : category));
        }
    };

    const fetchMoreBlogs = () => {
        setLoadingMore(true);
        fetchLatestBlogs(currentPage + 1);
        setCurrentPage((prevPage) => prevPage + 1);
        setLoadingMore(false);
    };

    useEffect(() => {
        if (pageState === "home") {
            fetchLatestBlogs();
        } else {
            fetchLatestBlogsByCategory();
        }

        if (!trendingBlogs) {
            fetchTrendingBlogs();
        }

        fetchTrendingBlogs();
    }, [pageState, currentPage]);

    return (
        <div>
            <AnimationWrapper>
                <section className="h-cover flex justify-center gap-10">
                    <div className="w-full">
                        <InPageNavigations routes={[pageState, "trending blogs"]} defaultHidden={["trending blogs"]}>
                            <>
                                {blogs === null ? (
                                    <Loader />
                                ) : (
                                    blogs.length ?
                                        blogs.map((blog, i) => {
                                            return <AnimationWrapper
                                                key={i}
                                                transition={{ duration: 1, delay1: i * .1 }}
                                            >
                                                <BlogPostCard content={blog} author={blog.author.personal_info}   />
                                            </AnimationWrapper>
                                        })
                                        :
                                        <NoDataMessage message="No blogs published " />
                                )}
                                {pageState === "home" && (
                                    <div className="flex justify-center mt-5">
                                        <button
                                            id="getMoreButton"
                                            className="btn-dark"
                                            onClick={fetchMoreBlogs}
                                            disabled={loadingMore}
                                            style={{ marginBottom: "100px" }}
                                        >
                                            {loadingMore ? "Loading..." : "Get More Blogs"}
                                        </button>
                                    </div>
                                )}
                            </>
                            {
                                trendingBlogs && trendingBlogs.length > 0 ? (
                                    trendingBlogs.map((blog, i) => (
                                        <AnimationWrapper
                                            key={i}
                                            transition={{ duration: 1, delay1: i * 0.1 }}
                                        >
                                            <MiniimalBlogPost blog={blog} index={i} />
                                        </AnimationWrapper>
                                    ))
                                ) : (
                                    <NoDataMessage message="No trending blogs " />
                                )
                            }
                        </InPageNavigations>
                    </div>

                    <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
                        <div className="flex flex-col gap-10 ">
                            <div>
                                <h1 className="font-medium text-xl mb-8">Stories from all interests</h1>
                                <div className="flex gap-3 flex-wrap">
                                    {categories.map((category, i) => (
                                        <button
                                            key={i}
                                            className={`tag ${pageState === category ? " bg-black text-white" : ""}`}
                                            onClick={(e) => loadBlogByCategory(e, category)}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h1 className="font-medium text-xl mb-8" > Trending <i className="fi fi-rr-arrow-trend-up" ></i></h1>
                                {
                                    trendingBlogs === null ? <Loader /> :
                                        trendingBlogs.length ?
                                            trendingBlogs.map((blog, i) => {
                                                return <AnimationWrapper
                                                    key={i}
                                                    transition={{ duration: 1, delay1: i * .1 }}
                                                >
                                                    <MiniimalBlogPost blog={blog} index={i} />
                                                </AnimationWrapper>
                                            }) :
                                            <NoDataMessage message="No trending blogs " />
                                }
                            </div>
                        </div>
                    </div>
                </section>
            </AnimationWrapper>
        </div>
    );

};

export default HomePage;