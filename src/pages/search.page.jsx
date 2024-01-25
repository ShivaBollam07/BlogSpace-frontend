import { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import axios from "axios";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import NoDataMessage from "../components/nodata.component";
import { useParams } from "react-router-dom";
import InPageNavigation from "../components/inpage-navigation.component";
import UserCard from "../components/usercard.component";

const SearchPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const { query } = useParams();

  const fetchBlogsByTag = (tag) => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { tag })
      .then(({ data }) => {
        setBlogs(data || []);
      })
      .catch(err => {
        console.error("Error fetching blogs:", err);
      });
  };

  const fetchUsers = () => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users", { query })
      .then(({ data: { users } }) => {
        setUsers(users || []);
      })
      .catch(err => {
        console.error("Error fetching users:", err);
      });
  };

  useEffect(() => {
    resetState();
    fetchBlogsByTag(query.toLowerCase());
    fetchUsers();
  }, [query]);

  const resetState = () => {
    setBlogs([]);
    setUsers([]);
  };

  return (
    <div>
      <AnimationWrapper>
        <section className="h-cover flex justify-center gap-10">
          <div className="w-full">
            <InPageNavigation routes={[`search results from "${query}"`, "Accounts Matched"]} defaultHidden={["Accounts Matched"]}>
              <>
                {blogs === null ? (
                  <Loader />
                ) : (
                  blogs.length ? (
                    blogs.map((blog, i) => (
                      <AnimationWrapper
                        key={i}
                        transition={{ duration: 1, delay1: i * 0.1 }}
                      >
                        <BlogPostCard content={blog} author={blog.author.personal_info} />
                      </AnimationWrapper>
                    ))
                  ) : (
                    <NoDataMessage message="No blogs published" />
                  )
                )}
              </>

              <UserCard users={users} />

            </InPageNavigation>
          </div>
          <div className="min-w-[40%] lg:min-w-[[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
            <h1 className="text-xl fonr-medium mb-8">User related to Search <i className="fi fi-rr-user mt-1"></i></h1>
            <UserCard users={users} />
          </div>
        </section>
      </AnimationWrapper>
    </div>
  );
};

export default SearchPage;
