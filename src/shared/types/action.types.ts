export enum Action {
  BUY = 'buy',
  HOLD = 'hold',
  SELL = 'sell',
}

export type ActionChanging = Action.BUY | Action.SELL;