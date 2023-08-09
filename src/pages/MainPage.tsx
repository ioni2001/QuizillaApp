import { FC, useRef } from "react";
import "../styles/MainPageStyle.css";
import Button from '@mui/material/Button';
import * as interfaceConstants from '../utils/interface-constants';
import * as navigatorConstants from '../utils/navigator-constants';
import * as apiConstants from '../utils/api-constants';
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";

export const MainPage: FC = () => {

    const navigate = useNavigate();
     const pinRef = useRef<HTMLInputElement | null>(null);
     const handleNumericKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (!/[0-9]/.test(event.key)) {
          event.preventDefault();
        }
      }

      const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        const pastedText = event.clipboardData.getData('Text');
        if (!/^\d*$/.test(pastedText)) {
          event.preventDefault();
        }
      }

      const handleJoinBtnClicked = () => {
        if(pinRef.current?.value === null || pinRef.current?.value === undefined ||
            pinRef.current?.value === "" || pinRef.current?.value.length < 6){
                toast.error(interfaceConstants.pinError, {
                    position: "top-center",
                    duration: 3000
                  });
                return;  
            }
            fetch(`${apiConstants.baseUrl}${apiConstants.getRoomByPin}/${pinRef.current.value}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
                .then((response) => {
                    if (response.status == 200) {
                        return response.json();
                    }
                })
                .then((response) => {
                    navigate(navigatorConstants.PlayQuizPage + "/" + response.id);
                })
                .catch((error) => {
                    toast.error(error, {
                        position: "top-right",
                        duration: 3000
                    });
                });
        }  


    return (
        <div>
            <Toaster />
            <div className="header-buttons">
                <div className="header-buttons-wrapper">
                    <Button style={{ backgroundColor: "#2864DD" }} variant="contained" onClick={() => navigate(navigatorConstants.Login)}>{interfaceConstants.loginButton}</Button>
                    <Button style={{ backgroundColor: "#2864DD" }} variant="contained" onClick={() => navigate(navigatorConstants.SignUp)}>{interfaceConstants.signupButton}</Button>
                </div>
            </div>
            <div className="name-paragraph">
                <p>
                    {interfaceConstants.quizilla}
                </p>
            </div>
            <div className="enter-pin-wrapper">
                <TextField sx={{width: "50%", marginLeft: "30%", marginTop: "7%"}} variant="standard"
                id="pin"
                label="Enter Pin"
                name="pin"
                inputRef={pinRef}
                inputProps={{ maxLength: 6, typeof: 'number' }}
                InputProps={{
                    disableUnderline: true,
                    style: {fontSize: 20}
                  }}
                  onKeyPress={handleNumericKeyPress}
                  onPaste={handlePaste}
                />          
            </div>
            <div style={{width: "100%", display: "flex", justifyContent: "center", marginTop: "2%"}}>
                <Button style={{ backgroundColor: "#2864DD" }} variant="contained" onClick={handleJoinBtnClicked}>{interfaceConstants.join}</Button>
            </div>
        </div>
    );
}