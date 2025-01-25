import { waitRandom } from "../waitRandom";
import { Wallet } from "./wallet.types";
import Decimal from "decimal.js";

export const createWallet = (initialBallance: string): Wallet => {
    let _balance = new Decimal(initialBallance);

    const add = async (amount: string): Promise<void> => {
        await waitRandom();

        _balance = _balance.plus(amount);
    }

    const subtract = async (amount: string): Promise<void> => {
        await waitRandom();

        _balance = _balance.minus(amount);
    }

    const balance = async (): Promise<string> => {
        await waitRandom();

        return _balance.toString();
    }

    return {
        add,
        subtract,
        balance,
    }
}