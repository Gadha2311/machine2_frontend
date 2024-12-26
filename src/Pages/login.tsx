import React, { useState } from "react";
import {
  Avatar,
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Grid,
  Grid2,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import useLogin from "../hooks/useLogin";

const LoginPage: React.FC = () => {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const { loginUser, } = useLogin();

  const handleSubmit = async (event: React.FormEvent) => {
    const { email, password } = formValues;
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    try {
      await loginUser({ ...formValues });
      setFormValues({
        email: "",
        password: "",
      });
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred");
    }
    console.log("Login form submitted:", { email, password });
  };

  return (
    <Container component="main" maxWidth="md" sx={{ ml: 20, mb: 2 }}>
      <Box
        sx={{
          marginLeft: 60,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formValues.email}
            onChange={(e) =>
              setFormValues({ ...formValues, [e.target.name]: e.target.value })
            }
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={formValues.password}
            onChange={(e) =>
              setFormValues({ ...formValues, [e.target.name]: e.target.value })
            }
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid2 container spacing={2}>
            
            <Grid xs={6} display="flex" justifyContent="flex-end">
              <Button href="/signup" variant="text" size="small">
                {"Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid2>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
