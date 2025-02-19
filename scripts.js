import { playlist as videos } from './playlist.js';
import { Calendar } from './calendar.js';

// Application Configuration
const CONFIG = {
    startDate: new Date("09 Apr 2022"),
    imageClasses: ['bg1', 'bg2', 'bg3', 'bg4', 'bg5', 'bg6'],
    maxGuesses: 6,
    videoIds: [
        'l7vRSu_wsNc', '4JkIs37a2JE', '5IsSpAOD6K8', 'JkRKT6T0QLg', 'uPudE8nDog0', 'oIb9QUGjdIc',
        'r3kQlzOi27M', 'uejh-bHa4To', 'GHhD4PD75zY', 'LatorN4P9aA', 'QqqBs6kkzHE', 'SwrYMWoqg5w',
        'Yf_Lwe6p-Cg', 'ejorQVy3m8E', 'ijAYN9zVnwg', 'm3-hY-hlhBg', 'rkpG4XApJ28', 'uq-gYOrU8bA',
        'z5rRZdiu1UE', 'cOeKidp-iWo', '5-WpsdC2-Cc', 'PGNiXGX2nLU', '79fzeNUqQbQ', 'nTizYn3-QN0',
        'xwtdhWltSIg', '0-EF60neguk', 'cjIvu7e6Wq8', 'wTP2RUD_cL0', 'HasaQvHCv4w', 'eBG7P-K-r1Y',
        '4xmckWVPRaI', 'W8r-tXRLazs', 'kemivUKb4f4', '9SOryJvTAGs', 'RRKJiM9Njr8', 'etviGf1uWlg',
        'FTQbiNvZqaY', 'L_jWHffIx5E', 'LuN6gs0AJls', 'PIb6AZdTr-A', 'PWgvGjAhvIw', 'hIs5StN8J-0',
        'J9gKyRmic20', 'djV11Xbc914', 'E1fzJ_AYajA', 'CdqoNKCCt7A', 'aENX1Sf3fgQ', 'eBShN8qT4lk',
        'dTAAsCNK7RA', 'XfR9iY5y94s', 'LKYPYj2XX80', 'K1b8AhIsSYQ', 'AjPau5QYtYs', 'JmcA9LIIXWw',
        'Jne9t8sHpUc', 'dQw4w9WgXcQ', 'hTWKbfoikeg', '3qVPNONdF58', 'rog8ou-ZepE', '0aqLwHP4y6Q',
        '3dOx510kyOs', '4B_UYYPb-Gk', '6VCdJyOAQYM', 'UtvmTu4zAMg', 'WM8bTdBs-cw', 'YgSPaXgAdzE',
        'd4-1ASpdT1Y', 'fC_q9KPczAg', 'o1tj2zJ2Wvg', 'tDl3bdE3YQA'
    ]
};

// Date Manager Class
class DateManager {
    constructor() {
        this.currentDate = new Date();
        this.todayDate = new Date();
        this.handleDateOverride();
    }

    handleDateOverride() {
        const params = new URLSearchParams(window.location.search);
        const overrideDate = params.get('day');

        if (overrideDate) {
            this.todayDate = new Date(overrideDate);
            if (this.todayDate.getTime() < CONFIG.startDate.getTime() ||
                this.todayDate.getTime() > this.currentDate.getTime()) {
                this.todayDate = this.currentDate;
            } else {
                this.todayDate.setHours(
                    this.currentDate.getHours(),
                    this.currentDate.getMinutes(),
                    this.currentDate.getSeconds()
                );
            }
        }
    }

    getMinutesToTomorrow() {
        const tomorrow = new Date(this.todayDate);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return Math.round((tomorrow - this.todayDate) / 1000 / 60);
    }

    getDateString() {
        return this.todayDate.toDateString();
    }

    getVideoIndexForToday() {
        const timeDiff = this.todayDate.getTime() - CONFIG.startDate.getTime();
        return Math.floor(Math.abs(timeDiff / (1000 * 3600 * 24))) % CONFIG.videoIds.length;
    }
}

// Game State Manager
class GameState {
    constructor() {
        this.imageIndex = 0;
        this.chooserTerm = '';
        this.storage = window.localStorage;
    }

    saveState(index, answer) {
        const storeData = { index, answer };
        this.storage.setItem(dateManager.getDateString(), JSON.stringify(storeData));
    }

