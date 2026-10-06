# AGENTS.md

## Project purpose

This repository contains a Home Assistant Lovelace custom card for weather-station observations and forecast data. The card is intended to feel at home beside Mushroom cards while remaining a standalone project.

## Non-negotiable architectural decisions

- Build the card as a standalone Lit web component.
- Do not import, extend, bundle, or depend on Mushroom internals.
- Mushroom is visual inspiration only. Use Home Assistant theme variables and public frontend interfaces wherever practical.
- Keep weather observations and forecast data conceptually separate:
  - Weather-station entities describe what is happening now.
  - The configured weather entity supplies forecast data.
- Do not hardcode Ecowitt entity IDs. Users must be able to map compatible Home Assistant entities through the visual editor or YAML.
- Preserve both visual-editor configuration and advanced YAML configuration.

## Technology expectations

- Use TypeScript and Lit unless there is a documented reason not to.
- Register the card and editor as custom elements.
- Keep the compiled browser asset separate from source files.
- Use a repeatable build and test process suitable for HACS releases.
- Keep pure data-processing utilities independent from rendering code where possible.

## Component organization

Prefer small, focused modules such as:

- Main card component
- Visual editor component
- Forecast rendering
- Current-conditions rendering
- Station-metric rendering
- Rainfall sparkline
- Compass conversion
- Unit and number formatting
- Localization
- Responsive layout selection

Avoid putting all entity parsing, display logic, and CSS in one large component.

## Home Assistant integration

The card should support the standard Lovelace card lifecycle, including:

- `setConfig`
- `hass` state updates
- `getCardSize`
- Visual-editor integration
- Starter configuration for the card picker where supported

Handle missing, unavailable, unknown, and invalid entity states gracefully. An optional sensor should never make the entire card fail to render.

## Configuration principles

- Use clear, stable configuration names.
- Provide sensible defaults and an automatic mode for responsive behavior.
- Prefer entity selectors and structured editor controls over free-form text fields.
- Keep advanced options available in YAML without making them mandatory for ordinary users.
- Avoid breaking configuration changes after release; provide migration logic when necessary.

## Responsive design

The card must respond to its actual allocated width, not only to device or viewport type. Use a width-aware approach such as `ResizeObserver` or equivalent.

The automatic layout should provide compact, standard, and wide tiers. Manual overrides may exist, but `auto` should be the default.

Do not assume that a card placed in a sidebar has the same width as a card placed in a dashboard column.

## Weather behavior

- The primary current temperature comes from the configured station temperature entity.
- Forecast temperature must not replace the measured station temperature.
- Before late afternoon, show the forecast high for today when available.
- After late afternoon, show tonight's forecast low when available.
- Prefer actual forecast period boundaries when the weather entity provides them; use a configurable or documented fallback when it does not.
- Use the station's rain-state entity to drive active-rain presentation when available.
- Treat precipitation probability as forecast information, not as proof that it is currently raining.

## Rainfall visualization

The sparkline should represent hourly rainfall increments or rain rate, not a cumulative total. A cumulative series hides rainfall intensity because it is mostly monotonic.

The default rainfall area should be able to show:

- Current rain rate
- Rainfall today
- Rainfall this week
- Recent rainfall history

When rain is active or heavy, the rainfall section may expand or receive stronger visual emphasis.

## Wind direction

Store and process wind direction as degrees. Do not store translated compass text as the source value.

Support:

- 8-point compass mode for compact display
- 16-point compass mode for greater precision
- Locale-specific compass labels
- A rotated visual arrow when appropriate
- Graceful handling of missing, negative, or out-of-range values

Normalize degrees before conversion. North must work consistently for both 0 and 360 degrees.

## Localization and units

- Do not hardcode user-facing English strings in rendering code.
- Use locale-aware number and date/time formatting.
- Respect Home Assistant's language and unit preferences where possible.
- Keep translation keys stable and descriptive.
- Include accessibility labels in the localization work.
- Treat compass abbreviations as translatable; they are not universal across languages.

## Visual language

The design should be Mushroom-inspired but independently implemented:

- Rounded card surface
- Restrained typography hierarchy
- Soft condition-based accents
- Familiar Home Assistant spacing and theme variables
- Clear primary and secondary values
- Low visual noise when conditions are unremarkable

Do not copy private Mushroom components or rely on Mushroom-specific CSS variables. Define project-specific variables with Home Assistant theme fallbacks.

## Accessibility

- Provide meaningful labels for icons, arrows, charts, and condition states.
- Do not communicate important information by color alone.
- Preserve readable contrast in all condition themes.
- Ensure compact layouts do not hide essential values from screen readers.
- Support keyboard interaction in the visual editor and interactive card elements.

## Testing expectations

Add tests for:

- Degree-to-compass conversion, especially values near sector boundaries
- 0/360-degree normalization
- Missing and unavailable entities
- Time-of-day high/low selection
- Rainfall series preparation
- Locale-aware labels and units
- Responsive layout breakpoints
- Visual-editor configuration events

Before a release, test at minimum with:

- A complete Ecowitt sensor set
- A partially configured sensor set
- Active rain and dry conditions
- Narrow and wide dashboard placements
- At least one non-English locale
- Both YAML and visual-editor configuration

## Documentation expectations

Keep the README current as configuration changes. Include screenshots or sample layouts when the UI stabilizes. Document optional entities, automatic behavior, localization, known limitations, and upgrade notes.

## Scope discipline

Prefer a small, reliable first release over a broad configuration surface. New metrics should be added in a way that preserves automatic prioritization and does not turn the default card into an unstructured wall of data.
