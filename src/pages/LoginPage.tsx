import { FC, useRef } from "react";
import "../styles/LoginPageStyle.css";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as interfaceConstants from '../utils/interface-constants';
import * as apiConstants from '../utils/api-constants';
import * as navigatorConstants from '../utils/navigator-constants';
import { AuthenticationResultDTO } from "../models/AuthenticationResultDTO";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const theme = createTheme();

export const LoginPage: FC = () => {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (emailRef.current?.value == null || emailRef.current?.value == undefined || emailRef.current?.value == "" ||
      passwordRef.current?.value == null || passwordRef.current?.value == undefined || passwordRef.current?.value == "") {
      toast.error(interfaceConstants.errorEmptyFieldsLogin, {
        position: "top-right",
        duration: 3000
      });
      return;
    }
    fetch(`${apiConstants.baseUrl}${apiConstants.login}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
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
      <div className="login-component">
        <ThemeProvider theme={theme}>
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
                {interfaceConstants.loginButton}
              </Typography>
              <Box component="div">
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  InputProps={{ autoComplete: 'off' }}
                  autoFocus
                  inputRef={emailRef}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  InputProps={{ autoComplete: 'off' }}
                  inputRef={passwordRef}
                />
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleSubmit}
                >
                  {interfaceConstants.loginButton}
                </Button>
                <Grid container style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                  <Grid item>
                    <p style={{color: "#1976D2", fontSize: "95%", textDecoration: "underline", cursor: "pointer"}} onClick={() => navigate(navigatorConstants.SignUp)}>{interfaceConstants.missingAccount}</p>
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