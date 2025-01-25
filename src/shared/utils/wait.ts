export const wait = async <T = unknown>(timeout = 0, payload?: T): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(payload), timeout));
}