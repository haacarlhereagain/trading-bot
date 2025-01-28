import Decimal from "decimal.js";
import { Action, AnalyzeMarketMeta } from "../../shared";
import { MarketAnalyzer, MarketAnalyzerProps } from "./marketAnalyzer.types";
import { MarketAnalyze } from "../tradingBot";

export const analyzeMarket_movingAverage_simple: MarketAnalyzer<AnalyzeMarketMeta> = ({
    marketData, currentPrice, logs
}: MarketAnalyzerProps): MarketAnalyze<AnalyzeMarketMeta> => {
    const result: MarketAnalyze<AnalyzeMarketMeta> = {
        meta: { rsi: '1' },
        action: undefined,
    }
    // todo use logs
    const average = marketData.reduce((sum, { price }) => new Decimal(sum).plus(price), new Decimal(0)).div(marketData.length);
    
    if (average.lessThan(currentPrice)) {
        result.action = Action.SELL;
    } else if (average.greaterThan(currentPrice)) {
        result.action = Action.BUY;
    } else {
        result.action = Action.HOLD;
    }

    return result;
}