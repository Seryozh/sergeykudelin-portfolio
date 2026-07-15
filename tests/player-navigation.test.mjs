import assert from "node:assert/strict";
import test from "node:test";
import {
  clampSceneIndex,
  focusSceneElement,
} from "../app/components/playerNavigation.ts";

test("clamps scene navigation to the available range", () => {
  assert.equal(clampSceneIndex(-1, 5), 0);
  assert.equal(clampSceneIndex(3, 5), 3);
  assert.equal(clampSceneIndex(8, 5), 4);
});

test("returns focus to the new scene and scrolls it into view", () => {
  const calls = [];
  const heading = {
    focus(options) {
      calls.push(["focus", options]);
    },
  };
  const scene = {
    querySelector(selector) {
      calls.push(["query", selector]);
      return heading;
    },
    scrollIntoView(options) {
      calls.push(["scroll", options]);
    },
  };

  focusSceneElement(scene, false);

  assert.deepEqual(calls, [
    ["query", "[data-player-scene-title]"],
    ["focus", { preventScroll: true }],
    ["scroll", { behavior: "smooth", block: "start" }],
  ]);
});

test("uses immediate scrolling when reduced motion is requested", () => {
  let scrollOptions;
  const scene = {
    querySelector() {
      return null;
    },
    scrollIntoView(options) {
      scrollOptions = options;
    },
  };

  focusSceneElement(scene, true);
  assert.deepEqual(scrollOptions, { behavior: "auto", block: "start" });
  assert.doesNotThrow(() => focusSceneElement(null, true));
});
