 
import { PrimaryButton } from "@fluentui/react";
import { FC, useCallback, useEffect, useState } from "react";
import { Answer } from "../models/Answer";
import { Player } from "../models/Player";
import { Question } from "../models/Question";
import "../styles/AnswerComponentStyle.css";
import { AnswerDTO } from "../models/AnswerDTO";
import * as apiConstants from '../utils/api-constants';

 
export const AnswerComponent: FC<{
    question: Question;
    guest?: Player;
    timer?: number;
    revealAnswer: boolean;
    shouldAppear: boolean;
    isHostView?: boolean;
}> = ({ question, guest, timer, revealAnswer, shouldAppear, isHostView }) => {

    const [shuffleNumber, setShuffleNumber] = useState<number>(0);
    const [chosenAnswerNumber, setChosenAnswerNumber] = useState<number>(0);
    const [selectTime, setSelectTime] = useState<number | undefined>(0);
    const [score, setScore] = useState<number>(0);

    useEffect(() => {
        setShuffleNumber(Math.floor(Math.random() * 4));
        setChosenAnswerNumber(0);
        setSelectTime(0);
        setScore(0);
    }, [shouldAppear]);

    useEffect(() => {
        if (timer === question.time) {
            submitAnswer();
        } 
    }, [timer])

    function renderAnswerButtons() {
        const final = [];

        for (let i : number = 1; i <= 4; i++) {
            final.push(
                <AnswerButton
                    answer={question.answers?.at((shuffleNumber + i) % 4)}
                    isSelected={chosenAnswerNumber == i}
                    revealAnswer={revealAnswer}
                    onSelected = {() => {selectAnswer(i)}}
                    isHostView={isHostView}
                />
            );
        }

        return final;
    }

    return (
        <div className="positionBox" style={{ opacity: shouldAppear ? 1 : 0 }} >
            <div className="infoText" style={{ display: (revealAnswer && !isHostView) ? "" : "none" }} >
                <span style={{ display: (revealAnswer && chosenAnswerNumber == 0) ? "" : "none" }} >
                    No answer selected
                </span>
                <br></br>
                <span style={{ display: revealAnswer ? "" : "none" }}>
                    Your score is: {score}
                </span>
            </div>
            <div className="answerBox">
                {(() => renderAnswerButtons())()}
            </div>
        </div>
    );

    function selectAnswer(answerNumber: number) {
        console.log(answerNumber)
        setChosenAnswerNumber(answerNumber);
        setSelectTime(timer);
    }

    function submitAnswer() {
        if (isHostView) return

        if (guest && chosenAnswerNumber !== 0 && selectTime !== undefined) {
            let answerChosen = question.answers?.at((shuffleNumber + chosenAnswerNumber) % 4);

            let guestAnswer: AnswerDTO = {
                "questionId": question.id!,
                "answerId": answerChosen?.id,
                "time": selectTime
            }
            fetch(apiConstants.baseUrl + apiConstants.answerQuestion + "/"+ guest.id, {
                method: "PUT",
                mode: "cors",
                headers: {
                    Accept: "application/json",
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(guestAnswer)
            })
                .then(response => response.json())
                .then(response => {
                    guest.score = response;
                    setScore(response);
                });
        }
    }
}
 
const AnswerButton: FC<{
    answer?: Answer,
    isSelected: boolean,
    revealAnswer?: boolean,
    onSelected?: any,
    isHostView?: boolean
}> = ({ answer, isSelected, revealAnswer, onSelected, isHostView }) => {
 
    useEffect(() => {
 
    }, [isSelected])
 
    return (
        <PrimaryButton className={`answerButton answerText ${getStyle()}`}
            onClick={onSelected} 
            disabled={isSelected || revealAnswer || isHostView}
            text={answer?.text}
        >
        </PrimaryButton>
    );
 
    function getStyle(): string {
        if (isHostView) {
            if (revealAnswer) {
                if (answer?.isCorect) {
                    return " answerButtonCorrect";
                } else {
                    return " answerButtonWrong";
                }
            } else {
                return " hostButton";
            }
        }
 
        let selectedAnswerClass: string = "answerButtonSelected";
        if (revealAnswer) {
            if (answer?.isCorect) {
                if(isSelected)
                    return "answerButtonCorrect";
                else
                    return " answerButtonShowCorrect"
            } else {
                if (isSelected) {
                    return " answerButtonWrong";
                } else {
                    return " answerButtonNotAnswered";
                }
            }
        } else {
            if (isSelected) {
                return selectedAnswerClass;
            }
            return "";
        }
    }
}