export class ServiceWorker {
    private CACHE_NAME = "CACHE";
    constructor(protected urlsToCache: string[]) {
        this.init = this.init.bind(this);
        this.overwriteCacheName = this.overwriteCacheName.bind(this);
        this.onInstall = this.onInstall.bind(this);
        this.onFetch = this.onFetch.bind(this);
        this.cacheRequest = this.cacheRequest.bind(this);
    }

    public overwriteCacheName(name: string): void {
        this.CACHE_NAME = name;
    }
    public init(): void {
        console.info("init");
        self.addEventListener("install", this.onInstall);
        self.addEventListener("fetch", this.onFetch)
    }

    protected onFetch(event: FetchEvent): void {
        console.info("on fetch");
        event.respondWith(caches.match(event.request).then((res) => {
            if (res) {
                console.info("responding from cache");
                return res;
            }
            return fetch(ServiceWorker.getModifiedRequest(event.request)).then((response) => {
                if (!response || response.status !== 200) {
                    console.info("didn't cache: ", event.request.url, event.request.method, response.status);
                    return response;
                }
                console.info("cached: ", event.request.url);
                const resToCache = response.clone();
                this.cacheRequest(event.request, resToCache);
                return response;
            })
        }))

    }
    protected static getModifiedRequest(request: Request): Request {
        if (request.method.toUpperCase() !== "GET") {
            return request;
        }
        return new Request(request.url, {
            method: "GET",
            mode: "cors",
            credentials: request.credentials,
            headers: request.headers
        });
    }

    protected async cacheRequest(request: Request, response: Response): Promise<void>{
        caches.open(this.CACHE_NAME).then((cache) => {
            cache.put(request, response);
        });
    }

    protected onInstall(event: ExtendableEvent): void {
        console.info("on install");
        if (this.urlsToCache.length === 0) {
            return;
        }
        event.waitUntil(caches.open(this.CACHE_NAME).then((cache: Cache) => {
            return cache.addAll(this.urlsToCache)
        }))
    }
}
/**
 * Promise, setTimeout(300) if already resolved, do nothing.
 * at 300, if it's not resolved yet, call the callback
 */