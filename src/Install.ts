interface IMessage {
    status: boolean;
    message?: string;
}
interface IErrorMessage extends IMessage {
    status: false;
    message: string;
    error?: Error;
}
interface ISuccessMessage extends IMessage {
    status: true;
}
interface IServiceWorkerNotFoundErrorMessage extends IErrorMessage {
    message: "ServiceWorker not supported"
}
export class Install {
    private static isServiceWorkerSupported(): boolean {
        return "serviceWorker" in navigator;
    }
    public async register(path: string): Promise<IServiceWorkerNotFoundErrorMessage | IErrorMessage | ISuccessMessage> {
        try {
            if (!Install.isServiceWorkerSupported()) {
                return {status: false, message: "ServiceWorker not supported"};
            }
            await navigator.serviceWorker.register(path);
            return {status: true};
        } catch (e) {
            return {status: false, message: "service worker registration failed", error: e}
        }

    }
}
