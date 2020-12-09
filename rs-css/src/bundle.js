/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ts_GenerateContent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ts/GenerateContent */ "./src/ts/GenerateContent.ts");
/* harmony import */ var _ts_hoverEffects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ts/hoverEffects */ "./src/ts/hoverEffects.ts");


fetch('./src/levels.json')
    .then(function (res) { return res.json(); })
    .then(function (levels) {
    var progressInStorage = JSON.parse(localStorage.getItem('levelsProgress'));
    var levelsProgress = progressInStorage || new Array(levels.length);
    var currentLevel = localStorage.getItem('currentLevel') || '1';
    if (!progressInStorage) {
        localStorage.setItem('levelsProgress', JSON.stringify(levelsProgress));
    }
    var page = new _ts_GenerateContent__WEBPACK_IMPORTED_MODULE_0__.default(levels);
    page.generateLevels(levelsProgress);
    document.querySelector("[data-level=\"" + currentLevel + "\"]").classList.add('button-active');
    page.generateGame(+currentLevel);
    document.querySelector('.pool').addEventListener('mousemove', _ts_hoverEffects__WEBPACK_IMPORTED_MODULE_1__.poolHover);
    document.querySelector('.editor-html code').addEventListener('mousemove', _ts_hoverEffects__WEBPACK_IMPORTED_MODULE_1__.codeHover);
    document.querySelector('.levels').addEventListener('click', function (e) {
        var element = e.target;
        if (element.closest('.level.button')) {
            // debugger;
            var button = element.closest('.level.button');
            page.generateGame(+button.dataset.level);
        }
        else if (element.closest('.button-reset')) {
            levelsProgress = new Array(levels.length);
            localStorage.setItem('levelsProgress', JSON.stringify(levelsProgress));
            page.generateLevels(levelsProgress);
            var current = localStorage.getItem('currentLevel') || '1';
            document.querySelector("[data-level=\"" + current + "\"]").classList.add('button-active');
        }
    });
});
/*
levelsProgress = [
  [2, 'checked|helped| ']
]
*/


/***/ }),

/***/ "./src/ts/GenerateContent.ts":
/*!***********************************!*
  !*** ./src/ts/GenerateContent.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _utils_create__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/create */ "./src/ts/utils/create.ts");
/* harmony import */ var _animationEffects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./animationEffects */ "./src/ts/animationEffects.ts");


var carpet = document.querySelector('.pool-carpet');
var htmlCodeBlock = document.querySelector('.editor-html code');
var levelsBlock = document.querySelector('.levels-steps');
var selectorInput = document.querySelector('input');
var tagOpening = '&lt;';
var tagClosing = '&gt;';
var generateElementText = function (tagName, id, className, hasContent) {
    if (hasContent === void 0) { hasContent = false; }
    var result = tagOpening + "<span class=\"hljs-name\">" + tagName + "</span>";
    if (className) {
        result += " <span class=\"hljs-attr\">class</span>=<span class=\"hljs-string\">\"" + className + "\"</span>";
    }
    if (id) {
        result += " <span class=\"hljs-attr\">id</span>=<span class=\"hljs-string\">\"" + tagName + "-" + id + "\"</span>";
    }
    if (hasContent)
        result += "" + tagClosing;
    else
        result += " /" + tagClosing;
    return result;
};
var GenerateContent = /** @class */ (function () {
    function GenerateContent(levelsObjects) {
        var _this = this;
        this.submitHandler = function () {
            _this.animations.cancelSelectorAnimation = true;
            _this.animations.cancelAnswerAnimation = false;
            var levelsProgress = JSON.parse(localStorage.getItem('levelsProgress'));
            var enteredValue = selectorInput.value;
            var checkerClassName = _this.gotHelp ? 'helped' : 'checked';
            var checkerEl = _this.levelButtons[_this.currentLevel - 1].querySelector('svg');
            var goal = document.querySelector(_this.levelsObjects[_this.currentLevel - 1].selector);
            if (!Number.isNaN(+enteredValue)) {
                selectorInput.value = '';
                _this.generateGame(+enteredValue);
            }
            else if (goal === document.querySelector(enteredValue)) {
                selectorInput.value = '';
                levelsProgress[_this.currentLevel - 1] = [_this.currentLevel, checkerClassName];
                if (checkerEl.classList[checkerEl.classList.length - 1].includes('ed')) {
                    var removingClassName = Array.from(checkerEl.classList).find(function (cl) { return cl.includes('ed'); });
                    checkerEl.classList.remove(removingClassName);
                }
                _this.levelButtons[_this.currentLevel - 1].querySelector('svg').classList.add("icon-" + checkerClassName);
                setTimeout(function () { return _this.animations.correctAnswerAnimation(); }, 400);
                setTimeout(function () { return _this.generateGame(_this.currentLevel + 1); }, 1500);
                localStorage.setItem('levelsProgress', JSON.stringify(levelsProgress));
            }
            else {
                _this.animations.wrongAnswerAnimation(false);
            }
            return false;
        };
        this.getHelp = function () {
            _this.gotHelp = true;
            selectorInput.value = _this.levelsObjects[_this.currentLevel - 1].selector;
        };
        this.levelsObjects = levelsObjects;
        this.levelButtons = [];
        this.animations = new _animationEffects__WEBPACK_IMPORTED_MODULE_1__.default(null);
        document.querySelector('form').addEventListener('submit', this.submitHandler);
        document.querySelector('.editor-help').addEventListener('click', this.getHelp);
    }
    GenerateContent.prototype.generateGame = function (levelNumber) {
        this.gotHelp = false;
        if (levelNumber === this.levelsObjects.length + 1)
            return;
        this.currentLevel = levelNumber;
        this.animations.cancelSelectorAnimation = false;
        document.querySelector('.game-task').textContent = this.levelsObjects[this.currentLevel - 1].description;
        document.querySelector('.button-active').classList.remove('button-active');
        this.levelButtons[this.currentLevel - 1].classList.add('button-active');
        localStorage.setItem('currentLevel', this.currentLevel.toString());
        carpet.innerHTML = '';
        htmlCodeBlock.innerHTML = '';
        var quarters = this.levelsObjects[this.currentLevel - 1].carpet;
        // CARPET
        quarters.forEach(function (quarter) {
            var quarterCodeText = generateElementText('quarter', quarter.id, quarter.class, Boolean(quarter.balls));
            // for code-editor ↓
            var quarterCode = (0,_utils_create__WEBPACK_IMPORTED_MODULE_0__.default)('p', 'quarter-p', quarterCodeText, htmlCodeBlock);
            // for carpet ↓
            var quarterEl = (0,_utils_create__WEBPACK_IMPORTED_MODULE_0__.default)('quarter', "" + (quarter.class || ''), null, carpet, [
                'id',
                "quarter-" + quarter.id || 0,
            ]);
            if (quarter.balls) {
                quarter.balls.forEach(function (ball) {
                    // for code-editor ↓
                    var ballCodeText = generateElementText('ball', ball.id, ball.class);
                    (0,_utils_create__WEBPACK_IMPORTED_MODULE_0__.default)('p', 'ball-p tab', ballCodeText, quarterCode);
                    // for carpet ↓
                    var ballEl = (0,_utils_create__WEBPACK_IMPORTED_MODULE_0__.default)('ball', "" + (ball.class || ''), null, quarterEl, [
                        'id',
                        "ball-" + (ball.id || ''),
                    ]);
                    ballEl.style.left = ball.position[0] + "%";
                    ballEl.style.top = ball.position[1] + "%";
                    if (!ball.class) {
                        ballEl.style.background = "rgb(" + Math.random() * 255 + ", " + Math.random() * 255 + ", " + Math.random() * 255 + ")";
                    }
                });
                // for code-editor ↓
                quarterCode.innerHTML += tagOpening + "/<span class=\"hljs-name\">quarter</span>" + tagClosing;
            }
        });
        // HOLES (if are there)
        var holes = [this.levelsObjects[this.currentLevel - 1].holes][0];
        if (holes) {
            holes.forEach(function (hole) {
                var holeCodeText = generateElementText('hole', hole.id, hole.class);
                (0,_utils_create__WEBPACK_IMPORTED_MODULE_0__.default)('p', 'hole-p', holeCodeText, htmlCodeBlock);
            });
        }
        // SELECTOR ANIMATION EFFECTS
        this.animations.selector = this.levelsObjects[this.currentLevel - 1].selector;
        this.animations.selectorAnimation(false);
    };
    GenerateContent.prototype.generateLevels = function (levelsProgress) {
        this.levelButtons = [];
        levelsBlock.innerHTML = '';
        for (var i = 0; i < this.levelsObjects.length; i += 1) {
            var levelStatus = levelsProgress[i] ? levelsProgress[i][1] : 'check';
            var levelButton = (0,_utils_create__WEBPACK_IMPORTED_MODULE_0__.default)('button', 'level button button-primary btn btn-flat', "<svg class=\"icon icon-" + levelStatus + "\" viewBox=\"0 0 515.556 515.556\">\n            <path\n              d=\"m0 274.226 176.549 176.886 339.007-338.672-48.67-47.997-290.337 290-128.553-128.552z\"\n            />\n          </svg>", null, ['level', "" + this.levelsObjects[i].id]);
            (0,_utils_create__WEBPACK_IMPORTED_MODULE_0__.default)('span', 'level-number', "" + this.levelsObjects[i].id, levelButton);
            (0,_utils_create__WEBPACK_IMPORTED_MODULE_0__.default)('p', 'level-title', "" + this.levelsObjects[i].title, levelButton);
            this.levelButtons.push(levelButton);
            levelsBlock.append(levelButton);
        }
        return this;
    };
    return GenerateContent;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GenerateContent);


/***/ }),

