import { controller, api } from "../electron/bridge";

import Konva from 'konva';

declare global {
    // eslint-disable-next-line
    interface Window {
        Controller: typeof controller;
        Api: typeof api;
        Konva: typeof Konva;
    }
}