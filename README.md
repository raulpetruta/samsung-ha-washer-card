# Samsung Washer Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs)
[![GitHub release](https://img.shields.io/github/v/release/raulpetruta/samsung-ha-washer-card?sort=date&display_name=tag)](https://github.com/raulpetruta/samsung-ha-washer-card/releases/latest)

A beautiful, animated Home Assistant card for Samsung washing machines. It reads entities from Home Assistant and does not call Samsung's cloud API.

> [!IMPORTANT]
> Samsung's paid SmartThings API is a greedy charge for hardware people already own. This project does not use that API.
>
> The washer is connected on your local network with [LocalThings](https://github.com/mbillow/localthings). This card only shows the entities Home Assistant already has.
>
> 📺 **Louis Rossmann on the SmartThings API change:** https://www.youtube.com/watch?v=V5q4xWf4h80
>
> 📖 **Background:** https://consumerrights.wiki/w/Samsung_SmartThings_API_monetization

Existing dashboards that still use the old SmartThings entity names keep working.

## Connect the washer

This card does not talk to the washer. [LocalThings](https://github.com/mbillow/localthings) does that on your local network, then the card reads the entities it creates.

1. Set the washer up in the SmartThings app once so it joins your Wi-Fi. Keep it registered there. Removing it can wipe the Wi-Fi settings the next time the washer reaches Samsung.
2. Find the washer's IP address in your router, or in the SmartThings app. A DHCP reservation keeps that address stable.
3. In HACS, open **Integrations**, search for **LocalThings**, and download it. It is in the default list, so you do not add a custom repository. Restart Home Assistant.

   [![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=mbillow&repository=localthings&category=integration)

4. Go to **Settings > Devices & Services > Add Integration > LocalThings** and enter the washer's IP. LocalThings reads the model and creates one device with sensors and controls.
5. Add this card to a dashboard and pick **any** entity from that washer. The card finds machine state, cycle, finish time, energy, water, and the wash controls on the same device.

The first appliance contacts Samsung once, with no account, to read a public identifier. Later appliances only need an IP.

Two cases need one extra step:

- Some machines refuse the automatic certificate and ask for a pre-shared key. See [LocalThings credential acquisition](https://github.com/mbillow/localthings/blob/main/docs/credential-acquisition.md).
- Some older washers, including certain WW6500 models, use TCP port 8888 and ask for a device token. Leave the token empty, turn **Remote Control** on with the door closed, and let the washer reach Home Assistant on port 8889.

If the card stays empty, check that the LocalThings entities are not `unavailable`, that the washer is on the same network as Home Assistant, and that nothing else is holding the washer's local connection. An appliance accepts one connection at a time.

## Features

🎨 **Modern Design**
- Appliance-inspired layout with automatic light and dark mode
- Smooth drum animation and hover states

🔄 **Live status**
- Cycle name on the badge, with the wash stage when the machine only reports `active`
- Color-coded light for running, paused, idle, and recently completed
- The completed light stays on after LocalThings clears the finish-time sensor

📊 **Sensors and controls**
- Finish time, energy, water, power, and job state
- Child lock, remote control, bubble soak, detergent, rinse, spin, and wash temperature
- Each control can be hidden from the card editor
- Sensor units come from the entity. Numeric spin shows `RPM`, and a numeric temperature shows `°C`

⚙️ **Configurable**
- Pick any entity from the washer. LocalThings siblings are found automatically
- Optional entity overrides when you want a different sensor
- Header icon as an emoji or an MDI icon
- How long the completed light stays on

## Installation

This is a **dashboard card**, not a Home Assistant integration or add-on. It does not appear as its own page in the sidebar. After it is installed, edit a dashboard, choose **Add card**, and search for **Samsung Washer Card**.

Restarting Home Assistant does not load a new dashboard file. Reload the browser page after you add the resource.

### HACS (Recommended)

The repository type must be **Dashboard**.

If you choose **Integration**, HACS rejects the repository. The message says it is not a valid integration, or that it looks like an app repository and HACS does not manage apps. There is no app or custom integration in this repository to install.

1. Open HACS
2. Open the three-dot menu and choose **Custom repositories**
3. Repository: `https://github.com/raulpetruta/samsung-ha-washer-card`
4. Category: **Dashboard**
5. Add the repository, search for **Samsung Washer Card**, and download it
6. When HACS asks, reload the browser

### Manual Installation

1. Download [`dist/samsung-ha-washer-card.js`](https://github.com/raulpetruta/samsung-ha-washer-card/blob/main/dist/samsung-ha-washer-card.js) from the repository. The [release page](https://github.com/raulpetruta/samsung-ha-washer-card/releases/latest) source archive contains the same file in the `dist` folder.
2. In the Home Assistant file editor, create `config/www/samsung-ha-washer-card/` and save the file there as `samsung-ha-washer-card.js`.
3. Go to **Settings → Dashboards → three-dot menu → Resources → Add resource**
   - URL: `/local/samsung-ha-washer-card/samsung-ha-washer-card.js`
   - Resource type: **JavaScript module**
4. Reload the browser. Then edit a dashboard and add **Samsung Washer Card**.

The folder name in `config/www` and the `/local/...` URL must match. If the card still does not appear, open the browser developer tools and confirm that resource URL returns the JavaScript file rather than a 404.

```yaml
resources:
  - url: /local/samsung-ha-washer-card/samsung-ha-washer-card.js
    type: module
```

## Configuration

### Visual Editor (Recommended)

1. Add the card to your dashboard
2. Click **Configure** or the edit button
3. Set **Washer Entity** to any entity from the washer
4. Set the icon and how long the completed light stays on
5. Turn off **Show Child Lock**, **Show Water Temperature**, or any other **Show …** switch to hide that control

LocalThings entities on that same device are filled in automatically. You can still pick a different entity for energy, water, power, cycle, or temperature. Leave a sensor field empty to hide that tile.

### Manual Configuration

#### LocalThings

`device_name` is the full entity id of any entity on the washer:

```yaml
type: custom:samsung-washer-card
device_name: sensor.washer_machine_state
icon: "mdi:washing-machine"
complete_status_for_x_hours: 2
show_bubble_soak: false
show_detergent: false
```

#### Legacy SmartThings names

Older setups can still pass the shared object-id prefix:

```yaml
type: custom:samsung-washer-card
device_name: washing_machine
icon: "mdi:washing-machine"
complete_status_for_x_hours: 2
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `device_name` | string | **Required** | Any washer entity id, or a legacy device prefix |
| `icon` | string | `🧺` | Icon for the card header (emoji or `mdi:icon-name`) |
| `complete_status_for_x_hours` | number | `2` | Hours to show the green completed light after the cycle ends |
| `program_entity` | string | auto | Cycle select. Overrides automatic detection |
| `completion_time_entity` | string | auto | Finish-time sensor |
| `energy_entity` | string | auto | Energy sensor |
| `energy_saved_entity` | string | auto | Energy-saved sensor |
| `water_entity` | string | auto | Water-use sensor |
| `power_entity` | string | auto | Current power sensor |
| `power_binary_entity` | string | auto | Power on/off sensor |
| `job_state_entity` | string | auto | Cycle stage sensor |
| `water_temperature_entity` | string | auto | Wash temperature select |
| `show_child_lock` | boolean | `true` | Show the child lock control |
| `show_remote_control` | boolean | `true` | Show the remote control status |
| `show_bubble_soak` | boolean | `true` | Show bubble soak |
| `show_detergent` | boolean | `true` | Show detergent dose |
| `show_rinse_cycles` | boolean | `true` | Show rinse cycles |
| `show_spin_level` | boolean | `true` | Show spin speed |
| `show_water_temperature` | boolean | `true` | Show wash temperature |

## What the card shows

From a LocalThings washer, the card matches these translation keys on the selected device:

- Machine state, progress, and cycle (`machine_state`, `progress`, `washer_cycle`)
- Finish time (`finish_time`)
- Energy, power, and water (`energy_kwh`, `energy_saved_kwh`, `power_watts`, `water_liters`, `power_switch`)
- Child lock, remote control, bubble soak, detergent, rinse, spin (`spin_speed`), and wash temperature (`wash_temperature`)

Child lock uses Home Assistant's lock polarity: `on` means unlocked. Spin values get an `RPM` suffix only when they are numeric. Sensor units come from the entity.

### Legacy entity ids

If the card cannot see a device registry entry, it still looks up the old SmartThings object ids.

#### Sensors
- `sensor.{device_name}_machine_state`
- `sensor.{device_name}_job_state`
- `sensor.{device_name}_completion_time`
- `sensor.{device_name}_energy`
- `sensor.{device_name}_energy_saved`
- `sensor.{device_name}_power`
- `sensor.{device_name}_water_consumption`

#### Binary Sensors
- `binary_sensor.{device_name}_child_lock`
- `binary_sensor.{device_name}_remote_control`
- `binary_sensor.{device_name}_power`

#### Controls
- `switch.{device_name}_bubble_soak`
- `select.{device_name}_detergent_dispense_amount`
- `select.{device_name}_spin_level`
- `select.{device_name}_water_temperature`
- `number.{device_name}_rinse_cycles`

## Examples

### With Custom Icon

```yaml
type: custom:samsung-washer-card
device_name: sensor.washer_machine_state
icon: "mdi:washing-machine"
```

### Multiple Washers

```yaml
# Upstairs
type: custom:samsung-washer-card
device_name: sensor.upstairs_washer_machine_state
icon: "🏠"

# Downstairs
type: custom:samsung-washer-card
device_name: sensor.downstairs_washer_machine_state
icon: "🧺"
```

## Screenshots

### Light Mode
![Light Mode](screenshots/eye-burn-mode.png)

### Dark Mode
![Dark Mode](screenshots/dark-mode.png)

### Setup Card View
![Setup Card View](screenshots/setup-view.png)

Sensor tiles that you leave empty stay hidden. Controls stay visible until you turn off their **Show …** switch.

## Development

The project has a clean, modular structure:

```text
src/
├── main.js              # Main card class
├── components/          # UI components
├── styles/              # CSS styles
└── utils/               # Helper utilities
```

### Building for Distribution

```bash
npm run build    # Creates samsung-ha-washer-card.js for HACS
npm run dev      # Development build
npm run clean    # Clean build files
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you find this card useful, consider:

- ⭐ Starring this repository
- 🐛 Reporting issues
- 💡 Suggesting new features
- ☕ [Buying me a coffee](https://buymeacoffee.com/raulpetruta)
