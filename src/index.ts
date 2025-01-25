// import express from 'express';
// import bodyParser from 'body-parser';
// import initRoutes from './routers';
import { ActionFn, AnalyzeMarketFn, createTradingBot, GetActionAmountFn, GetCurrentPriceFn, LoggerPayload } from './tradingBot';
import { Action, TickerGeneric } from './shared';
import { createLogger } from './logger';
import { createWallet } from './mocks/wallet/wallet';
import { createWalletsConnector, generatePriceData, Wallet } from './mocks';
import { ACTION_COEFFICIENTS, FIAT_TICKER, MAX_ERROR_RETRY, TICK_INTERVAL_IN_MS } from './const';
import Decimal from 'decimal.js';

import { analyzeMarket_movingAverage_simple } from './marketAnalyzer';
import { Ticker } from './ticker';

const TICKER: Ticker = Ticker.Asdf;

const wallets: Record<Ticker | TickerGeneric, Wallet> = {
    [FIAT_TICKER]: createWallet('100'),
    [TICKER]: createWallet('0'),
}

const walletsConnector = createWalletsConnector(wallets);

// ---

// todo implement
const getCurrentPriceFn: GetCurrentPriceFn<Ticker> = async <Ticker extends TickerGeneric>(ticker: Ticker): Promise<string> => {
    return '1';
}

// todo implement
const getActionAmountFn: GetActionAmountFn<Ticker> = async ({
    action,
    price,
    ticker,
}): Promise<string> => {
    const wallet = wallets[action === Action.BUY ? FIAT_TICKER : ticker];
    const balance = await wallet.balance();
    const coefficient = action === Action.BUY ? ACTION_COEFFICIENTS.buy : ACTION_COEFFICIENTS.sell;
    const sum = new Decimal(balance).mul(coefficient);
    return sum.div(price).toString();
}

// todo implement
const actionFn: ActionFn<Ticker> = async ({
    amount, price, action
}): Promise<void> => {
    const method = action === Action.BUY ? walletsConnector.buy : walletsConnector.sell;
    await method(amount, price);
}

const logger = createLogger<LoggerPayload>();

const tradingBot = createTradingBot<Ticker>({
    ticker: TICKER,
    getCurrentPriceFn,
    analyzeMarketFn: async (ticker: Ticker, price: string) => {
        const data = await generatePriceData(1672531200);
        // подменять методы
        return analyzeMarket_movingAverage_simple(data, price);
    },
    getActionAmountFn,
    actionFn,
    tickIntervalInS: TICK_INTERVAL_IN_MS,
    maxErrorRetry: MAX_ERROR_RETRY,
    logger: logger.add,
});

// tradingBot.start();
