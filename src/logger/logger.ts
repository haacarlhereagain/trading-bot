import { wait } from "../shared";

export const createLogger = <DataItem>() => {
    const data: DataItem[] = [];

    const add = async (_: DataItem): Promise<void> => {
        await wait(100);
        data.push(_);
    }

    const getLogs = async (): Promise<DataItem[]> => {
        await wait(100);

        return data;
    }

    return {
        add,
        getLogs,
    }
}