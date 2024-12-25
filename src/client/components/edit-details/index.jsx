import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Button from '@mui/material/Button';
import MobileStepper from '@mui/material/MobileStepper';
import { useTheme } from '@mui/material/styles';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ConnectedWorld from '../../assets/images/connected-world.png';
import { selectSession, updateLoggedInUserAsync } from '../auth/authSlice';
import { basePath } from '../../../utils/urls';
import { usePutter, useGetter } from '../../hooks/fetcher';
import urls from '../../../utils/urls';
import { toast } from 'react-toastify';

const GetUserDetails = () => {
  const session = useSelector(selectSession)
  const dispatch = useDispatch()

  const { data: updatedUser, trigger: updateUser } = usePutter(basePath + urls.user.update)
  const { data: updatedAddress, trigger: updateAddress } = usePutter(basePath + urls.user.address.update)
  const { data: addressData, mutate: addressMutate } = useGetter(basePath + urls.user.address.get)
  const { data: loggedInUser, mutate: loggedInUserMutate } = useGetter(basePath + urls.user.profile.get.replace(':id', session?.user))

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  const [formData, setFormData] = useState({});

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    setFirstname(loggedInUser?.data?.name.first)
    setLastname(loggedInUser?.data?.name.last)
    setDob(formatDate(loggedInUser?.data?.dob))
    setPhone(loggedInUser?.data?.phone)
    setBio(loggedInUser?.data?.bio)
    setFormData({
      name: addressData?.data.name,
      buildingName: addressData?.data.buildingName,
      line1: addressData?.data.line1,
      line2: addressData?.data.line2,
      street: addressData?.data.street,
      city: addressData?.data.city,
      state: addressData?.data.state,
      country: addressData?.data.country,
      pinCode: addressData?.data.pinCode,
    })
  }, [loggedInUser, addressData])

  const handleInputChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    })
  };

  const clickHandler = async () => {
    const res = await updateUser({
      name: {
        first: firstname,
        last: lastname
      },
      phone,
      bio,
      dob
    })
    if (res?.status === "success") {
      toast.success("Edited Personal Details Successfully")
    }
    else {
      toast.error("Something went wrong!!")
    }
    dispatch(updateLoggedInUserAsync())
  }

  const addressHandler = async (e) => {
    e.preventDefault();
    const res = await updateAddress(formData)
    if (res?.status === "success") {
      toast.success("Address Details Edited Successfully")
    }
    else {
      toast.error("Something went wrong!!")
    }
  }

  // useEffect(() => {
  //   // console.log(updatedUser);
  // }, [updatedUser])

  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <main className="mainFormContainer">
      <h1 style={{ fontSize: "3rem", fontWeight: "600" }}>Edit Your Profile</h1>
      <section className="formSection">
        <div className="formImgContainer" style={{ maxWidth: "500px", maxHeight: "425px" }}>
          <img src={ConnectedWorld} alt="connected-world" />
        </div>
        <div className="formContainer card" style={{ width: "50%" }}>
          {activeStep === 0 ? (
            <form id='detailForm' style={{ width: "100%" }}>
              <h2>Personal Details</h2>
              <div className="twoInput mt-1">
                <div className="">
                  <label htmlFor="">First Name</label>
                  <input
                    type="text"
                    className="firstName mt-1"
                    name="firstName"
                    placeholder="First Name"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                  // style={{ color: '#808080', cursor: 'not-allowed' }}
                  />
                </div>
                <div className="">
                  <label htmlFor="">Last Name</label>
                  <input
                    type="text"
                    className="lastName mt-1"
                    name="lastName"
                    placeholder="Last Name"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                  // style={{ color: '#808080', cursor: 'not-allowed' }}
                  />
                </div>
              </div>
              <div className="twoInput mt-1">
                <div className="">
                  <label htmlFor="">Date of Birth</label>
                  <input
                    type="date"
                    className="dob mt-1"
                    name="dob"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
                <div className="">
                  <label htmlFor="">Phone Number</label>
                  <input
                    type="text"
                    className="profileImage mt-1"
                    name="phone"
                    placeholder="PhoneNumber"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="oneInput mt-2">
                <label htmlFor="">Bio</label>
                <textarea id="bio" name="bio" rows="2" cols="50" value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>
              <button type='button' onClick={clickHandler} className="submitButton mt-2" id="detailButton">
                Edit Personal Details
              </button>
            </form>
          ) : null}

          {Object.keys(loggedInUser?.data).includes("profile") && activeStep === 1 ? (
            <form id="detailForm" onSubmit={addressHandler} style={{ width: "100%" }}>
              <h2>Address Details</h2>
              <div className="twoInput">
                <div className="div">
                  {/* <label htmlFor="name">Name</label> */}
                  <input type="text" name="name" placeholder='Name' id="name" value={formData?.name} onChange={handleInputChange} />
                </div>
                <div className="div">

                  {/* <label htmlFor="buildingName">Building Name</label> */}
                  <input type="text" name="buildingName" placeholder='Building Name' id="buildingName" value={formData?.buildingName} onChange={handleInputChange} />
                </div>
              </div>
              <div className="oneInput">
                {/* <label htmlFor="">Adress Line 1</label> */}
                <input type="text" name="line1" placeholder='Address Line 1' id='line1' value={formData?.line1} onChange={handleInputChange} />
              </div>
              <div className="oneInput">
                {/* <label htmlFor="">Adress Line 2</label> */}
                <input type="text" name="line2" placeholder='Adress Line 2' id='line' value={formData?.line2} onChange={handleInputChange} />
              </div>
              <div className="oneInput">
                {/* <label htmlFor="">Street</label> */}
                <input type="text" name="street" placeholder='Street name' id='street' value={formData?.street} onChange={handleInputChange} />
              </div>
              <div className="twoInput">
                <div className="div">
                  <input type="text" name='city' placeholder='city' id='city' value={formData?.city} onChange={handleInputChange} />
                </div>
                <div className="div">
                  <input type="text" name="state" placeholder='State' id="state" value={formData?.state} onChange={handleInputChange} />
                </div>

              </div>
              <div className="twoInput">
                <div className="div">
                  {/* <label htmlFor="state">State</label> */}
                  <input type="text" name="country" placeholder='country' id="country" value={formData?.country} onChange={handleInputChange} />
                </div>
                <div className="div">

                  {/* <label htmlFor="pinCode">Pin Code</label> */}
                  <input type="number" name="pinCode" placeholder='Pin Code' id="pinCode" value={formData?.pinCode} onChange={handleInputChange} />
                </div>
              </div>
              <button type='submit' className="submitButton mt-2" id="detailButton">
                Edit
              </button>
            </form>
          ) : null}
        </div>
      </section>
      {Object.keys(loggedInUser?.data).includes("profile") && <MobileStepper
        variant="progress"
        steps={2}
        position="static"
        activeStep={activeStep}
        sx={{ width: 500, height: 40 }}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === 1}>
            Next
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Back
          </Button>
        }
      />}
    </main>
  );
};

export default GetUserDetails;
