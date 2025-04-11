const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { BrowserWindow } = require('electron');
const https = require('https');
const os = require('os');

class ISOGenerator {
  constructor(config) {
    this.config = config;
    this.containerName = 'nextos-builder';
    this.archIsoPath = path.join(process.env.APPDATA || process.env.HOME, 'NextOS', 'archlinux.iso');
    this.terminalWindow = null;
  }

  createTerminalWindow() {
    this.terminalWindow = new BrowserWindow({
      width: 800,
      height: 600,
      title: 'NextOS ISO Generation Progress',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    this.terminalWindow.loadFile(path.join(__dirname, '../components/Terminal.html'));
    this.logToTerminal('Starting ISO generation process...\n');
  }

  logToTerminal(message) {
    if (this.terminalWindow && !this.terminalWindow.isDestroyed()) {
      this.terminalWindow.webContents.send('terminal-output', message);
    }
  }

  async checkDocker() {
    try {
      await this.executeCommand('docker --version');
      this.logToTerminal('✓ Docker is installed\n');
    } catch (error) {
      throw new Error('Docker is not installed or not running. Please install Docker and try again.');
    }
  }

  async downloadArchISO() {
    if (fs.existsSync(this.archIsoPath)) {
      this.logToTerminal('✓ Arch ISO already exists\n');
      return;
    }

    this.logToTerminal('Downloading Arch Linux ISO...\n');
    const isoUrl = 'https://geo.mirror.pkgbuild.com/iso/latest/archlinux-x86_64.iso';
    
    // Create directory if it doesn't exist
    const dir = path.dirname(this.archIsoPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(this.archIsoPath);
      https.get(isoUrl, (response) => {
        const total = parseInt(response.headers['content-length'], 10);
        let current = 0;

        response.on('data', (chunk) => {
          current += chunk.length;
          const progress = (current / total * 100).toFixed(2);
          this.logToTerminal(`Download progress: ${progress}%\r`);
        });

        response.pipe(file);
        file.on('finish', () => {
          file.close();
          this.logToTerminal('\n✓ Arch ISO downloaded successfully\n');
          resolve();
        });
      }).on('error', (err) => {
        fs.unlink(this.archIsoPath, () => {});
        reject(err);
      });
    });
  }

  async generateISO() {
    try {
      this.createTerminalWindow();
      
      // Step 1: Check Docker
      await this.checkDocker();

      // Step 2: Download Arch ISO if needed
      await this.downloadArchISO();

      // Step 3: Create and start Docker container
      await this.setupDockerContainer();

      // Step 4: Run archinstall with selected options
      await this.runArchinstall();

      // Step 5: Run post-installation scripts
      await this.runPostInstallation();

      // Step 6: Generate final ISO
      await this.createFinalISO();

      // Step 7: Cleanup
      await this.cleanup();

      this.logToTerminal('\n✓ ISO generation completed successfully!\n');
      
      return {
        success: true,
        message: 'ISO generated successfully',
        isoPath: path.join(process.env.HOME || process.env.USERPROFILE, 'Downloads', 'nextos.iso')
      };
    } catch (error) {
      this.logToTerminal(`\n❌ Error: ${error.message}\n`);
      return {
        success: false,
        message: error.message
      };
    }
  }

  async setupDockerContainer() {
    this.logToTerminal('Setting up Docker container...\n');
    
    // First, make sure any existing container is removed
    try {
      await this.executeCommand(`docker rm -f ${this.containerName}`);
    } catch (error) {
      // Ignore errors if container doesn't exist
    }
    
    // Create a new container with necessary permissions and mounts
    const command = `docker run -d --name ${this.containerName} \
      --privileged \
      -v "${this.archIsoPath}:/arch.iso:ro" \
      -v "${path.join(__dirname, '../../temp-archinstall-config.json')}:/archinstall-config.json:ro" \
      archlinux:base-devel \
      tail -f /dev/null`; // Keep container running
    
    await this.executeCommand(command);
    
    // Verify container is running
    const containerStatus = await this.executeCommand(`docker ps --filter name=${this.containerName} --format "{{.Status}}"`);
    if (!containerStatus.includes("Up")) {
      throw new Error("Failed to start Docker container");
    }
    
    this.logToTerminal('✓ Docker container created and running\n');
  }

  async runArchinstall() {
    this.logToTerminal('Configuring system with archinstall...\n');
    
    // Install archinstall if not already installed
    await this.executeCommand(`docker exec ${this.containerName} pacman -Sy --noconfirm archinstall`);
    
    // Run archinstall with the config file
    const command = `docker exec ${this.containerName} archinstall --config /archinstall-config.json`;
    await this.executeCommand(command);
    this.logToTerminal('✓ System configuration completed\n');
  }

  async runPostInstallation() {
    this.logToTerminal('Running post-installation tasks...\n');
    const script = this.generatePostInstallScript();
    const command = `docker exec ${this.containerName} bash -c "${script}"`;
    await this.executeCommand(command);
    this.logToTerminal('✓ Post-installation tasks completed\n');
  }

  async createFinalISO() {
    this.logToTerminal('Creating final ISO...\n');
    const command = `docker exec ${this.containerName} makearchiso -w /work -o /output nextos.iso`;
    await this.executeCommand(command);
    this.logToTerminal('✓ Final ISO created\n');
  }

  async cleanup() {
    this.logToTerminal('Cleaning up...\n');
    const command = `docker stop ${this.containerName} && docker rm ${this.containerName}`;
    await this.executeCommand(command);
    this.logToTerminal('✓ Cleanup completed\n');
  }

  async executeCommand(command) {
    return new Promise((resolve, reject) => {
      console.log(`Executing command: ${command}`);
      const process = spawn(command, [], { shell: true });
      
      let stdout = '';
      let stderr = '';

      process.stdout.on('data', (data) => {
        const output = data.toString();
        stdout += output;
        console.log(`Command output: ${output}`);
        this.logToTerminal(output);
      });

      process.stderr.on('data', (data) => {
        const error = data.toString();
        stderr += error;
        console.error(`Command error: ${error}`);
        this.logToTerminal(error);
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve(stdout.trim());
        } else {
          reject(new Error(`Command failed with exit code ${code}\nCommand: ${command}\nError: ${stderr}`));
        }
      });
    });
  }

