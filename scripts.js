import { playlist as videos } from './playlist.js';

// Video objects turned into an array
const videosArray = Object.entries(videos);

// video IDs to choose from
const availableVideos = [
    'l7vRSu_wsNc',
    '4JkIs37a2JE',
    '5IsSpAOD6K8',
    'JkRKT6T0QLg',
    'uPudE8nDog0',
    'oIb9QUGjdIc',
    'r3kQlzOi27M',
    'uejh-bHa4To',
    'GHhD4PD75zY',
    'LatorN4P9aA',
    'QqqBs6kkzHE',
    'SwrYMWoqg5w',
    'Yf_Lwe6p-Cg',
    'ejorQVy3m8E',
    'ijAYN9zVnwg',
    'm3-hY-hlhBg',
    'rkpG4XApJ28',
    'uq-gYOrU8bA',
    'z5rRZdiu1UE',
    'cOeKidp-iWo',
    '5-WpsdC2-Cc',
    'PGNiXGX2nLU',
    '79fzeNUqQbQ',
    'nTizYn3-QN0',
    'xwtdhWltSIg',
    '0-EF60neguk',
    'cjIvu7e6Wq8',
    'wTP2RUD_cL0',
    'HasaQvHCv4w',
    'eBG7P-K-r1Y',
    '4xmckWVPRaI',
    'W8r-tXRLazs',
    'kemivUKb4f4',
    '9SOryJvTAGs',
    'RRKJiM9Njr8',
    'etviGf1uWlg',
    'FTQbiNvZqaY',
    'L_jWHffIx5E',
    'LuN6gs0AJls',
    'PIb6AZdTr-A',
    'PWgvGjAhvIw',
    'hIs5StN8J-0',
    'J9gKyRmic20',
    'djV11Xbc914',
    'E1fzJ_AYajA',
    'CdqoNKCCt7A',
    'aENX1Sf3fgQ',
    'eBShN8qT4lk',
    'dTAAsCNK7RA',
    'XfR9iY5y94s',
    'LKYPYj2XX80',
    'K1b8AhIsSYQ',
    'AjPau5QYtYs',
    'JmcA9LIIXWw',
    'Jne9t8sHpUc',
    'dQw4w9WgXcQ',
    'hTWKbfoikeg',
    '3qVPNONdF58',
    'rog8ou-ZepE',
    '0aqLwHP4y6Q',
    '3dOx510kyOs',
    '4B_UYYPb-Gk',
    '6VCdJyOAQYM',
    'UtvmTu4zAMg',
    'WM8bTdBs-cw',
    'YgSPaXgAdzE',
    'd4-1ASpdT1Y',
    'fC_q9KPczAg',
    'o1tj2zJ2Wvg',
    'tDl3bdE3YQA'
];

// Set localstorage info
let myStorage = window.localStorage;

// Let us override today's date
const queryString = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});
let overrideDate = queryString.day;

const startDate = new Date("09 Apr 2022");
let currentDate = new Date();
let todayDate = new Date();

// If overriding, change "todays" date
if (overrideDate) {
    todayDate = new Date(overrideDate);
    // make sure the override is between start date and today's date
    if (todayDate.getTime() < startDate.getTime() || todayDate.getTime() > currentDate.getTime()) {
        todayDate = currentDate;
    } else {
        // keep the current time so "minutes to tomorrow" is still correct
        todayDate.setHours(currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds());
    }

}

