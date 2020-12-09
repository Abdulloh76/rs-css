import create from './utils/create';
import { Level } from './Interfaces';
import { SelectorAnimation } from './animationEffects'

const carpet = document.querySelector('.pool-carpet');
const htmlCodeBlock = document.querySelector('.editor-html code');
const levelsBlock = document.querySelector('.levels-steps');

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

  levelsProgress: [number, string][];

  selectorAnimation: SelectorAnimation;

  constructor(levelsObjects: Level[], levelsProgress: [number, string][]) {
    this.levelsObjects = levelsObjects;
    this.levelsProgress = levelsProgress;
    this.levelButtons = [];
    this.selectorAnimation = new SelectorAnimation(null)
  }

  generateGame(levelNumber: number) {
    this.selectorAnimation.cancelAnimation = false;
    document.querySelector('.game-task').textContent = this.levelsObjects[levelNumber - 1].description;
    document.querySelector('.button-active').classList.remove('button-active')
    this.levelButtons[levelNumber - 1].classList.add('button-active');
    localStorage.setItem('currentLevel', levelNumber.toString());
    carpet.innerHTML = '';
    htmlCodeBlock.innerHTML = '';
    const quarters = this.levelsObjects[levelNumber - 1].carpet;
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
    const [holes] = [this.levelsObjects[levelNumber - 1].holes];
    if (holes) {
      holes.forEach((hole) => {
        const holeCodeText = generateElementText('hole', hole.id, hole.class)
        create('p', 'hole-p', holeCodeText, htmlCodeBlock);
      })
    }

    // ANIMATION EFFECTS
    this.selectorAnimation.selector = this.levelsObjects[levelNumber - 1].selector;
    this.selectorAnimation.selectorAnimation(false);
  }

  generateLevels() {
    for (let i = 0; i < this.levelsObjects.length; i += 1) {
      const levelStatus = this.levelsProgress[i] ? this.levelsProgress[i][1] : 'check';
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
}
