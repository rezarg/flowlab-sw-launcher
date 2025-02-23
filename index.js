const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

//const steamworks = require("steamworks.js");
const ngrok = require("ngrok");

const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const config = JSON.parse(fs.readFileSync("./LauncherConfig.json", "utf-8"));
const gamePath = config.application;

console.log(`Loaded config.json: ${JSON.stringify(config)}`);

const game = spawn(gamePath, [], { detached: true, stdio: "ignore" });
game.unref();

game.on("close", (code) => {
  console.log(`Game exited with code ${code}`);
  process.exit(code);
});

app.post("/flowlab/achievement/", (req, res) => {
  //if (client.achievement.activate(req.body.id)) {
  //  console.log(`Activated achievement: ${req.body.id}`);
  //}

  const userStats = SteamUserStats();
  const achievementId = req.body.id;

  if (SetAchievement(userStats, achievementId)) {
    console.log("Unlocked achievement:", achievementId);
    StoreStats(userStats);
  } else {
    console.log("Failed to set achievement:", achievementId);
  }

  res.sendStatus(200);
});

let steam_appid = 480;
try {
  const steam_appid_txt = fs.readFileSync(path.join(gamePath, "../steam_appid.txt"), "utf-8");
  steam_appid = parseInt(steam_appid_txt);
} catch (err) {
  console.log(`${path.join(gamePath, "../steam_appid.txt")} steam_appid.txt not found, using 480 as default`);
}

//const client = steamworks.init(steam_appid);

// Hard-Coded Steamworks
//const nativeBinding = require('./steamworksjs.win32-x64-msvc.node');
//const nativeBinding = require(`${__dirname}/steamworksjs.win32-x64-msvc.node`)
//const nativeBinding = require(path.resolve(__dirname, "steamworksjs.win32-x64-msvc.node"))
//const nativeBinding = require(path.resolve(__dirname, "steamworksjs.node"))
const koffi = require("koffi");
//const { init: internalInit, runCallbacks, restartAppIfNecessary, ...api } = nativeBinding
//const { init: internalInit, runCallbacks, restartAppIfNecessary, ...api } = koffi.load(path.resolve(__dirname, "steamworksjs.node"));
const steamAPI = koffi.load(path.resolve(__dirname, "steam_api64.dll"));
process.on('exit', steamAPI.func('void SteamAPI_Shutdown()'));

//const SteamUserStats = steamAPI.func('void* SteamUserStats()');
const SteamUserStats = steamAPI.func('void* SteamAPI_SteamUserStats_v012()');
const SetAchievement = steamAPI.func('bool SteamUserStats_SetAchievement(void*, const char*)');
//const GetAchievement = steamAPI.func('bool SteamUserStats_GetAchievement(void*, const char*, bool*)');
const StoreStats = steamAPI.func('bool SteamUserStats_StoreStats(void*)');

//if (steamAPI.func("bool SteamAPI_RestartAppIfNecessary(uint32)")(steam_appid)) {
//  console.log("SteamAPI_RestartAppIfNecessary");
//  process.exit(1);
//}

const initResult = steamAPI.func("bool SteamAPI_Init()")();
if (!initResult) {
  console.log("SteamAPI_Init failed. Returned:", initResult);
  process.exit(1);
}

//internalInit(steam_appid)
//setInterval(runCallbacks, 1000 / 30)
setInterval(() => {
  steamAPI.func("void SteamAPI_RunCallbacks()")();
}, 1000 / 30);
const client = api

console.log(`Game launched with steamworks.js\nPlayer detected: ${client.localplayer.getName()}`);

const port = 3000;
app.listen(port, async () => {
  console.log(`Server running on local port ${port}`);

  await ngrok.authtoken("2tPYQuBElWq3Eo3nJOshERTaXDS_4WHCjgaJspmjdWxKZ6DC5");
  const url = await ngrok.connect(port);

  await fetch(`https://flowlab-interactions-api-production.up.railway.app/bind-ngrok/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ngrokUrl: url,
    }),
  });

  console.log(`Ngrok tunnel established at: ${url}`);
});