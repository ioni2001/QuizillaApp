import { Player } from "./Player";
import { Quiz } from "./Quiz";
import { RoomState } from "./RoomState";

export interface Room{
    id: string,
    pin: number,
    state: RoomState,
    quiz: Quiz,
    players: Player[]
}