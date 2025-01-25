import { WAIT_MAX, WAIT_MIN } from "../const";
import { randomNumber } from "../shared";

export const waitRandom = async <T = unknown>(payload?: T): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(payload), randomNumber(WAIT_MIN, WAIT_MAX)));
}