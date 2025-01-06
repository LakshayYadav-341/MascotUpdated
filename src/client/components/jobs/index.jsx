import React, { useState } from "react";
import jobHuntImg from "../../assets/images/job-hunt.svg";
import { useGetter } from "@client/hooks/fetcher.js";
import urls, { serverPath, basePath } from "../../../utils/urls";
import { Autocomplete, Chip, IconButton, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { selectSession } from "../auth/authSlice";
import styles from "./styles.module.scss";
import tempImage from "@client/assets/images/profile.png";
import { toast } from "react-toastify";
import SendIcon from '@mui/icons-material/Send';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const INITIAL_FORM = {
  title: "",
  company: "",
  description: "",
  endsAt: "",
  experienceYears: ""
};

const JobContainer = () => {
  const navigate = useNavigate();
  const session = useSelector(selectSession);

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [company, setCompany] = useState("");
  const [currentSkills, setCurrentSkills] = useState([]);
  const [changedSkill, setChangedSkill] = useState("");

  // API URLs
  const profileUrl = session?.user ? basePath + urls.user.profile.get.replace(':id', session.user) : null;
  const companyUrl = basePath + urls.company.findAll;
  const jobGetUrl = basePath + urls.job.findAll;

  // Data Fetching
  const { data: tempUser } = useGetter(profileUrl, { enabled: !!profileUrl });
  const { data: companyData } = useGetter(companyUrl);
  const { data: jobData, mutate: jobMutate } = useGetter(jobGetUrl);
  const { data: skillsData } = useGetter(basePath + urls.skills);

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleChangeFormData = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateCompany = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        company,
        skills: currentSkills.map(skill => skill._id)
      };

      const res = await axios.post(basePath + urls.job.create, data, {
        headers: {
          authorization: `Bearer ${session?.token}`
        }
      });

      if (res?.status === 200) {
        setFormData(INITIAL_FORM);
        setCompany("");
        setCurrentSkills([]);
        toast.success("Job Posted Successfully");
        jobMutate();
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const renderJobPost = () => (
    <div className="card">
      <div style={{fontSize: '20px' , textDecoration: 'none' }}>
        <h4 style={{ }}>Checkout the referrals posted by you.</h4>
        <Link to={`/userJob/${session?.user}`} className="linkStyle">My Referrals</Link>
      </div>
      <hr />
      <h3 style={{ textAlign: "left" }}>Create Referral</h3>
      <form className="jobForm">
        <label className="jobLabel" htmlFor="job-title">Title</label>
        <input
          className="jobInput"
          type="text"
          id="job-title"
          name="title"
          required
          onChange={handleChangeFormData}
          value={formData.title}
        />

        <label className="jobLabel" htmlFor="company-name">Company Name</label>
        <Autocomplete
          sx={{
            bgcolor: "white",
            "& .MuiOutlinedInput-root.Mui-focused": {
              color: "black",
              borderColor: "black",
            },
            "& .MuiOutlinedInput-root": {
              color: "black",
            },
            "& .MuiInputLabel-outlined.Mui-focused": {
              color: "black",
            },
            "& .MuiInputLabel-outlined": {
              color: "black",
            },
          }}
          freeSolo
          options={companyData?.data?.map((company) => company.name) || []}
          renderInput={(params) => (
            <TextField
              {...params}
              name="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          )}
          onChange={(_, value) => setCompany(value)}
          value={company}
        />

        <label className="jobLabel" htmlFor="job-description">Description</label>
        <textarea
          className="jobInput"
          id="job-description"
          name="description"
          required
          onChange={handleChangeFormData}
          value={formData.description}
        />

        <label className="jobLabel" htmlFor="job-skills">Skills</label>
        <Autocomplete
          sx={{
            bgcolor: "white",
            "& .MuiOutlinedInput-root.Mui-focused": {
              color: "black",
              borderColor: "black",
            },
            "& .MuiInputLabel-outlined.Mui-focused": {
              color: "black",
            },
          }}
          freeSolo
          options={
            skillsData?.data?.filter((skill) => !currentSkills.map((e) => e?._id)?.includes(skill?._id))?.map((e) => e?.name) || []
          }
          renderInput={(params) => <TextField {...params} />}
          value={changedSkill}
          onChange={(_, value, reason) => {
            if (reason === "clear") {
              setChangedSkill("");
              return;
            }
            const selectedSkill = skillsData?.data?.find((k) => k.name === value);
            if (selectedSkill && !currentSkills.some(s => s._id === selectedSkill._id)) {
              setCurrentSkills(prev => [...prev, selectedSkill]);
            }
            setChangedSkill("");
          }}
        />
        <div className={styles.changedSkillContainer}>
          {currentSkills.map((skill, i) => (
            <Chip
              key={i}
              label={skillsData?.data?.find((k) => k._id === skill._id)?.name}
              variant="outlined"
              onDelete={() => {
                setCurrentSkills(prev => prev.filter((_, index) => index !== i));
              }}
            />
          ))}
        </div>

        <label className="jobLabel" htmlFor="job-location">Apply Before</label>
        <input
          className="jobInput"
          type="date"
          id="job-location"
          name="endsAt"
          required
          onChange={handleChangeFormData}
          value={formData.endsAt}
        />

        <label className="jobLabel" htmlFor="job-salary">Experience in Years</label>
        <input
          className="jobInput"
          type="number"
          id="job-salary"
          name="experienceYears"
          required
          onChange={handleChangeFormData}
          value={formData.experienceYears}
        />

        <button
          className="submitButton"
          style={{ width: "100%" }}
          onClick={handleCreateCompany}
        >
          Post Job
        </button>
      </form>
    </div>
  );

  const renderJobList = () => {
    if (!jobData?.length) {
      return <div style={{ textAlign: "center", margin: "auto 0" }}><h1>No Referral Opportunity. Please visit later. </h1></div>;
    }

    return (
      <div className="card job-card-container">
        <div className="container-title">
          <div style={{ fontSize: "18px", fontWeight: 600, color: "white" }}>
            Referrals, recommended for you
          </div>
        </div>
        {jobData.map((job) => (
          <div className="card" style={{ display: "flex", flexDirection: "column", boxShadow: "1px 1px 20px 0px black" }} key={job._id}>
            <div className="userProfile">
              <div className="profileImgPost">
                <img src={job?.from?.profilePhoto ? serverPath + job.from.profilePhoto : tempImage} alt="profileImg" />
              </div>
              <div className="userInfo">
                <h5>{job.from.name.first} {job.from.name.last}</h5>
                <p>{job.from.bio}</p>
              </div>
            </div>
            <div className="company-info">
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <div style={{ color: "white", fontSize: "18px", fontWeight: 450 }} className="job-name">
                  {job.title} ({job.description})
                </div>
              </div>
              <div className="company-name">
                At <span style={{ fontWeight: "bold" }}>{job.company.name}</span>
              </div>
              <div>Skills Required: {job?.skills.map((skill, i) => (
                <Chip variant="outlined" key={i} label={skill?.name} />
              ))}</div>
              <div className="posted-time">Experience Years: {job.experienceYears}</div>
              <div className="posted-time">Apply Before: {formatDate(job.endsAt)}</div>
              <IconButton
                sx={{ position: "absolute", bottom: "0.5rem", right: "1rem" }}
                onClick={() => navigate(`/chat?userId=${job?.from?._id}`)}
              >
                <SendIcon sx={{ color: "#3297d1", fontSize: "2rem" }} />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderJobGuidance = () => (
    <div className="card job-helper">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: "24px", fontWeight: 500, color: "white" }}>
          Job Seeker Guidance
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px", fontSize: "18px", color: "#cacaca" }}>
        <img src={jobHuntImg} width="80%" alt="job-hunt" style={{ paddingLeft: "10%" }} />
        <div>
          Job postings are shared by alumni who have referral opportunities. You can view the job description to determine if it aligns with your needs and interests.
        </div>
        <hr />
        If you're interested in a position, feel free to reach out to the alumni directly through chat and inquire about a referral.
      </div>
    </div>
  );

  const isAlumni = tempUser?.data?.role === "alumni";

  return (
    <main className="job-container">
      <div className="container-main">
        {isAlumni ? renderJobPost() : renderJobList()}
      </div>
      <div className="container-right">
        {!isAlumni ? renderJobGuidance() : renderJobList()}
      </div>
    </main>
  );
};

export default JobContainer;