const todayDateString = todayDate.toDateString();
document.getElementById('videoDate').innerHTML = todayDateString;

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
function getMinutesToTomorrow() {
    // tomorrow date
    let tomorrow = new Date(todayDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    return (Math.round((tomorrow - todayDate) / 1000 / 60)); // convert to minutes
}

const nextVideo = document.getElementById('nextVideo');
nextVideo.innerHTML = getMinutesToTomorrow();

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
        const videoTitle = document.createElement('h3');
        videoTitle.innerHTML = '<a href="https://www.youtube.com/watch?v=' + theVideo + '" target="_blank" class="videoSuccess">' + videos[videoAnswer] + '</a>';
        results.appendChild(videoTitle);

        let text = todayDate.toLocaleDateString();
        let copyResults = 'Videordle.com (' + text + '):';
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

        results.appendChild(document.createElement('br'));
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

// Modals

const infoModalButton = document.getElementById('modal-info-button');
const infoModal = document.getElementById('modal-info');
const infoModalClose = document.getElementById('modal-info-close');

const qModalButton = document.getElementById('modal-q-button');
const qModal = document.getElementById('modal-q');
const qModalClose = document.getElementById('modal-q-close');

const graphModalButton = document.getElementById('modal-graph-button');
const graphModal = document.getElementById('modal-graph');
const graphModalClose = document.getElementById('modal-graph-close');

const modalDarken = document.getElementById('modal-darken');


function closeModal(modal) {
    modal.classList.remove('show')
    modalDarken.classList.remove('darken')
}

infoModalButton.addEventListener('click', (e) => {
    e.preventDefault();
    infoModal.classList.add('show')
    modalDarken.classList.add('darken')
    infoModalClose.addEventListener('click', () => {
        closeModal(infoModal);
    })
    modalDarken.addEventListener('click', () => {
        closeModal(infoModal);
    })
})

qModalButton.addEventListener('click', (e) => {
    e.preventDefault();
    qModal.classList.add('show')
    modalDarken.classList.add('darken')
    qModalClose.addEventListener('click', () => {
        closeModal(qModal);
    })
    modalDarken.addEventListener('click', () => {
        closeModal(qModal);
    })
})

graphModalButton.addEventListener('click', (e) => {
    e.preventDefault();
    var date = new Date();
    month = date.getMonth();
    year = date.getFullYear();
    document.getElementById("curMonth").innerHTML = months[month];
    document.getElementById("curYear").innerHTML = year;
    loadCalendarMonths();
    loadCalendarYears();
    loadCalendarDays();

    graphModal.classList.add('show')
    modalDarken.classList.add('darken')
    graphModalClose.addEventListener('click', () => {
        closeModal(graphModal);
    })
    modalDarken.addEventListener('click', () => {
        closeModal(graphModal);
    })
});

// Calendar stuff

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var startYear = 2022;
var endYear = 2022;
var month = 0;
var year = 0;
let monthToggle = 'hide';
let yearToggle = 'hide';

function loadCalendarMonths() {
    // Create a dropdown of months and add hidden to dom
    for (var i = 0; i < months.length; i++) {
        var doc = document.createElement("div");
        doc.innerHTML = months[i];
        doc.classList.add("dropdown-item");

        doc.onclick = (function () {
            var selectedMonth = i;
            return function () {
                month = selectedMonth;
                document.getElementById("curMonth").innerHTML = months[month];
                loadCalendarDays();
                document.getElementById('months').style.display = 'none';
                monthToggle = 'hide';
                return month;
            }
        })();

        document.getElementById("months").appendChild(doc);
    }
}

function loadCalendarYears() {
    document.getElementById("years").innerHTML = "";

    for (var i = startYear; i <= endYear; i++) {
        var doc = document.createElement("div");
        doc.innerHTML = i;
        doc.classList.add("dropdown-item");

        doc.onclick = (function () {
            var selectedYear = i;
            return function () {
                year = selectedYear;
                document.getElementById("curYear").innerHTML = year;
                loadCalendarDays();
                return year;
            }
        })();

        document.getElementById("years").appendChild(doc);
    }
}

function loadCalendarDays() {
    document.getElementById("calendarDays").innerHTML = "";

    var tmpDate = new Date(year, month, 0);
    var num = daysInMonth(month, year);
    var dayofweek = tmpDate.getDay();
    let nowDate = new Date();
    nowDate.setHours(0, 0, 0, 0);
    // overwrite todayDate time to be 0 for better comparrison
    let selectedTodayDate = todayDate;
    selectedTodayDate.setHours(0, 0, 0, 0);

    for (var i = 0; i <= dayofweek; i++) {
        var d = document.createElement("div");
        d.classList.add("day");
        d.classList.add("blank");
        document.getElementById("calendarDays").appendChild(d);
    }

    for (var i = 0; i < num; i++) {
        var tmp = i + 1;
        var d = document.createElement("div");
        d.id = "calendarday_" + i;
        d.classList.add('day');

        var dateString = tmp.toString().padStart(2, "0") + ' ' + months[month] + ' ' + year;

        let thisDate = new Date(dateString);

        // highlight today's date
        if (thisDate.getTime() == nowDate.getTime()) {
            d.classList.add('todayDay');
        }

        // highlight the current overridden date if different from today
        if (thisDate.getTime() == selectedTodayDate.getTime()) {
            if (selectedTodayDate.getTime() != nowDate.getTime()) {
                d.classList.add('selectedDay');
            }
        }

        d.innerHTML = tmp;
        d.dataset.day = tmp;

        // Only underline and make clickable old dates
        if (thisDate.getTime() <= nowDate.getTime() && thisDate.getTime() >= startDate.getTime()) {
            d.classList.add('dayUnderline');
            d.addEventListener('click', (e) => {
                let dateQuery = e.currentTarget.dataset.day.padStart(2, "0") + ' ' + months[month] + ' ' + year;
                window.location.href = window.location.protocol + "//" + window.location.host + window.location.pathname + '?day=' + dateQuery;
            });
        }

        document.getElementById("calendarDays").appendChild(d);
    }

    var clear = document.createElement("div");
    clear.className = "clear";
    document.getElementById("calendarDays").appendChild(clear);
}

function daysInMonth(month, year) {
    var d = new Date(year, month + 1, 0);
    return d.getDate();
}

let curMonthClick = document.getElementById('curMonth');

// show/hide the month dropdown
curMonthClick.addEventListener('click', (e) => {
    if (monthToggle == 'show') {
        monthToggle = 'hide';
        document.getElementById('months').style.display = 'none';
    } else {
        monthToggle = 'show';
        document.getElementById('months').style.display = 'block';
    }
});

let curYearClick = document.getElementById('curYear');

// show/hide the year dropdown, eventually
curYearClick.addEventListener('click', (e) => {
    // if(yearToggle == 'show') {
    //     yearToggle = 'hide';
    //     document.getElementById('years').style.display = 'none';
    // } else {
    //     yearToggle = 'show';
    //     document.getElementById('years').style.display = 'block';
    // }
});
