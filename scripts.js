import { playlist as videos } from './playlist.js';

// Video objects turned into an array
const videosArray = Object.entries(videos);

// video IDs to choose from
const availableVideos = [
    'FTQbiNvZqaY',
    'J9gKyRmic20',
    'djV11Xbc914',
    'CdqoNKCCt7A',
    'aENX1Sf3fgQ',
    'dQw4w9WgXcQ',
    'hTWKbfoikeg',
    '3qVPNONdF58',
    'rog8ou-ZepE',
    'eBShN8qT4lk',
    'dTAAsCNK7RA',
    'XfR9iY5y94s',
    'LKYPYj2XX80',
    'K1b8AhIsSYQ',
    'E1fzJ_AYajA',
    '5IsSpAOD6K8'
];

// Set localstorage info
let myStorage = window.localStorage;

const startDate = new Date("16 Mar 2022");
const todayDate = new Date();
const todayDateString = todayDate.toDateString();

const getTheWordIndexForToday = () => {
    // return Math.floor(Math.random() * availableVideos.length); // random ID
    // get index based on offset of startDate
    const timeDiff = todayDate.getTime() - startDate.getTime();
    return Math.floor(Math.abs(timeDiff / (1000 * 3600 * 24))) % availableVideos.length;
}



// The selected video to show
const theVideo = availableVideos[getTheWordIndexForToday()];
// Text input for search
const chooser = document.getElementById('chooser');

// minutes until next day
const nextVideo = document.getElementById('nextVideo');
nextVideo.innerHTML = Math.round((86400 - Math.floor(new Date() / 1000) % 86400) / 60);

let imageClasses = ['bg1', 'bg2', 'bg3', 'bg4', 'bg5', 'bg6'];
let imageIndex = 0;

// The main image
const mainImage = document.getElementById('main_image');
mainImage.style.backgroundImage = "url('gifs/" + theVideo + ".gif')";

// The results from searching
const results = document.getElementById('results');

// the entered search input
let chooser_term = '';

// Check if today was already complete
if (myStorage.getItem(todayDateString) != undefined) {
    let storedResults = JSON.parse(myStorage.getItem(todayDateString));
    imageIndex = storedResults.index;
    checkAnswer(storedResults.answer);
}

function checkAnswer(videoAnswer) {
    // remove the previous image class
    mainImage.classList.remove(imageClasses[imageIndex]);
    // remove any text input in search
    chooser.value = '';
    // create the ID for the list of past guesses next to the image
    let guessId = 'guess' + (imageIndex + 1);

    if (imageIndex === 5 || (videoAnswer != undefined && atob(videoAnswer) == theVideo)) {
        let isCorrect = true;
        if (videoAnswer == undefined) {
            // Skipped the last guess
            isCorrect = false;
            videoAnswer = btoa(theVideo);
        }

        // Store the results
        let storeData = { 'index': imageIndex, 'answer': videoAnswer };
        myStorage.setItem(todayDateString, JSON.stringify(storeData));

        // Show the fully zoomed out
        mainImage.classList.add('bgfinal');
        // Remove all the search components
        document.getElementById('search-label').remove();
        document.getElementById('search-input').remove();
        // Create a link to the video
        const videoTitle = document.createElement('h1');
        videoTitle.innerHTML = '<a href="https://www.youtube.com/watch?v=' + theVideo + '" target="_blank">' + videos[videoAnswer] + '</a>';
        results.appendChild(videoTitle);

        let text = todayDate.toLocaleDateString();
        let copyResults = 'Videordle (' + text + '):';
        if (!isCorrect) {
            copyResults += ' ⬛ ⬛ ⬛ ⬛ ⬛ ⬛'
        } else {
            for (let i = 0; i < 6; i++) {
                if (i == imageIndex) {
                    copyResults += ' 🟩';
                    break;
                } else {
                    copyResults += ' ⬛';
                }
            }
        }
        const resultsCopyText = document.createElement('div');
        resultsCopyText.id = 'resultsCopy';
        resultsCopyText.innerHTML = copyResults;
        results.appendChild(resultsCopyText);

        const shareButton = document.createElement('button');
        shareButton.id = 'shareButton';
        shareButton.classList.add('btn', 'btn-primary', 'btn-sm');
        shareButton.innerHTML = 'Copy results for sharing';
        results.appendChild(shareButton);

        shareButton.addEventListener('click', e => {
            navigator.clipboard.writeText(copyResults).then(() => {
                alert("Copied to clipboard");
            });
        });

        // Add the video title to the last element in the guess list
        let guessList = document.getElementById(guessId);
        let videoName = videos[videoAnswer];
        if (isCorrect) {
            videoName = '✅ ' + videoName;
            guessList.classList.add('bg-success', 'bg-gradient', 'bg-opacity-25');
        } else {
            videoName = '❌ ' + videoName;
            guessList.classList.add('bg-danger', 'bg-gradient', 'bg-opacity-25');
        }
        guessList.innerHTML = videoName;
        return;
    }

    // for incorrect answers, add the title of the guessed video
    mainImage.classList.add(imageClasses[imageIndex + 1]);
    imageIndex++;
    let guessList = document.getElementById(guessId);
    let videoName = (videoAnswer == undefined) ? '' : videos[videoAnswer];
    guessList.classList.add('bg-danger', 'bg-gradient', 'bg-opacity-25');
    guessList.innerHTML = '❌ ' + videoName;
}

const searchVideos = async () => {
    // remove previous search responses
    results.innerHTML = '';

    const ul = document.createElement('ul');
    ul.classList.add('list-group');
    ul.id = 'chooser_list';

    videosArray.filter(([key, video]) =>
        video.toLowerCase().includes(chooser_term.toLowerCase())
    )
        .forEach(([key, video]) => {
            const li = document.createElement('li');
            li.dataset.videoId = key;
            li.classList.add('list-group-item');
            li.classList.add('list-group-item-action')
            li.classList.add('videoList');
            li.innerText = video;

            ul.appendChild(li);
        });

    results.appendChild(ul);

    // Event triggered when an answer is selected
    ul.addEventListener("click", function (e) {
        if (e.target && e.target.matches("li.videoList")) {
            let selectedVideo = e.target.dataset.videoId;
            ul.remove();
            checkAnswer(selectedVideo);
        }
    });
};

// Find as you type
chooser.addEventListener('input', e => {
    chooser_term = e.target.value;
    if (chooser_term.length > 1) {
        searchVideos();
    } else {
        results.innerHTML = '';
    }
});

// This is the "skip" button
const submitAnswer = document.getElementById('submitAnswer');
if (submitAnswer) {
    submitAnswer.addEventListener('click', e => {
        chooser.value = '';
        checkAnswer();
    });
}

