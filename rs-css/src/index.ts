import GenerateContent from './ts/GenerateContent';
import { poolHover, codeHover } from './ts/hoverEffects';

fetch('./src/levels.json')
  .then((res) => res.json())
  .then((levels) => {
    const progressInStorage = JSON.parse(localStorage.getItem('levelsProgress'));
    let levelsProgress: [number, string][] = progressInStorage || new Array(levels.length);
    const currentLevel = localStorage.getItem('currentLevel') || '1';

    if (!progressInStorage) {
      localStorage.setItem('levelsProgress', JSON.stringify(levelsProgress));
    }

    const page = new GenerateContent(levels);
    page.generateLevels(levelsProgress);
    document.querySelector(`[data-level="${currentLevel}"]`).classList.add('button-active');
    page.generateGame(+currentLevel);

    document.querySelector('.pool').addEventListener('mousemove', poolHover);
    document.querySelector('.editor-html code').addEventListener('mousemove', codeHover);
    document.querySelector('.levels').addEventListener('click', (e) => {
      const element = e.target as HTMLElement;
      if (element.closest('.level.button')) {
        // debugger;
        const button = element.closest('.level.button') as HTMLElement;
        page.generateGame(+button.dataset.level);
      } else if (element.closest('.button-reset')) {
        levelsProgress = new Array(levels.length);
        localStorage.setItem('levelsProgress', JSON.stringify(levelsProgress));
        page.generateLevels(levelsProgress);
        const current = localStorage.getItem('currentLevel') || '1';
        document.querySelector(`[data-level="${current}"]`).classList.add('button-active');
      }
    });
  });

/*
levelsProgress = [
  [2, 'checked|helped| ']
]
*/
