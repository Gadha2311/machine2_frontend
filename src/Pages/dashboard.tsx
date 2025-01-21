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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Sidebar from "../components/sideBar";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Swal from "sweetalert2";
import { IPost } from "../interface/userInterface";

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
  const [openModal, setOpenModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [postsPerPage] = useState(8); 

  const fetchPosts = async () => {
    try {
      const response = await Axios.get(`/auth/posts?page=${currentPage}&limit=${postsPerPage}`);
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages); 
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


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

  const editPost = async (formData: FormData) => {
    try {
      const response = await Axios.post(
        `/auth/editPosts/${selectedPostId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
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
    } catch (error) {
      setError("Error updating post. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    if (!isEditing) {
      files.forEach((file) => {
        formData.append("img", file);
      });
    }

    if (isEditing) {
      await editPost(formData);
    } else {
      try {
        const response = await Axios.post("/auth/createPost", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setPosts((prevPosts) => [...prevPosts, response.data.post]);
      } catch (error) {
        setError("Error creating post. Please try again.");
      }
    }

    // Reset form
    setTitle("");
    setContent("");
    setFiles([]);
    setImageError("");
    setIsEditing(false);
    setSelectedPostId(null);
    setOpenModal(false);
    fetchPosts();
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
   
  };

  const closeMenu = () => {
    setMenuAnchor(null);
   
  };

  const handleEdit = (post: IPost) => {
    setTitle(post.title);
    setContent(post.content);
    setFiles(post.img ? post.img.map((img) => new File([], img)) : []);
    setIsEditing(true);
    setOpenModal(true);
    closeMenu();
  };

  const handleDelete = async () => {
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
                  value={!isEditing ? title : ""}
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
                  value={!isEditing ? content : ""}
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
                <Grid item key={post._id} xs={12} sm={10} md={10} lg={7}>
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
                      height="400"
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
        <Box sx={{ marginTop: "20px", display: "flex", justifyContent: "space-between", width: "100%" }}>
          <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <Typography>
            Page {currentPage} of {totalPages}
          </Typography>
          <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
          </Button>
        </Box>
        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle>
            {isEditing ? "Edit Post" : "Create New Post"}
          </DialogTitle>
          <DialogContent>
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
            ></IconButton>
            {imageError && (
              <Typography color="error" variant="body2">
                {imageError}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {isEditing ? "Update Post" : "Create Post"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Dashboard;