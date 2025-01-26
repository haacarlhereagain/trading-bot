import Decimal from "decimal.js";
import { Action } from "../../shared";
import { MarketAnalyzer, MarketAnalyzerProps } from "./marketAnalyzer.types";

export const analyzeMarket_movingAverage_simple: MarketAnalyzer = ({
    marketData, currentPrice, logs
}: MarketAnalyzerProps): Action => {
    // todo use logs
    const average = marketData.reduce((sum, { price }) => new Decimal(sum).plus(price), new Decimal(0)).div(marketData.length);
    
    if (average.lessThan(currentPrice)) {
        return Action.BUY;
    } else if (average.greaterThan(currentPrice)) {
        return Action.SELL;
    } else {
        return Action.HOLD;
    }
}