import { Answer } from "./Answer";

export interface Question{
    id?: string,
    text: string,
    time: number,
    answers: Answer[]
}