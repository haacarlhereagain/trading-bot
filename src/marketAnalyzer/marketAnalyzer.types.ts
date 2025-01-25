import { Action, PriceEntity } from "../shared";

export type MarketAnalyzer = (data: PriceEntity[], currentPrice: string) => Action;