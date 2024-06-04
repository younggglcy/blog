export function isScroll(el: HTMLElement, isVertical?: boolean): boolean {
  const key = (
    {
      undefined: 'overflow',
      true: 'overflow-y',
      false: 'overflow-x',
    } as const
  )[String(isVertical)]!
  const overflow = (el.style as any)[key]
  return ['scroll', 'auto', 'overlay'].some(s => overflow.includes(s))
}

export function getScrollContainer(el: HTMLElement,
  isVertical?: boolean): Window | HTMLElement | undefined {
  let parent: HTMLElement = el
  while (parent) {
    if ([window, document, document.documentElement].includes(parent))
      return window

    if (isScroll(parent, isVertical))
      return parent

    parent = parent.parentNode as HTMLElement
  }

  return parent
}

export function getOffsetTop(el: HTMLElement) {
  let offset = 0
  let parent = el

  while (parent) {
    offset += parent.offsetTop
    parent = parent.offsetParent as HTMLElement
  }

  return offset
}

export function getOffsetTopDistance(el: HTMLElement,
  containerEl: HTMLElement) {
  return Math.abs(getOffsetTop(el) - getOffsetTop(containerEl))
}
