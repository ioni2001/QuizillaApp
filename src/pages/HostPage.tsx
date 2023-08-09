import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as apiConstants from '../utils/api-constants';
import { Room } from "../models/Room";
import toast from "react-hot-toast";
import "../styles/HostPageStyle.css";
import PersonIcon from '@mui/icons-material/Person';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from "@mui/material";
import * as interfaceConstants from '../utils/interface-constants';
import * as signalR from '@microsoft/signalr';
import { connect } from "http2";
import { Player } from "../models/Player";
import { RoomState } from "../models/RoomState";
import { StartQuizTimer } from "../components/StartQuizTimer";
import { TimerComponent } from "../components/TimerComponent";
import { Question } from "../models/Question";
import { QuestionTextComponent } from "../components/QuestionTextComponent";
import { AnswerComponent } from "../components/AnswerComponent";
import * as navigatorConstants from '../utils/navigator-constants';

export const HostPage: FC = () => {

    const { roomId } = useParams();
    const [room, setRoom] = useState<Room>();
    const [players, setPlayers] = useState<Player[]>([]);
    const [index, setIndex] = useState<number>(0);
    const [roomState, setRoomState] = useState<RoomState>(RoomState.Waiting);
    const [showStartQuizTimer, setShowQuizTimer] = useState<boolean>(true);
    const [currentQuestion, setCurrentQuestion] = useState<Question>();
    const [counter, setCounter] = useState<number>();
    const [reveal, setReveal] = useState<boolean>(false);
    const [shouldClassmentAppear, setShouldClassmentAppear] = useState<boolean>(false);
    const [sortedPlayers, setSortedPlayers] = useState<Player[]>([]);
    const navigate = useNavigate();

    const [connection, setConnection] = useState<signalR.HubConnection>(new signalR.HubConnectionBuilder()
        .withUrl(apiConstants.signalRConnection)
        .withAutomaticReconnect()
        .build());

    useEffect(() => {
        fetch(`${apiConstants.baseUrl}${apiConstants.getRoom}/${roomId}`, {
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
                setRoom(response);
            })
            .catch((error) => {
                toast.error(error, {
                    position: "top-right",
                    duration: 3000
                });
            });
        if (connection.state === signalR.HubConnectionState.Disconnected) {
            connection.start()
                .then(async () => {
                    await connection.invoke(apiConstants.signalRJoinRoom, roomId, "");
                    connection.on(apiConstants.signalRSendPlayers, async (message) => {
                        if (message) {
                            setPlayers(message.$values);
                        }
                        else {
                            setPlayers([]);
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
                });
        }

    }, []);

    const handleStartQuizBtnClicked = async () => {
        await connection.invoke(apiConstants.signalRUpdateStateQuiz, roomId, RoomState.Started);
        setRoomState(RoomState.Started);
    }

    const sendSortedPlayers = async () => {
        await connection.invoke(apiConstants.signalRSortedPlayers, roomId);
    }

    const sendQuestion = async () => {
        await connection.invoke(apiConstants.signalRSendQuestion, roomId, room?.quiz.questions.at(index));
        setCurrentQuestion(room?.quiz.questions.at(index));
        setCounter(room?.quiz.questions.at(index)?.time);
        setIndex(index + 1);
        setShowQuizTimer(false);
        setShouldClassmentAppear(false);
        setReveal(false);
    }

    const sendFinishMessage = async () => {
        await connection.invoke(apiConstants.signalRSendFinishMessage, roomId, RoomState.Finished);
        navigate(navigatorConstants.QuizPage);
    }

    if (roomState == RoomState.Waiting) {
        return (
            <div className="root-hostpage">
                <div className="paragraph-host-wrapper">
                    <p className="paragraph-host-title">
                        {room?.quiz.title}
                    </p>
                    <p className="paragraph-host-pin">
                        {interfaceConstants.gamePin}{room?.pin}
                    </p>
                </div>
                <div className="hostpage-content-wrapper">
                    <div className="hostpage-nrplayers-wrapper">
                        <PersonIcon fontSize="large" />
                        <p className="paragraph-host-nrplayers">{players.length}</p>
                    </div>
                    <div>
                        <TableContainer sx={{ backgroundColor: "rgba(242, 242, 242, 0.7)", borderRadius: "30px", borderColor: "#fc4a1a", borderWidth: "5px", borderStyle: "solid", boxShadow: "rgb(36, 247, 29) 0px 20px 55px, rgba(255, 255, 255, 0.12) 0px -12px 30px, rgba(255, 255, 255, 0.12) 0px 4px 6px, rgba(255, 255, 255, 0.17) 0px 12px 13px, rgba(255, 255, 255, 0.295) 0px -3px 5px" }} component={Paper}>
                            <Table sx={{ minWidth: 300 }} aria-label="simple table">
                                <TableHead sx={{ display: "flex", justifyContent: "center" }}>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {players.map((player) => (
                                        <TableRow
                                            key={player.connectionId}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, display: "flex", justifyContent: "center" }}
                                        >
                                            <TableCell component="th" scope="row" style={{ fontSize: '35px', display: "flex", justifyContent: "center", flexDirection: "row" }}>
                                                <PersonIcon style={{ marginTop: "8px" }} fontSize="large"></PersonIcon>
                                                {player.name}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    <div style={{ marginTop: "3%", marginRight: "1%" }}>
                        <Button variant="contained" color="success" onClick={() => {
                            handleStartQuizBtnClicked();
                            setTimeout(() => {
                                sendQuestion();
                            }, 5000);
                        }}
                        >{interfaceConstants.startQuizButton}</Button>
                    </div>
                </div>
            </div>
        );
    }
    if (roomState == RoomState.Started) {
        return (
            <div className="root-hostpage-started">
                {showStartQuizTimer && <StartQuizTimer secondsRemained={3}></StartQuizTimer>}
                {!showStartQuizTimer && !shouldClassmentAppear &&
                    <div className="hostpage-components-wrapper">
                        <TimerComponent
                            props={counter!}
                            setIsTimeUp={() => {
                                setReveal(true);
                                const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
                                async function makeCalls() {
                                    await delay(6000);
                                    sendSortedPlayers();
                                    if (index < room?.quiz.questions.length!) {
                                        await delay(9000);
                                        sendQuestion();
                                    } else {
                                        await delay(9000);
                                        sendFinishMessage();
                                    }
                                }

                                makeCalls();
                            }}
                            setProps={setCounter}
                        />
                        <QuestionTextComponent props={currentQuestion?.text!} />
                        <AnswerComponent question={currentQuestion!} revealAnswer={reveal} shouldAppear={true} isHostView={true} />
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
                                        <TableCell>Score</TableCell>
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
        <div></div>
    );

} 