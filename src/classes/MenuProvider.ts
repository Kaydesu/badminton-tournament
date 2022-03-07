import { app, Menu, MenuItemConstructorOptions } from 'electron';

export class AppMenu {
    private _name: string;
    private _subMenus: MenuItemConstructorOptions[];

    constructor(name: string, subMenus?: MenuItemConstructorOptions[]) {
        this._name = name;
        this._subMenus = subMenus || [];
    }

    generateTemplate() {
        const template: MenuItemConstructorOptions = {
            label: this._name,
            submenu: [],
        }
        template.submenu = this._subMenus.map(item => item);
        return template;
    }

    updateSubMenu(subMenus: MenuItemConstructorOptions[]) {
        this._subMenus = subMenus;
    }
}