/***/ "./src/ts/animationEffects.ts":
/*!************************************!*
  !*** ./src/ts/animationEffects.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
var Animations = /** @class */ (function () {
    function Animations(selector) {
        var _this = this;
        this.selectorAnimation = function (isIncrease) {
            var elements = Array.from(document.querySelectorAll(_this.selector));
            var className = isIncrease ? 'increase' : 'decrease';
            elements.forEach(function (el) {
                if (isIncrease)
                    el.classList.remove('decrease');
                else
                    el.classList.remove('increase');
                if (_this.cancelSelectorAnimation)
                    return;
                el.classList.add(className);
            });
            setTimeout(function () { return _this.selectorAnimation(!isIncrease); }, 400);
        };
        this.wrongAnswerAnimation = function (toRight) {
            var className = toRight ? 'to-right' : 'to-left';
            if (toRight)
                _this.editor.classList.remove('to-left');
            else
                _this.editor.classList.remove('to-right');
            if (_this.cancelAnswerAnimation)
                return;
            _this.editor.classList.add(className);
            setTimeout(function () { return _this.wrongAnswerAnimation(!toRight); }, 70);
            setTimeout(function () {
                _this.cancelAnswerAnimation = true;
            }, 700);
        };
        this.correctAnswerAnimation = function () {
            _this.cancelSelectorAnimation = true;
            var balls = Array.from(document.querySelectorAll('ball'));
            var hitAudio = document.querySelector('.hit');
            var putAudio = document.querySelector('.put');
            balls.forEach(function (el) {
                hitAudio.play();
                var ball = el;
                var _a = ball.style, left = _a.left, top = _a.top;
                ball.style.left = '';
                ball.style.top = '';
                if (parseFloat(left) < 30) {
                    if (parseFloat(top) < 50) {
                        ball.classList.add('to-top-left');
                    }
                    else {
                        ball.classList.add('to-bottom-left');
                    }
                }
                else if (parseFloat(left) > 75) {
                    if (parseFloat(top) < 50) {
                        ball.classList.add('to-top-right');
                    }
                    else {
                        ball.classList.add('to-bottom-right');
                    }
                }
                else if (parseFloat(top) < 50) {
                    ball.classList.add('to-top-center');
                }
                else {
                    ball.classList.add('to-bottom-center');
                }
                putAudio.play();
                setTimeout(function () {
                    ball.style.opacity = '0';
                }, 500);
            });
        };
        this.selector = selector;
        this.cancelSelectorAnimation = false;
        this.cancelAnswerAnimation = false;
        this.editor = document.querySelector('.game__editor');
    }
    return Animations;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Animations);


/***/ }),

/***/ "./src/ts/hoverEffects.ts":
/*!********************************!*
  !*** ./src/ts/hoverEffects.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "poolHover": () => /* binding */ poolHover,
