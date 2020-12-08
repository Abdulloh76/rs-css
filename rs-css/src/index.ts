import GenerateContent from './ts/GenerateContent';
import { poolHover, codeHover } from './ts/hoverEffects'

fetch('./src/levels.json')
  .then((res) => res.json())
  .then((levels) => {
    const progressInStorage = JSON.parse(localStorage.getItem('levelsProgress'));
    const levelsProgress: [number, string][] = progressInStorage || new Array(levels.length);

    if (!progressInStorage) {
      localStorage.setItem('levelsProgress', JSON.stringify(levelsProgress));
    }

    const page = new GenerateContent(levels, levelsProgress);
    page.generateLevels().generateGame(3);

    document.querySelector('.pool').addEventListener('mousemove', poolHover);
    document.querySelector('.editor-html code').addEventListener('mousemove', codeHover);
  });

/*
levelsProgress = [
  [2, 'checked|helped| ']
]
*/
