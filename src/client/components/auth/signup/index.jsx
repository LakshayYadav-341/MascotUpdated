import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import urls, { basePath } from "../../../../utils/urls";
import Details from "../../details";
import classes from "./styles.module.scss";

export default function SignUp() {
  const [credential, setCredential] = useState({});
  const [credentialAdded, setCredentialAdded] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [selectedValue, setSelectedValue] = useState("student");

  const handleEmailBlur = () => {
    setIsEmailValid(email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isEmailValid || email === "") {
      return toast.error("Please enter a valid email address!");
    }

    const data = new FormData(event.currentTarget);
    const password = data.get("password");

    try {
      const res = await axios.get(
        basePath + urls.auth.getUserByEmail.replace(":email", email)
      );

      if (res && res.status === 200) {
        return toast.error("This email has already been taken!");
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setCredential({ email, password, role: selectedValue });
        setCredentialAdded(true);
        return toast.success("Credentials added successfully!");
      } else {
        return toast.error("An unexpected error occurred. Please try again!");
      }
    }
  };

  return (
    <>
      {credentialAdded && <Details credential={credential} />}
      {!credentialAdded && (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            className={classes.box}
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                error={!isEmailValid}
                helperText={!isEmailValid ? "Invalid email address" : ""}
                sx={{
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "white",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input":
                  {
                    color: "white",
                  },
                  "& .MuiInputLabel-outlined.Mui-focused": {
                    color: "white",
                  },
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                sx={{
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "white",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input":
                  {
                    color: "white",
                  },
                  "& .MuiInputLabel-outlined.Mui-focused": {
                    color: "white",
                  },
                  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", paddingTop: "1rem" }}>
                <Typography component="h4" variant="h6">
                  Select your role
                </Typography>
                <FormControlLabel
                  control={<Radio />}
                  label="Student"
                  value="student"
                  checked={selectedValue === "student"}
                  onChange={handleChange}
                />
                <FormControlLabel
                  control={<Radio />}
                  label="Alumni"
                  value="alumni"
                  checked={selectedValue === "alumni"}
                  onChange={handleChange}
                />
                {/* <FormControlLabel
                  control={<Radio />}
                  label="Institute Admin"
                  value="institute"
                  checked={selectedValue === 'institute'}
                  onChange={handleChange}
                />
                <FormControlLabel
                  control={<Radio />}
                  label="Admin"
                  value="admin"
                  checked={selectedValue === 'admin'}
                  onChange={handleChange}
                /> */}
              </div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={!isEmailValid}
                sx={{
                  mt: 3,
                  mb: 2,
                  "&.MuiButton-root:hover": {
                    borderColor: "#1565c0",
                    bgcolor: "#1565c0",
                  },
                }}
              >
                Sign Up
              </Button>
              <Grid container>
                <Grid item>
                  <Link to="/signin">{"Already have an account? Login here"}</Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      )}
    </>
  );
}