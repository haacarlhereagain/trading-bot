import Decimal from "decimal.js";
import { FIAT_TICKER } from "../../const"
import { TickerGeneric } from "../../shared"
import { Wallet } from "../wallet/wallet.types"

export const createWalletsConnector = (wallets: Record<TickerGeneric, Wallet>) => {
    const nonFiatTicker = Object.keys(wallets).filter(ticker => ticker !== FIAT_TICKER)[0];

    if (!nonFiatTicker) {
        throw new Error('createWalletsConnector(): nonFiatTicker is not defined');
    }

    const buy = async (amount: string, price: string): Promise<void> => {
        await wallets[FIAT_TICKER].subtract(new Decimal(price).mul(amount).toString());
        await wallets[nonFiatTicker].add(amount);
    }

    const sell = async (amount: string, price: string): Promise<void> => {
        await wallets[FIAT_TICKER].add(new Decimal(price).mul(amount).toString());
        await wallets[nonFiatTicker].subtract(amount);
    }

    return {
        buy,
        sell,
        wallets,
    }
}