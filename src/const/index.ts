import { Action, TickerGeneric } from "../shared";

export const WAIT_MIN = 100;

export const WAIT_MAX = 300;

export const FIAT_TICKER: TickerGeneric = 'usdt';

export const MS_IN_S = 1000;

export const MS_IN_M = MS_IN_S * 60;

export const TICK_INTERVAL_IN_MS = MS_IN_M * 10;

export const MAX_ERROR_RETRY = 5;

export const ACTION_COEFFICIENTS: Record<Action.BUY | Action.SELL, number> = {
    [Action.BUY]: 0.1,
    [Action.SELL]: 0.7,
} as const