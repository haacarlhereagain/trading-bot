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

    const use = async <
        T = unknown,
        R = Error,
        E extends ((...args: Array<unknown>) => Promise<T> | T) = ((...args: Array<unknown>) => Promise<T> | T),
    >(
        handler: E,
        args?: Parameters<E>,
        options?: Partial<IRetryOptions<T, R>>,
    ): Promise<T> => {
        stop();
        isActive = true;
        const _id = id.id;
        let errorRetries = 0;

        while (true) {
            if (!isActive || _id !== id.id) {
                return;
            } 

            const { isAbortRetryError, retryErrorTimeout, retryTimeoutInMs, isNeedRetry, maxErrorRetry } = {
                ...RETRY_REQUEST_OPTIONS,
                ...options,
            };

            try {
                errorRetries && errorRetries++;
                const response = await handler(...args);
                errorRetries = 0;

                if (!isNeedRetry?.(response)) {
                    return response;
                }
                
                await wait(retryTimeoutInMs);
            } catch (e) {
                !errorRetries && (errorRetries = 1);
                if (errorRetries >= maxErrorRetry || isAbortRetryError?.(e)) {
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