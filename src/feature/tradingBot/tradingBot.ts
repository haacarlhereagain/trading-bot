import dayjs from 'dayjs';
import { Action, ActionChanging, PriceEntity, TickerGeneric, TimeRange, createRetry } from '../../shared';

interface GetPriceHistoryFnProps<Ticker extends TickerGeneric> {
  timeRange: TimeRange;
  ticker: Ticker;
}

export type GetPriceHistoryFn<Ticker extends TickerGeneric> = (props: GetPriceHistoryFnProps<Ticker>) => Promise<PriceEntity[]> | PriceEntity[];

export type GetCurrentPriceFn<Ticker extends TickerGeneric> = (ticker: Ticker) => Promise<string>;

export interface MarketAnalyze<Meta = undefined> {
  action: Action;
  meta: Meta;
}

export type AnalyzeMarketFn<
  Ticker extends TickerGeneric,
  Meta = undefined,
> = (ticker: Ticker, currentPrice: string) => Promise<MarketAnalyze<Meta>>;

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

export interface ActionLog<
  Ticker extends TickerGeneric,
  MarketAnalyzeMeta = undefined,
> {
  action: ActionChanging,
  timestamp: number;
  amount: string; 
  price: string;
  ticker: Ticker;
  meta: MarketAnalyzeMeta;
}

export type LogActionFn<Ticker extends TickerGeneric, MarketAnalyzeMeta = undefined> = (log: ActionLog<Ticker, MarketAnalyzeMeta>) => Promise<void>;

export interface CreateTradingBotProps<
  Ticker extends TickerGeneric,
  MarketAnalyzeMeta = undefined,
> {
    ticker: Ticker;
    getCurrentPriceFn: GetCurrentPriceFn<Ticker>;
    analyzeMarketFn: AnalyzeMarketFn<Ticker, MarketAnalyzeMeta>;
    getActionAmountFn: GetActionAmountFn<Ticker>;
    executeActionFn: ExecuteActionFn<Ticker>;
    tickIntervalInS: number;
    maxErrorRetry: number;
    logActionFn: LogActionFn<Ticker, MarketAnalyzeMeta>;
}

export const createTradingBot = <
  Ticker extends TickerGeneric,
  MarketAnalyzeMeta = undefined,
>(props: CreateTradingBotProps<Ticker, MarketAnalyzeMeta>) => {
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
  
    const _executeTrade = async (__actionId: number, { action, meta }: MarketAnalyze<MarketAnalyzeMeta>, price: string): Promise<void> => {
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
      await logActionFn({ action, timestamp: dayjs().unix(), amount, price, ticker, meta });
    };

    const tick = async (): Promise<void> => {
      const __actionId = retry.state().id;
      const price = await getCurrentPriceFn(props.ticker);
      checkActive(__actionId);
      const marketAnalyzeResult = await analyzeMarketFn(ticker, price);

      if (marketAnalyzeResult.action === Action.HOLD) {
        return;
      }
      checkActive(__actionId);
      await _executeTrade(__actionId, marketAnalyzeResult, price);
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