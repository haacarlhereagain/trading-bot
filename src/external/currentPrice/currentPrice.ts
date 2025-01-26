import { TickerGeneric } from "../../shared";
import { Ticker } from "../../ticker";
import { GetCurrentPriceFn } from "../../feature";

export const getCurrentPrice: GetCurrentPriceFn<Ticker> = async <Ticker extends TickerGeneric>(ticker: Ticker): Promise<string> => {
    return '1';
}