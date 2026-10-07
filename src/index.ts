import { CARD_TAG, SkyScoopCard } from "./skyscoop-card.js";
import { SkyScoopCardEditor } from "./skyscoop-card-editor.js";

if (!customElements.get(CARD_TAG)) {
  customElements.define(CARD_TAG, SkyScoopCard);
}

if (!customElements.get("skyscoop-card-editor")) {
  customElements.define("skyscoop-card-editor", SkyScoopCardEditor);
}

window.customCards ??= [];
if (!window.customCards.some((card) => card.type === CARD_TAG)) {
  window.customCards.push({
    type: CARD_TAG,
    name: "SkyScoop",
    description: "Weather-station observations and forecast data.",
    preview: true,
  });
}

console.info("%c SKYSCOOP %c Ready", "color: white; background: #347f78; font-weight: bold;", "");