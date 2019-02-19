interface IEnrichedPromise<T> extends Promise<T> {
    isResolved: boolean;
}
export class PromiseHook<T> {
    private readonly promise: Promise<T>;
    private isPromiseResolved: boolean = false;
    constructor(promise: Promise<T>) {
        this.promise = this.enrichPromise(promise);
    }
    public hook(callback: (promise: Promise<T>) => void, timeout: number): void {
        setTimeout(() => {
            if (this.isPromiseResolved) {
                return;
            }
            callback(this.promise);
        }, timeout);
    }
    private enrichPromise(promise: Promise<T>): Promise<T> {
        return promise.then((value) => {
            this.isPromiseResolved = true;
            return value
        })
    }
}