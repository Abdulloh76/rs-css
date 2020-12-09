export default class Animations {
  public selector: string;

  public cancelSelectorAnimation: boolean;

  editor: Element;

  public cancelAnswerAnimation: boolean;

  constructor(selector: string) {
    this.selector = selector;
    this.cancelSelectorAnimation = false;
    this.cancelAnswerAnimation = false;
    this.editor = document.querySelector('.game__editor');
  }

  public selectorAnimation = (isIncrease: boolean) => {
    const elements = Array.from(document.querySelectorAll(this.selector));
    const className = isIncrease ? 'increase' : 'decrease';
    elements.forEach((el) => {
      if (isIncrease) el.classList.remove('decrease');
      else el.classList.remove('increase');
      if (this.cancelSelectorAnimation) return;
      el.classList.add(className);
    });
    setTimeout(() => this.selectorAnimation(!isIncrease), 400);
  };

  public wrongAnswerAnimation = (toRight: boolean) => {
    const className = toRight ? 'to-right' : 'to-left';
    if (toRight) this.editor.classList.remove('to-left');
    else this.editor.classList.remove('to-right');

    if (this.cancelAnswerAnimation) return;
    this.editor.classList.add(className);
    setTimeout(() => this.wrongAnswerAnimation(!toRight), 70);
    setTimeout(() => {
      this.cancelAnswerAnimation = true;
    }, 700);
  };

  public correctAnswerAnimation = () => {
    this.cancelSelectorAnimation = true;
    const balls = Array.from(document.querySelectorAll('ball'));
    const hitAudio = document.querySelector('.hit') as HTMLAudioElement;
    const putAudio = document.querySelector('.put') as HTMLAudioElement;
    balls.forEach((el) => {
      hitAudio.play();
      const ball = el as HTMLElement;
      const { left, top } = ball.style;
      ball.style.left = '';
      ball.style.top = '';
      if (parseFloat(left) < 30) {
        if (parseFloat(top) < 50) {
          ball.classList.add('to-top-left');
        } else {
          ball.classList.add('to-bottom-left');
        }
      } else if (parseFloat(left) > 75) {
        if (parseFloat(top) < 50) {
          ball.classList.add('to-top-right');
        } else {
          ball.classList.add('to-bottom-right');
        }
      } else if (parseFloat(top) < 50) {
        ball.classList.add('to-top-center');
      } else {
        ball.classList.add('to-bottom-center');
      }
      putAudio.play();
      setTimeout(() => {
        ball.style.opacity = '0';
      }, 500);
    });
  };
}
