import { controller, api } from "../electron/bridge";


declare global {
    // eslint-disable-next-line
    interface Window {
        Controller: typeof controller;
        Api: typeof api;
    }
}