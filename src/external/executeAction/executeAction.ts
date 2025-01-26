import { Ticker } from "../../ticker";
import { ExecuteActionFn } from "../../feature";

export const executeAction: ExecuteActionFn<Ticker> = async ({
    amount, price, action, ticker,
}): Promise<void> => {
    // todo implement
}