import { app, Menu, MenuItemConstructorOptions } from 'electron';

import { AppMenu } from '@classes/MenuProvider';
import WindowManager from '@classes/WindowManager';
import { openTeamManagementWindow, openTournamentCreateWindow } from './createWindows';
import { startPrintStream, startWindowStream } from './startup';
import { setUpFetchTeam } from './setUpStreams';

const menuTemplate: MenuItemConstructorOptions[] = [];

if (require('electron-squirrel-startup')) {
  app.quit();
}

app.on('ready', () => {

  startWindowStream();
  setUpFetchTeam()
  startPrintStream();

  WindowManager.createMainWindow();
  // Construct app menu
  const tournamentMenu = new AppMenu('Giải đấu', [{
    label: "Tạo giải đấu",
    click() {
      openTournamentCreateWindow();
    }
  }]);

  // const teamManagementMenu = new AppMenu('Quản lý đội', [{
  //   label: 'Tạo đội mới',
  //   click() {
  //     openTeamManagementWindow();
  //   }
  // }]);
  
  menuTemplate.push(
    tournamentMenu.generateTemplate(),
  );

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
