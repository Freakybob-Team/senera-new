const { app, BrowserWindow, screen } = require("electron");
const RPC = require("discord-rpc");
const path = require("path");

let win;

function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    win = new BrowserWindow({
        width: width,
        height: height,
        autoHideMenuBar: true,
        icon: path.join(__dirname, "logos/512x512.png"),
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile("index.html");
    win.setTitle("Senera");
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

const clientId = "1343487206593138728"; 
const rpc = new RPC.Client({ transport: "ipc" });

async function setActivity() {
    if (!rpc) return;

    rpc.setActivity({
        details: "Senera",
        state: "Chatting, I guess?",
        startTimestamp: Date.now(),
        largeImageKey: "512x512", 
        largeImageText: "Senera Beta 7"
    });
}

rpc.on("ready", () => {
    setActivity();
    setInterval(setActivity, 15 * 1000);
});

rpc.login({ clientId }).catch(console.error);

app.on("quit", () => {
    rpc.destroy();
});
