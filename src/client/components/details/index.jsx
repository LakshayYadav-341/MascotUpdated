import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Stack, Alert } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { createUserAsync, selectUserCreated, resetUserCreationState } from '../auth/authSlice';

export default function Details(props) {
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const isUserCreated = useSelector(selectUserCreated);
  const dispatch = useDispatch();

  const validateForm = (formData) => {
    const newErrors = {};

    // First Name validation
    const firstName = formData.get('name.first');
    if (!firstName) {
      newErrors['firstName'] = 'First name is required';
    } else if (firstName.length < 2) {
      newErrors['firstName'] = 'First name must be at least 2 characters';
    }

    // Last Name validation
    const lastName = formData.get('name.last');
    if (!lastName) {
      newErrors['lastName'] = 'Last name is required';
    } else if (lastName.length < 2) {
      newErrors['lastName'] = 'Last name must be at least 2 characters';
    }

    // Date of Birth validation
    const dob = formData.get('dob');
    if (!dob) {
      newErrors['dob'] = 'Date of birth is required';
    } else {
      const birthDate = new Date(dob);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        newErrors['dob'] = 'You must be at least 13 years old';
      }
    }

    // Phone validation
    const phone = formData.get('phone');
    if (!phone) {
      newErrors['phone'] = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors['phone'] = 'Please enter a valid 10-digit phone number';
    }

    // Bio validation
    const bio = formData.get('bio');
    if (!bio) {
      newErrors['bio'] = 'Bio is required';
    } else if (bio.length < 10) {
      newErrors['bio'] = 'Bio must be at least 10 characters';
    } else if (bio.length > 200) {
      newErrors['bio'] = 'Bio must not exceed 200 characters';
    }

    // Profile Photo validation
    const profilePhoto = formData.get('profilePhoto');
    if (profilePhoto && profilePhoto.size > 0) {
      const fileSize = profilePhoto.size / 1024 / 1024; // in MB
      if (fileSize > 5) {
        newErrors['profilePhoto'] = 'Image size should not exceed 5MB';
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(profilePhoto.type)) {
        newErrors['profilePhoto'] = 'Please upload a valid image file (JPG, PNG)';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});
    setSubmitError('');

    const formData = new FormData(event.currentTarget);
    formData.append("email", props.credential.email);
    formData.append("password", props.credential.password);
    formData.append("role", props.credential.role);

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      await dispatch(createUserAsync(formData));
    } catch (error) {
      setSubmitError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUserCreated) {
      dispatch(resetUserCreationState());
      setCreated(true);
    }
  }, [isUserCreated, dispatch]);

  return (
    <>
      {created && <Navigate to="/signin" replace={true} />}
      <main className="flex justify-center items-center h-full bg-gray-800">
        <div className="bg-gray-700 rounded-lg shadow-md p-8 w-full max-w-md">
          <CssBaseline />
          <Box className="flex flex-col items-center">
            <Avatar className="mb-4 bg-primary.main">
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h4" className="text-gray-300 mb-4">
              Get Started With Mascot
            </Typography>
            {submitError && (
              <Alert severity="error" className="w-full mt-2">
                {submitError}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} noValidate className="w-full mt-2 text-gray-300">
              <Stack direction="row" spacing={8}>
                <Box className="bg-primary.dark p-4 rounded-lg shadow-md w-full">
                  <Stack direction="column">
                    <Typography component="h1" variant="h5" className="text-gray-300">
                      Personal Details
                    </Typography>
                    <Stack className="mt-2" direction="row" spacing={2}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        name="name.first"
                        autoComplete="firstName"
                        autoFocus
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        InputLabelProps={{ className: "text-gray-300" }}
                        InputProps={{ className: "text-gray-300" }}
                        FormHelperTextProps={{ className: "text-red-500" }}
                      />
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="name.last"
                        label="Last Name"
                        id="lastName"
                        autoComplete="lastName"
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                        InputLabelProps={{ className: "text-gray-300" }}
                        InputProps={{ className: "text-gray-300" }}
                        FormHelperTextProps={{ className: "text-red-500" }}
                      />
                    </Stack>
                    <Stack className="mt-2" direction="row" spacing={2}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="dob"
                        label="Date of Birth"
                        id="dob"
                        type="date"
                        InputLabelProps={{ shrink: true, className: "text-gray-300" }}
                        InputProps={{ className: "text-gray-300" }}
                        error={!!errors.dob}
                        helperText={errors.dob}
                        FormHelperTextProps={{ className: "text-red-500" }}
                      />
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="phone"
                        label="Phone Number"
                        id="phoneNumber"
                        type="number"
                        error={!!errors.phone}
                        helperText={errors.phone}
                        InputLabelProps={{ className: "text-gray-300" }}
                        InputProps={{ className: "text-gray-300" }}
                        FormHelperTextProps={{ className: "text-red-500" }}
                      />
                    </Stack>
                    <Stack className="mt-2" direction="row" spacing={2}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="bio"
                        label="Write a brief about your bio"
                        id="userBio"
                        multiline
                        rows={3}
                        error={!!errors.bio}
                        helperText={errors.bio}
                        InputLabelProps={{ className: "text-gray-300" }}
                        InputProps={{ className: "text-gray-300" }}
                        FormHelperTextProps={{ className: "text-red-500" }}
                      />
                    </Stack>
                    <Stack className="mt-2" direction="row" spacing={2}>
                      <TextField
                        type="file"
                        margin="normal"
                        required
                        fullWidth
                        name="profilePhoto"
                        id="profileImageUrl"
                        error={!!errors.profilePhoto}
                        helperText={errors.profilePhoto}
                        InputLabelProps={{ className: "text-gray-300" }}
                        InputProps={{ className: "text-gray-300" }}
                        FormHelperTextProps={{ className: "text-red-500" }}
                        inputProps={{
                          accept: "image/*",
                        }}
                      />
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                className="mt-3 mb-2 bg-primary.main hover:bg-primary.dark text-gray-300"
              >
                {loading ? "Creating Account..." : "Submit"}
              </Button>
            </Box>
          </Box>
        </div>
      </main>
    </>
  );
}