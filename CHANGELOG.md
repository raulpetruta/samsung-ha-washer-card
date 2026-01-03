# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2026-01-03

### Improved

- Updated grid layout configuration for better responsiveness in sections view (min/max columns)
- Improved device name auto-detection logic to avoid incorrect defaults
- Enhanced configuration editor behavior when no device is selected

## [1.0.2] - 2025-12-17

### Improved

- Enhanced configuration editor with entity picker for easier device selection
- Fixed issue where configuration editor would appear empty on initial load
- Removed manual grid layout options in favor of Home Assistant's native layout controls

## [1.0.1] - 2025-09-07

### Fixed

- Updated repository URL in distribution files
- Fixed device_name configuration in README and JavaScript files
- Improved build process with correct timestamps

### Changed

- Updated documentation for better clarity on device configuration

## [1.0.0] - 2025-08-28

### Added

- Initial release of Samsung Washer Card
- Animated washing machine with spinning drum and water effects
- Real-time status monitoring with color-coded indicators
- Support for all Samsung SmartThings washer sensors
- Configurable icons (emoji and Material Design Icons)
- Responsive grid layout for sensors and controls
- Dark/light mode automatic detection
- Configurable completion status duration
- HACS compatibility

### Features

- **Visual Design**: Modern appliance-inspired color scheme
- **Animations**: Spinning drum when running, bubbling water effects
- **Sensors**: Energy, water consumption, completion time, job state
- **Controls**: Child lock, remote control, bubble soak, detergent settings
- **Configuration**: Custom device names, icons, and status durations
- **Responsive**: Works on desktop, tablet, and mobile devices

### Supported Entities

- Machine state and job state sensors
- Energy consumption and savings tracking
- Water consumption monitoring
- Power status and consumption
- Control switches and selectors
- Completion time with smart formatting
