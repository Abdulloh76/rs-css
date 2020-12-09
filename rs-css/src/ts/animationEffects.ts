export class SelectorAnimation {
  public selector: string;

  public cancelAnimation: boolean;

  constructor(selector: string) {
    this.selector = selector;
    this.cancelAnimation = false;
  }

  public selectorAnimation = (isIncrease: boolean) => {
    const elements = Array.from(document.querySelectorAll(this.selector));
    if (this.cancelAnimation) return;
    const className = isIncrease ? 'increase' : 'decrease';
    elements.forEach((el) => {
      if (isIncrease) el.classList.remove('decrease');
      else el.classList.remove('increase');
      el.classList.add(className);
    });
    setTimeout(() => this.selectorAnimation(!isIncrease), 500);
  };
}

export const wrongAnswerAnimation = () => {};

export const correctAnswerAnimation = () => {};
