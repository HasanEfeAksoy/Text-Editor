const electron = require("electron");
const url = require("url");
const path = require("path");
const { app, BrowserWindow, Menu, ipcMain, dialog, MenuItem } = electron;

const fileBusinnes = require("fs");



var mainWindow;

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },

        width: 610,
        height: 600,
        backgroundColor: "#262626"
    });
    mainWindow.loadURL(
        url.format({
            pathname : path.join(__dirname, "main.html"),
            protocol : "file",
            slashes : true
        }
        )
    );

    mainWindow.setMaximumSize(610, 620);
    mainWindow.setMaximizable(false);


    function newfile() {
        mainWindow.webContents.send("newfile", "");
    }


    function savefile() {
        mainWindow.webContents.send("savefile", "value:savefile");
    }
    ipcMain.on("savefile_html", (event, data) => {
        dialog.showSaveDialog(mainWindow, { title: "Save File.."  } ).then(result => {
            
            if (!result.canceled) {
                fileBusinnes.writeFile(result.filePath, data, (error) => {
                    if (error) {
                        console.log(error.message);
                    }

                })
            }
        }).catch(err => {
            console.log(err);
        })
    })


    function openfile() {
        dialog.showOpenDialog(mainWindow, { title: "Open File.." } ).then(result => {
            if (!result.canceled) {
                fileBusinnes.readFile(result.filePaths[0], (error, data) => {
                    if (error) {
                        console.log(error.message);
                    }
                    mainWindow.webContents.send("openfile", data.toString());
                })
            }
        }).catch(err => {
            console.log(err);
        })
    }



    const ctxMenu = new Menu();
    ctxMenu.append(new MenuItem({label : "Undo", accelerator : process.platform == "darwin" ? "Command+Z" : "Ctrl+Z", role: "undo"}))
    ctxMenu.append(new MenuItem({label : "Redo", accelerator : process.platform == "darwin" ? "Command+Y" : "Ctrl+Y", role: "redo"}))
    ctxMenu.append(new MenuItem({type: "separator"}))
    ctxMenu.append(new MenuItem({label : "Cut", accelerator : process.platform == "darwin" ? "Command+X" : "Ctrl+X", role: "cut"}))
    ctxMenu.append(new MenuItem({label : "Copy", accelerator : process.platform == "darwin" ? "Command+C" : "Ctrl+C", role: "copy"}))
    ctxMenu.append(new MenuItem({label : "Paste", accelerator : process.platform == "darwin" ? "Command+V" : "Ctrl+V", role: "paste"}))
    ctxMenu.append(new MenuItem({type: "separator"}))
    ctxMenu.append(new MenuItem({label : "Delete", accelerator : process.platform == "darwin" ? "Delete" : "Delete", role: "delete"}))
    ctxMenu.append(new MenuItem({label : "Select All", accelerator : process.platform == "darwin" ? "Command+A" : "Ctrl+A", role: "selectall"}))

    mainWindow.webContents.on("context-menu", (e, params) => {
        ctxMenu.popup(mainWindow, params.x, params.y)
    })


    const mainMenuTemplate = [
    
        {
            label : "File",
            submenu : [
                {
                    label : "New File",
                    accelerator : process.platform == "darwin" ? "Command+N" : "Ctrl+N",
                    click: () => {
                        newfile();
                    }
                },
                {
                    label : "Save As File",
                    accelerator : process.platform == "darwin" ? "Command+S" : "Ctrl+S",
                    click : () => {
                        savefile();
                    }
                },
                {
                    label : "Open File",
                    accelerator : process.platform == "darwin" ? "Command+O" : "Ctrl+O",
                    click : () => {
                        openfile();
                    }
                },
                {
                    type : "separator"
                },
                {
                    label : "Exit",
                    role : "quit"
                }
            ]
        },
        {
            label : "Edit",
            submenu : [
                {
                    label : "Undo",
                    accelerator : process.platform == "darwin" ? "Command+Z" : "Ctrl+Z",
                    role: "undo"
                },
                {
                    label : "Redo",
                    accelerator : process.platform == "darwin" ? "Command+Y" : "Ctrl+Y",
                    role: "redo"
                },
                {
                    type: "separator"
                },
                {
                    label : "Cut",
                    accelerator : process.platform == "darwin" ? "Command+X" : "Ctrl+X",
                    role: "cut"
                },
                {
                    label : "Copy",
                    accelerator : process.platform == "darwin" ? "Command+C" : "Ctrl+C",
                    role: "copy"
                },
                {
                    label : "Paste",
                    accelerator : process.platform == "darwin" ? "Command+V" : "Ctrl+V",
                    role: "paste"
                },
                {
                    type: "separator"
                },
                {
                    label : "Delete",
                    accelerator : process.platform == "darwin" ? "Delete" : "Delete",
                    role: "delete"
                },
                {
                    label : "Select All",
                    accelerator : process.platform == "darwin" ? "Command+A" : "Ctrl+A",
                    role: "selectall"
                }
            ]
        }
         //,
        // {
        //     label : "DEV TOOLS",
        //     click : () => {
        //         mainWindow.webContents.toggleDevTools();
        //     }
        // }
    ]
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
})