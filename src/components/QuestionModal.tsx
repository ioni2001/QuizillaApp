import { FC, useRef, useState } from "react"
import { Question } from "../models/Question"
import { Modal } from "@fluentui/react";
import '../styles/QuestionModalStyle.css'
import { Autocomplete, Box, Button, TextField } from "@mui/material";
import * as interfaceConstants from '../utils/interface-constants';
import { Answer } from "../models/Answer";
import { toast } from "react-hot-toast";

export const QuestionModal: FC<{
    question: Question | undefined,
    open: boolean,
    questions: Question[],
    setQuestions: Function,
    setOpen: Function,
    scrollRef: React.RefObject<HTMLDivElement>,
    equals: Function
}> = ({ question, open, questions, setQuestions, setOpen, scrollRef, equals }) => {

    const timerOptions = [
        {
            code: "1", description: "5"
        },
        {
            code: "2", description: "15"
        },
        {
            code: "3", description: "30"
        },
        {
            code: "4", description: "45"
        },
        {
            code: "5", description: "60"
        },
    ];

    const timerRef = useRef<HTMLInputElement | null>(null);
    const textRef = useRef<HTMLInputElement | null>(null);
    const correctAnswerRef = useRef<HTMLInputElement | null>(null);
    const wrongAnswer1Ref = useRef<HTMLInputElement | null>(null);
    const wrongAnswer2Ref = useRef<HTMLInputElement | null>(null);
    const wrongAnswer3Ref = useRef<HTMLInputElement | null>(null);

    const getAnswers = (state: string) => {
        let answers: Answer[] = [];
        if(state == "save"){
            answers.push({
                isCorect: true,
                text: correctAnswerRef.current?.value!
            },
                {
                    isCorect: false,
                    text: wrongAnswer1Ref.current?.value!
                },
                {
                    isCorect: false,
                    text: wrongAnswer2Ref.current?.value!
                },
                {
                    isCorect: false,
                    text: wrongAnswer3Ref.current?.value!
                },
            );
            return answers;
        }
        answers.push({
            id: question?.answers[0].id,
            isCorect: true,
            text: correctAnswerRef.current?.value!
        },
            {
                id: question?.answers[1].id,
                isCorect: false,
                text: wrongAnswer1Ref.current?.value!
            },
            {
                id: question?.answers[2].id,
                isCorect: false,
                text: wrongAnswer2Ref.current?.value!
            },
            {
                id: question?.answers[3].id,
                isCorect: false,
                text: wrongAnswer3Ref.current?.value!
            },
        );
        return answers;
    }

    const validateFields = (): boolean =>{
        if(timerRef === null || timerRef === undefined ||
            textRef === null || textRef === undefined ||
            correctAnswerRef === null || correctAnswerRef === undefined ||
            wrongAnswer1Ref === null || wrongAnswer1Ref === undefined ||
            wrongAnswer2Ref === null || wrongAnswer2Ref === undefined ||
            wrongAnswer3Ref === null || wrongAnswer3Ref === undefined)
            return false;
        if(timerRef.current?.value === "" || textRef.current?.value === "" ||
            correctAnswerRef.current?.value === "" || wrongAnswer1Ref.current?.value === "" ||
            wrongAnswer2Ref.current?.value === "" || wrongAnswer3Ref.current?.value === ""
            )
            return false;
        return true;       
    }

    const handleSave = () => {
        if (validateFields()) {
            let question: Question = {
                text: textRef.current?.value!,
                time: Number(timerRef.current?.value!),
                answers: getAnswers("save")
            }
            setQuestions([...questions, question]);
            setOpen(!open);
            setTimeout(function () {
                scrollRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }, 100);
        }
        else{
            toast.error(interfaceConstants.errorEmptyFieldsSignup, {
                position: "top-right",
                duration: 3000
              });
        }
    }

    const handleEdit = () => {
        if (validateFields()) {
            let updatedQuestion: Question = {
                id: question?.id,
                text: textRef.current?.value!,
                time: Number(timerRef.current?.value!),
                answers: getAnswers("edit")
            }
            const updatedQuestions = questions.map((element) =>{
                if(equals(question, element)){
                    return updatedQuestion;
                }
                return element;
            });
            setQuestions(updatedQuestions);
            setOpen(!open);
        }
        else{
            toast.error(interfaceConstants.errorEmptyFieldsSignup, {
                position: "top-right",
                duration: 3000
              });
        }
    }

    if (question === undefined) {
        return (
            <Modal
                isOpen={open}
                onDismiss={() => setOpen(!open)}
                containerClassName="root-question-modal"
            >
                <div className="row-div-wrapper">
                    <TextField
                        required
                        margin="normal"
                        style={{ width: "450px" }}
                        id="text"
                        label="Text"
                        name="text"
                        InputProps={{ autoComplete: 'off' }}
                        autoFocus
                        multiline={true}
                        maxRows={3}
                        inputProps={{ maxLength: 190 }}
                        inputRef={textRef}
                    />
                    <Autocomplete
                        color="#fc4a1a"
                        disablePortal={true}
                        options={timerOptions}
                        disableClearable={false}
                        getOptionLabel={(option) => option.description}
                        renderInput={(params) => (
                            <TextField required {...params} label="Timer(seconds)" inputRef={timerRef} />
                        )}
                        style={{ width: "220px", marginTop: "2.75%", marginLeft: "1%" }}
                    />
                </div>
                <div className="row-div-wrapper">
                    <TextField
                        required
                        margin="normal"
                        style={{ width: "58%" }}
                        id="correct"
                        label="Correct Answer"
                        name="correct"
                        InputProps={{ autoComplete: 'off' }}
                        autoFocus
                        color="success"
                        inputRef={correctAnswerRef}
                    />
                    <TextField
                        required
                        margin="normal"
                        style={{ width: "58%", marginLeft: "4%" }}
                        id="wrong1"
                        label="Wrong Answer"
                        name="wrong1"
                        InputProps={{ autoComplete: 'off' }}
                        autoFocus
                        color="error"
                        inputRef={wrongAnswer1Ref}
                    />
                </div>
                <div className="row-div-wrapper">
                    <TextField
                        required
                        margin="normal"
                        style={{ width: "58%" }}
                        id="wrong2"
                        label="Wrong Answer"
                        name="wrong2"
                        InputProps={{ autoComplete: 'off' }}
                        autoFocus
                        color="error"
                        inputRef={wrongAnswer2Ref}
                    />
                    <TextField
                        required
                        margin="normal"
                        style={{ width: "58%", marginLeft: "4%" }}
                        id="wrong3"
                        label="Wrong Answer"
                        name="wrong3"
                        InputProps={{ autoComplete: 'off' }}
                        autoFocus
                        color="error"
                        inputRef={wrongAnswer3Ref}
                    />
                </div>
                <div className="row-div-wrapper" style={{ width: "90%", justifyContent: "space-around" }}>
                    <Button color="success" variant="outlined" onClick={handleSave}>{interfaceConstants.save}</Button>
                    <Button color="error" variant="outlined" onClick={() => setOpen(!open)}>{interfaceConstants.cancel}</Button>
                </div>

            </Modal>
        );
    }
    return (
        <div>
            <Modal
                isOpen={open}
                onDismiss={() => setOpen(!open)}
                containerClassName="root-question-modal"
            >
                <div className="row-div-wrapper">
                    <TextField
                        required
                        margin="normal"
                        style={{ width: "450px" }}
                        id="text"
                        label="Text"
                        name="text"
                        InputProps={{ autoComplete: 'off' }}
                        autoFocus
                        multiline={true}
                        maxRows={3}
                        inputProps={{ maxLength: 190 }}
                        inputRef={textRef}
                        defaultValue={question.text}
                    />
                    <Autocomplete
                        color="#fc4a1a"
                        disablePortal={true}
                        options={timerOptions}
                        disableClearable={false}
                        getOptionLabel={(option) => option.description}
                        defaultValue={{ code: '_', description: question.time.toString() }}
                        renderInput={(params) => (
                            <TextField required {...params} label="Timer(seconds)" inputRef={timerRef} />
                        )}
                        style={{ width: "220px", marginTop: "2.75%", marginLeft: "1%" }}
                    />
                </div>
                <div className="row-div-wrapper">
                    <TextField
                        required
                        margin="normal"
                        style={{ width: "58%" }}
                        id="correct"
                        label="Correct Answer"
                        name="correct"
                        InputProps={{ autoComplete: 'off' }}
                        autoFocus
                        color="success"
                        inputRef={correctAnswerRef}
                        defaultValue={question.answers[0].text}
                    />
                    <TextField
                        required
                        margin="normal"
                        style={{ width: "58%", marginLeft: "4%" }}
                        id="wrong1"
                        label="Wrong Answer"
                        name="wrong1"
                        InputProps={{ autoComplete: 'off' }}
                        autoFocus
                        color="error"
                        inputRef={wrongAnswer1Ref}
                        defaultValue={question.answers[1].text}
                    />
                </div>
                <div className="row-div-wrapper">
                    <TextField
                        required
                        margin="normal"
                        style={{ width: "58%" }}
                        id="wrong2"
                        label="Wrong Answer"
                        name="wrong2"
                        InputProps={{ autoComplete: 'off' }}
                        autoFocus
                        color="error"
                        inputRef={wrongAnswer2Ref}
                        defaultValue={question.answers[2].text}
                    />
                    <TextField
                        required
                        margin="normal"
                        style={{ width: "58%", marginLeft: "4%" }}
                        id="wrong3"
                        label="Wrong Answer"
                        name="wrong3"
                        InputProps={{ autoComplete: 'off' }}
                        autoFocus
                        color="error"
                        inputRef={wrongAnswer3Ref}
                        defaultValue={question.answers[3].text}
                    />
                </div>
                <div className="row-div-wrapper" style={{ width: "90%", justifyContent: "space-around" }}>
                    <Button color="success" variant="outlined" onClick={handleEdit}>{interfaceConstants.save}</Button>
                    <Button color="error" variant="outlined" onClick={() => setOpen(!open)}>{interfaceConstants.cancel}</Button>
                </div>
            </Modal>
        </div>
    );
}