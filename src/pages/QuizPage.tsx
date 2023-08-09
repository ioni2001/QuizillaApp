import { FC, useEffect, useRef, useState } from "react";
import { Quiz } from "../models/Quiz";
import LogoutIcon from '@mui/icons-material/Logout';
import * as interfaceConstants from '../utils/interface-constants';
import * as navigatorConstants from '../utils/navigator-constants';
import * as apiConstants from '../utils/api-constants';
import { useNavigate } from "react-router-dom";
import "../styles/QuizPageStyle.css";
import { QuizComponent } from "../components/QuizComponent";
import { Box, IconButton, Tooltip } from '@mui/material';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import toast, { Toaster } from 'react-hot-toast';
import { AreYouSureModal } from "../components/AreYouSureModal";
import CircularProgress from '@mui/material/CircularProgress';

export const QuizPage: FC = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz>();
    const [showCircularProgress, setShowCircularProgress] = useState<boolean>(true);

    useEffect(() => {
        fetch(`${apiConstants.baseUrl}${apiConstants.getUserQuizes}`, {
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
                setQuizzes(response);
                const timer = setTimeout(() => {
                    scrollToBottom();
                    setShowCircularProgress(false);
                }, 100);
                return () => clearTimeout(timer);
            })
            .catch((error) => {
                toast.error(error, {
                    position: "top-right",
                    duration: 3000
                });
            });
    }, []);

    const scrollToBottom = () => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleLogoutBtn = () => {
        fetch(`${apiConstants.baseUrl}${apiConstants.logout}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then((response) => {
                if (response.status == 200) {
                    navigate(navigatorConstants.MainPage);
                }
            })
            .catch((error) => {
                toast.error(error, {
                    position: "top-right",
                    duration: 3000
                });
            });
    }

    const updateQuizList = () => {
        const updatedList = quizzes.filter((quiz) => {
            return quiz.id !== selectedQuiz?.id
        });
        setQuizzes(updatedList);
    }

    const handleDeleteBtnClicked = () => {
        fetch(`${apiConstants.baseUrl}${apiConstants.deleteQuiz}/${selectedQuiz?.id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then((response) => {
                if (response.status == 200) {
                    updateQuizList();
                    setDeleteModalOpen(false);
                    toast.success(interfaceConstants.successDeleteQuiz, {
                        position: "top-right",
                        duration: 3000
                    });
                }
            })
            .catch((error) => {
                toast.error(error, {
                    position: "top-right",
                    duration: 3000
                });
            });
    }

    return (
        <div className="root-quiz">
            {showCircularProgress &&
                <Box sx={{ display: 'flex', justifyContent: "center" }} >
                    <CircularProgress />
                </Box>}
            {!showCircularProgress && 
            <div>
                <Toaster />
                <AreYouSureModal handleConfirm={handleDeleteBtnClicked} message={interfaceConstants.deleteQuizMessage} open={deleteModalOpen} setOpen={setDeleteModalOpen} />
                <div className="div-logout-btn">
                    <Tooltip
                        title="Logout">
                        <IconButton onClick={handleLogoutBtn}>
                            <LogoutIcon sx={{ fontSize: 45, color: "white" }} />
                        </IconButton>
                    </Tooltip>
                </div>
                {quizzes.length > 0 && <div style={{ width: "100%", alignItems: "center", display: "flex", justifyContent: "center" }}>
                    <div className="paragraph-wrapper">
                        <p className="paragraph-quizzes">
                            {interfaceConstants.myQuizzes}
                        </p>
                    </div>
                </div>}
                {quizzes.length > 0 && <div className="quizzes-wrapper">
                    {quizzes.map(quiz => {
                        return <QuizComponent quiz={quiz} setDeleteModalOpen={setDeleteModalOpen} setSelectedQuiz={setSelectedQuiz} />
                    })}
                    <div ref={scrollRef}></div>
                </div>
                }
                {quizzes.length === 0 && <div style={{ width: "100%", alignItems: "center", display: "flex", justifyContent: "center" }}>
                    <div className="paragraph-wrapper">
                        <p className="paragraph-quizzes" style={{ fontSize: "95px" }}>
                            {interfaceConstants.noQuizzes}
                        </p>
                    </div>
                </div>
                }
                <div style={{ width: "100%", alignItems: "center", display: "flex", justifyContent: "center" }}>
                    <Tooltip
                        title="Add Quiz">
                        <IconButton onClick={() => { navigate(navigatorConstants.FormQuizPage) }}>
                            <AddBoxOutlinedIcon sx={{ fontSize: 45, color: "white" }} />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            }
        </div>
    );
}