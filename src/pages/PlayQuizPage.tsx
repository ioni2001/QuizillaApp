import { FC, useEffect, useRef, useState } from "react";
import { RoomState } from "../models/RoomState";
import { Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import * as interfaceConstants from '../utils/interface-constants';
import "../styles/PlayQuizPageStyle.css";
import * as apiConstants from '../utils/api-constants';
import * as signalR from '@microsoft/signalr';
import * as navigatorConstants from '../utils/navigator-constants'
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Player } from "../models/Player";
import { Question } from "../models/Question";
import { StartQuizTimer } from "../components/StartQuizTimer";
import { TimerComponent } from "../components/TimerComponent";
import { QuestionTextComponent } from "../components/QuestionTextComponent";
import { AnswerComponent } from "../components/AnswerComponent";
import { Answer } from "../models/Answer";
import PersonIcon from '@mui/icons-material/Person';


export const PlayQuizPage: FC = () => {
    const [roomState, setRoomState] = useState<RoomState>(RoomState.Waiting);
    const nicknameRef = useRef<HTMLInputElement | null>(null);
    const { roomId } = useParams();
    const [spinnerOn, setSpinnerOn] = useState<boolean>(false);
    //const [player, setPlayer] = useState<Player>();
    const player = useRef<Player | undefined>();
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [counter, setCounter] = useState<number>(0);
    const [reveal, setReveal] = useState<boolean>(false);
    const [shouldClassmentAppear, setShouldClassmentAppear] = useState<boolean>(false);
    const [sortedPlayers, setSortedPlayers] = useState<Player[]>([]);
    const [finalScore, setFinalScore] = useState<number>();
    const [finalPosition, setFinalPosition] = useState<number>();
    const navigate = useNavigate();

    const [connection, setConnection] = useState<signalR.HubConnection>(new signalR.HubConnectionBuilder()
        .withUrl(apiConstants.signalRConnection)
        .withAutomaticReconnect()
        .build());    

    useEffect(() => {
        if (connection.state === signalR.HubConnectionState.Disconnected) {
            connection.start()
                .then(async () => {
                    connection.on(apiConstants.signalRSendPlayersToSpecificConnection, async (message) => {
                        if (message) {
                            // setPlayer({
                            //     connectionId: message.connectionId,
                            //     id: message.id,
                            //     name: message.name,
                            //     score: message.score,
                            //     room: message.room
                            // });
                            player.current = {
                                connectionId: message.connectionId,
                                id: message.id,
                                name: message.name,
                                score: message.score,
                                room: message.room
                            };
                            setSpinnerOn(true);
                        }
                    });
                    connection.on(apiConstants.signalRUpdateStateQuiz, async (message) => {
                        if (message) {
                            setRoomState(message);
                        }
                    })
                    connection.on(apiConstants.signalRSendQuestion, async (message) => {
                        if (message) {
                            let answers: Answer[] = [];
                            message.answers.$values.forEach((answer: any) => {
                                answers.push({
                                    id: answer.id,
                                    isCorect: answer.isCorect,
                                    text: answer.text
                                })
                            });
                            setCurrentQuestion({
                                answers: answers,
                                text: message.text,
                                time: message.time,
                                id: message.id
                            });
                            setCounter(message.time);
                            setShouldClassmentAppear(false);
                            setReveal(false);
                        }
                    });
                    connection.on(apiConstants.signalRSortedPlayers, async (message) => {
                        if (message) {
                            setSortedPlayers(message.$values);
                            setShouldClassmentAppear(true);
                        }
                        else {
                            setSortedPlayers([]);
                            setShouldClassmentAppear(false);
                        }
                    });
                    connection.on(apiConstants.signalRSendFinalRanking, async (message) => {
                        console.log(player);
                        if (message) {
                            await populateFinalScore(message.$values);
                            setRoomState(RoomState.Finished);
                        }
                        else {
                            setSortedPlayers([]);
                        }
                    })
                });
        }
    }, []);

    const populateFinalScore = async (playerArray: Player[]) =>{
        playerArray.forEach((element: any, index: number) => {
            if (element.id == player.current?.id) {
                setFinalPosition(index + 1);
                setFinalScore(element.score);
                return;
            }
        })
    }

    const handleJoinBtnClicked = async () => {
        if (nicknameRef.current?.value === undefined || nicknameRef.current?.value === null
            || nicknameRef.current?.value === "") {
            toast.error("Nickname must be valid!", {
                position: "top-right",
                duration: 3000
            });
            return;
        }
        await connection.invoke(apiConstants.signalRJoinRoom, roomId, nicknameRef.current.value);
    }

    if (roomState === RoomState.Waiting) {
        return (
            <div className="root">
                {!spinnerOn &&
                    <div className="root">
                        <Toaster />
                        <div className="enter-nickname-wrapper">
                            <TextField sx={{ width: "80%", marginLeft: "10%", marginTop: "7%" }} variant="standard"
                                id="nickname"
                                label="Enter Nickname..."
                                name="nickname"
                                inputRef={nicknameRef}
                                InputProps={{
                                    disableUnderline: true,
                                    style: { fontSize: 30 }
                                }}
                            />

                        </div>
                        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "2.5%" }}>
                            <Button style={{ backgroundColor: "#2864DD" }} variant="contained" onClick={handleJoinBtnClicked}>{interfaceConstants.join}</Button>
                        </div>
                    </div>}
                {spinnerOn &&
                    <Box sx={{ display: 'flex', justifyContent: "center", flexDirection: "column" }} >
                        <CircularProgress />
                        <p style={{ fontSize: "20px", color: "#2763da", marginLeft: "-40%" }}>{interfaceConstants.waitingHost}</p>
                    </Box>}
            </div>
        );
    }
    if (roomState === RoomState.Started) {
        return (
            <div className="root">
                {currentQuestion === null && <StartQuizTimer secondsRemained={3}></StartQuizTimer>}
                {currentQuestion !== null && !shouldClassmentAppear &&
                    <div className="hostpage-components-wrapper">
                        <TimerComponent
                            props={counter!}
                            setIsTimeUp={() => {
                                setReveal(true);
                            }}
                            setProps={setCounter}
                        />
                        <QuestionTextComponent props={currentQuestion?.text!} />
                        <AnswerComponent question={currentQuestion!} timer={currentQuestion.time - counter!} revealAnswer={reveal} shouldAppear={true} isHostView={false} guest={player.current} />
                    </div>
                }
                {shouldClassmentAppear &&
                    <div className="hostpage-components-wrapper">
                        <div className="paragraph-host-wrapper">
                            <p className="paragraph-host-title">
                                Leaderboard
                            </p>
                        </div>
                        <TableContainer sx={{ backgroundColor: "rgba(242, 242, 242, 0.7)", borderRadius: "30px", borderColor: "#fc4a1a", borderWidth: "5px", borderStyle: "solid", boxShadow: "rgb(36, 247, 29) 0px 20px 55px, rgba(255, 255, 255, 0.12) 0px -12px 30px, rgba(255, 255, 255, 0.12) 0px 4px 6px, rgba(255, 255, 255, 0.17) 0px 12px 13px, rgba(255, 255, 255, 0.295) 0px -3px 5px" }} component={Paper}>
                            <Table sx={{ minWidth: 300 }} aria-label="simple table">
                                <TableHead sx={{ display: "flex", justifyContent: "center" }}>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ marginLeft: "15px" }}>Score</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sortedPlayers.map((player, index) => (
                                        <TableRow
                                            key={player.connectionId}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, display: "flex", justifyContent: "center" }}
                                        >
                                            <TableCell component="th" scope="row" style={{ fontSize: '35px', display: "flex", justifyContent: "center", flexDirection: "row" }}>
                                                <p style={{ fontSize: "30px", marginTop: "6px" }}>{index + 1}. </p>
                                                {player.name}
                                            </TableCell>
                                            <TableCell component="th" scope="row" style={{ fontSize: '35px', display: "flex", justifyContent: "center", flexDirection: "row" }}>
                                                {player.score}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                }
            </div>
        );
    }
    return (
        <div className="root">
            <div className="paragraph-host-wrapper">
                <p className="paragraph-host-title">
                    Quiz finished
                </p>
                <p className="paragraph-host-title" style={{ fontSize: "80px" }}>
                    Your position is {finalPosition}  with score {finalScore}
                </p>
                {finalPosition! > 1 && <p style={{ fontSize: "30px", color: "white", fontWeight: "bold", fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                    {interfaceConstants.constructiveFeedback}
                </p>
                }
                {finalPosition! == 1 && <p style={{ fontSize: "30px", color: "white", fontWeight: "bold", fontFamily: "Comic Sans MS, cursive, sans-serif"}}>
                    {interfaceConstants.positiveFeedback}
                </p>
                }
            </div>
            <Button style={{ backgroundColor: "#2864DD" }} variant="contained" onClick={() => navigate(navigatorConstants.MainPage)}>{interfaceConstants.exit}</Button>
        </div>
    );

}