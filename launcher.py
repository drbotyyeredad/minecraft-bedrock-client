#!/usr/bin/env python3
"""
Minecraft Bedrock Edition Client Launcher
No injection - uses official Add-ons and Scripting API
"""

import os
import json
import shutil
import uuid
from pathlib import Path
from tkinter import Tk, ttk, messagebox, filedialog, simpledialog
import subprocess
import platform

class BedrockClientLauncher:
    def __init__(self):
        self.root = Tk()
        self.root.title("Bedrock Client Launcher")
        self.root.geometry("700x550")
        self.root.resizable(True, True)
        
        # Paths
        if platform.system() == "Windows":
            appdata = Path.home() / "AppData" / "Local" / "Packages"
            self.bedrock_path = None
            for folder in appdata.iterdir():
                if "Microsoft.MinecraftUWP" in folder.name or "Microsoft.Minecraft_" in folder.name:
                    self.bedrock_path = folder / "LocalState" / "games" / "com.mojang"
                    break
        else:
            self.bedrock_path = Path.home() / ".minecraft_bedrock"
        
        if self.bedrock_path and self.bedrock_path.exists():
            self.dev_packs_path = self.bedrock_path / "development_behavior_packs"
        else:
            self.dev_packs_path = Path.home() / "BedrockAddons"
        
        self.dev_packs_path.mkdir(parents=True, exist_ok=True)
        self.config_file = Path.home() / ".bedrock_launcher_config.json"
        
        self.load_config()
        self.setup_ui()
    
    def load_config(self):
        """Load saved addon list"""
        if self.config_file.exists():
            with open(self.config_file) as f:
                self.config = json.load(f)
        else:
            self.config = {"addons": []}
    
    def save_config(self):
        """Save addon list"""
        with open(self.config_file, 'w') as f:
            json.dump(self.config, f, indent=2)
    
    def setup_ui(self):
        """Build GUI"""
        # Title
        title_frame = ttk.Frame(self.root)
        title_frame.pack(fill="x", padx=10, pady=10)
        ttk.Label(title_frame, text="🎮 Bedrock Client Launcher", font=("Arial", 16, "bold")).pack(side="left")
        ttk.Label(title_frame, text="(Official Add-ons - No Injection)", font=("Arial", 9, "italic")).pack(side="left", padx=10)
        
        # Addon List Frame
        list_frame = ttk.LabelFrame(self.root, text="Installed Add-ons", padding=10)
        list_frame.pack(fill="both", expand=True, padx=10, pady=5)
        
        # Scrollable listbox
        scroll = ttk.Scrollbar(list_frame)
        scroll.pack(side="right", fill="y")
        
        self.addon_list = ttk.Treeview(list_frame, columns=("Status", "Path"), height=12, yscrollcommand=scroll.set)
        scroll.config(command=self.addon_list.yview)
        self.addon_list.heading("#0", text="Addon Name")
        self.addon_list.heading("Status", text="Status")
        self.addon_list.heading("Path", text="Path")
        self.addon_list.column("#0", width=200)
        self.addon_list.column("Status", width=80)
        self.addon_list.column("Path", width=300)
        self.addon_list.pack(fill="both", expand=True)
        
        self.refresh_addon_list()
        
        # Button Frame
        btn_frame = ttk.Frame(self.root)
        btn_frame.pack(pady=10)
        
        ttk.Button(btn_frame, text="➕ Create Addon", command=self.create_addon).grid(row=0, column=0, padx=3)
        ttk.Button(btn_frame, text="📂 Import Addon", command=self.import_addon).grid(row=0, column=1, padx=3)
        ttk.Button(btn_frame, text="📁 Open Folder", command=self.open_folder).grid(row=0, column=2, padx=3)
        ttk.Button(btn_frame, text="🎮 Launch Game", command=self.launch_game).grid(row=0, column=3, padx=3)
        ttk.Button(btn_frame, text="🔄 Refresh", command=self.refresh_addon_list).grid(row=0, column=4, padx=3)
        
        # Status bar
        self.status_var = ttk.StringVar(value=f"Addons Path: {self.dev_packs_path}")
        ttk.Label(self.root, textvariable=self.status_var, relief="sunken").pack(fill="x", padx=5, pady=5)
    
    def refresh_addon_list(self):
        """Refresh the addon list display"""
        for item in self.addon_list.get_children():
            self.addon_list.delete(item)
        
        if self.dev_packs_path.exists():
            for addon_dir in sorted(self.dev_packs_path.iterdir()):
                if addon_dir.is_dir():
                    manifest_path = addon_dir / "manifest.json"
                    if manifest_path.exists():
                        try:
                            with open(manifest_path) as f:
                                manifest = json.load(f)
                                name = manifest.get("header", {}).get("name", addon_dir.name)
                                status = "✅ Enabled"
                                self.addon_list.insert("", "end", text=name, values=(status, str(addon_dir)))
                        except Exception as e:
                            self.addon_list.insert("", "end", text=addon_dir.name, values=("❌ Error", str(addon_dir)))
    
    def create_addon(self):
        """Create a new addon from template"""
        name = simpledialog.askstring("Create New Addon", "Enter addon name:")
        if not name:
            return
        
        # Validate name
        if not name.replace("_", "").replace("-", "").isalnum():
            messagebox.showerror("Error", "Addon name must be alphanumeric with underscores/hyphens only")
            return
        
        addon_path = self.dev_packs_path / name
        if addon_path.exists():
            messagebox.showerror("Error", f"Addon '{name}' already exists!")
            return
        
        addon_path.mkdir(exist_ok=True)
        
        # Create manifest
        header_uuid = str(uuid.uuid4())
        module_uuid = str(uuid.uuid4())
        
        manifest = {
            "format_version": 2,
            "header": {
                "name": name,
                "description": f"{name} addon",
                "uuid": header_uuid,
                "version": [1, 0, 0]
            },
            "modules": [
                {
                    "description": "Script module",
                    "type": "javascript",
                    "uuid": module_uuid,
                    "version": [1, 0, 0]
                }
            ],
            "dependencies": [
                {
                    "module_name": "@minecraft/server",
                    "version": "1.10.0"
                }
            ]
        }
        
        with open(addon_path / "manifest.json", 'w') as f:
            json.dump(manifest, f, indent=2)
        
        # Create scripts directory
        scripts_dir = addon_path / "scripts"
        scripts_dir.mkdir(exist_ok=True)
        
        # Create main.js
        main_js = '''import { world } from "@minecraft/server";

// Welcome to your Bedrock addon!
// Enable experimental gameplay in your world settings to use scripts

world.beforeEvents.chatSend.subscribe(ev => {
    if (ev.message.startsWith("!")) {
        ev.cancel = true;
        const command = ev.message.substring(1);
        ev.sender.runCommandAsync(`say Custom command: ${command}`);
    }
});

world.afterEvents.playerSpawn.subscribe(ev => {
    ev.player.runCommandAsync("title @s actionbar §aWelcome to this Bedrock addon!");
});
'''
        with open(scripts_dir / "main.js", 'w') as f:
            f.write(main_js)
        
        messagebox.showinfo("Success", f"Addon '{name}' created!\n\nLocation: {addon_path}\n\nEnable experimental gameplay in your world settings to use it.")
        self.refresh_addon_list()
    
    def import_addon(self):
        """Import an existing addon folder"""
        folder = filedialog.askdirectory(title="Select Addon Folder")
        if folder and Path(folder).is_dir():
            addon_name = Path(folder).name
            dest = self.dev_packs_path / addon_name
            
            if dest.exists():
                messagebox.showwarning("Warning", f"Addon '{addon_name}' already exists!")
                return
            
            try:
                shutil.copytree(folder, dest)
                messagebox.showinfo("Success", f"Addon '{addon_name}' imported!")
                self.refresh_addon_list()
            except Exception as e:
                messagebox.showerror("Error", f"Failed to import addon: {e}")
    
    def open_folder(self):
        """Open addons folder in file explorer"""
        try:
            if platform.system() == "Windows":
                os.startfile(self.dev_packs_path)
            elif platform.system() == "Darwin":  # macOS
                subprocess.run(["open", self.dev_packs_path])
            else:  # Linux
                subprocess.run(["xdg-open", self.dev_packs_path])
        except Exception as e:
            messagebox.showerror("Error", f"Could not open folder: {e}")
    
    def launch_game(self):
        """Launch Minecraft Bedrock"""
        try:
            if platform.system() == "Windows":
                subprocess.Popen("minecraft://")
            else:
                messagebox.showinfo("Info", "Please launch Minecraft manually from your system.")
            messagebox.showinfo("Launched", "Minecraft Bedrock launching...\n\nRemember to enable Experimental Gameplay in your world settings!")
        except Exception as e:
            messagebox.showerror("Error", f"Could not launch Minecraft: {e}")
    
    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    launcher = BedrockClientLauncher()
    launcher.run()