  generateArchinstallConfig() {
    // Convert user selections to archinstall configuration
    const config = {
      hostname: this.config.systemConfig.hostname,
      locale: this.config.systemConfig.locale,
      keyboard_layout: this.config.systemConfig.keyboardLayout,
      mirror_region: this.config.systemConfig.mirrorRegion,
      bootloader: this.config.systemConfig.bootloader,
      audio: this.config.systemConfig.audio,
      kernel: this.config.systemConfig.kernel,
      network_manager: this.config.systemConfig.networkManager,
      timezone: this.config.systemConfig.timezone,
      root_password: this.config.systemConfig.rootPassword,
      filesystem: this.config.systemTweaks.filesystem,
      user_account: {
        username: this.config.systemConfig.userAccount.username,
        password: this.config.systemConfig.userAccount.password,
        groups: this.config.systemConfig.userAccount.groups
      },
      desktop_environment: this.config.desktopEnvironment.type === 'desktop' 
        ? this.config.desktopEnvironment.selectedDE 
        : this.config.desktopEnvironment.selectedWM,
      packages: this.getSelectedPackages()
    };

    // Write config to temporary file
    const configPath = path.join(__dirname, '../../temp-archinstall-config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    return configPath;
  }

  generatePostInstallScript() {
    // Generate post-installation script based on selected packages
    const packages = this.getSelectedPackages();
    const filesystem = this.config.systemTweaks.filesystem;
    
    // Add filesystem-specific packages
    let fsPackages = '';
    if (filesystem === 'btrfs') {
      fsPackages = 'btrfs-progs';
    } else if (filesystem === 'ext4') {
      fsPackages = 'e2fsprogs';
    } else if (filesystem === 'ext3') {
      fsPackages = 'e2fsprogs';
    }
    
    return `
      pacman -Syu --noconfirm
      pacman -S --noconfirm ${packages.join(' ')} ${fsPackages}
      systemctl enable NetworkManager
      systemctl enable ${this.config.systemConfig.audio}
    `;
  }

  getSelectedPackages() {
    // Convert selected packages to array
    return Object.entries(this.config.selectedPackages)
      .filter(([_, selected]) => selected)
      .map(([pkgName]) => pkgName);
  }
}

module.exports = ISOGenerator; 