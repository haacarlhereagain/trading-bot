import { GetActionAmountFn } from "../../feature";
import { waitRandom } from "../../mocks/waitRandom";
import { Ticker } from "../../ticker";

export const getActionAmount: GetActionAmountFn<Ticker> = async ({
    action,
    price,
    ticker,
}): Promise<string> => {
    // todo implement
    await waitRandom();
    return '1';
}