    loadState() {
        const stored = this.storage.getItem(dateManager.getDateString());
        if (stored) {
            const storedResults = JSON.parse(stored);
            this.imageIndex = storedResults.index;
            return storedResults;
        }
        return null;
    }
}

// UI Manager Class
class UIManager {
    constructor(dateManager, gameState) {
        this.dateManager = dateManager;
        this.gameState = gameState;
        this.elements = this.getElements();
        this.currentVideo = CONFIG.videoIds[this.dateManager.getVideoIndexForToday()];
        this.videosArray = Object.entries(videos);
        this.initialize();
    }

    getElements() {
        return {
            mainImage: document.getElementById('main_image'),
            results: document.getElementById('results'),
            chooser: document.getElementById('chooser'),
            videoDate: document.getElementById('videoDate'),
            nextVideo: document.getElementById('nextVideo'),
            submitAnswer: document.getElementById('submitAnswer'),
            modalElements: {
                info: {
                    button: document.getElementById('modal-info-button'),
                    modal: document.getElementById('modal-info'),
                    close: document.getElementById('modal-info-close')
                },
                question: {
                    button: document.getElementById('modal-q-button'),
                    modal: document.getElementById('modal-q'),
                    close: document.getElementById('modal-q-close')
                },
                graph: {
                    button: document.getElementById('modal-graph-button'),
                    modal: document.getElementById('modal-graph'),
                    close: document.getElementById('modal-graph-close')
                },
                darken: document.getElementById('modal-darken')
            }
        };
    }

    initialize() {
        this.setupInitialUI();
        this.setupEventListeners();
        this.loadSavedState();
    }

    setupInitialUI() {
        this.elements.videoDate.innerHTML = this.dateManager.getDateString();
        this.elements.nextVideo.innerHTML = this.dateManager.getMinutesToTomorrow();
        this.elements.mainImage.style.backgroundImage = `url('gifs/${this.currentVideo}.gif')`;
        this.elements.mainImage.classList.add(CONFIG.imageClasses[0]);
    }

    setupEventListeners() {
        // Search input
        this.elements.chooser.addEventListener('input', (e) => {
            this.gameState.chooserTerm = e.target.value;
            if (this.gameState.chooserTerm.length > 1) {
                this.searchVideos();
            } else {
                this.elements.results.innerHTML = '';
            }
        });

        // Skip button
        if (this.elements.submitAnswer) {
            this.elements.submitAnswer.addEventListener('click', () => {
                this.elements.chooser.value = '';
                this.checkAnswer();
            });
        }

        // Modal handlers
        this.setupModals();
    }

    setupModals() {
        Object.entries(this.elements.modalElements).forEach(([key, modal]) => {
            if (key !== 'darken') {
                modal.button.addEventListener('click', (e) => {
                    e.preventDefault();
                    modal.modal.classList.add('show');
                    this.elements.modalElements.darken.classList.add('darken');

                    if (key === 'graph') {
                        window.calendar = new Calendar(CONFIG.startDate);
                    }
                });

                modal.close.addEventListener('click', () => this.closeModal(modal.modal));
                this.elements.modalElements.darken.addEventListener('click', () => this.closeModal(modal.modal));
            }
        });
    }

    closeModal(modal) {
        modal.classList.remove('show');
        this.elements.modalElements.darken.classList.remove('darken');
    }

    loadSavedState() {
        const savedState = this.gameState.loadState();
        if (savedState) {
            this.checkAnswer(savedState.answer);
        }
    }

    async searchVideos() {
        this.elements.results.innerHTML = '';
        const ul = this.createSearchResultsList();

        this.videosArray
            .filter(([key, video]) =>
                video.toLowerCase().includes(this.gameState.chooserTerm.toLowerCase()))
            .forEach(([key, video]) => {
                const li = this.createSearchResultItem(key, video);
                ul.appendChild(li);
            });

        this.elements.results.appendChild(ul);
    }

    createSearchResultsList() {
        const ul = document.createElement('ul');
        ul.classList.add('list-group');
        ul.id = 'chooser_list';
        ul.addEventListener('click', (e) => {
            if (e.target?.matches('li.videoList')) {
                const selectedVideo = e.target.dataset.videoId;
                ul.remove();
                this.checkAnswer(selectedVideo);
            }
        });
        return ul;
    }

