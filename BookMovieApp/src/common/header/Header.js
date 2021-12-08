import React, { useState, useContext } from 'react';
import Modal from 'react-modal';
import './Header.css';
import logo from '../../assets/logo.svg';
import Button from "@material-ui/core/Button";
import { Tab, Tabs, Box, FormControl, InputLabel, FormHelperText } from '@material-ui/core';
import { UserContext } from '../../UserContext';
import { useHistory, useLocation } from 'react-router-dom';
import { Input } from '@material-ui/core';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return <div {...other}>{value === index && <Box p={3}>{children}</Box>}</div>;
}


export default function Header({ baseUrl }) {

    const location = useLocation();
    const movieId = location.pathname.split("/")[2];



    const [modalIsOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState(0);
    const [userName, setUserName] = useState("");
    const [reqUserName, setReqUserName] = useState("dispNone");
    const [password, setPassword] = useState("");
    const [reqPassword, setReqPassword] = useState("dispNone");
    const [reqFirstName, setReqFirstName] = useState("dispNone");
    const [reqLastName, setReqLastName] = useState("dispNone");
    const [reqEmailAddress, setReqEmailAddress] = useState("dispNone");
    const [reqRegPassword, setReqRegPassword] = useState("dispNone");
    const [reqMobileNumber, setReqMobileNumber] = useState("dispNone");

    const [registration, setRegistration] = useState({
        "email_address": "",
        "first_name": "",
        "last_name": "",
        "mobile_number": "",
        "password": ""
    });
    const [registrationSuccess, setRegistrationSuccess] = useState("");
    const [userInfo, setUserInfo] = useState({ "id": "", "first_name": "", "last_name": "", "email_address": "", "mobile_phone": "", "status": "", "last_login_time": "", "role": { "id": 0, "name": "", "permissions": [] } });
    const [state, dispatch] = useContext(UserContext);
    const history = useHistory();

    /*
    * handleChange is used to capture and set Tab selection state 
    */
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    /*
    * handleRegistrationChange is used to capture Registration input field changes and set in the state
    */
    const handleRegistrationChange = (event) => {
        setRegistration({ ...registration, [event.target.name]: event.target.value });
    }

    /*
    * openModalButtonHandler is used to open Modal popup
    */
    const openModalButtonHandler = () => {
        setIsOpen(true);
    }

    /*
    * closeModalButtonHandler is used to close Modal popup
    */
    const closeModalButtonHandler = () => {
        setIsOpen(false);
    }

    /*
    * logoutButtonHandler is used to Logout user if logged in
    */
    const logoutButtonHandler = () => {
        dispatch({ type: "ACCESS_TOKEN", payLoad: "" });
        setUserName("");
        setPassword("");
    }

    /*
    * bookShowButtonHandler is used to navigate user to bookshow page
    */
    const bookShowButtonHandler = () => {
        if (state.accessToken) {
            history.push(`/bookshow/${movieId}`);
        } else {
            openModalButtonHandler();
        }
    }

    /*
    * loginButtonHandler is used to call auth/login and navigate user accordingly
    */
    const loginButtonHandler = () => {

        userName === "" ? setReqUserName("dispBlock") : setReqUserName("dispNone");
        userName === "" ? setReqPassword("dispBlock") : setReqPassword("dispNone");
        if (
            userName === "" ||
            userName === ""
        ) {
            return;
        }
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${userName}:${password}`)
            }
        };
        fetch(`${baseUrl}auth/login`, requestOptions)
            .then(response => {
                const token = response.headers.get("access-token");
                dispatch({ type: "ACCESS_TOKEN", payLoad: token });
                return response.json();
            })
            .then((data) => {
                setUserInfo({ ...userInfo, ...data });
                closeModalButtonHandler();
                if (data.id) {
                    history.push("/");
                }

            });
    }

    /*
    * registerButtonHandler is used to call v1/signup and register user and show success/failure message
    */
    const registerButtonHandler = () => {
        setRegistrationSuccess("");

        registration.first_name === "" ? setReqFirstName("dispBlock") : setReqFirstName("dispNone");
        registration.last_name === "" ? setReqLastName("dispBlock") : setReqLastName("dispNone");
        registration.email_address === "" ? setReqEmailAddress("dispBlock") : setReqEmailAddress("dispNone");
        registration.password === "" ? setReqRegPassword("dispBlock") : setReqRegPassword("dispNone");
        registration.mobile_number === "" ? setReqMobileNumber("dispBlock") : setReqMobileNumber("dispNone");
        
        if (
            registration.first_name === "" ||
            registration.last_name === "" ||
            registration.email_address === "" ||
            registration.password === "" ||
            registration.mobile_number === ""
          ) {
            return;
          }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registration)
        }
        fetch(`${baseUrl}signup`, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error("Error During Registration");
                }
            }
            )
            .then(data => {

                setRegistrationSuccess("Registration Successful. Please Login!");
                return data;
            })
            .catch(error => {
                setRegistrationSuccess("Registration Failed!");

            }
            );
    }




    return (
        <div id="header">

            <div className="logo">
                <img alt="" src={logo} />
            </div>

            {(state.accessToken) ?
                <div className="loginLogout">
                    <Button variant="contained" onClick={logoutButtonHandler}>Logout</Button>
                </div>
                :
                <div className="loginLogout">
                    <Button variant="contained" onClick={openModalButtonHandler}>Login</Button>
                </div>
            }

            {movieId &&
                <div className="bookMyShow padding10" >
                    <Button variant="contained" color="primary" onClick={bookShowButtonHandler}>Book Show</Button>
                </div>
            }

            
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModalButtonHandler}
                style={customStyles}
                contentLabel="Example Modal"
                ariaHideApp={false}

            >
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="LOGIN" />
                    <Tab label="REGISTER" />
                </Tabs>

                <TabPanel value={value} index={0}>
                    <div className="alignCenter mtop10">
                    <FormControl required className="formControlh">
                        <InputLabel htmlFor="userName">
                            Username
                        </InputLabel>
                        <Input
                            id="userName"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                        <FormHelperText className={reqUserName}>
                            <span className="red">Required</span>
                        </FormHelperText>
                    </FormControl>
                    </div>
                    <div className="alignCenter mtop10">
                    <FormControl required className="formControlh">
                        <InputLabel htmlFor="password">
                            Password
                        </InputLabel>
                        <Input
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <FormHelperText className={reqPassword}>
                            <span className="red">Required</span>
                        </FormHelperText>
                    </FormControl>
                    </div>
                    <div className="alignCenter mtop10">
                        <Button type="submit" variant="contained" color="primary" onClick={loginButtonHandler}>LOGIN</Button>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <div className="alignCenter mtop10">
                    <FormControl required className="formControlh">
                        <InputLabel htmlFor="first_name">
                            First Name
                        </InputLabel>
                        <Input
                            id="first_name"
                            name="first_name"
                            value={registration.first_name}
                            onChange={handleRegistrationChange}
                        />
                        <FormHelperText className={reqFirstName}>
                            <span className="red">Required</span>
                        </FormHelperText>
                    </FormControl>
                    </div>
                    <div className="alignCenter mtop10">
                    <FormControl required className="formControlh">
                        <InputLabel htmlFor="last_name">
                            Last Name
                        </InputLabel>
                        <Input
                            id="last_name"
                            name="last_name"
                            value={registration.last_name}
                            onChange={handleRegistrationChange}
                        />
                        <FormHelperText className={reqLastName}>
                            <span className="red">Required</span>
                        </FormHelperText>
                    </FormControl>
                    </div>
                    <div className="alignCenter mtop10">
                    <FormControl required className="formControlh">
                        <InputLabel htmlFor="email_address">
                            Email
                        </InputLabel>
                        <Input
                            id="email_address"
                            name="email_address"
                            value={registration.email_address}
                            onChange={handleRegistrationChange}
                        />
                        <FormHelperText className={reqEmailAddress}>
                            <span className="red">Required</span>
                        </FormHelperText>
                    </FormControl>
                    </div>
                    <div className="alignCenter mtop10">
                    <FormControl required className="formControlh">
                        <InputLabel htmlFor="password">
                            Password
                        </InputLabel>
                        <Input
                            id="password"
                            name="password"
                            value={registration.password}
                            onChange={handleRegistrationChange}
                        />
                        <FormHelperText className={reqRegPassword}>
                            <span className="red">Required</span>
                        </FormHelperText>
                    </FormControl>
                    </div>
                    <div className="alignCenter mtop10">
                    <FormControl required className="formControlh">
                        <InputLabel htmlFor="mobile_number">
                            Contact No
                        </InputLabel>
                        <Input
                            id="mobile_number"
                            name="mobile_number"
                            value={registration.mobile_number}
                            onChange={handleRegistrationChange}
                        />
                        <FormHelperText className={reqMobileNumber}>
                            <span className="red">Required</span>
                        </FormHelperText>
                    </FormControl>
                    </div>
                    <div className="alignCenter mtop10">{registrationSuccess}</div>
                    <div className="alignCenter mtop10">
                        <Button type="submit" variant="contained" color="primary" onClick={registerButtonHandler}>REGISTER</Button>
                    </div>

                </TabPanel>
            </Modal>
        </div>


    )
}

