import Decimal from "decimal.js";
import { Action, PriceEntity } from "../shared";
import { MarketAnalyzer } from "./marketAnalyzer.types";

export const analyzeMarket_movingAverage_simple: MarketAnalyzer = (data: PriceEntity[], currentPrice: string): Action => {
    const average = data.reduce((sum, { price }) => new Decimal(sum).plus(price), new Decimal(0)).div(data.length);
    
    if (average.lessThan(currentPrice)) {
        return Action.BUY;
    } else if (average.greaterThan(currentPrice)) {
        return Action.SELL;
    } else {
        return Action.HOLD;
    }
}