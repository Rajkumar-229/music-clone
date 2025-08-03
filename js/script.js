console.log('Hey this is a js program');

let currentSong = new Audio();
let songs;
let currFolder;

function formatSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  // Round the seconds to the nearest whole number
  seconds = Math.round(seconds);

  // Calculate minutes and seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Format minutes and seconds with leading zeros if necessary
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  // Return the formatted string
  return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs(folder) {

  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a")
  songs = []
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1])
    }
  }


  let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
  songUL.innerHTML = ""

  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li>
                         <div class="info">
                         <img src="Svgs/music.svg" alt="">
                         <div class="hey">
                            <div> ${song.replaceAll("%20", " ")} </div>
                            <div class="name">Rajkumar</div>
                         </div>
                          </div>
                        <div class="play"><h6> Play now </h6><img src="Svgs/p-icon2.svg" alt=""></div></li>`
  }


  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      playMusic(e.querySelector(".hey").getElementsByTagName("div")[0].innerHTML.trim())
    })

  });
  return songs
}



const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  // let audio = new Audio("/songs/" + track);
  if (!pause) {
    currentSong.play();
    play.src = "Svgs/pause.svg";
  }
  document.querySelector(".songname").innerHTML = decodeURI(track)
  document.querySelector(".time").innerHTML = "00:00 / 00:00"
}


async function displayAlbum() {
  let a = await fetch(`/songs/`)
  let response = await a.text();

  let div = document.createElement("div")
  div.innerHTML = response;
  let anchor = div.getElementsByTagName("a")
  let container1 = document.querySelector(".container1")
  let array = Array.from(anchor)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/songs")) {
      let folder = e.href.split("/").slice(-2)[0];

      let a = await fetch(`http://127.0.0.1:3000//songs/${folder}/info.json`)
      let response = await a.json();

      container1.innerHTML = container1.innerHTML + `<div data-folder="${folder}" class="card">
      <span class="circle">
      <img src="/songs/${folder}/cover.jpg" alt=""></span>
      
      <button data-testid="play-button" aria-label="Play Pritam" data-encore-id="buttonPrimary"
      data-is-icon-only="true" class="play-button">
      <span class="play-icon">
      <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24"
      class="Svg-sc-ytk21e-0 bneLcE">
      <path
      d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
      </path>
      </svg>
      </span>
      </button>
      <span class="artist">
      <h2>${response.title}</h2>
      <P>${response.description}</P>
      </span>
      </div>`
    }
  }
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
      playMusic(songs[0])
    })
  });
}

async function main() {
  await getSongs("songs/Arijit-Singh")
  playMusic(songs[0], true);


  await displayAlbum();

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "Svgs/pause.svg";
    }
    else {
      currentSong.pause();
      play.src = "Svgs/playicon.svg";
    }
  })




  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".time").innerHTML = `${formatSeconds(currentSong.currentTime)}/${formatSeconds(currentSong.duration)}`
    document.querySelector(".c-seek").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  })


  document.querySelector(".seekbar").addEventListener("click", e => {
    let parcent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
    document.querySelector(".c-seek").style.left = parcent + "%";
    currentSong.currentTime = ((currentSong.duration) * parcent) / 100;
  })
  document.querySelector(".hamberger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
  })
  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-110%"
  })

  // Add an event listner to make a previous button
  previous.addEventListener("click", () => {
    currentSong.pause()

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ((index - 1) >= 0) {
      playMusic(songs[index - 1]);
    }
  })

  // Add an event listner to make a Next button
  next.addEventListener("click", () => {
    currentSong.pause()

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ((index + 1) < songs.length) {
      playMusic(songs[index + 1]);
    }
  })



  document.querySelector(".rang").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    currentSong.volume = parseInt(e.target.value) / 100;

    if (currentSong.volume > 0) {
      document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("Svgs/mute.svg", "Svgs/volume.svg")
    }
  })

  document.querySelector(".volume>img").addEventListener("click", e => {
    if (e.target.src.includes("Svgs/volume.svg")) {
      e.target.src = e.target.src.replace("Svgs/volume.svg", "Svgs/mute.svg")
      currentSong.volume = "0";
      document.querySelector(".rang").getElementsByTagName("input")[0].value = 0;
    }

    else {
      e.target.src = e.target.src.replace("Svgs/mute.svg", "Svgs/volume.svg")
      currentSong.volume = "1";
      document.querySelector(".rang").getElementsByTagName("input")[0].value = 90;
    }
  })

}
main();