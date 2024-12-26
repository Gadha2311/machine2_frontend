import React, { useEffect, useState } from "react";
import Axios from "../axios";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material";

interface IPost {
  _id: string;
  userId: string;
  username?: string;
  title: string;
  content: string;
  img?: string[];
  createdAt: string;
}

const MAX_CONTENT_LENGTH = 100;

interface PostListProps {
  posts: IPost[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  const [localPosts, setLocalPosts] = useState<IPost[]>(posts); // Renamed to localPosts
  const [expandedPost, setExpandedPost] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await Axios.get("/auth/posts");
        setLocalPosts(response.data.posts); 
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false); 
      }
    };

    const timeout = setTimeout(fetchPosts, 3000);

    return () => clearTimeout(timeout); 
  }, []);

  const toggleExpand = (postId: string) => {
    setExpandedPost((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={4} justifyContent="center">
      {localPosts.map((post) => ( // Use localPosts here
        <Grid item key={post._id} xs={12} sm={6} md={4} lg={3}>
          <Card
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "gray.900",
              color: "white",
              position: "relative",
            }}
          >
            <CardMedia
              component="img"
              height="200"
              image={
                post.img && post.img.length > 0
                  ? post.img[0]
                  : "https://source.unsplash.com/random/300x300/?1"
              }
              alt={post.title}
            />
            <CardContent
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" color="textPrimary" gutterBottom>
                {post.username}
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                {post.title}
              </Typography>
              <Typography variant="body2" color="info">
                {expandedPost.has(post._id)
                  ? post.content
                  : post.content.length > MAX_CONTENT_LENGTH
                  ? `${post.content.substring(0, MAX_CONTENT_LENGTH)}...`
                  : post.content}
              </Typography>
              {post.content.length > MAX_CONTENT_LENGTH && (
                <Button
                  onClick={() => toggleExpand(post._id)}
                  size="small"
                  sx={{ marginTop: "0.5rem", color: "primary.light" }}
                >
                  {expandedPost.has(post._id) ? "Show Less" : "Read More"}
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default PostList;