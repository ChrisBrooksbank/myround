export function haptic(ms = 30) {
  navigator.vibrate?.(ms);
}
