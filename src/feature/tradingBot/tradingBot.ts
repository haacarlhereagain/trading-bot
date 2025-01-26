import dayjs from 'dayjs';
import { Action, ActionChanging, PriceEntity, TickerGeneric, TimeRange, createRetry } from '../../shared';

interface GetPriceHistoryFnProps<Ticker extends TickerGeneric> {
  timeRange: TimeRange;
  ticker: Ticker;
}

export type GetPriceHistoryFn<Ticker extends TickerGeneric> = (props: GetPriceHistoryFnProps<Ticker>) => Promise<PriceEntity[]> | PriceEntity[];

export type GetCurrentPriceFn<Ticker extends TickerGeneric> = (ticker: Ticker) => Promise<string>;

export type AnalyzeMarketFn<Ticker extends TickerGeneric> = (ticker: Ticker, currentPrice: string) => Promise<Action>;

export type ExecuteActionFn<Ticker extends TickerGeneric> = (payload: {
  amount: string;
  price: string;
  ticker: Ticker;
  action: Action,
}) => Promise<void>;

export type GetActionAmountFn<Ticker extends TickerGeneric> = (payload: {
  ticker: Ticker;
  action: ActionChanging;
  price: string;
}) => Promise<string>;

export interface ActionLog<Ticker extends TickerGeneric> {
  action: ActionChanging,
  timestamp: number;
  amount: string; 
  price: string;
  ticker: Ticker;
}

export type LogActionFn<Ticker extends TickerGeneric> = (log: ActionLog<Ticker>) => Promise<void>;

export interface CreateTradingBotProps<Ticker extends TickerGeneric> {
    ticker: Ticker;
    getCurrentPriceFn: GetCurrentPriceFn<Ticker>;
    analyzeMarketFn: AnalyzeMarketFn<Ticker>;
    getActionAmountFn: GetActionAmountFn<Ticker>;
    executeActionFn: ExecuteActionFn<Ticker>;
    tickIntervalInS: number;
    maxErrorRetry: number;
    logActionFn: LogActionFn<Ticker>;
}

export const createTradingBot = <Ticker extends TickerGeneric>(props: CreateTradingBotProps<Ticker>) => {
    const {
      ticker,
      tickIntervalInS,
      maxErrorRetry,
      getActionAmountFn,
      getCurrentPriceFn,
      logActionFn,
      analyzeMarketFn,
      executeActionFn,
    } = props;
    const retry = createRetry();

    const checkActive = (actionId: number): void => {
      const { isActive, id } = retry.state();
      if (isActive && actionId !== id) {
        throw new Error('checkActive(): abort operation');
      }
    }
  
    const _executeTrade = async (__actionId: number, action: Action, price: string): Promise<void> => {
      if (action === Action.HOLD) {
        return;
      }

      const amount = await getActionAmountFn({
        ticker,
        action,
        price,
      })
      checkActive(__actionId);
      await executeActionFn({ ticker, price, amount, action });
      await logActionFn({ action, timestamp: dayjs().unix(), amount, price, ticker });
    };

    const tick = async (): Promise<void> => {
      const __actionId = retry.state().id;
      const price = await getCurrentPriceFn(props.ticker);
      checkActive(__actionId);
      const action = await analyzeMarketFn(ticker, price);
      if (action === Action.HOLD) {
        return;
      }
      checkActive(__actionId);
      await _executeTrade(__actionId, action, price);
    };

    const start = (): void => {
      if (retry.state().isActive) {
        throw new Error('createTradingBot(): start(): the bot is already running');
      }

      retry.use(tick, [], {
        retryTimeoutInMs: tickIntervalInS,
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
      tick,
    };
};