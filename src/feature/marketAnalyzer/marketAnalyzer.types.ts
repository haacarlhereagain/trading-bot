import { Action, PriceEntity } from "../../shared";
import { Ticker } from "../../ticker";
import { ActionLog } from "../tradingBot";

export interface MarketAnalyzerProps {
    marketData: PriceEntity[];
    currentPrice: string;
    logs:  ActionLog<Ticker>[];
}

export type MarketAnalyzer = (props: MarketAnalyzerProps) => Action;