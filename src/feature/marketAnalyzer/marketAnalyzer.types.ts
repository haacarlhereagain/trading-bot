import { PriceEntity } from "../../shared";
import { Ticker } from "../../ticker";
import { ActionLog, MarketAnalyze } from "../tradingBot";

export interface MarketAnalyzerProps {
    marketData: PriceEntity[];
    currentPrice: string;
    logs: ActionLog<Ticker>[];
}

export type MarketAnalyzer<Meta> = (props: MarketAnalyzerProps) => MarketAnalyze<Meta>;