/* harmony export */   "codeHover": () => /* binding */ codeHover
/* harmony export */ });
var poolHover = function (e) {
    if (document.querySelector('.hovered')) {
        document.querySelectorAll('.hovered').forEach(function (hovered) {
            hovered.classList.remove('hovered');
        });
    }
    var targetElement = e.target;
    if (targetElement.closest('ball')) {
        var ballEl_1 = targetElement.closest('ball');
        ballEl_1.classList.add('hovered');
        var index = Array.from(document.querySelectorAll('ball')).findIndex(function (b) { return b === ballEl_1; });
        document.querySelectorAll('.ball-p')[index].classList.add('hovered');
    }
    else if (targetElement.closest('hole') && document.querySelector('.hole-p')) {
        var holeEl_1 = targetElement.closest('hole');
        holeEl_1.classList.add('hovered');
        var index = Array.from(document.querySelectorAll('hole')).findIndex(function (b) { return b === holeEl_1; });
        document.querySelectorAll('.hole-p')[index].classList.add('hovered');
    }
    else if (targetElement.closest('quarter')) {
        var quarterEl_1 = targetElement.closest('quarter');
        quarterEl_1.classList.add('hovered');
        var index = Array.from(document.querySelectorAll('quarter')).findIndex(function (b) { return b === quarterEl_1; });
        document.querySelectorAll('.quarter-p')[index].classList.add('hovered');
    }
};
var codeHover = function (e) {
    if (document.querySelector('.hovered')) {
        document.querySelectorAll('.hovered').forEach(function (hovered) {
            hovered.classList.remove('hovered');
        });
    }
    var targetElement = e.target;
    if (targetElement.closest('p')) {
        var element_1 = targetElement.closest('p');
        element_1.classList.add('hovered');
        var className = element_1.classList[0];
        var index = Array.from(document.querySelectorAll("." + className)).findIndex(function (el) { return el === element_1; });
        document.querySelectorAll(className.slice(0, -2))[index].classList.add('hovered');
    }
};


/***/ }),

/***/ "./src/ts/utils/create.ts":
/*!********************************!*
  !*** ./src/ts/utils/create.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ create
/* harmony export */ });
/**
 * @param {String} el
 * @param {String} classNames
 * @param {HTMLElement} child
 * @param {HTMLElement} parent
 * @param  {...array} dataAttr
 */
