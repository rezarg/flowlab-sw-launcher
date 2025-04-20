# Flowlab Steamworks Launcher
The Flowlab Steamworks Launcher is a **third party program** that launches Flowlab games with additional features for Steam interactions, such as **Steam Achievements**, **DLC support**, and **Workshop support**.

FSWL is brought to you by yours truly, ***rezarg***.

"But rezarg, where's the source files?" <-- You may be asking... Truth is, I hate github. I ran into so many problems and just got sick of it, so I just cleared the repo. I'll fix it eventually, but for now you can get the source files by [shooting me an email](mailto:contact.rezarg@gmail.com?subject=FSWL%20Source%20Files&body=Hey!%0A%0ACould%20I%20get%20the%20FSWL%20source%20files%3F).

Okay okay, now that we've got that out of the way, let's get on to actually using this junk.

## Installation
Head on over to [releases](https://github.com/rezarg/flowlab-sw-launcher/releases) and select the latest release. There, you'll find some important assets: `achievements.txt`, `dlcs.txt`, `workshop.txt`, `Production.zip`, and `LauncherConsole.exe`.

These files are:
1. `achievements.txt`: This includes the Behavior Import code for the Achievements bundle (This will be used to add Steam Achievement support to your game.)
2. `dlcs.txt`: This includes the Behavior Import code for the DLCs bundle (This will be used to add DLC support to your game.)
3. `workshop.txt`: You get the gist.
4. `Production.zip`: This zip file contains the `Launcher.exe` which will run your game along with the Flowlab Interactions API server, and a template `LauncherConfig.json` file which will be used soon to configure your Launcher.
5. `LauncherConsole.exe`: This is the same as `Launcher.exe` from `Production.zip`, but is meant for development and debugging. Do not include this in public releases of your game.

FSWL is two parts: The Launcher and the Bundle(s). You see, the Launcher will run your game along with a private backend server that the Bundles can communicate with. Without the launcher, the bundles won't work!

### But what the heck is `Launcher.exe` and `LauncherConsole.exe`?

* Launcher.exe should be used for production / public releases of your game as it will run the Flowlab Interactions API server in the background, allowing your players to have a nice, smooth gaming experience.

* LauncherConsole.exe can be used for development / private testing of your game as it will run the Flowlab Interactions API server in the foreground, meaning you can see all those juicy logs and errors. (If something breaks, this will show you what happened!)

Once you've installed and extracted `Production.zip`, smack all the files in it right in your game's folder next to the main executable. (See the file structure example below to verify)

Open up LauncherConfig.json with any text editor -- yes, even Notepad will work. Where it says `"application": ""`, change it to point towards your game's executable (relative to the Launcher and LauncherConfig). It should look something like `"application": "./MyGame.exe"`

Next, you'll need to replace `480` with your game's appId. If you don't know what it is, you can find it on the store page of your game in the url. I'll use Parse-O-Rhythm as an example (I'm sure sup3r87 won't mind): [https://store.steampowered.com/app/2988830/ParseORhythm/](https://store.steampowered.com/app/2988830/ParseORhythm/). You're lookin' for that number after /app/, `298830` in this case. Your LauncherConfig should look something like this now:
```json
{
  "application": "./ParseORhythm.exe",
  "app_id": 2988830
}
```
But of course with your game's executable and appId.

Your file structure should look like so:
```txt
bin/
├── assets/
├── manifest/
├── workshop/
│   └── preview.png
├── icon.ico
├── Launcher.exe
├── LauncherConfig.json
├── lime.ndll
└── YourGameName.exe
```

And uh... That's it, actually. Well, for the most part. There's a bit more you can do, and you can learn about that below.

## Workshop customization
You may have noticed the `workshop/` folder included in `Production.zip`. If you open it up, you'll find `preview.png`. This is the default image if workshop assets. (A workshop item's image can be changed after uploading, this is just the default!)
