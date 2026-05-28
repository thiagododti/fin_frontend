type TokenCallback = (token: string | null) => void;

let isRefreshing = false;
const queue: TokenCallback[] = [];

export function isRefreshInProgress() {
    return isRefreshing;
}

export function startRefresh() {
    isRefreshing = true;
}

export function resolveRefresh(newToken: string) {
    isRefreshing = false;
    queue.forEach((cb) => cb(newToken));
    queue.length = 0;
}

export function failRefresh() {
    isRefreshing = false;
    queue.forEach((cb) => cb(null));
    queue.length = 0;
}

export function waitForRefresh(): Promise<string | null> {
    return new Promise((resolve) => {
        queue.push(resolve);
        setTimeout(() => {
            if (queue.includes(resolve)) {
                failRefresh();
            }
        }, 10_000);
    });
}
