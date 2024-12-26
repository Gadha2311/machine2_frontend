import React, { useEffect, useState } from "react";
import Axios from "../axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Menu,
  MenuItem,
} from "@mui/material";
import Sidebar from "../components/sideBar";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Swal from "sweetalert2";

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

const Dashboard: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [imageError, setImageError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [expandedPost, setExpandedPost] = useState<Set<string>>(new Set());
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const response = await Axios.get("/auth/posts");
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle post submission
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);
      setFiles(fileArray);
      setImageError("");
    }
  };

  const validateForm = () => {
    let valid = true;
    if (!title) {
      setTitleError("Title is required");
      valid = false;
    } else {
      setTitleError("");
    }

    if (!content) {
      setContentError("Content is required");
      valid = false;
    } else {
      setContentError("");
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      if (!isEditing) {
        files.forEach((file) => {
          formData.append("img", file);
        });
      }

      if (isEditing) {
        const response = await Axios.post(
          `/auth/editPosts/${selectedPostId}`,
          formData,
          config
        );

        const updatedPost = {
          ...response.data.post,
          title,
          content,
          img: response.data.post.img,
        };

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === selectedPostId ? updatedPost : post
          )
        );
      } else {
        // Send request for creating post
        const response = await Axios.post("/auth/createPost", formData, config);
        setPosts((prevPosts) => [...prevPosts, response.data.post]);
      }

      // Reset form
      setTitle("");
      setContent("");
      setFiles([]);
      setImageError("");
      setIsEditing(false);
      setSelectedPostId(null);
      fetchPosts();
    } catch (error) {
      setError("Error creating/updating post. Please try again.");
    }
  };

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

  const openMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    postId: string
  ) => {
    setMenuAnchor(event.currentTarget);
    setSelectedPostId(postId);
    console.log(`postId${postId}`);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    // setSelectedPostId(null);
  };

  const handleEdit = (post: IPost) => {
    setTitle(post.title);
    setContent(post.content);
    setFiles(post.img ? post.img.map((img) => new File([], img)) : []);
    setIsEditing(true);
    closeMenu();
  };

  const handleDelete = async () => {
    // SweetAlert2 confirmation box
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      try {
        await Axios.delete(`/auth/deletePosts/${selectedPostId}`);
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== selectedPostId)
        );
        Swal.fire("Deleted!", "Your post has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "There was an error deleting the post.", "error");
      } finally {
        closeMenu();
      }
    }
  };

  const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
  const currentUserId = userData.user.id;

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
      <Sidebar />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: "10px",
        }}
      >
        {/* Create/Edit Post Form */}
        <Paper
          sx={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" gutterBottom>
            {isEditing ? "Edit Post" : "Create New Post"}
          </Typography>

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  variant="outlined"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  error={!!titleError}
                  helperText={titleError}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Content"
                  variant="outlined"
                  multiline
                  rows={4}
                  fullWidth
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  error={!!contentError}
                  helperText={contentError}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <input
                  type="file"
                  hidden
                  onChange={handleImageChange}
                  accept="image/*"
                  id="imageInput"
                />
                <IconButton
                  color="primary"
                  component="span"
                  onClick={() =>
                    (
                      document.getElementById("imageInput") as HTMLInputElement
                    )?.click()
                  }
                >
                  <PhotoCameraIcon />
                </IconButton>
                {imageError && (
                  <Typography color="error" variant="body2">
                    {imageError}
                  </Typography>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  startIcon={<SendIcon />}
                >
                  {isEditing ? "Update Post" : "Create Post"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Post List */}
        <Box sx={{ marginTop: "20px", width: "100%" }}>
          <Grid container spacing={4} justifyContent="center">
            {Array.isArray(posts) &&
              posts.map((post) => (
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
                      {currentUserId === post.userId && (
                        <>
                          <IconButton
                            onClick={(e) => openMenu(e, post._id)}
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              color: "primary.main",
                            }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            anchorEl={menuAnchor}
                            open={!!menuAnchor && selectedPostId === post._id}
                            onClose={closeMenu}
                          >
                            <MenuItem onClick={() => handleEdit(post)}>
                              Edit
                            </MenuItem>
                            <MenuItem onClick={handleDelete}>Delete</MenuItem>
                          </Menu>
                        </>
                      )}
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        color="primary"
                        gutterBottom
                      >
                        {post.title}
                      </Typography>
                      <Typography variant="body2" color="info">
                        {expandedPost.has(post._id)
                          ? post.content
                          : post.content.length > MAX_CONTENT_LENGTH
                          ? `${post.content.substring(
                              0,
                              MAX_CONTENT_LENGTH
                            )}...`
                          : post.content}
                      </Typography>
                      {post.content.length > MAX_CONTENT_LENGTH && (
                        <Button
                          onClick={() => toggleExpand(post._id)}
                          size="small"
                          sx={{ marginTop: "0.5rem", color: "primary.light" }}
                        >
                          {expandedPost.has(post._id)
                            ? "Show Less"
                            : "Read More"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
