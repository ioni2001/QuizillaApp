import { FC, useRef } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as interfaceConstants from '../utils/interface-constants';
import * as apiConstants from '../utils/api-constants';
import * as navigatorConstants from '../utils/navigator-constants';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import '../styles/SignupPageStyle.css';
import { AuthenticationResultDTO } from "../models/AuthenticationResultDTO";

const defaultTheme = createTheme();

export const SigunupPage: FC = () => {
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const firstNameRef = useRef<HTMLInputElement | null>(null);
    const lastNameRef = useRef<HTMLInputElement | null>(null);
    const confirmPasswordRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();

    const handleSubmit = () => {
        if (emailRef.current?.value == null || emailRef.current?.value == undefined || emailRef.current?.value == "" ||
            passwordRef.current?.value == null || passwordRef.current?.value == undefined || passwordRef.current?.value == "" ||
            firstNameRef.current?.value == null || firstNameRef.current?.value == undefined || firstNameRef.current?.value == "" ||
            lastNameRef.current?.value == null || lastNameRef.current?.value == undefined || lastNameRef.current?.value == "") {
            toast.error(interfaceConstants.errorEmptyFieldsSignup, {
                position: "top-right",
                duration: 3000
            });
            return;
        }
        if(passwordRef.current?.value !== confirmPasswordRef.current?.value){
            toast.error(interfaceConstants.confirmPasswordErrorMsg, {
                position: "top-right",
                duration: 3000
            });
            return;
        }
        fetch(`${apiConstants.baseUrl}${apiConstants.signUp}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: emailRef.current.value,
              password: passwordRef.current.value,
              firstName: firstNameRef.current.value,
              lastName: lastNameRef.current.value
            }),
          })
            .then((response) => {
              return response.json();
            })
            .then((response: AuthenticationResultDTO) => {
              if (!response.isSucces) {
                toast.error(response.error, {
                  position: "top-right",
                  duration: 3000
                });
                return;
              }
              navigate(navigatorConstants.QuizPage);
            })
            .catch((error) => {
              toast.error(error, {
                position: "top-right",
                duration: 3000
              });
            });
    }

    return (
        <div className="root">
            <Toaster />
            <div className="signup-component">
                <ThemeProvider theme={defaultTheme}>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <Box
                            sx={{
                                marginTop: 5,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Avatar sx={{ bgcolor: 'secondary.main' }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                {interfaceConstants.signupButton}
                            </Typography>
                            <Box sx={{
                                marginTop: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            name="firstName"
                                            required
                                            fullWidth
                                            id="firstName"
                                            label="First Name"
                                            autoFocus
                                            InputProps={{ autoComplete: 'off' }}
                                            inputRef={firstNameRef}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="lastName"
                                            label="Last Name"
                                            name="lastName"
                                            InputProps={{ autoComplete: 'off' }}
                                            inputRef={lastNameRef}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            InputProps={{ autoComplete: 'off' }}
                                            inputRef={emailRef}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type="password"
                                            id="password"
                                            InputProps={{ autoComplete: 'off' }}
                                            inputRef={passwordRef}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="confirmpassword"
                                            label="Confirm Password"
                                            type="password"
                                            id="confirmpassword"
                                            InputProps={{ autoComplete: 'off' }}
                                            inputRef={confirmPasswordRef}
                                        />
                                    </Grid>
                                </Grid>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    onClick={handleSubmit}
                                >
                                    {interfaceConstants.signupButton}
                                </Button>
                                <Grid>
                                    <Grid item>
                                        <p style={{ color: "#1976D2", fontSize: "95%", textDecoration: "underline", cursor: "pointer" }} onClick={() => navigate(navigatorConstants.Login)}>{interfaceConstants.alreadyHaveAccount}</p>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Container>
                </ThemeProvider>
            </div>
        </div>
    );
}