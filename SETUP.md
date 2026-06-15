# Setup Guide for Bedrock Client Launcher

## Windows Setup

### 1. Install Python
- Download Python 3.7+ from [python.org](https://www.python.org/downloads/)
- **Important**: Check "Add Python to PATH" during installation
- Verify installation: Open Command Prompt and run `python --version`

### 2. Clone Repository
```bash
git clone https://github.com/drbotyyeredad/minecraft-bedrock-client.git
cd minecraft-bedrock-client
```

### 3. Run Launcher
```bash
python launcher.py
```

## macOS Setup

### 1. Install Python (if not already installed)
```bash
brew install python3
```

### 2. Clone Repository
```bash
git clone https://github.com/drbotyyeredad/minecraft-bedrock-client.git
cd minecraft-bedrock-client
```

### 3. Run Launcher
```bash
python3 launcher.py
```

## Linux Setup

### 1. Install Python & Tkinter
```bash
sudo apt-get install python3 python3-tk
```

### 2. Clone Repository
```bash
git clone https://github.com/drbotyyeredad/minecraft-bedrock-client.git
cd minecraft-bedrock-client
```

### 3. Run Launcher
```bash
python3 launcher.py
```

## Bedrock Edition Setup

### Enable Experimental Gameplay

1. **Create a new world** (or edit an existing one)
2. Go to **Settings → Experiments**
3. Enable:
   - ✅ **Upcoming Creator Features**
   - ✅ **Script Debugger**
   - ✅ **Scripts** (under Experimental)
4. Create/join the world
5. Your addons will load automatically

### View Script Errors

If your scripts have errors:
1. Press `F8` (or use the console command `/script`)
2. This opens the **Script Debugger** where you can see errors
3. Fix the JavaScript code in your addon's `scripts/main.js`

## Addon Folder Locations

The launcher automatically finds your addon folder:

**Windows:**
```
%APPDATA%\..\Local\Packages\Microsoft.MinecraftUWP_[random]\LocalState\games\com.mojang\development_behavior_packs
```

**Fallback:**
```
%USERPROFILE%\BedrockAddons
```

**macOS/Linux:**
```
~/.minecraft_bedrock/development_behavior_packs
```

Or:
```
~/BedrockAddons
```

## Troubleshooting

### Python not found
- Ensure Python 3.7+ is installed
- Ensure it's added to your system PATH
- Try `python3` instead of `python`

### Tkinter not installed (Linux)
```bash
sudo apt-get install python3-tk
```

### Minecraft path not found
- The launcher will create a `BedrockAddons` folder in your home directory
- You can manually point to your Bedrock folder
- Edit the `dev_packs_path` variable in `launcher.py` if needed

### Addons not appearing in game
- Ensure the addon folder is in the correct location
- Enable experimental gameplay in world settings
- Restart the game after adding addons
- Check that `manifest.json` is valid JSON

### Scripts not executing
- Enable Script Debugger in experimental features
- Check the debugger (`F8`) for errors
- Ensure you're using valid JavaScript
- Reload the world

## Getting Help

- [Official Minecraft Bedrock API Docs](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/)
- [Script API Examples](https://github.com/Mojang/minecraft-samples)
- [Bedrock Add-on Forum](https://www.reddit.com/r/MinecraftAddons/)

---

Happy scripting! 🎮
