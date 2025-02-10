import { wait } from './wait';
import { IncrId } from './incrId';

export interface IRetryOptions<T = unknown, R = Error> {
    isAbortRetryError?: (error: R) => boolean;
    retryErrorTimeout?: number;
    isNeedRetry?: (response: T) => boolean;
    retryTimeoutInMs?: number;
    maxErrorRetry?: number;
}

export interface IRetryInternalOptions {
    currentErrorRetry: number;
}

export const RETRY_REQUEST_OPTIONS: IRetryOptions<unknown, unknown> = Object.freeze({
    retryErrorTimeout: 300,
    retryTimeoutInMs: 1000,
    maxErrorRetry: 0,
});

export const RETRY_OPTIONS: IRetryInternalOptions = Object.freeze({
    currentErrorRetry: 0,
});

export interface RetryState {
    id: number;
    isActive: boolean;
}

export const createRetry = () => {
    const id = new IncrId();
    let isActive = false;

    const stop = (): void => {
        id.incr();
        isActive = false;
    }

    const use = async <T = unknown, R = Error>(
        handler: (...args: Array<unknown>) => Promise<T> | T,
        args?: Array<unknown>,
        options?: Partial<IRetryOptions<T, R>>,
    ): Promise<T> => {
        stop();
        isActive = true;
        id.incr();
        const _id = id.id;
        let errorRetry = 0;
        let hasError = false;

        while (true) {
            if (!isActive || _id !== id.id) {
                throw new Error('createRetry.use(): is inactive');
            } 

            const _options = { ...RETRY_REQUEST_OPTIONS, ...options };
            const { isAbortRetryError, retryErrorTimeout, retryTimeoutInMs, isNeedRetry, maxErrorRetry } = _options;

            try {
                hasError && errorRetry++;
                const response = await handler(...args);
                errorRetry = 0;
                hasError = false;

                if (!isNeedRetry?.(response)) {
                    return response;
                }
                
                await wait(retryTimeoutInMs);
            } catch (e) {
                hasError = true;
                if (errorRetry >= maxErrorRetry || isAbortRetryError?.(e)) {
                    throw Error(e);
                }
                await wait(retryErrorTimeout);
            }
        }
    }

    const state = (): RetryState => {
        return {
            isActive,
            id: id.id,
        };
    }

    return {
        stop,
        use,
        state,
    }
}