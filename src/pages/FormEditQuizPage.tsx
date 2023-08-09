import { FC, useEffect, useRef, useState } from "react"
import { Quiz } from "../models/Quiz";
import * as interfaceConstants from "../utils/interface-constants";
import * as navigatorConstants from "../utils/navigator-constants";
import * as apiConstants from "../utils/api-constants";
import "../styles/FormQuizPageStyle.css";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Question } from "../models/Question";
import { QuestionModal } from "../components/QuestionModal";
import { AreYouSureModal } from "../components/AreYouSureModal";
import { Button, IconButton, TextField, Tooltip } from "@mui/material";
import { QuestionComponent } from "../components/QuestionComponent";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
export const FormEditQuizPage: FC = () => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState<Quiz>();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [openEditQuestion, setOpenEditQuestion] = useState<boolean>(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [confirmExitModalOpen, setConfirmExitModalOpen] = useState<boolean>(false);
    const [confirmDeleteQuestionModalOpen, setConfirmDeleteQuestionModalOpen] = useState<boolean>(false);
    const [clickedQuestion, setClickedQuestion] = useState<Question>();
    const navigate = useNavigate();
    const [titleState, setTitleState] = useState<string>("");
    const [descriptionState, setDescriptionState] = useState<string>("");

    useEffect(() => {
        fetch(`${apiConstants.baseUrl}${apiConstants.getQuiz}/${quizId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then((response) => {
                if (response.status != 200) {
                    toast.error(response.statusText, {
                        position: "top-right",
                        duration: 3000
                    });
                    return;
                }
                return response.json();
            })
            .then((response: Quiz) => {
                setQuiz(response);
                setQuestions(response.questions);
                setTitleState(response.title);
                if (response.description == null) {
                    setDescriptionState("");
                }
                else {
                    setDescriptionState(response.description);
                }
            })
            .catch((error) => {
                toast.error(error, {
                    position: "top-right",
                    duration: 3000
                });
            });
    }, []);

    const handleExit = () => {
        navigate(navigatorConstants.QuizPage);
    }

    const equals = (question1: Question, question2: Question): boolean => {
        if (question1.text !== question2.text || question1.time !== question2.time)
            return false;
        question1.answers.forEach(function (answer, index) {
            if (answer !== question2.answers[index])
                return false;
        });
        return true;
    }

    const handleDeleteQuestion = () => {
        const updatedQuestions = questions.filter((question) => {
            return !equals(question, clickedQuestion!)
        });
        setQuestions(updatedQuestions);
        setConfirmDeleteQuestionModalOpen(!confirmDeleteQuestionModalOpen);
    }

    const saveButtonClicked = () => {
        if (titleState === "") {
            toast.error(interfaceConstants.errorCreateQuizTitleMessage, {
                position: "top-right",
                duration: 3000
            });
            return;
        }
        if (questions.length === 0) {
            toast.error(interfaceConstants.errorCreateQuizQuestionsMessage, {
                position: "top-right",
                duration: 3000
            });
            return;
        }
        fetch(`${apiConstants.baseUrl}${apiConstants.updateQuiz}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: quiz?.id,
                title: titleState,
                description: descriptionState,
                readOnly: quiz?.readOnly,
                questions: questions
            }),
        })
            .then((response) => {
                if (response.status != 200) {
                    toast.error(response.statusText, {
                        position: "top-right",
                        duration: 3000
                    });
                    return;
                }
                navigate(navigatorConstants.QuizPage);
                return;
            })
            .catch((error) => {
                toast.error(error, {
                    position: "top-right",
                    duration: 3000
                });
            });
    }

    return (<div className="root-form">
        <div className="paragraph-form-wrapper">
            <p className="paragraph-form-type">
                {interfaceConstants.editQuiz}
            </p>
        </div>
        <div className="quiz-details-wrapper">
            <Toaster />
            <QuestionModal open={open} question={undefined} questions={questions} setQuestions={setQuestions} setOpen={setOpen} scrollRef={scrollRef} equals={equals} />
            <QuestionModal open={openEditQuestion} question={clickedQuestion} questions={questions} setQuestions={setQuestions} setOpen={setOpenEditQuestion} scrollRef={scrollRef} equals={equals} />
            <AreYouSureModal handleConfirm={handleDeleteQuestion} message={interfaceConstants.deleteQuestionMessage} open={confirmDeleteQuestionModalOpen} setOpen={setConfirmDeleteQuestionModalOpen}></AreYouSureModal>
            <AreYouSureModal handleConfirm={handleExit} message={interfaceConstants.exitMessage} open={confirmExitModalOpen} setOpen={setConfirmExitModalOpen}></AreYouSureModal>
            <TextField
                style={{ width: "90%" }}
                margin="normal"
                required
                id="title"
                label="Title"
                name="title"
                InputProps={{ autoComplete: 'off' }}
                autoFocus
                value={titleState}
                onChange={event => setTitleState(event.target.value)}
            />
            <TextField
                style={{ width: "90%" }}
                margin="normal"
                id="description"
                label="Description"
                name="description"
                InputProps={{ autoComplete: 'off' }}
                autoFocus
                multiline={true}
                maxRows={3}
                inputProps={{ maxLength: 190 }}
                onChange={event => setDescriptionState(event.target.value)}
                value={descriptionState}
            />
            {questions?.map((question: Question) => {
                return (
                    <QuestionComponent question={question} setModalDeleteOpen={setConfirmDeleteQuestionModalOpen} setClickedQuestion={setClickedQuestion} setModalEditOpen={setOpenEditQuestion} />
                );
            })}
            <div style={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                <Tooltip
                    title="Add Question"
                >
                    <IconButton onClick={() => { setOpen(true) }}>
                        <AddBoxOutlinedIcon sx={{ fontSize: 45, color: "white" }} />
                    </IconButton>
                </Tooltip>
            </div>
            <div ref={scrollRef}></div>
        </div>
        <div className="wrapper-buttons-formquiz">
            <Button color="success" variant="contained" onClick={saveButtonClicked}>{interfaceConstants.save}</Button>
            <Button color="error" variant="contained" onClick={() => setConfirmExitModalOpen(true)}>{interfaceConstants.cancel}</Button>
        </div>
    </div>
    );
}