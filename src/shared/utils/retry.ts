import { wait } from './wait';
import { IncrId } from './incrId';

export interface IRetryOptions<T = unknown, R = Error> {
    isAbortRetryError?: (error: R) => boolean;
    retryErrorTimeout?: number;
    isNeedRetry?: (response: T) => boolean;
    retryTimeout?: number;
    maxErrorRetry?: number;
}

export interface IRetryInternalOptions {
    currentErrorRetry: number;
}

export const RETRY_REQUEST_OPTIONS: IRetryOptions<unknown, unknown> = Object.freeze({
    retryErrorTimeout: 300,
    retryTimeout: 1000,
    maxErrorRetry: 0,
});

export const RETRY_OPTIONS: IRetryInternalOptions = Object.freeze({
    currentErrorRetry: 0,
});

export const createRetry = () => {
    const id = new IncrId();

    const _state = {
        isActive: false,
    }

    const stop = (): void => {
        id.incr();
        _state.isActive = false;
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
        const { isAbortRetryError, retryErrorTimeout, retryTimeout, isNeedRetry, maxErrorRetry } = _options;
        try {
            const response = await handler(...args);
            retryData.currentErrorRetry = 0;
            if (isNeedRetry?.(response)) {
                await wait(retryTimeout);
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
        _state.isActive = true;
        return _retry<T, R>(handler, args, options);
    }

    const state = () => {
        return structuredClone(_state);
    }

    return {
        stop,
        use,
        state,
    }
}