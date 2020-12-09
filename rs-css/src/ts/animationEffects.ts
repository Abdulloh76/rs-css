export class Animations {
  public selector: string;

  public cancelSelectorAnimation: boolean;

  editor: Element;

  public cancelAnswerAnimation: boolean;

  constructor(selector: string) {
    this.selector = selector;
    this.cancelSelectorAnimation = false;
    this.cancelAnswerAnimation = false;
    this.editor = document.querySelector('.game__editor')
  }

  public selectorAnimation = (isIncrease: boolean) => {
    const elements = Array.from(document.querySelectorAll(this.selector));
    if (this.cancelSelectorAnimation) return;
    const className = isIncrease ? 'increase' : 'decrease';
    elements.forEach((el) => {
      if (isIncrease) el.classList.remove('decrease');
      else el.classList.remove('increase');
      el.classList.add(className);
    });
    setTimeout(() => this.selectorAnimation(!isIncrease), 500);
  };

  public wrongAnswerAnimation = (toRight: boolean) => {
    const className = toRight ? 'to-right' : 'to-left';
    if (toRight) this.editor.classList.remove('to-left');
    else this.editor.classList.remove('to-right');

    if (this.cancelAnswerAnimation) return;
    this.editor.classList.add(className)
    setTimeout(() => this.wrongAnswerAnimation(!toRight), 70);
    setTimeout(() => { this.cancelAnswerAnimation = true }, 700)
  }
}

export const wrongAnswerAnimation = () => {
  // const  = document.querySelector('.game__editor');
};

export const correctAnswerAnimation = () => {};
