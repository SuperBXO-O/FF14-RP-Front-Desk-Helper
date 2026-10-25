# FF14 RP Front Desk Helper

An open-source, browser-based front desk and bookkeeping tool for Final Fantasy XIV role-play venues.

The app runs as a single static `public/index.html` file. It works offline using browser storage, and can connect to the separately distributed [INPA Bridge](https://github.com/SuperBXO-O/INPABridge) plugin through `127.0.0.1:18500` for in-game integration.

This project is not affiliated with or endorsed by Square Enix, Final Fantasy XIV, DeepSeek, or any third-party skill author. It does not include official game artwork, logos, fonts, screenshots, or text.

## Screenshots

### Orders and automatic calculation

![Orders and automatic calculation](docs/screenshots/desktop-orders.png)

### Settings

![Settings](docs/screenshots/settings.png)

### Report

![Report](docs/screenshots/report.png)

### Mobile layout

![Mobile orders](docs/screenshots/mobile-orders.png)

## Features

- Business items with configurable names, prices, staff settlement rates and units
- Customer orders, reservations, room usage and settlement records
- Inventory reconciliation and business reports
- Browser-local data plus optional shared data through INPA Bridge
- Session archive export to JSON and XLSX
- Up to two game-item bindings per business item
- In-game tell tickets, customer chat, ignore list and whitelist
- Optional separate front desk and staff salary allocation modes
- Responsive desktop and mobile layouts
- Historical sale prices and wage rates are frozen with each posted record
- Sales and settlements can be voided or refunded without deleting the voucher
- Concurrent sales and settlements from multiple windows are merged safely
- Over-returned tokens appear as clearly marked reconciliation exceptions

## Deployment

1. Download or clone this repository.
2. Upload `public/index.html` to any static web host.
3. Optional: install `INPA Bridge` separately and connect the page to the local plugin.

No build step or third-party npm packages are required to host the app.

## Data and privacy

- The repository contains no player identifiers or business records.
- Browser-only mode keeps records in the browser.
- Plugin mode stores data on the user's own computer.
- Network access is only used for pages, plugin requests and optional calendar/music embeds already declared by the interface.

## Design and AI disclosure

The product was developed through an iterative human-directed design process with AI assistance. DeepSeek was used during product design, interface exploration, copy iteration and implementation support. Generated output was reviewed, edited and tested before being included.

See [DESIGN.md](DESIGN.md) for the design process and [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md) for development references and upstream licenses.

## License

This project is licensed under the **GNU Affero General Public License v3.0**. See [LICENSE](LICENSE).

If you modify this program and make it available to users over a network, the AGPL requires that those users can obtain the corresponding source code.

The project name and branding identify this upstream project. The AGPL does not grant trademark rights or permission to represent a modified deployment as an official release.

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting changes.

