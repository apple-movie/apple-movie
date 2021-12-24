function playM3u8(url) {
  if (Hls.isSupported()) {
    var video = document.getElementById("video");
    openFullscreen(video);
    video.hidden = false;
    video.volume = 1.0;
    var hls = new Hls();
    var m3u8Url = decodeURIComponent(url);
    hls.loadSource(m3u8Url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play();
    });
    document.title = url;
  }
}

/* View in fullscreen */
function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen(elem) {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}

const list = document.getElementById("list");

function renderItem(data) {
  
  

  let template = document.getElementById("item-template");
  let item = template.content.cloneNode(true);

  item.querySelector(".name").textContent = data.name;
  item.querySelector(".date").textContent = data.year;
  item.querySelector(".lang").textContent = data.vod_lang;
  item.querySelector(".area").textContent = data.vod_area;
  item.querySelector(".director").textContent = data.vod_director;
  item.querySelector(".actor").textContent = data.vod_actor;

  item.querySelector("img").src = data.pic;

  let urls = data.vod_url.split("\r");
  let buttons = item.querySelector(".play-buttons");

  urls.forEach((url, index) => {
    url = url.replace(/\d+\$/g, "");

    let label = urls.length > 1 ? "第" + (index + 1) + "集" : "播放";
    let button = renderPlayButton(label, url);
    buttons.append(button);
  });

  list.append(item);
}

function renderPlayButton(label, url) {
  let button = document.createElement("button");
  button.type = "button";
  button.className = 'play-button';
  button.innerText = label;
  button.dataset.url = url;

  return button;
}

function search(keyword) {
 const searchLoading = document.querySelector('.search-loading');
   const searchError = document.querySelector('.search-error');
  searchLoading.hidden = false;
  fetch("https://taopianapi.com/home/cjapi/as/mc/vod/json/m3u8?wd=" + keyword)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
    searchLoading.hidden = true;
    
      var items = data.data;

      items.forEach((item) => {
        renderItem(item);
      });
    });
}

const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  search(searchInput.value);
});

const video = document.getElementById("video");

document.addEventListener('click', (e) => {
  if(e.target.classList.contains('play-button')) {
    playM3u8(e.target.dataset.url);
  }
});

video.addEventListener('fullscreenchange', (event) => {
  // document.fullscreenElement will point to the element that
  // is in fullscreen mode if there is one. If not, the value
  // of the property is null.
  if (document.fullscreenElement) {
    
  } else {
    video.pause();
   video.hidden = true;
  }
});
