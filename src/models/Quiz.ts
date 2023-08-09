import { Question } from "./Question";

export interface Quiz{
    id: string,
    title: string,
    description: string | null,
    readOnly: boolean,
    questions: Question[]
}