    createSearchResultItem(key, video) {
        const li = document.createElement('li');
        li.dataset.videoId = key;
        li.classList.add('list-group-item', 'list-group-item-action', 'videoList');
        li.innerText = video;
        return li;
    }

    checkAnswer(videoAnswer) {
        // Remove previous image class
        this.elements.mainImage.classList.remove(CONFIG.imageClasses[this.gameState.imageIndex]);
        this.elements.chooser.value = '';
        const guessId = `guess${this.gameState.imageIndex + 1}`;

        if (this.isGameOver(videoAnswer)) {
            this.handleGameOver(videoAnswer, guessId);
            return;
        }

        this.handleIncorrectGuess(videoAnswer, guessId);
    }

    isGameOver(videoAnswer) {
        return this.gameState.imageIndex === CONFIG.maxGuesses - 1 ||
            (videoAnswer && atob(videoAnswer) === this.currentVideo);
    }

    handleGameOver(videoAnswer, guessId) {
        const isCorrect = videoAnswer !== undefined;
        const finalAnswer = isCorrect ? videoAnswer : btoa(this.currentVideo);

        this.gameState.saveState(this.gameState.imageIndex, finalAnswer);
        this.showFinalState(finalAnswer, isCorrect);
        this.updateGuessList(guessId, finalAnswer, isCorrect);
    }

    handleIncorrectGuess(videoAnswer, guessId) {
        this.elements.mainImage.classList.add(CONFIG.imageClasses[this.gameState.imageIndex + 1]);
        this.gameState.imageIndex++;
        this.updateGuessList(guessId, videoAnswer, false);
    }

    showFinalState(videoAnswer, isCorrect) {
        this.elements.mainImage.classList.add('bgfinal');
        document.getElementById('search-label').remove();
        document.getElementById('search-input').remove();

        this.showVideoTitle(videoAnswer);
        this.showResultsText(isCorrect);
        this.addShareButton();
    }

    showVideoTitle(videoAnswer) {
        const videoTitle = document.createElement('h3');
        videoTitle.innerHTML = `<a href="https://www.youtube.com/watch?v=${this.currentVideo}" target="_blank" class="videoSuccess">${videos[videoAnswer]}</a>`;
        this.elements.results.appendChild(videoTitle);
    }

    showResultsText(isCorrect) {
        const text = this.dateManager.todayDate.toLocaleDateString();
        let copyResults = `Videordle.com (${text}):`;

        if (!isCorrect) {
            copyResults += ' ⬛ ⬛ ⬛ ⬛ ⬛ ⬛';
        } else {
            for (let i = 0; i < CONFIG.maxGuesses; i++) {
                copyResults += i === this.gameState.imageIndex ? ' 🟩' : ' ⬛';
                if (i === this.gameState.imageIndex) break;
            }
        }

        const resultsCopyText = document.createElement('div');
        resultsCopyText.id = 'resultsCopy';
        resultsCopyText.innerHTML = copyResults;
        this.elements.results.appendChild(resultsCopyText);
    }

    addShareButton() {
        this.elements.results.appendChild(document.createElement('br'));
        const shareButton = document.createElement('button');
        shareButton.id = 'shareButton';
        shareButton.classList.add('btn', 'btn-primary', 'btn-sm');
        shareButton.innerHTML = 'Copy results for sharing';

        shareButton.addEventListener('click', () => {
            const copyText = document.getElementById('resultsCopy').innerHTML;
            navigator.clipboard.writeText(copyText).then(() => {
                alert("Copied to clipboard");
            });
        });

        this.elements.results.appendChild(shareButton);
    }

    updateGuessList(guessId, videoAnswer, isCorrect) {
        const guessList = document.getElementById(guessId);
        const videoName = videoAnswer ? videos[videoAnswer] : '';

        guessList.classList.add(
            isCorrect ? 'bg-success' : 'bg-danger',
            'bg-gradient',
            'bg-opacity-25'
        );

        guessList.innerHTML = `${isCorrect ? '✅' : '❌'} ${videoName}`;
    }
}

// Initialize the application
const dateManager = new DateManager();
const gameState = new GameState();
const uiManager = new UIManager(dateManager, gameState);