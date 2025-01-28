// import express from 'express';
// import bodyParser from 'body-parser';
// import initRoutes from './routers';
import {generatePriceData } from './mocks';
import { MAX_ERROR_RETRY, TICK_INTERVAL_IN_MS } from './const';
import { Ticker } from './ticker';
import { getActionAmount, executeAction, getCurrentPrice } from './external';
import { analyzeMarket_movingAverage_simple, createTradingBot, createLogger } from './feature';
import { AnalyzeMarketMeta } from './shared';

const logger = createLogger();

const tradingBot = createTradingBot<Ticker, AnalyzeMarketMeta>({
    ticker: Ticker.Asdf,
    getCurrentPriceFn: getCurrentPrice,
    analyzeMarketFn: async (ticker: Ticker, currentPrice: string) => {
        // todo use ticker
        const [marketData, logs] = await Promise.all([generatePriceData(1672531200), logger.getLogs()]);
        return analyzeMarket_movingAverage_simple({ marketData, logs, currentPrice });
    },
    getActionAmountFn: getActionAmount,
    executeActionFn: executeAction,
    tickIntervalInS: TICK_INTERVAL_IN_MS,
    maxErrorRetry: MAX_ERROR_RETRY,
    logActionFn: logger.log,
});

// tradingBot.start();
