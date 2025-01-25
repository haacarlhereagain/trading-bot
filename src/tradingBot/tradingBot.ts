import dayjs from 'dayjs';
import { Action, PriceEntity, TickerGeneric, TimeRange } from '../shared';
import { createRetry } from '../shared';

interface GetPriceHistoryFnProps<Ticker extends TickerGeneric> {
  timeRange: TimeRange;
  ticker: Ticker;
}

export type GetPriceHistoryFn<Ticker extends TickerGeneric> = (props: GetPriceHistoryFnProps<Ticker>) => Promise<PriceEntity[]> | PriceEntity[];

export type GetCurrentPriceFn<Ticker extends TickerGeneric> = (ticker: Ticker) => Promise<string>;

export type AnalyzeMarketFn<Ticker extends TickerGeneric> = (ticker: Ticker, price: string) => Promise<Action>;

export type ActionFn<Ticker extends TickerGeneric> = (payload: {
  amount: string;
  price: string;
  ticker: Ticker;
  action: Action,
}) => Promise<void>;

export type GetActionAmountFn<Ticker extends TickerGeneric> = (payload: {
  ticker: Ticker;
  action: Action.BUY | Action.SELL;
  price: string;
}) => Promise<string>;

export interface LoggerPayload {
  action: Action,
  timestamp: number;
  amount?: string; 
  price?: string;
}

export interface CreateTradingBotProps<Ticker extends TickerGeneric> {
    ticker: Ticker;
    getCurrentPriceFn: GetCurrentPriceFn<Ticker>;
    analyzeMarketFn: AnalyzeMarketFn<Ticker>;
    getActionAmountFn: GetActionAmountFn<Ticker>;
    actionFn: ActionFn<Ticker>;
    tickIntervalInS: number;
    maxErrorRetry: number;
    logger?: (payload: LoggerPayload) => void;
}

export const createTradingBot = <Ticker extends TickerGeneric>(props: CreateTradingBotProps<Ticker>) => {
    const {
      ticker,
      tickIntervalInS,
      maxErrorRetry,
      getActionAmountFn,
      getCurrentPriceFn,
      logger,
      analyzeMarketFn,
      actionFn,
    } = props;
    const retry = createRetry();

    const checkActive = (actionId: number): void => {
      const { isActive, id } = retry.state();
      if (!isActive || actionId !== id) {
        throw new Error('checkActive(): aborted operation');
      }
    }
  
    const executeTrade = async (__actionId: number, action: Action, price: string): Promise<void> => {
      if (action === Action.HOLD) {
        logger?.({ action, timestamp: dayjs().unix() });
        return;
      }
      const amount = await getActionAmountFn({
        ticker,
        action,
        price,
      })
      checkActive(__actionId);
      await actionFn({ ticker, price, amount, action });
      checkActive(__actionId);
      logger?.({ action: Action.BUY, timestamp: dayjs().unix(), amount, price });
    };

    const tick = async (): Promise<void> => {
      const __actionId = retry.state().id;
      const price = await getCurrentPriceFn(props.ticker);
      checkActive(__actionId);
      const action = await analyzeMarketFn(ticker, price);
      checkActive(__actionId);
      await executeTrade(__actionId, action, price);
    };

    const start = (): void => {
      if (retry.state().isActive) {
        throw new Error('createTradingBot(): start(): the bot is already running');
      }

      retry.use(tick, [], {
        retryTimeout: tickIntervalInS,
        isNeedRetry: () => true,
        maxErrorRetry,
      });
    };

    const stop = (): void => {
      retry.stop();
    };
    
    return {
      start,
      stop,
    };
};