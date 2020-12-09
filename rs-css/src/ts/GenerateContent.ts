import create from './utils/create';
import { Level } from './Interfaces';
import Animations from './animationEffects';

const carpet = document.querySelector('.pool-carpet');
const htmlCodeBlock = document.querySelector('.editor-html code');
const levelsBlock = document.querySelector('.levels-steps');
const selectorInput = document.querySelector('input');

const tagOpening = '&lt;';
const tagClosing = '&gt;';

const generateElementText = (
  tagName: string,
  id: string | number,
  className: string,
  hasContent = false,
): string => {
  let result = `${tagOpening}<span class="hljs-name">${tagName}</span>`;
  if (className) {
    result += ` <span class="hljs-attr">class</span>=<span class="hljs-string">"${className}"</span>`;
  }
  if (id) {
    result += ` <span class="hljs-attr">id</span>=<span class="hljs-string">"${tagName}-${id}"</span>`;
  }
  if (hasContent) result += `${tagClosing}`;
  else result += ` /${tagClosing}`;

  return result;
};
export default class GenerateContent {
  levelsObjects: Level[];

  levelButtons: HTMLElement[];

  animations: Animations;

  currentLevel: number;

  gotHelp: boolean;

  constructor(levelsObjects: Level[]) {
    this.levelsObjects = levelsObjects;
    this.levelButtons = [];
    this.animations = new Animations(null);
    document.querySelector('form').addEventListener('submit', this.submitHandler);
    document.querySelector('.editor-help').addEventListener('click', this.getHelp);
  }

  generateGame(levelNumber: number) {
    this.gotHelp = false;
    if (levelNumber === this.levelsObjects.length + 1) return;
    this.currentLevel = levelNumber;
    this.animations.cancelSelectorAnimation = false;
    document.querySelector('.game-task').textContent = this.levelsObjects[
      this.currentLevel - 1
    ].description;
    document.querySelector('.button-active').classList.remove('button-active');
    this.levelButtons[this.currentLevel - 1].classList.add('button-active');
    localStorage.setItem('currentLevel', this.currentLevel.toString());
    carpet.innerHTML = '';
    htmlCodeBlock.innerHTML = '';
    const quarters = this.levelsObjects[this.currentLevel - 1].carpet;
    // CARPET
    quarters.forEach((quarter) => {
      const quarterCodeText = generateElementText(
        'quarter',
        quarter.id,
        quarter.class,
        Boolean(quarter.balls),
      );
      // for code-editor ↓
      const quarterCode = create('p', 'quarter-p', quarterCodeText, htmlCodeBlock);
      // for carpet ↓
      const quarterEl = create('quarter', `${quarter.class || ''}`, null, carpet, [
        'id',
        `quarter-${quarter.id}` || '',
      ]);
      if (quarter.balls) {
        quarter.balls.forEach((ball) => {
          // for code-editor ↓
          const ballCodeText = generateElementText('ball', ball.id, ball.class);
          create('p', 'ball-p tab', ballCodeText, quarterCode);
          // for carpet ↓
          const ballEl = create('ball', `${ball.class || ''}`, null, quarterEl, [
            'id',
            `ball-${ball.id || ''}`,
          ]);
          ballEl.style.left = `${ball.position[0]}%`;
          ballEl.style.top = `${ball.position[1]}%`;
          if (!ball.class) {
            ballEl.style.background = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
              Math.random() * 255
            })`;
          }
        });
        // for code-editor ↓
        quarterCode.innerHTML += `${tagOpening}/<span class="hljs-name">quarter</span>${tagClosing}`;
      }
    });

    // HOLES (if are there)
    const [holes] = [this.levelsObjects[this.currentLevel - 1].holes];
    if (holes) {
      holes.forEach((hole) => {
        const holeCodeText = generateElementText('hole', hole.id, hole.class);
        create('p', 'hole-p', holeCodeText, htmlCodeBlock);
      });
    }

    // SELECTOR ANIMATION EFFECTS
    this.animations.selector = this.levelsObjects[this.currentLevel - 1].selector;
    this.animations.selectorAnimation(false);
  }

  generateLevels(levelsProgress: [number, string][]) {
    this.levelButtons = [];
    levelsBlock.innerHTML = '';
    for (let i = 0; i < this.levelsObjects.length; i += 1) {
      const levelStatus = levelsProgress[i] ? levelsProgress[i][1] : 'check';
      const levelButton = create(
        'button',
        'level button button-primary btn btn-flat',
        `<svg class="icon icon-${levelStatus}" viewBox="0 0 515.556 515.556">
            <path
              d="m0 274.226 176.549 176.886 339.007-338.672-48.67-47.997-290.337 290-128.553-128.552z"
            />
          </svg>`,
        null,
        ['level', `${this.levelsObjects[i].id}`],
      );
      create('span', 'level-number', `${this.levelsObjects[i].id}`, levelButton);
      create('p', 'level-title', `${this.levelsObjects[i].title}`, levelButton);
      this.levelButtons.push(levelButton);
      levelsBlock.append(levelButton);
    }
    return this;
  }

  submitHandler = (): boolean => {
    this.animations.cancelSelectorAnimation = true;
    this.animations.cancelAnswerAnimation = false;

    const levelsProgress = JSON.parse(localStorage.getItem('levelsProgress'));
    const enteredValue = selectorInput.value;
    const checkerClassName = this.gotHelp ? 'helped' : 'checked';
    const checkerEl = this.levelButtons[this.currentLevel - 1].querySelector('svg');
    const goal = document.querySelector(this.levelsObjects[this.currentLevel - 1].selector);

    if (!Number.isNaN(+enteredValue)) {
      selectorInput.value = '';
      this.generateGame(+enteredValue);
    } else if (goal === document.querySelector(enteredValue)) {
      selectorInput.value = '';
      levelsProgress[this.currentLevel - 1] = [this.currentLevel, checkerClassName];
      if (checkerEl.classList[checkerEl.classList.length - 1].includes('ed')) {
        const removingClassName = Array.from(checkerEl.classList).find((cl) => cl.includes('ed'));
        checkerEl.classList.remove(removingClassName);
      }
      this.levelButtons[this.currentLevel - 1]
        .querySelector('svg')
        .classList.add(`icon-${checkerClassName}`);
      setTimeout(() => this.animations.correctAnswerAnimation(), 400);
      setTimeout(() => this.generateGame(this.currentLevel + 1), 1500);
      localStorage.setItem('levelsProgress', JSON.stringify(levelsProgress));
    } else {
      this.animations.wrongAnswerAnimation(false);
    }

    return false;
  };

  getHelp = () => {
    this.gotHelp = true;
    selectorInput.value = this.levelsObjects[this.currentLevel - 1].selector;
  };
}
