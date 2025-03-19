# NextOS

A desktop application for creating custom Arch Linux ISOs with pre-configured settings, similar to ChrisTitusTech's MicroWin but for Arch Linux.

## Features

- Base system selection with essential components
- Pre-configured driver selection (NVIDIA, AMD, Intel)
- Desktop environment and window manager selection
- Software package selection
- System tweaks and preferences
- ISO generation with save functionality

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Arch Linux system with the following packages installed:
  - archiso
  - pacstrap
  - mkarchiso

## Installation

1. Clone the repository:
```bash
git clone https://github.com/AnanyaPratapSingh7/nextos.git
cd nextos
```

2. Install dependencies:
```bash
npm install
```

3. Build the application:
```bash
npm run build
```

4. Start the application:
```bash
npm start
```

## Development

To run the application in development mode:

```bash
npm run watch
```

## Building the Application

To create a distributable package:

```bash
npm run package
```

The packaged application will be available in the `dist` directory.

## Project Structure

```
nextos/
├── src/
│   ├── components/         # React components
│   ├── context/           # React context for state management
│   ├── services/          # Backend services
│   └── App.js             # Main application component
├── main.js                # Electron main process
├── package.json           # Project configuration
└── webpack.config.js      # Webpack configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by ChrisTitusTech's MicroWin
- Built with Electron and React
- Uses Material-UI for the interface 