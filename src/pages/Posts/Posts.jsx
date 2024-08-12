import { useEffect, useState } from "react";
import "./Posts.css";

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch the list of posts from the API
    fetch("https://codebuddy.review/posts")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data);
        setPosts(data.data);
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  return (
    <div className="posts-container">
      <div className="posts-grid">
        {posts &&
          posts.length > 0 &&
          posts.map((post) => (
            <div className="post-card" key={post.id}>
              <img src={post.image} className="post-image" alt="Post" />
              <div className="post-content">
                <div className="post-author">
                  <img src={post.avatar} className="avatar-img" alt="Author" />
                  <h5 className="author-name">
                    {post.firstName} {post.lastName}
                  </h5>
                </div>
                <p className="post-writeup">{post.writeup}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Posts;
