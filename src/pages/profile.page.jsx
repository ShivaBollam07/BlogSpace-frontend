import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { UserContext } from "../App";
import BlogPostCard from "../components/blog-post.component";
import NoDataMessage from "../components/nodata.component";
import AboutUser from "../components/about.component";
import InPageNavigations from "../components/inpage-navigation.component";
import getDay from "../common/date";

export const profileDataStructure = {
    personal_info: {
        username: "",
        fullname: "",
        profile_img: "",
        bio: "",
    },
    account_info: {
        total_posts: 0,
        total_reads: 0,
    },
    social_links: {},
    joinedAt: "",
};

const ProfilePage = () => {
    let { id: profileId } = useParams();
    let [profile, setProfile] = useState(profileDataStructure);
    let [loading, setLoading] = useState(true);
    let [blogs, setBlogs] = useState([]);

    let {
        personal_info: { username: profile_username, fullname, profile_img, bio } = {},
        account_info: { total_posts = 0, total_reads = 0 } = {},
        social_links = {},
        joinedAt,
    } = profile;

    let { userAuth } = useContext(UserContext);
    let username = userAuth ? userAuth.username : null;

    const fetchUserProfile = () => {
        axios
            .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", { username: profileId || username })
            .then(({ data: user }) => {
                setProfile(user);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching profile:", err);
                setLoading(false);
            });
    };

    const fetchUserBlogs = (username) => {
        axios
            .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-user-blogs", { username })
            .then(({ data }) => {
                setBlogs(data || []);
            })
            .catch((err) => {
                console.error("Error fetching user blogs:", err);
            });
    };

    const resetStates = () => {
        setProfile(profileDataStructure);
        setLoading(true);
    };

    useEffect(() => {
        resetStates();
        fetchUserProfile();
    }, [profileId]);

    useEffect(() => {
        if (profile?.personal_info?.username) {
            fetchUserBlogs(profile.personal_info.username);
        }
    }, [profile]);

    return (
        <AnimationWrapper>
            {loading ? (
                <Loader />
            ) : (
                <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12 ">
                    <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] items-center">
                        {profile?.personal_info?.profile_img && (
                            <img
                                src={profile.personal_info.profile_img}
                                alt={profile.personal_info.username}
                                className="w-48 h-48 rounded-full md:w-32 md:h-32"
                            />
                        )}
                        <h1 className="text-2xl font-medium">{profile?.personal_info?.username}</h1>
                        <p className="text-xl text-dark-grey capitalize h-6 ">{profile?.personal_info?.fullname}</p>
                        <br />
                        <p className="text-dark-grey text-sm">Total Blogs: {total_posts.toLocaleString()}</p>
                        <p className="text-dark-grey text-sm">Total Reads: {total_reads.toLocaleString()}</p>
                        <p className="text-dark-grey text-sm">Joined on: {getDay(joinedAt)}</p>

                        

                    </div>
                    <div className="flex-grow max-w-[800px] w-full pl-100 ">
                        <InPageNavigations routes={[`Blogs by ${profile?.personal_info?.username}`]} defaultHidden={[]}>
                            <>
                                {blogs === null ? (
                                    <Loader />
                                ) : (
                                    blogs.length ? (
                                        blogs.map((blog, i) => (
                                            <AnimationWrapper key={i} transition={{ duration: 1, delay1: i * 0.1 }}>
                                                <BlogPostCard content={blog} author={blog.author.personal_info} />
                                            </AnimationWrapper>
                                        ))
                                    ) : (
                                        <NoDataMessage message="No blogs published " />
                                    )
                                )}
                            </>
                        </InPageNavigations>
                    </div>
                </section>
            )}
        </AnimationWrapper>
    );
};

export default ProfilePage;
