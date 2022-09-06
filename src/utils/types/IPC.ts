export type IPCMainEvents = "openWindow" | "fetch" | "update" | "delete";

export type TableNames = "TEAMS" | "ATHLETES" | "TOURNAMENTS" | "MATCHES";

export type IPCResponse<T> = {
    status: 'success' | 'error';
    data?: T;
}