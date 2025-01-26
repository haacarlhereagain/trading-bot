import { waitRandom } from "../mocks/waitRandom";
import { Ticker } from "../ticker";
import { LogActionFn, ActionLog } from "../tradingBot";

// todo нормальный логгер (монго)
export const createLogger = () => {
    const data: ActionLog<Ticker>[] = [];

    const log: LogActionFn<Ticker> = async (log: ActionLog<Ticker>): Promise<void> => {
        await waitRandom();
        data.push(log);
    }

    const getLogs = async (): Promise<ActionLog<Ticker>[]> => {
        await waitRandom();

        return data;
    }

    return {
        log,
        getLogs,
    }
}