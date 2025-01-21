import React, { useState } from "react";
import Axios from "../axios";
import {
  TextField,
  Button,
  Typography,
  IconButton,
  Grid,
  Paper,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

interface CreatePostProps {
  onPostCreated: () => void;
  onClose: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");

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
      setError("Title is required");
      valid = false;
    }
    if (!content) {
      setError("Content is required");
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    files.forEach((file) => {
      formData.append("img", file);
    });

    try {
      await Axios.post("/auth/createPost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      onPostCreated();
      onClose();
    } catch (error) {
      setError("Error creating post. Please try again.");
    }
  };

  return (
    <Paper sx={{ padding: "20px", marginBottom: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Create New Post
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
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
            />
          </Grid>
          <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
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
            {imageError && <Typography color="error">{imageError}</Typography>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ marginLeft: "10px" }}
            >
              Create Post
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default CreatePost;
