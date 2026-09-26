import { Temporal } from "@js-temporal/polyfill";

if (!("Temporal" in globalThis)) {
    Object.assign(globalThis, { Temporal });
}

export { Temporal };
