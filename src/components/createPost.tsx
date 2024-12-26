import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Grid,
  IconButton,
  Button,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SendIcon from "@mui/icons-material/Send";
import Axios from "../axios";

interface AddPostProps {
  onPostAdded: () => void;
}

const AddPost: React.FC<AddPostProps> = ({ onPostAdded }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [imageError, setImageError] = useState("");
  const [error, setError] = useState("");

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

      files.forEach((file) => {
        formData.append("img", file);
      });

      await Axios.post("/auth/createPost", formData, config);
      setTitle("");
      setContent("");
      setFiles([]);
      setImageError("");
      setError("");
      onPostAdded(); // Notify parent to fetch updated posts
    } catch (err) {
      setError("Error creating post. Please try again.");
    }
  };

  return (
    <Paper
      sx={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Create New Post
      </Typography>
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
      <form onSubmit={handleSubmit} style={{ width: "30%", background :"#E8E8E8", borderRadius:"10px",padding:"20px"}}>
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
              required
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
            />
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default AddPost;