function create(el, classNames, child, parent) {
    var _a;
    var dataAttr = [];
    for (var _i = 4; _i < arguments.length; _i++) {
        dataAttr[_i - 4] = arguments[_i];
    }
    var element = null;
    try {
        element = document.createElement(el);
    }
    catch (error) {
        throw new Error('Unable to create HTMLElement! Give a proper tag name');
    }
    if (classNames)
        (_a = element.classList).add.apply(_a, classNames.split(' '));
    if (child && Array.isArray(child)) {
        child.forEach(function (childElement) { return childElement && element.append(childElement); });
    }
    else if (child && typeof child === 'object') {
        element.append(child);
    }
    else if (child && typeof child === 'string') {
        element.innerHTML = child;
    }
    if (parent)
        parent.append(element);
    if (dataAttr.length) {
        dataAttr.forEach(function (_a) {
            var attrName = _a[0], attrValue = _a[1];
            if (attrValue === '')
                element.setAttribute(attrName, '');
            if (attrName.match(/value|id|placeholder|cols|rows|role|aria|src|alt|title|autocorrect|spellcheck|viewBox/)) {
                element.setAttribute(attrName, attrValue);
            }
            else {
                element.dataset[attrName] = attrValue;
            }
        });
    }
    return element;
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/index.ts");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ycy1jc3MvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vcnMtY3NzLy4vc3JjL3RzL0dlbmVyYXRlQ29udGVudC50cyIsIndlYnBhY2s6Ly9ycy1jc3MvLi9zcmMvdHMvYW5pbWF0aW9uRWZmZWN0cy50cyIsIndlYnBhY2s6Ly9ycy1jc3MvLi9zcmMvdHMvaG92ZXJFZmZlY3RzLnRzIiwid2VicGFjazovL3JzLWNzcy8uL3NyYy90cy91dGlscy9jcmVhdGUudHMiLCJ3ZWJwYWNrOi8vcnMtY3NzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3JzLWNzcy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcnMtY3NzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcnMtY3NzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcnMtY3NzL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQW1EO0FBQ007QUFFekQsS0FBSyxDQUFDLG1CQUFtQixDQUFDO0tBQ3ZCLElBQUksQ0FBQyxVQUFDLEdBQUcsSUFBSyxVQUFHLENBQUMsSUFBSSxFQUFFLEVBQVYsQ0FBVSxDQUFDO0tBQ3pCLElBQUksQ0FBQyxVQUFDLE1BQU07SUFDWCxJQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7SUFDN0UsSUFBSSxjQUFjLEdBQXVCLGlCQUFpQixJQUFJLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2RixJQUFNLFlBQVksR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEdBQUcsQ0FBQztJQUVqRSxJQUFJLENBQUMsaUJB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Q0FBQyxDQUFDO0tBQ0o7SUFFRCxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDOzs7Ozs7O1VDcEREO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3JCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsc0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgR2VuZXJhdGVDb250ZW50IGZyb20gJy4vdHMvR2VuZXJhdGVDb250ZW50JztcbmltcG9ydCB7IHBvb2xIb3ZlciwgY29kZUhvdmVyIH0gZnJvbSAnLi90cy9ob3ZlckVmZmVjdHMnO1xuXG5mZXRjaCgnLi9zcmMvbGV2ZWxzLmpzb24nKVxuICAudGhlbigocmVzKSA9PiByZXMuanNvbigpKVxuICAudGhlbigobGV2ZWxzKSA9PiB7XG4gICAgY29uc3QgcHJvZ3Jlc3NJblN0b3JhZ2UgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdsZXZlbHNQcm9ncmVzcycpKTtcbiAgICBsZXQgbGV2ZWxzUHJvZ3Jlc3M6IFtudW1iZXIsIHN0cmluZ11bXSA9IHByb2dyZXNzSW5TdG9yYWdlIHx8IG5ldyBBcnJheShsZXZlbHMubGVuZ3RoKTtcbiAgICBjb25zdCBjdXJyZW50TGV2ZWwgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY3VycmVudExldmVsJykgfHwgJzEnO1xuXG4gICAgaWYgKCFwcm9ncmVzc0luU3RvcmFnZSkge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2xldmVsc1Byb2dyZXNzJywgSlNPTi5zdHJpbmdpZnkobGV2ZWxzUHJvZ3Jlc3MpKTtcbiAgICB9XG5cbiAgICBjb25zdCBwYWdlID0gbmV3IEdlbmVyYXRlQ29udGVudChsZXZlbHMpO1xuICAgIHBhZ2UuZ2VuZXJhdGVMZXZlbHMobGV2ZWxzUHJvZ3Jlc3MpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWxldmVsPVwiJHtjdXJyZW50TGV2ZWx9XCJdYCkuY2xhc3NMaXN0LmFkZCgnYnV0dG9uLWFjdGl2ZScpO1xuICAgIHBhZ2UuZ2VuZXJhdGVHYW1lKCtjdXJyZW50TGV2ZWwpO1xuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBvb2wnKS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBwb29sSG92ZXIpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lZGl0b3ItaHRtbCBjb2RlJykuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgY29kZUhvdmVyKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGV2ZWxzJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgY29uc3QgZWxlbWVudCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50O1xuICAgICAgaWYgKGVsZW1lbnQuY2xvc2VzdCgnLmxldmVsLmJ1dHRvbicpKSB7XG4gICAgICAgIC8vIGRlYnVnZ2VyO1xuICAgICAgICBjb25zdCBidXR0b24gPSBlbGVtZW50LmNsb3Nlc3QoJy5sZXZlbC5idXR0b24nKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgcGFnZS5nZW5lcmF0ZUdhbWUoK2J1dHRvbi5kYXRhc2V0LmxldmVsKTtcbiAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5jbG9zZXN0KCcuYnV0dG9uLXJlc2V0JykpIHtcbiAgICAgICAgbGV2ZWxzUHJvZ3Jlc3MgPSBuZXcgQXJyYXkobGV2ZWxzLmxlbmd0aCk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsZXZlbHNQcm9ncmVzcycsIEpTT04uc3RyaW5naWZ5KGxldmVsc1Byb2dyZXNzKSk7XG4gICAgICAgIHBhZ2UuZ2VuZXJhdGVMZXZlbHMobGV2ZWxzUHJvZ3Jlc3MpO1xuICAgICAgICBjb25zdCBjdXJyZW50ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2N1cnJlbnRMZXZlbCcpIHx8ICcxJztcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtbGV2ZWw9XCIke2N1cnJlbnR9XCJdYCkuY2xhc3NMaXN0LmFkZCgnYnV0dG9uLWFjdGl2ZScpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuLypcbmxldmVsc1Byb2dyZXNzID0gW1xuICBbMiwgJ2NoZWNrZWR8aGVscGVkfCAnXVxuXVxuKi9cbiIsImltcG9ydCBjcmVhdGUgZnJvbSAnLi91dGlscy9jcmVhdGUnO1xuaW1wb3J0IHsgTGV2ZWwgfSBmcm9tICcuL0ludGVyZmFjZXMnO1xuaW1wb3J0IEFuaW1hdGlvbnMgZnJvbSAnLi9hbmltYXRpb25FZmZlY3RzJztcblxuY29uc3QgY2FycGV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBvb2wtY2FycGV0Jyk7XG5jb25zdCBodG1sQ29kZUJsb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVkaXRvci1odG1sIGNvZGUnKTtcbmNvbnN0IGxldmVsc0Jsb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxldmVscy1zdGVwcycpO1xuY29uc3Qgc2VsZWN0b3JJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0Jyk7XG5cbmNvbnN0IHRhZ09wZW5pbmcgPSAnJmx0Oyc7XG5jb25zdCB0YWdDbG9zaW5nID0gJyZndDsnO1xuXG5jb25zdCBnZW5lcmF0ZUVsZW1lbnRUZXh0ID0gKFxuICB0YWdOYW1lOiBzdHJpbmcsXG4gIGlkOiBzdHJpbmcgfCBudW1iZXIsXG4gIGNsYXNzTmFtZTogc3RyaW5nLFxuICBoYXNDb250ZW50ID0gZmFsc2UsXG4pOiBzdHJpbmcgPT4ge1xuICBsZXQgcmVzdWx0ID0gYCR7dGFnT3BlbmluZ308c3BhbiBjbGFzcz1cImhsanMtbmFtZVwiPiR7dGFnTmFtZX08L3NwYW4+YDtcbiAgaWYgKGNsYXNzTmFtZSkge1xuICAgIHJlc3VsdCArPSBgIDxzcGFuIGNsYXNzPVwiaGxqcy1hdHRyXCI+Y2xhc3M8L3NwYW4+PTxzcGFuIGNsYXNzPVwiaGxqcy1zdHJpbmdcIj5cIiR7Y2xhc3NOYW1lfVwiPC9zcGFuPmA7XG4gIH1cbiAgaWYgKGlkKSB7XG4gICAgcmVzdWx0ICs9IGAgPHNwYW4gY2xhc3M9XCJobGpzLWF0dHJcIj5pZDwvc3Bhbj49PHNwYW4gY2xhc3M9XCJobGpzLXN0cmluZ1wiPlwiJHt0YWdOYW1lfS0ke2lkfVwiPC9zcGFuPmA7XG4gIH1cbiAgaWYgKGhhc0NvbnRlbnQpIHJlc3VsdCArPSBgJHt0YWdDbG9zaW5nfWA7XG4gIGVsc2UgcmVzdWx0ICs9IGAgLyR7dGFnQ2xvc2luZ31gO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2VuZXJhdGVDb250ZW50IHtcbiAgbGV2ZWxzT2JqZWN0czogTGV2ZWxbXTtcblxuICBsZXZlbEJ1dHRvbnM6IEhUTUxFbGVtZW50W107XG5cbiAgYW5pbWF0aW9uczogQW5pbWF0aW9ucztcblxuICBjdXJyZW50TGV2ZWw6IG51bWJlcjtcblxuICBnb3RIZWxwOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKGxldmVsc09iamVjdHM6IExldmVsW10pIHtcbiAgICB0aGlzLmxldmVsc09iamVjdHMgPSBsZXZlbHNPYmplY3RzO1xuICAgIHRoaXMubGV2ZWxCdXR0b25zID0gW107XG4gICAgdGhpcy5hbmltYXRpb25zID0gbmV3IEFuaW1hdGlvbnMobnVsbCk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZm9ybScpLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIHRoaXMuc3VibWl0SGFuZGxlcik7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVkaXRvci1oZWxwJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmdldEhlbHApO1xuICB9XG5cbiAgZ2VuZXJhdGVHYW1lKGxldmVsTnVtYmVyOiBudW1iZXIpIHtcbiAgICB0aGlzLmdvdEhlbHAgPSBmYWxzZTtcbiAgICBpZiAobGV2ZWxOdW1iZXIgPT09IHRoaXMubGV2ZWxzT2JqZWN0cy5sZW5ndGggKyAxKSByZXR1cm47XG4gICAgdGhpcy5jdXJyZW50TGV2ZWwgPSBsZXZlbE51bWJlcjtcbiAgICB0aGlzLmFuaW1hdGlvbnMuY2FuY2VsU2VsZWN0b3JBbmltYXRpb24gPSBmYWxzZTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZS10YXNrJykudGV4dENvbnRlbnQgPSB0aGlzLmxldmVsc09iamVjdHNbXG4gICAgICB0aGlzLmN1cnJlbnRMZXZlbCAtIDFcbiAgICBdLmRlc2NyaXB0aW9uO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idXR0b24tYWN0aXZlJykuY2xhc3NMaXN0LnJlbW92ZSgnYnV0dG9uLWFjdGl2ZScpO1xuICAgIHRoaXMubGV2ZWxCdXR0b25zW3RoaXMuY3VycmVudExldmVsIC0gMV0uY2xhc3NMaXN0LmFkZCgnYnV0dG9uLWFjdGl2ZScpO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjdXJyZW50TGV2ZWwnLCB0aGlzLmN1cnJlbnRMZXZlbC50b1N0cmluZygpKTtcbiAgICBjYXJwZXQuaW5uZXJIVE1MID0gJyc7XG4gICAgaHRtbENvZGVCbG9jay5pbm5lckhUTUwgPSAnJztcbiAgICBjb25zdCBxdWFydGVycyA9IHRoaXMubGV2ZWxzT2JqZWN0c1t0aGlzLmN1cnJlbnRMZXZlbCAtIDFdLmNhcnBldDtcbiAgICAvLyBDQVJQRVRcbiAgICBxdWFydGVycy5mb3JFYWNoKChxdWFydGVyKSA9PiB7XG4gICAgICBjb25zdCBxdWFydGVyQ29kZVRleHQgPSBnZW5lcmF0ZUVsZW1lbnRUZXh0KFxuICAgICAgICAncXVhcnRlcicsXG4gICAgICAgIHF1YXJ0ZXIuaWQsXG4gICAgICAgIHF1YXJ0ZXIuY2xhc3MsXG4gICAgICAgIEJvb2xlYW4ocXVhcnRlci5iYWxscyksXG4gICAgICApO1xuICAgICAgLy8gZm9yIGNvZGUtZWRpdG9yIOKGk1xuICAgICAgY29uc3QgcXVhcnRlckNvZGUgPSBjcmVhdGUoJ3AnLCAncXVhcnRlci1wJywgcXVhcnRlckNvZGVUZXh0LCBodG1sQ29kZUJsb2NrKTtcbiAgICAgIC8vIGZvciBjYXJwZXQg4oaTXG4gICAgICBjb25zdCBxdWFydGVyRWwgPSBjcmVhdGUoJ3F1YXJ0ZXInLCBgJHtxdWFydGVyLmNsYXNzIHx8ICcnfWAsIG51bGwsIGNhcnBldCwgW1xuICAgICAgICAnaWQnLFxuICAgICAgICBgcXVhcnRlci0ke3F1YXJ0ZXIuaWR9YCB8fCAnJyxcbiAgICAgIF0pO1xuICAgICAgaWYgKHF1YXJ0ZXIuYmFsbHMpIHtcbiAgICAgICAgcXVhcnRlci5iYWxscy5mb3JFYWNoKChiYWxsKSA9PiB7XG4gICAgICAgICAgLy8gZm9yIGNvZGUtZWRpdG9yIOKGk1xuICAgICAgICAgIGNvbnN0IGJhbGxDb2RlVGV4dCA9IGdlbmVyYXRlRWxlbWVudFRleHQoJ2JhbGwnLCBiYWxsLmlkLCBiYWxsLmNsYXNzKTtcbiAgICAgICAgICBjcmVhdGUoJ3AnLCAnYmFsbC1wIHRhYicsIGJhbGxDb2RlVGV4dCwgcXVhcnRlckNvZGUpO1xuICAgICAgICAgIC8vIGZvciBjYXJwZXQg4oaTXG4gICAgICAgICAgY29uc3QgYmFsbEVsID0gY3JlYXRlKCdiYWxsJywgYCR7YmFsbC5jbGFzcyB8fCAnJ31gLCBudWxsLCBxdWFydGVyRWwsIFtcbiAgICAgICAgICAgICdpZCcsXG4gICAgICAgICAgICBgYmFsbC0ke2JhbGwuaWQgfHwgJyd9YCxcbiAgICAgICAgICBdKTtcbiAgICAgICAgICBiYWxsRWwuc3R5bGUubGVmdCA9IGAke2JhbGwucG9zaXRpb25bMF19JWA7XG4gICAgICAgICAgYmFsbEVsLnN0eWxlLnRvcCA9IGAke2JhbGwucG9zaXRpb25bMV19JWA7XG4gICAgICAgICAgaWYgKCFiYWxsLmNsYXNzKSB7XG4gICAgICAgICAgICBiYWxsRWwuc3R5bGUuYmFja2dyb3VuZCA9IGByZ2IoJHtNYXRoLnJhbmRvbSgpICogMjU1fSwgJHtNYXRoLnJhbmRvbSgpICogMjU1fSwgJHtcbiAgICAgICAgICAgICAgTWF0aC5yYW5kb20oKSAqIDI1NVxuICAgICAgICAgICAgfSlgO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIGZvciBjb2RlLWVkaXRvciDihpNcbiAgICAgICAgcXVhcnRlckNvZGUuaW5uZXJIVE1MICs9IGAke3RhZ09wZW5pbmd9LzxzcGFuIGNsYXNzPVwiaGxqcy1uYW1lXCI+cXVhcnRlcjwvc3Bhbj4ke3RhZ0Nsb3Npbmd9YDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEhPTEVTIChpZiBhcmUgdGhlcmUpXG4gICAgY29uc3QgW2hvbGVzXSA9IFt0aGlzLmxldmVsc09iamVjdHNbdGhpcy5jdXJyZW50TGV2ZWwgLSAxXS5ob2xlc107XG4gICAgaWYgKGhvbGVzKSB7XG4gICAgICBob2xlcy5mb3JFYWNoKChob2xlKSA9PiB7XG4gICAgICAgIGNvbnN0IGhvbGVDb2RlVGV4dCA9IGdlbmVyYXRlRWxlbWVudFRleHQoJ2hvbGUnLCBob2xlLmlkLCBob2xlLmNsYXNzKTtcbiAgICAgICAgY3JlYXRlKCdwJywgJ2hvbGUtcCcsIGhvbGVDb2RlVGV4dCwgaHRtbENvZGVCbG9jayk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBTRUxFQ1RPUiBBTklNQVRJT04gRUZGRUNUU1xuICAgIHRoaXMuYW5pbWF0aW9ucy5zZWxlY3RvciA9IHRoaXMubGV2ZWxzT2JqZWN0c1t0aGlzLmN1cnJlbnRMZXZlbCAtIDFdLnNlbGVjdG9yO1xuICAgIHRoaXMuYW5pbWF0aW9ucy5zZWxlY3RvckFuaW1hdGlvbihmYWxzZSk7XG4gIH1cblxuICBnZW5lcmF0ZUxldmVscyhsZXZlbHNQcm9ncmVzczogW251bWJlciwgc3RyaW5nXVtdKSB7XG4gICAgdGhpcy5sZXZlbEJ1dHRvbnMgPSBbXTtcbiAgICBsZXZlbHNCbG9jay5pbm5lckhUTUwgPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGV2ZWxzT2JqZWN0cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY29uc3QgbGV2ZWxTdGF0dXMgPSBsZXZlbHNQcm9ncmVzc1tpXSA/IGxldmVsc1Byb2dyZXNzW2ldWzFdIDogJ2NoZWNrJztcbiAgICAgIGNvbnN0IGxldmVsQnV0dG9uID0gY3JlYXRlKFxuICAgICAgICAnYnV0dG9uJyxcbiAgICAgICAgJ2xldmVsIGJ1dHRvbiBidXR0b24tcHJpbWFyeSBidG4gYnRuLWZsYXQnLFxuICAgICAgICBgPHN2ZyBjbGFzcz1cImljb24gaWNvbi0ke2xldmVsU3RhdHVzfVwiIHZpZXdCb3g9XCIwIDAgNTE1LjU1NiA1MTUuNTU2XCI+XG4gICAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgICBkPVwibTAgMjc0LjIyNiAxNzYuNTQ5IDE3Ni44ODYgMzM5LjAwNy0zMzguNjcyLTQ4LjY3LTQ3Ljk5Ny0yOTAuMzM3IDI5MC0xMjguNTUzLTEyOC41NTJ6XCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9zdmc+YCxcbiAgICAgICAgbnVsbCxcbiAgICAgICAgWydsZXZlbCcsIGAke3RoaXMubGV2ZWxzT2JqZWN0c1tpXS5pZH1gXSxcbiAgICAgICk7XG4gICAgICBjcmVhdGUoJ3NwYW4nLCAnbGV2ZWwtbnVtYmVyJywgYCR7dGhpcy5sZXZlbHNPYmplY3RzW2ldLmlkfWAsIGxldmVsQnV0dG9uKTtcbiAgICAgIGNyZWF0ZSgncCcsICdsZXZlbC10aXRsZScsIGAke3RoaXMubGV2ZWxzT2JqZWN0c1tpXS50aXRsZX1gLCBsZXZlbEJ1dHRvbik7XG4gICAgICB0aGlzLmxldmVsQnV0dG9ucy5wdXNoKGxldmVsQnV0dG9uKTtcbiAgICAgIGxldmVsc0Jsb2NrLmFwcGVuZChsZXZlbEJ1dHRvbik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc3VibWl0SGFuZGxlciA9ICgpOiBib29sZWFuID0+IHtcbiAgICB0aGlzLmFuaW1hdGlvbnMuY2FuY2VsU2VsZWN0b3JBbmltYXRpb24gPSB0cnVlO1xuICAgIHRoaXMuYW5pbWF0aW9ucy5jYW5jZWxBbnN3ZXJBbmltYXRpb24gPSBmYWxzZTtcblxuICAgIGNvbnN0IGxldmVsc1Byb2dyZXNzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbGV2ZWxzUHJvZ3Jlc3MnKSk7XG4gICAgY29uc3QgZW50ZXJlZFZhbHVlID0gc2VsZWN0b3JJbnB1dC52YWx1ZTtcbiAgICBjb25zdCBjaGVja2VyQ2xhc3NOYW1lID0gdGhpcy5nb3RIZWxwID8gJ2hlbHBlZCcgOiAnY2hlY2tlZCc7XG4gICAgY29uc3QgY2hlY2tlckVsID0gdGhpcy5sZXZlbEJ1dHRvbnNbdGhpcy5jdXJyZW50TGV2ZWwgLSAxXS5xdWVyeVNlbGVjdG9yKCdzdmcnKTtcbiAgICBjb25zdCBnb2FsID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmxldmVsc09iamVjdHNbdGhpcy5jdXJyZW50TGV2ZWwgLSAxXS5zZWxlY3Rvcik7XG5cbiAgICBpZiAoIU51bWJlci5pc05hTigrZW50ZXJlZFZhbHVlKSkge1xuICAgICAgc2VsZWN0b3JJbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgdGhpcy5nZW5lcmF0ZUdhbWUoK2VudGVyZWRWYWx1ZSk7XG4gICAgfSBlbHNlIGlmIChnb2FsID09PSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVudGVyZWRWYWx1ZSkpIHtcbiAgICAgIHNlbGVjdG9ySW5wdXQudmFsdWUgPSAnJztcbiAgICAgIGxldmVsc1Byb2dyZXNzW3RoaXMuY3VycmVudExldmVsIC0gMV0gPSBbdGhpcy5jdXJyZW50TGV2ZWwsIGNoZWNrZXJDbGFzc05hbWVdO1xuICAgICAgaWYgKGNoZWNrZXJFbC5jbGFzc0xpc3RbY2hlY2tlckVsLmNsYXNzTGlzdC5sZW5ndGggLSAxXS5pbmNsdWRlcygnZWQnKSkge1xuICAgICAgICBjb25zdCByZW1vdmluZ0NsYXNzTmFtZSA9IEFycmF5LmZyb20oY2hlY2tlckVsLmNsYXNzTGlzdCkuZmluZCgoY2wpID0+IGNsLmluY2x1ZGVzKCdlZCcpKVxuICAgICAgICBjaGVja2VyRWwuY2xhc3NMaXN0LnJlbW92ZShyZW1vdmluZ0NsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgICB0aGlzLmxldmVsQnV0dG9uc1t0aGlzLmN1cnJlbnRMZXZlbCAtIDFdLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpLmNsYXNzTGlzdC5hZGQoYGljb24tJHtjaGVja2VyQ2xhc3NOYW1lfWApO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmFuaW1hdGlvbnMuY29ycmVjdEFuc3dlckFuaW1hdGlvbigpLCA0MDApO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmdlbmVyYXRlR2FtZSh0aGlzLmN1cnJlbnRMZXZlbCArIDEpLCAxNTAwKTtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdsZXZlbHNQcm9ncmVzcycsIEpTT04uc3RyaW5naWZ5KGxldmVsc1Byb2dyZXNzKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYW5pbWF0aW9ucy53cm9uZ0Fuc3dlckFuaW1hdGlvbihmYWxzZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGdldEhlbHAgPSAoKSA9PiB7XG4gICAgdGhpcy5nb3RIZWxwID0gdHJ1ZTtcbiAgICBzZWxlY3RvcklucHV0LnZhbHVlID0gdGhpcy5sZXZlbHNPYmplY3RzW3RoaXMuY3VycmVudExldmVsIC0gMV0uc2VsZWN0b3I7XG4gIH07XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBBbmltYXRpb25zIHtcbiAgcHVibGljIHNlbGVjdG9yOiBzdHJpbmc7XG5cbiAgcHVibGljIGNhbmNlbFNlbGVjdG9yQW5pbWF0aW9uOiBib29sZWFuO1xuXG4gIGVkaXRvcjogRWxlbWVudDtcblxuICBwdWJsaWMgY2FuY2VsQW5zd2VyQW5pbWF0aW9uOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHNlbGVjdG9yOiBzdHJpbmcpIHtcbiAgICB0aGlzLnNlbGVjdG9yID0gc2VsZWN0b3I7XG4gICAgdGhpcy5jYW5jZWxTZWxlY3RvckFuaW1hdGlvbiA9IGZhbHNlO1xuICAgIHRoaXMuY2FuY2VsQW5zd2VyQW5pbWF0aW9uID0gZmFsc2U7XG4gICAgdGhpcy5lZGl0b3IgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ2FtZV9fZWRpdG9yJyk7XG4gIH1cblxuICBwdWJsaWMgc2VsZWN0b3JBbmltYXRpb24gPSAoaXNJbmNyZWFzZTogYm9vbGVhbikgPT4ge1xuICAgIGNvbnN0IGVsZW1lbnRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuc2VsZWN0b3IpKTtcbiAgICBjb25zdCBjbGFzc05hbWUgPSBpc0luY3JlYXNlID8gJ2luY3JlYXNlJyA6ICdkZWNyZWFzZSc7XG4gICAgZWxlbWVudHMuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgIGlmIChpc0luY3JlYXNlKSBlbC5jbGFzc0xpc3QucmVtb3ZlKCdkZWNyZWFzZScpO1xuICAgICAgZWxzZSBlbC5jbGFzc0xpc3QucmVtb3ZlKCdpbmNyZWFzZScpO1xuICAgICAgaWYgKHRoaXMuY2FuY2VsU2VsZWN0b3JBbmltYXRpb24pIHJldHVybjtcbiAgICAgIGVsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICB9KTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2VsZWN0b3JBbmltYXRpb24oIWlzSW5jcmVhc2UpLCA0MDApO1xuICB9O1xuXG4gIHB1YmxpYyB3cm9uZ0Fuc3dlckFuaW1hdGlvbiA9ICh0b1JpZ2h0OiBib29sZWFuKSA9PiB7XG4gICAgY29uc3QgY2xhc3NOYW1lID0gdG9SaWdodCA/ICd0by1yaWdodCcgOiAndG8tbGVmdCc7XG4gICAgaWYgKHRvUmlnaHQpIHRoaXMuZWRpdG9yLmNsYXNzTGlzdC5yZW1vdmUoJ3RvLWxlZnQnKTtcbiAgICBlbHNlIHRoaXMuZWRpdG9yLmNsYXNzTGlzdC5yZW1vdmUoJ3RvLXJpZ2h0Jyk7XG5cbiAgICBpZiAodGhpcy5jYW5jZWxBbnN3ZXJBbmltYXRpb24pIHJldHVybjtcbiAgICB0aGlzLmVkaXRvci5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLndyb25nQW5zd2VyQW5pbWF0aW9uKCF0b1JpZ2h0KSwgNzApO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5jYW5jZWxBbnN3ZXJBbmltYXRpb24gPSB0cnVlO1xuICAgIH0sIDcwMCk7XG4gIH07XG5cbiAgcHVibGljIGNvcnJlY3RBbnN3ZXJBbmltYXRpb24gPSAoKSA9PiB7XG4gICAgdGhpcy5jYW5jZWxTZWxlY3RvckFuaW1hdGlvbiA9IHRydWU7XG4gICAgY29uc3QgYmFsbHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2JhbGwnKSk7XG4gICAgY29uc3QgaGl0QXVkaW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGl0JykgYXMgSFRNTEF1ZGlvRWxlbWVudDtcbiAgICBjb25zdCBwdXRBdWRpbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wdXQnKSBhcyBIVE1MQXVkaW9FbGVtZW50O1xuICAgIGJhbGxzLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICBoaXRBdWRpby5wbGF5KCk7XG4gICAgICBjb25zdCBiYWxsID0gZWwgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICBjb25zdCB7IGxlZnQsIHRvcCB9ID0gYmFsbC5zdHlsZTtcbiAgICAgIGJhbGwuc3R5bGUubGVmdCA9ICcnO1xuICAgICAgYmFsbC5zdHlsZS50b3AgPSAnJztcbiAgICAgIGlmIChwYXJzZUZsb2F0KGxlZnQpIDwgMzApIHtcbiAgICAgICAgaWYgKHBhcnNlRmxvYXQodG9wKSA8IDUwKSB7XG4gICAgICAgICAgYmFsbC5jbGFzc0xpc3QuYWRkKCd0by10b3AtbGVmdCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJhbGwuY2xhc3NMaXN0LmFkZCgndG8tYm90dG9tLWxlZnQnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChwYXJzZUZsb2F0KGxlZnQpID4gNzUpIHtcbiAgICAgICAgaWYgKHBhcnNlRmxvYXQodG9wKSA8IDUwKSB7XG4gICAgICAgICAgYmFsbC5jbGFzc0xpc3QuYWRkKCd0by10b3AtcmlnaHQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBiYWxsLmNsYXNzTGlzdC5hZGQoJ3RvLWJvdHRvbS1yaWdodCcpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHBhcnNlRmxvYXQodG9wKSA8IDUwKSB7XG4gICAgICAgIGJhbGwuY2xhc3NMaXN0LmFkZCgndG8tdG9wLWNlbnRlcicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYmFsbC5jbGFzc0xpc3QuYWRkKCd0by1ib3R0b20tY2VudGVyJyk7XG4gICAgICB9XG4gICAgICBwdXRBdWRpby5wbGF5KCk7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgYmFsbC5zdHlsZS5vcGFjaXR5ID0gJzAnO1xuICAgICAgfSwgNTAwKTtcbiAgICB9KTtcbiAgfTtcbn1cbiIsImV4cG9ydCBjb25zdCBwb29sSG92ZXIgPSAoZTpNb3VzZUV2ZW50KSA9PiB7XG4gIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaG92ZXJlZCcpKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmhvdmVyZWQnKS5mb3JFYWNoKChob3ZlcmVkKSA9PiB7XG4gICAgICBob3ZlcmVkLmNsYXNzTGlzdC5yZW1vdmUoJ2hvdmVyZWQnKTtcbiAgICB9KVxuICB9XG4gIGNvbnN0IHRhcmdldEVsZW1lbnQgPSBlLnRhcmdldCBhcyBFbGVtZW50O1xuICBpZiAodGFyZ2V0RWxlbWVudC5jbG9zZXN0KCdiYWxsJykpIHtcbiAgICBjb25zdCBiYWxsRWwgPSB0YXJnZXRFbGVtZW50LmNsb3Nlc3QoJ2JhbGwnKTtcbiAgICBiYWxsRWwuY2xhc3NMaXN0LmFkZCgnaG92ZXJlZCcpO1xuICAgIGNvbnN0IGluZGV4ID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdiYWxsJykpLmZpbmRJbmRleCgoYikgPT4gYiA9PT0gYmFsbEVsKVxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5iYWxsLXAnKVtpbmRleF0uY2xhc3NMaXN0LmFkZCgnaG92ZXJlZCcpXG4gIH0gZWxzZSBpZiAodGFyZ2V0RWxlbWVudC5jbG9zZXN0KCdob2xlJykgJiYgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhvbGUtcCcpKSB7XG4gICAgY29uc3QgaG9sZUVsID0gdGFyZ2V0RWxlbWVudC5jbG9zZXN0KCdob2xlJyk7XG4gICAgaG9sZUVsLmNsYXNzTGlzdC5hZGQoJ2hvdmVyZWQnKTtcbiAgICBjb25zdCBpbmRleCA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaG9sZScpKS5maW5kSW5kZXgoKGIpID0+IGIgPT09IGhvbGVFbClcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaG9sZS1wJylbaW5kZXhdLmNsYXNzTGlzdC5hZGQoJ2hvdmVyZWQnKVxuICB9IGVsc2UgaWYgKHRhcmdldEVsZW1lbnQuY2xvc2VzdCgncXVhcnRlcicpKSB7XG4gICAgY29uc3QgcXVhcnRlckVsID0gdGFyZ2V0RWxlbWVudC5jbG9zZXN0KCdxdWFydGVyJyk7XG4gICAgcXVhcnRlckVsLmNsYXNzTGlzdC5hZGQoJ2hvdmVyZWQnKTtcbiAgICBjb25zdCBpbmRleCA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgncXVhcnRlcicpKS5maW5kSW5kZXgoKGIpID0+IGIgPT09IHF1YXJ0ZXJFbClcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucXVhcnRlci1wJylbaW5kZXhdLmNsYXNzTGlzdC5hZGQoJ2hvdmVyZWQnKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBjb2RlSG92ZXIgPSAoZTpNb3VzZUV2ZW50KSA9PiB7XG4gIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaG92ZXJlZCcpKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmhvdmVyZWQnKS5mb3JFYWNoKChob3ZlcmVkKSA9PiB7XG4gICAgICBob3ZlcmVkLmNsYXNzTGlzdC5yZW1vdmUoJ2hvdmVyZWQnKTtcbiAgICB9KVxuICB9XG4gIGNvbnN0IHRhcmdldEVsZW1lbnQgPSBlLnRhcmdldCBhcyBFbGVtZW50O1xuICBpZiAodGFyZ2V0RWxlbWVudC5jbG9zZXN0KCdwJykpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGFyZ2V0RWxlbWVudC5jbG9zZXN0KCdwJyk7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdob3ZlcmVkJyk7XG4gICAgY29uc3QgY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc0xpc3RbMF07XG4gICAgY29uc3QgaW5kZXggPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke2NsYXNzTmFtZX1gKSkuZmluZEluZGV4KChlbCkgPT4gZWwgPT09IGVsZW1lbnQpXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChjbGFzc05hbWUuc2xpY2UoMCwgLTIpKVtpbmRleF0uY2xhc3NMaXN0LmFkZCgnaG92ZXJlZCcpXG4gIH1cbn1cbiIsIi8qKlxuICogQHBhcmFtIHtTdHJpbmd9IGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gY2xhc3NOYW1lc1xuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY2hpbGRcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBhcmVudFxuICogQHBhcmFtICB7Li4uYXJyYXl9IGRhdGFBdHRyXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlKFxuICBlbDogc3RyaW5nLFxuICBjbGFzc05hbWVzOiBzdHJpbmcsXG4gIGNoaWxkOiBhbnksXG4gIHBhcmVudDogRWxlbWVudCxcbiAgLi4uZGF0YUF0dHI6IHN0cmluZ1tdW11cbik6IEhUTUxFbGVtZW50IHtcbiAgbGV0IGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gbnVsbDtcblxuICB0cnkge1xuICAgIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBjcmVhdGUgSFRNTEVsZW1lbnQhIEdpdmUgYSBwcm9wZXIgdGFnIG5hbWUnKTtcbiAgfVxuXG4gIGlmIChjbGFzc05hbWVzKSBlbGVtZW50LmNsYXNzTGlzdC5hZGQoLi4uY2xhc3NOYW1lcy5zcGxpdCgnICcpKTtcblxuICBpZiAoY2hpbGQgJiYgQXJyYXkuaXNBcnJheShjaGlsZCkpIHtcbiAgICBjaGlsZC5mb3JFYWNoKChjaGlsZEVsZW1lbnQpID0+IGNoaWxkRWxlbWVudCAmJiBlbGVtZW50LmFwcGVuZChjaGlsZEVsZW1lbnQpKTtcbiAgfSBlbHNlIGlmIChjaGlsZCAmJiB0eXBlb2YgY2hpbGQgPT09ICdvYmplY3QnKSB7XG4gICAgZWxlbWVudC5hcHBlbmQoY2hpbGQpO1xuICB9IGVsc2UgaWYgKGNoaWxkICYmIHR5cGVvZiBjaGlsZCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbGVtZW50LmlubmVySFRNTCA9IGNoaWxkO1xuICB9XG5cbiAgaWYgKHBhcmVudCkgcGFyZW50LmFwcGVuZChlbGVtZW50KTtcblxuICBpZiAoZGF0YUF0dHIubGVuZ3RoKSB7XG4gICAgZGF0YUF0dHIuZm9yRWFjaCgoW2F0dHJOYW1lLCBhdHRyVmFsdWVdOiBzdHJpbmdbXSkgPT4ge1xuICAgICAgaWYgKGF0dHJWYWx1ZSA9PT0gJycpIGVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCAnJyk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgYXR0ck5hbWUubWF0Y2goXG4gICAgICAgICAgL3ZhbHVlfGlkfHBsYWNlaG9sZGVyfGNvbHN8cm93c3xyb2xlfGFyaWF8c3JjfGFsdHx0aXRsZXxhdXRvY29ycmVjdHxzcGVsbGNoZWNrfHZpZXdCb3gvLFxuICAgICAgICApXG4gICAgICApIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGF0dHJWYWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LmRhdGFzZXRbYXR0ck5hbWVdID0gYXR0clZhbHVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGVcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ2V4cG9ydHMnIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbiJdLCJzb3VyY2VSb290IjoiIn0=