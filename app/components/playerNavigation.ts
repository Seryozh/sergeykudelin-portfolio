export type SceneSurface = "inline" | "presentation";

export function clampSceneIndex(index: number, sceneCount: number) {
  return Math.max(0, Math.min(index, sceneCount - 1));
}

export function focusSceneElement(
  scene: HTMLElement | null,
  prefersReducedMotion: boolean,
) {
  if (!scene) return;

  const heading = scene.querySelector<HTMLElement>("[data-player-scene-title]");
  heading?.focus({ preventScroll: true });
  scene.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });
}
