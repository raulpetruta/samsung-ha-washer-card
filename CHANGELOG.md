# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-09-07

### Added

- **Dryer support** - Card now supports Samsung dryers alongside washers
- New `dryer` configuration option (true/false) to switch between washer and dryer mode
- Animated dryer visual component with tumbling action and heat indicator
- Dryer-specific styling with orange/amber color scheme
- Support for dryer entities:
  - `sensor.dryer_completion_time`
  - `sensor.dryer_job_state`
  - `binary_sensor.dryer_power`
  - `binary_sensor.dryer_remote_control`
  - `sensor.dryer_machine_state`
  - `select.dryer`

### Changed

- Updated entity helpers to support both washer and dryer modes
- Modified sensors grid to hide water consumption for dryers
- Simplified controls section for dryers (removes washer-specific controls)
- Default icon changes based on device type (🧺 for washers, 🌪️ for dryers)
- Enhanced visual animations for dryer mode with tumbling effect

### Enhanced

- More flexible device type configuration
- Better visual distinction between washer and dryer modes
- Improved component modularity for future device type additions

## [1.0.1] - 2025-09-07

### Fixed

- Updated repository URL in distribution files
- Fixed device_name configuration in README and JavaScript files
- Improved build process with correct timestamps

### Improved

- Updated documentation for better clarity on device configuration

## [1.0.0] - 2025-08-28

### Features

- Initial release of Samsung Washer Card
- Animated washing machine with spinning drum and water effects
- Real-time status monitoring with color-coded indicators
- Support for all Samsung SmartThings washer sensors
- Configurable icons (emoji and Material Design Icons)
- Responsive grid layout for sensors and controls
- Dark/light mode automatic detection
- Configurable completion status duration
- HACS compatibility

### Capabilities

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
