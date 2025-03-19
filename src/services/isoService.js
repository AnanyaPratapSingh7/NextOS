const { exec } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

class ISOService {
  constructor() {
    this.workDir = path.join(process.cwd(), 'work');
    this.outputDir = path.join(process.cwd(), 'output');
  }

  async initialize() {
    try {
      await fs.mkdir(this.workDir, { recursive: true });
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      console.error('Failed to initialize directories:', error);
      throw error;
    }
  }

  async generateISO(config) {
    try {
      await this.initialize();
      
      // Create pacstrap directory
      const pacstrapDir = path.join(this.workDir, 'pacstrap');
      await fs.mkdir(pacstrapDir, { recursive: true });

      // Install base system
      await this.installBaseSystem(pacstrapDir, config.baseSystem);

      // Install desktop environment
      await this.installDesktopEnvironment(pacstrapDir, config.desktopEnvironment);

      // Install additional software
      await this.installSoftware(pacstrapDir, config.software);

      // Apply system tweaks
      await this.applySystemTweaks(pacstrapDir, config.systemTweaks);

      // Generate ISO
      const isoName = `nextos-${Date.now()}.iso`;
      const isoPath = path.join(this.outputDir, isoName);
      
      await this.createISO(pacstrapDir, isoPath);

      return {
        success: true,
        isoPath,
        isoName,
      };
    } catch (error) {
      console.error('Failed to generate ISO:', error);
      throw error;
    }
  }

  async installBaseSystem(pacstrapDir, config) {
    const basePackages = ['base', 'linux', 'linux-firmware'];
    
    if (config.nvidiaDrivers) {
      basePackages.push('nvidia', 'nvidia-utils');
    }
    if (config.amdDrivers) {
      basePackages.push('mesa', 'xf86-video-amdgpu');
    }
    if (config.intelDrivers) {
      basePackages.push('mesa', 'xf86-video-intel');
    }
    if (config.firmware) {
      basePackages.push('linux-firmware');
    }

    await this.runCommand(`pacstrap ${pacstrapDir} ${basePackages.join(' ')}`);
  }

  async installDesktopEnvironment(pacstrapDir, config) {
    const dePackages = {
      gnome: ['gnome', 'gnome-extra'],
      kde: ['plasma', 'plasma-extra'],
      xfce: ['xfce4', 'xfce4-goodies'],
      cinnamon: ['cinnamon'],
      mate: ['mate', 'mate-extra'],
      lxqt: ['lxqt', 'lxqt-extra'],
    };

    const wmPackages = {
      i3: ['i3', 'i3status', 'i3lock'],
      bspwm: ['bspwm', 'sxhkd'],
      hyprland: ['hyprland', 'waybar'],
      openbox: ['openbox', 'tint2'],
      sway: ['sway', 'waybar'],
    };

    if (config.type === 'desktop' && dePackages[config.selectedDE]) {
      await this.runCommand(`pacstrap ${pacstrapDir} ${dePackages[config.selectedDE].join(' ')}`);
    } else if (config.type === 'wm' && wmPackages[config.selectedWM]) {
      await this.runCommand(`pacstrap ${pacstrapDir} ${wmPackages[config.selectedWM].join(' ')}`);
    }
  }

  async installSoftware(pacstrapDir, config) {
    const selectedPackages = Object.entries(config.selectedPackages)
      .filter(([_, selected]) => selected)
      .map(([packageName]) => packageName);

    if (selectedPackages.length > 0) {
      await this.runCommand(`pacstrap ${pacstrapDir} ${selectedPackages.join(' ')}`);
    }
  }

  async applySystemTweaks(pacstrapDir, config) {
    // TODO: Implement system tweaks application
    // This would include:
    // - Configuring display server (X11/Wayland)
    // - Setting up auto-login
    // - Configuring swap
    // - Setting up partitioning
    // - Importing dotfiles
  }

  async createISO(pacstrapDir, outputPath) {
    await this.runCommand(`mkarchiso -v -w ${this.workDir} -o ${this.outputDir} ${pacstrapDir}`);
  }

  async runCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${command}`, error);
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }
}

module.exports = new ISOService(); 