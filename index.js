const electron = require("electron");
const { ipcRenderer } = electron;


const textaream = document.getElementById("textarea");
//textaream.value = "<html>\n\t<head>\n\t\t<title>Document</title>\n\t</head>\n\t<body>\n\n\t</body>\n</html>";


ipcRenderer.on("newfile", (event, data) => {
    textaream.value = data.toString();
})

ipcRenderer.on("savefile", (event, data) => {
    ipcRenderer.send("savefile_html", textaream.value.toString());
})

ipcRenderer.on("openfile", (event, data) => {
    textaream.value = data.toString();
})