import { ACTION_COEFFICIENTS, FIAT_TICKER, MAX_ERROR_RETRY, TICK_INTERVAL_IN_MS } from '../../const';
import { createLogger } from '../../feature';
import { createWallet, createWalletsConnector, Wallet } from '../../mocks';
import { Ticker } from '../../ticker';
import { AnalyzeMarketFn, createTradingBot, ExecuteActionFn, GetActionAmountFn } from './tradingBot';
import { Action, TickerGeneric } from '../../shared';
import { waitRandom } from '../../mocks/';
import Decimal from 'decimal.js';

type Wallets = Record<Ticker | TickerGeneric, Wallet>;

const TICKER: Ticker = Ticker.Asdf;

const BALANCES_INITIAL: Record<Ticker | TickerGeneric, string> = Object.freeze({
    [FIAT_TICKER]: '100',
    [TICKER]: '0',
})

const getWalletsBalances = async (wallets: Wallets): Promise<[string, string]> => {
    return await Promise.all([wallets[FIAT_TICKER].balance(), wallets[TICKER].balance()]);
}

test('tradingBot', async () => {
    const wallets: Wallets = {
        [FIAT_TICKER]: createWallet(BALANCES_INITIAL[FIAT_TICKER]),
        [TICKER]: createWallet(BALANCES_INITIAL[TICKER]),
    }

    const CURRENT_PRICE = '3.23';

    const getCurrentPrice = async (): Promise<string> => {
        return CURRENT_PRICE;
    }

    const walletsConnector = createWalletsConnector(wallets);

    const logger = createLogger();

    const getActionAmount: GetActionAmountFn<Ticker> = async ({
        action,
        price,
        ticker,
    }): Promise<string> => {
        await waitRandom();
        const wallet = wallets[action === Action.BUY ? FIAT_TICKER : ticker];
        const balance = await wallet.balance();
        const coefficient = action === Action.BUY ? ACTION_COEFFICIENTS.buy : ACTION_COEFFICIENTS.sell;
        // todo вынести логику определения суммы в фичу
        const sum = new Decimal(balance).mul(coefficient);
        // todo вынести логику определения количества в фичу
        return sum.div(price).toString();
    }

    const executeAction: ExecuteActionFn<Ticker> = async ({
        amount, price, action
    }): Promise<void> => {
        const method = action === Action.BUY ? walletsConnector.buy : walletsConnector.sell;
        await method(amount, price);
    }

    let action = Action.HOLD;

    const setAction = (action_: Action): void => {
        action = action_;
    }

    const analyzeMarket: AnalyzeMarketFn<Ticker> = async (ticker: Ticker, currentPrice: string): Promise<Action> => {
        await waitRandom();
        return action;
    }

    const tradingBot = createTradingBot<Ticker>({
        ticker: TICKER,
        getCurrentPriceFn: getCurrentPrice,
        analyzeMarketFn: analyzeMarket,
        getActionAmountFn: getActionAmount,
        executeActionFn: executeAction,
        tickIntervalInS: TICK_INTERVAL_IN_MS,
        maxErrorRetry: MAX_ERROR_RETRY,
        logActionFn: logger.log,
    });

    const balances1 = await getWalletsBalances(wallets);

    expect(balances1).toStrictEqual([BALANCES_INITIAL[FIAT_TICKER], BALANCES_INITIAL[TICKER]]);

    await tradingBot.tick();

    const balances2 = await getWalletsBalances(wallets);

    expect(balances2).toStrictEqual([BALANCES_INITIAL[FIAT_TICKER], BALANCES_INITIAL[TICKER]]);

    setAction(Action.BUY);
})