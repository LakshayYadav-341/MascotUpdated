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
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <main className="bg-gray-800 text-gray-300 h-full flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Edit Your Profile</h1>
      <section className="flex flex-col md:flex-row items-center justify-center w-full">
        <div className="md:max-w-[500px] md:max-h-[425px] mb-8 md:mb-0 md:mr-8">
          <img src={ConnectedWorld} alt="connected-world" className="w-full h-auto" />
        </div>
        <div className="bg-gray-700 rounded-lg shadow-md p-6 w-full md:w-1/2">
          {activeStep === 0 ? (
            <form id="detailForm" className="w-full">
              <h2 className="text-2xl font-bold mb-4">Personal Details</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="firstName" className="block mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="bg-gray-800 rounded-md px-3 py-2 w-full text-gray-300 focus:outline-none"
                    name="firstName"
                    placeholder="First Name"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="bg-gray-800 rounded-md px-3 py-2 w-full text-gray-300 focus:outline-none"
                    name="lastName"
                    placeholder="Last Name"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="dob" className="block mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className="bg-gray-800 rounded-md px-3 py-2 w-full text-gray-300 focus:outline-none"
                    name="dob"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="bg-gray-800 rounded-md px-3 py-2 w-full text-gray-300 focus:outline-none"
                    name="phone"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="bio" className="block mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="2"
                  className="bg-gray-800 rounded-md px-3 py-2 w-full text-gray-300 focus:outline-none"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={clickHandler}
                className="bg-blue-500 hover:bg-blue-600 text-gray-300 font-bold py-2 px-4 rounded-md w-full"
                id="detailButton"
              >
                Edit Personal Details
              </button>
            </form>
          ) : null}

          {Object.keys(loggedInUser?.data).includes("profile") && activeStep === 1 ? (
            <form id="detailForm" onSubmit={addressHandler} className="w-full">
              <h2 className="text-2xl font-bold mb-4">Address Details</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    className="bg-gray-800 rounded-md px-3 py-2 w-full text-gray-300 focus:outline-none"
                    name="name"
                    placeholder="Name"
                    value={formData?.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className="bg-gray-800 rounded-md px-3 py-2 w-full text-gray-300 focus:outline-none"
                    name="buildingName"
                    placeholder="Building Name"
                    value={formData?.buildingName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  className="bg-gray-800 rounded-md px-3 py-2 w-full text-gray-300 focus:outline-none"
                  name="line1"
                  placeholder="Address Line 1"
                  value={formData?.line1}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  className="bg-gray-800 rounded-md px-3 py-2 w-full text-gray-300 focus:outline-none"
                  name="line2"
                  placeholder="Address Line 2"
                  value={formData?.line2}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  className="bg-gray-800 rounded-md px-3 py-2 w-full text-gray-300 focus:outline-none"
                  name="street"
                  placeholder="Street name"
                  value={formData?.street}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    className="bg-gray-800 rounded-md px-3 py-2 w-full text-gray-300 focus:outline-none"
                    name="city"
                    placeholder="City"
                    value={formData?.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className="bg-gray-800 rounded-md px-3 py-2 w-full text-gray-300 focus:outline-none"
                    name="state"
                    placeholder="State"
                    value={formData?.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    className="bg-gray-800 rounded-md px-3 py-2 w-full text-gray-300 focus:outline-none"
                    name="country"
                    placeholder="Country"
                    value={formData?.country}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    className="bg-gray-800 rounded-md px-3 py-2 w-full text-gray-300 focus:outline-none"
                    name="pinCode"
                    placeholder="Pin Code"
                    value={formData?.pinCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-gray-300 font-bold py-2 px-4 rounded-md w-full">
                Edit
              </button>
            </form>
          ) : null}
        </div>
      </section>
      {Object.keys(loggedInUser?.data).includes("profile") && (
        <MobileStepper
          variant="progress"
          steps={2}
          position="static"
          activeStep={activeStep}
          className="mt-8 w-full md:w-[500px]"
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === 1}
              className="bg-blue-500 hover:bg-blue-600 text-gray-300"
            >
              Next
              {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
              className="bg-blue-500 hover:bg-blue-600 text-gray-300"
            >
              {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
              Back
            </Button>
          }
        />
      )}
    </main>
  );
};

export default GetUserDetails;
