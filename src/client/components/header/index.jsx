import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { alpha, styled } from "@mui/material/styles";
import * as React from "react";
import logo from "@client/assets/images/banner.png";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import HomeIcon from "@mui/icons-material/Home";
import MailIcon from "@mui/icons-material/Mail";
import MoreIcon from "@mui/icons-material/MoreVert";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import WorkIcon from "@mui/icons-material/Work";

import { useState, useEffect, useRef } from "react";
import classes from "./styles.module.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { selectLoggedInUser, selectSession } from "../auth/authSlice";
import { getAllUsers, getAllJobs } from "../auth/user/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { SearchList } from "./SearchList";
import axios from "axios";
import urls, { basePath } from "../../../utils/urls";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function PrimarySearchAppBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const usersUrl = basePath + urls.user.fetchAll;
  const jobsUrl = basePath + urls.job.findAll;
  const user = useSelector(selectLoggedInUser);
  const session = useSelector(selectSession);

  const [allUsers, setAllUsers] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [input, setInput] = useState("");
  const [blur, setBlur] = useState(false);
  const searchInputRef = useRef(null);

  const placeholder =
    location.pathname === "/chat" ? "Search people to chat" : "Search…";

  const handleDocumentClick = (event) => {
    if (
      searchInputRef.current &&
      !searchInputRef.current.contains(event.target)
    ) {
      setBlur(true);
    }
  };

  useEffect(() => {
    document.body.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.body.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const res = await axios.get(usersUrl, {
          headers: {
            "Content-Type": "application/JSON",
            authorization: `Bearer ${session.token}`,
          },
        });
        dispatch(getAllUsers(res.data.data));
        setAllUsers(res.data.data);
      } catch (error) {
        console.error("Error while fetching data:", error);
      }
    };
    const fetchJobsData = async () => {
      try {
        const res = await axios.get(jobsUrl, {
          headers: {
            "Content-Type": "application/JSON",
            authorization: `Bearer ${session.token}`,
          },
        });
        dispatch(getAllJobs(res.data));
        setAllJobs(res.data);
      } catch (error) {
        console.error("Error while fetching data:", error);
      }
    };
    fetchJobsData();
    fetchUsersData();
  }, []);

  const userNavigation = [
    { name: "My Profile", link: `/profile/${user}` },
    { name: "Sign out", link: "/logout" },
  ];

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {userNavigation.map((item) => (
        <MenuItem
          onClick={handleMenuClose}
          className={classes.profileLinks}
          key={item.name}
        >
          <Link to={item.link}>{item.name}</Link>
        </MenuItem>
      ))}
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <HomeIcon />
        </IconButton>
        <p>Home</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <PeopleAltIcon />
          </Badge>
        </IconButton>
        <p>My Networks</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <WorkIcon />
          </Badge>
        </IconButton>
        <p>Jobs</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const handleChange = (value) => {
    setInput(value);
    const filteredResult =
      location.pathname === "/jobs"
        ? allJobs.filter((job) => {
          return (
            value &&
            job &&
            job.title &&
            job.title.toLowerCase().includes(value.toLowerCase())
          );
        })
        : allUsers.filter((user) => {
          const name = user?.name?.first + " " + user?.name?.last;
          return (
            value &&
            user &&
            user.name &&
            name.toLowerCase().includes(value.toLowerCase())
          );
        });
    setSearchResults(filteredResult);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && location.pathname.includes("/jobs")) {
      navigate(`/jobs-filter-results/${input}`);
      setBlur(true);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {!blur && input && <div className={classes.backdropCreated} />}
      <AppBar position="fixed" className={classes.navbar} sx={{ bgcolor: 'primary.dark' }}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Link to="/home">
              <img src={logo} alt="Logo" className={classes.logoImage} />
            </Link>
          </Typography>
          <Search ref={searchInputRef}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder={placeholder}
              inputProps={{ "aria-label": "search" }}
              value={input}
              onChange={(e) => handleChange(e.target.value)}
              onFocus={() => setBlur(false)}
              onKeyDown={handleKeyDown}
            />
            {!blur && !location.pathname.includes("/jobs") && <SearchList results={searchResults} setSearchResults={setSearchResults} setInput={setInput} setBlur={setBlur} />}
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{ display: { xs: "none", md: "flex" } }}
            className={classes.iconContainer}
          >
            <Link to={'/home'}>
              <IconButton size="large" aria-label="show home" color="inherit">
                <HomeIcon></HomeIcon>
              </IconButton>
            </Link>
            {Object.keys(user).includes("admin") && (
              <Link to={'/dashboard/admin'}>
                <IconButton
                  size="large"
                  aria-label="show 4 new mails"
                  color="inherit"
                >
                  <AdminPanelSettingsIcon />
                </IconButton>
              </Link>
            )}
            <Link to={'/network'}>
              <IconButton
                size="large"
                aria-label="show 4 new connection"
                color="inherit"
              >
                <PeopleAltIcon />
              </IconButton>
            </Link>
            {!Object.keys(user).includes("admin") && (
              <Link to={'/jobs'}>
                <IconButton
                  size="large"
                  aria-label="show 4 new Jobs"
                  color="inherit"
                >
                  <WorkIcon />
                </IconButton>
              </Link>
            )}
            <Link to={'/chat'}>
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
              >
                <MailIcon />
              </IconButton>
            </Link>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
