import { playlist as videos } from './playlist.js';

const videosArray = Object.entries(videos);
const availableVideos = [
    'FTQbiNvZqaY',
    'J9gKyRmic20',
    'djV11Xbc914',
    'CdqoNKCCt7A',
    'aENX1Sf3fgQ'
];

const theVideo = availableVideos[Math.floor(Math.random() * availableVideos.length)];

const chooser = document.getElementById('chooser');

let imageClasses = ['bg1', 'bg2', 'bg3', 'bg4', 'bg5', 'bg6'];
let imageIndex = 0;
const mainImage = document.getElementById('main_image');
mainImage.style.backgroundImage = "url('" + theVideo + ".gif')";


function checkAnswer(isFinal) {
    if (imageIndex === 5 || isFinal !=  undefined) {
        mainImage.classList.remove(imageClasses[imageIndex]);
        mainImage.classList.add('bgfinal');
        return;
    }

    mainImage.classList.remove(imageClasses[imageIndex]);
    mainImage.classList.add(imageClasses[imageIndex + 1]);
    imageIndex++;
}

const results = document.getElementById('results');

const showVideos = async () => {
    results.innerHTML = '';

    const ul = document.createElement('ul');
    ul.id = 'chooser_list';

    videosArray.filter(([key, video]) =>
        video.toLowerCase().includes(chooser_term.toLowerCase())
    )
        .forEach(([key, video]) => {
            const li = document.createElement('li');
            li.dataset.videoId = key;
            li.classList.add('videoList');
            li.innerText = video;

            ul.appendChild(li);
        });

    results.appendChild(ul);

    ul.addEventListener("click", function (e) {
        if (e.target && e.target.matches("li.videoList")) {
            let selectedVideo = e.target.dataset.videoId;
            //console.log('The Video:' + theVideo);
            //console.log(atob(selectedVideo));
            if (atob(selectedVideo) == theVideo) {
                ul.remove();
                checkAnswer('final');
                chooser.value = '';
                const videoTitle = document.createElement('h1');
                videoTitle.innerHTML = '<a href="https://www.youtube.com/watch?v=' + theVideo + '" target="_blank">' + videos[selectedVideo] + '</a>';
                results.appendChild(videoTitle);
                alert('YOU WIN!');
            } else {
                ul.remove();
                checkAnswer();
                chooser.value = '';
                alert('TRY AGAIN');
            }
        }
    });
};


let chooser_term = '';

chooser.addEventListener('input', e => {
    chooser_term = e.target.value;
    showVideos();
});

const submitAnswer = document.getElementById('submitAnswer');
submitAnswer.addEventListener('click', e => {
    checkAnswer();
});

