export interface Wallet {
    add(amount: string): Promise<void>;
    subtract(amount: string): Promise<void>;
    balance(): Promise<string>;
}