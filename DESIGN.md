# Design process

## Product goal

The project needed to replace scattered notes and spreadsheets used by FF14 role-play venues with one operational interface for orders, reservations, rooms, settlements, reports, staff profiles, macros and in-game tells.

The central constraint was fast entry during an active role-play session. The interface therefore prioritizes:

- one screen dedicated to choosing a business and recording an order;
- visible automatic totals and a copyable customer quote;
- explicit settlement and inventory reconciliation;
- clear separation between browser-only and in-game connected modes;
- responsive layouts that remain usable in a narrow in-game browser.

## Visual direction

The page combines an industrial command-console structure with a light, paper-like working surface for data entry. The distinctive decisions are:

- one signal color for the active state and primary action;
- cut corners on pressable controls, while content panels remain square;
- thin rules and numbered records instead of generic floating-card grids;
- compact English labels paired with direct Chinese operational labels;
- short mechanical motion tied to actions, with reduced-motion support;
- data tables and reports that remain readable without animation.

The UI was developed specifically around the business workflow. Official game artwork, in-game logos and proprietary game fonts are intentionally excluded.

## Iteration history represented by the product

1. Start with a single stateful static page so it can be hosted anywhere without a backend build.
2. Separate the main workflow into orders, settlement, rooms, reports, staff/macros and settings.
3. Add automatic totals, quote text, settlement reconciliation and export formats.
4. Add optional local-plugin integration for target lookup, item delivery, chat and shared state.
5. Rework selection and settings flows after observed naming, deletion and double-item binding problems.
6. Add mobile and reduced-motion behavior plus repeated browser verification.

## AI-assisted development

DeepSeek assisted the product design, interface exploration, copy iteration and parts of the implementation. The output was not accepted blindly: requirements were defined by the project owner, then iterated with builds, screenshots, automated browser tests and manual functional checks.

The repository distinguishes the final implementation from the design references used during exploration. Skill source files are not redistributed as part of the application.

## Verification

The implementation has been exercised through:

- browser tests for settings, reset, tickets and item binding;
- offline and plugin-connected flows;
- duplicate and edge-case calculation checks;
- desktop and narrow-screen screenshot review;
- static artifact equality checks for distributable copies.

