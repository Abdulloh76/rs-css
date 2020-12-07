import create from './utils/create';
import { Level } from './Interfaces';

const pool = document.querySelector('.pool');
const htmlCodeBlock = document.querySelectorAll('.editor-html td');
const holes = document.querySelectorAll('hole');
const selectorInput = document.querySelector('.editor__selector input');
const selectorEnter = document.querySelector('.editor__selector .enter');
const levelsBlock = document.querySelector('.levels-steps');

export default class GenerateContent {
  levelsObj: Level[];

  levelButtons: HTMLElement[];

  levelsProgress: [number, string][];

  constructor(levelsObj: Level[], levelsProgress: [number, string][]) {
    this.levelsObj = levelsObj;
    this.levelsProgress = levelsProgress;
    this.levelButtons = [];
  }

  generatePool() {}

  generateLevels() {
    for (let i = 0; i < this.levelsObj.length; i += 1) {
      const levelStatus = this.levelsProgress[i] ? this.levelsProgress[i][1] : 'check';
      const levelButton = create(
        'button',
        'level button button-primary btn btn-flat',
        `<svg class="icon icon-${levelStatus}" viewBox="0 0 515.556 515.556">
            <path
              d="m0 274.226 176.549 176.886 339.007-338.672-48.67-47.997-290.337 290-128.553-128.552z"
            />
          </svg>`,
        null, ['level', `${this.levelsObj[i].id}`],
      );
      create('span', 'level-number', `${this.levelsObj[i].id}`, levelButton);
      create('p', 'level-title', `${this.levelsObj[i].title}`, levelButton);
      this.levelButtons.push(levelButton);
      levelsBlock.append(levelButton);
    }
    return this;
  }
}
