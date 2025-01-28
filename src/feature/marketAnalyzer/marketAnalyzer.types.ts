import { PriceEntity } from "../../shared";
import { Ticker } from "../../ticker";
import { ActionLog, MarketAnalyze } from "../tradingBot";

export interface MarketAnalyzerProps<MarketAnalyzerMeta> {
    marketData: PriceEntity[];
    currentPrice: string;
    logs: ActionLog<Ticker, MarketAnalyzerMeta>[];
}

export type MarketAnalyzer<Meta> = (props: MarketAnalyzerProps<Meta>) => MarketAnalyze<Meta>;