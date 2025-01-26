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

    const _retry = async <T = unknown, R = Error>(
        handler: (...args: Array<unknown>) => Promise<T> | T,
        args: Array<unknown>,
        options?: Partial<IRetryOptions<T, R>>,
        retryData = structuredClone({ ...RETRY_OPTIONS, id: id.incr() })
    ): Promise<T> => {
        if (retryData.id !== id.id) {
            return;
        }
        const _options = { ...RETRY_REQUEST_OPTIONS, ...options };
        const { isAbortRetryError, retryErrorTimeout, retryTimeoutInMs, isNeedRetry, maxErrorRetry } = _options;
        try {
            const response = await handler(...args);
            retryData.currentErrorRetry = 0;
            if (isNeedRetry?.(response)) {
                await wait(retryTimeoutInMs);
                return await _retry<T, R>(handler, args, _options, retryData);
            }
            return response;
        } catch (e) {
            if (retryData.currentErrorRetry >= maxErrorRetry || isAbortRetryError?.(e)) {
                throw Error(e);
            }
            await wait(retryErrorTimeout);
            retryData.currentErrorRetry++;
            return _retry<T, R>(handler, args, _options, retryData);
        }
    }

    const use = <T = unknown, R = Error>(
        handler: (...args: Array<unknown>) => Promise<T> | T,
        args?: Array<unknown>,
        options?: Partial<IRetryOptions<T, R>>,
    ): Promise<T> => {
        stop();
        isActive = true;
        return _retry<T, R>(handler, args, options);
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