export const poolHover = (e:MouseEvent) => {
  if (document.querySelector('.hovered')) {
    document.querySelectorAll('.hovered').forEach((hovered) => {
      hovered.classList.remove('hovered');
    })
  }
  const targetElement = e.target as Element;
  if (targetElement.closest('ball')) {
    const ballEl = targetElement.closest('ball');
    ballEl.classList.add('hovered');
    const index = Array.from(document.querySelectorAll('ball')).findIndex((b) => b === ballEl)
    document.querySelectorAll('.ball-p')[index].classList.add('hovered')
  } else if (targetElement.closest('hole') && document.querySelector('.hole-p')) {
    const holeEl = targetElement.closest('hole');
    holeEl.classList.add('hovered');
    const index = Array.from(document.querySelectorAll('hole')).findIndex((b) => b === holeEl)
    document.querySelectorAll('.hole-p')[index].classList.add('hovered')
  } else if (targetElement.closest('quarter')) {
    const quarterEl = targetElement.closest('quarter');
    quarterEl.classList.add('hovered');
    const index = Array.from(document.querySelectorAll('quarter')).findIndex((b) => b === quarterEl)
    document.querySelectorAll('.quarter-p')[index].classList.add('hovered')
  }
}

export const codeHover = (e:MouseEvent) => {
  if (document.querySelector('.hovered')) {
    document.querySelectorAll('.hovered').forEach((hovered) => {
      hovered.classList.remove('hovered');
    })
  }
  const targetElement = e.target as Element;
  if (targetElement.closest('p')) {
    const element = targetElement.closest('p');
    element.classList.add('hovered');
    const className = element.classList[0];
    const index = Array.from(document.querySelectorAll(`.${className}`)).findIndex((el) => el === element)
    document.querySelectorAll(className.slice(0, -2))[index].classList.add('hovered')
  }
}
