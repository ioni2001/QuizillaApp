import { Room } from "./Room";

export interface Player{
    id: string,
    name: string,
    score: number,
    connectionId: string,
    room: Room
}