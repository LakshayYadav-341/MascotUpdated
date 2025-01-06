import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Stack, Alert } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { createUserAsync, selectUserCreated, resetUserCreationState } from '../auth/authSlice';
import classes from "./styles.module.scss";

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
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          className={classes.box}
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h4">
            Get Started With Mascot
          </Typography>
          {submitError && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {submitError}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2, color: 'white' }}>
            <Stack direction={'row'} spacing={8}>
              <Box sx={{ bgcolor: 'primary.dark', padding: '1rem', borderRadius: '10px', boxShadow: '-4px 4px 5px 1px black' }}>
                <Stack direction={'column'}>
                  <Typography component="h1" variant="h5">
                    Personal Details
                  </Typography>
                  <Stack sx={{ mt: 2 }} direction={'row'} spacing={2}>
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
                      sx={{
                        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white"
                        },
                        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
                          color: "white"
                        },
                        "& .MuiInputLabel-outlined.Mui-focused": {
                          color: "white"
                        },
                        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white"
                        },
                        "& .MuiFormHelperText-root": {
                          color: "#f44336"
                        }
                      }}
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
                      sx={{
                        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white"
                        },
                        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
                          color: "white"
                        },
                        "& .MuiInputLabel-outlined.Mui-focused": {
                          color: "white"
                        },
                        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white"
                        },
                        "& .MuiFormHelperText-root": {
                          color: "#f44336"
                        }
                      }}
                    />
                  </Stack>
                  <Stack sx={{ mt: 2 }} direction={'row'} spacing={2}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="dob"
                      label="Date of Birth"
                      id="dob"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.dob}
                      helperText={errors.dob}
                      sx={{
                        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white"
                        },
                        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
                          color: "white"
                        },
                        "& .MuiInputLabel-outlined.Mui-focused": {
                          color: "white"
                        },
                        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white"
                        },
                        "& .MuiFormHelperText-root": {
                          color: "#f44336"
                        }
                      }}
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
                      sx={{
                        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white"
                        },
                        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
                          color: "white"
                        },
                        "& .MuiInputLabel-outlined.Mui-focused": {
                          color: "white"
                        },
                        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white"
                        },
                        "& .MuiFormHelperText-root": {
                          color: "#f44336"
                        }
                      }}
                    />
                  </Stack>
                  <Stack sx={{ mt: 2 }} direction={'row'} spacing={2}>
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
                      sx={{
                        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white"
                        },
                        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
                          color: "white"
                        },
                        "& .MuiInputLabel-outlined.Mui-focused": {
                          color: "white"
                        },
                        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white"
                        },
                        "& .MuiFormHelperText-root": {
                          color: "#f44336"
                        }
                      }}
                    />
                  </Stack>
                  <Stack sx={{ mt: 2 }} direction={'row'} spacing={2}>
                    <TextField
                      type='file'
                      margin="normal"
                      required
                      fullWidth
                      name="profilePhoto"
                      id="profileImageUrl"
                      error={!!errors.profilePhoto}
                      helperText={errors.profilePhoto}
                      sx={{
                        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white"
                        },
                        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
                          color: "white"
                        },
                        "& .MuiInputLabel-outlined.Mui-focused": {
                          color: "white"
                        },
                        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white"
                        },
                        "& .MuiFormHelperText-root": {
                          color: "#f44336"
                        }
                      }}
                      inputProps={{
                        accept: "image/*"
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
              sx={{
                mt: 3, 
                mb: 2, 
                "&.MuiButton-root:hover": {
                  borderColor: '#1565c0',
                  bgcolor: '#1565c0',
                },
              }}
            >
              {loading ? 'Creating Account...' : 'Submit'}
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}