import { FC, useRef, useState } from "react"
import { Quiz } from "../models/Quiz";
import * as interfaceConstants from "../utils/interface-constants";
import * as navigatorConstants from "../utils/navigator-constants";
import "../styles/FormQuizPageStyle.css";
import { Box, Button, IconButton, TextField, Tooltip } from "@mui/material";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { Question } from "../models/Question";
import { QuestionComponent } from "../components/QuestionComponent";
import { QuestionModal } from "../components/QuestionModal";
import { AreYouSureModal } from "../components/AreYouSureModal";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import * as apiConstants from '../utils/api-constants';
export const FormAddQuizPage: FC = () => {

    const [questions, setQuestions] = useState<Question[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [openEditQuestion, setOpenEditQuestion] = useState<boolean>(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [confirmExitModalOpen, setConfirmExitModalOpen] = useState<boolean>(false);
    const [confirmDeleteQuestionModalOpen, setConfirmDeleteQuestionModalOpen] = useState<boolean>(false);
    const [clickedQuestion, setClickedQuestion] = useState<Question>();
    const navigate = useNavigate();
    const titleRef = useRef<HTMLInputElement | null>(null);
    const descriptionRef = useRef<HTMLInputElement | null>(null);

    const handleExit= () => {
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
        if(titleRef === null || titleRef === undefined || titleRef.current?.value === ""){
            toast.error(interfaceConstants.errorCreateQuizTitleMessage, {
                position: "top-right",
                duration: 3000
                });
                return; 
            }
        if(questions.length === 0){
            toast.error(interfaceConstants.errorCreateQuizQuestionsMessage, {
                position: "top-right",
                duration: 3000
              });
             return; 
        }
        fetch(`${apiConstants.baseUrl}${apiConstants.createQuiz}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              title: titleRef.current?.value,
              description: descriptionRef.current?.value,
              readOnly: false,
              questions: questions
            }),
          })
            .then((response) => {
              if(response.status != 200){
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
                {interfaceConstants.createQuiz}
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
                inputRef={titleRef}
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
                inputRef={descriptionRef}/>
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