import { ref } from 'vue'

export default function useKonami(): { show: boolean } {
  const show = ref(false)
  /** For easter Egg */
  const KONAMI_CODE = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
  ]
  let currentPosition = 0

  function reset() {
    currentPosition = 0
  }

  const konamiCodeListener = function (event: KeyboardEvent) {
    if (event.key.toUpperCase() === KONAMI_CODE[currentPosition].toUpperCase()) {
      currentPosition++
      if (currentPosition === KONAMI_CODE.length) {
        show.value = !show.value
        reset()
      }
    } else {
      reset()
    }
  }

  window.addEventListener('keydown', konamiCodeListener)

  /** end easter Egg */
  return {
    show,
  }
}
