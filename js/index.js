//初期読み込み
var tag = document.createElement('script');

tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

//------動画の情報
//初期値
let youtubeId = "1XNKT-0za7E";
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId: youtubeId,
        playerVars: {
            playsinline: 1,
            controls: 0
        },
        events: {
            onStateChange: onPlayerStateChange
        }
    });
}

//再生関数
function playTheVideo() {
    player.playVideo();
}

//再生イベント
let doplayBtn = document.querySelector('#doplay');
doplayBtn.addEventListener('click', function () {
    playTheVideo(); //関数名に変更
});

//停止
let dostopBtn = document.querySelector('#dostop');
dostopBtn.addEventListener('click', function () {
    stopVideo();
});
//一時停止関数
function pauseTheVideo() {
    player.pauseVideo();
}

//一時停止イベント
let dopauseBtn = document.querySelector('#dopause');
dopauseBtn.addEventListener('click', function () {
    pauseTheVideo();
});

//ミュート関数
function onMute() {
    //ミュートの時、trueを返すのでミュートを解除します。
    if (player.isMuted()) {
        player.unMute();
    } else {
        //ミュートが解除されている時はfalseなので、ミュートにします。
        player.mute();
    }
}

//ミュートイベント
let onMuteBtn = document.querySelector('#mute');
onMuteBtn.addEventListener('click', function () {
    onMute();
});

//10秒前にの関数
function onePrev() {
    let currentTime = player.getCurrentTime();
    player.seekTo(currentTime - 10);
}

//10秒後にの関数
function oneNext() {
    let currentTime = player.getCurrentTime();
    player.seekTo(currentTime + 10);
}

//10秒前へイベント
let onePrevBtn = document.querySelector('#do10sPrev');
onePrevBtn.addEventListener('click', function () {
    onePrev();
});

//10秒後へイベント
let oneNextBtn = document.querySelector('#do10sNext');
oneNextBtn.addEventListener('click', function () {
    oneNext();
});

//音量調整
function volumeFn(vol) {
    let currentVol = player.getVolume();
    player.setVolume(vol);
}

let volumeBtn = document.querySelector('#volume');
let volumeTxt = document.querySelector('#volumeNum');
volumeBtn.addEventListener('change', function () {
    volumeFn(this.value);
    volumeTxt.textContent = this.value;
});

function onPlayerReady(event) {
    event.target.playVideo(); //①最初の再生を止める
    let currentVol = 5; //②最初のボリュームを設定（0〜100）
    event.target.setVolume(currentVol); //③Playerのボリュームに設定
    document.querySelector('#volume').value = currentVol; //④rangeFormに音量を設定
    document.querySelector('#volumeNum').textContent = currentVol; //⑤テキストにも音量を
}

//再生スピード関数
function playSpeed(num) {
    //setPlaybackRateが再生スピードをセットするメソッド
    player.setPlaybackRate(num);
    player.playVideo();
}

//再生スピードイベント
let speedBtn = document.querySelector('#doSpeed');
speedBtn.addEventListener('change', function () {
    //数値でないと効かないので、文字列から数値に変換
    playSpeed(parseFloat(speedBtn.speed.value));
});


function onPlayerReady(event) {
    event.target.playVideo();
}

var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
    }
}
//停止関数
function stopVideo() {
    player.stopVideo();
}

//!検索
let movieid = document.querySelector('#MovieId');
movieid.addEventListener('change', function () {
    youtubeId = movieid.value;
    //プレイヤー削除
    player.destroy();
    onYouTubeIframeAPIReady();
});

//検索関数の定義
const selectVideo = document.querySelector(".search__list");
selectVideo.style.display = "none"; // 検索結果を非表示

function ytSearch(val) {
    const key = 'AIzaSyCybbclXaPz6EmjonbiyLUPT8Y332j4hiU'; //自分のキーに書き換えます。
    const num = 10;
    const part = 'snippet';
    const type = 'video';
    const query = val;
    fetch(
        `https://www.googleapis.com/youtube/v3/search?type=${type}&part=${part}&maxResults=${num}&key=${key}&q=${query}&playsinline=1`
    )
        .then((data) => data.json())
        .then((obj) => {
            //検索した単語を予測に出す
            // console.log("通過");
            console.log(obj);

            selectVideo.innerHTML = "";
            for (let movie of obj.items) {

                const ytId = movie["id"]["videoId"];
                const ytTitle = movie["snippet"]["title"];

                //親のli要素を作成
                const liTag = document.createElement('li');
                liTag.classList.add('search__item');

                //第一子孫のimgを作成
                const imgTag = document.createElement('img');
                imgTag.setAttribute('value', ytId);
                imgTag.setAttribute('src', movie["snippet"]["thumbnails"]["default"]["url"]);
                imgTag.classList.add('search__img');

                //タイトルを生成
                const titleTag = document.createElement('p');
                titleTag.textContent = ytTitle;
                titleTag.classList.add('search__title');

                //liにそれぞれ付加
                liTag.appendChild(imgTag);
                liTag.appendChild(titleTag);

                //まとめてulに付加
                selectVideo.appendChild(liTag);

                imgTag.addEventListener("click", function () {
                    youtubeId = ytId; // 選択された動画IDを設定
                    player.destroy(); // プレイヤーを削除
                    onYouTubeIframeAPIReady(); // プレイヤーを再初期化
                    selectVideo.style.display = "none"; // 検索結果を表示
                    closeBtn.style.display = "none"; //閉じるボタンを表示
                });
            }
        });
}

//検索時実行
const ytSearchBtn = document.querySelector('#searchBtn');
const closeBtn = document.querySelector('.close');

ytSearchBtn.addEventListener('click', function (e) {
    //inputの値を持ってくる
    const ytSearchVal = document.querySelector('#ytSearch').value;
    closeBtn.style.display = "block"; //閉じるボタンを表示

    e.preventDefault();
    selectVideo.style.display = "flex"; // 検索結果を表示
    ytSearch(ytSearchVal); //検索関数を実行
});

closeBtn.addEventListener('click', () => {
    closeBtn.style.display = "none"; //閉じるボタンを非表示
    selectVideo.style.display = "none"; // 検索結果を非表示
});

//todo apiの初期化
//変更点はkeyの部分を2025-2の鍵に変更してます。