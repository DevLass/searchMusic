const form = document.querySelector("#form");
const searchInput = document.querySelector("#search");
const songsContainer = document.querySelector("#songs-container");
const prevAndNextContainer = document.querySelector("#prev-and-next-container");

const apiURL = `https://api.lyrics.ovh`;

const fetchData = async (url) => {
    const response = await fetch(url); // Retorna uma promise com objeto response
    return await response.json(); // Retorna outra promise
};

const getMoreSongs = async (url) => {
    console.log(url);
    const data = await fetchData(`https://cors-anywhere.herokuapp.com/${url}`);
    insertSongsIntoPage(data);
};

const insertNextAndPrevButtons = ({prev, next}) => {
    prevAndNextContainer.innerHTML = `
    ${
        prev
            ? `<button class="btn" onClick="getMoreSongs('${prev}')">Prev</button>`
            : ""
    }
    ${
        next
            ? `<button class="btn" onClick="getMoreSongs('${next}')">Next</button>`
            : ""
    }
    `;
};

const insertSongsIntoPage = ({ data, prev, next}) => {
    songsContainer.innerHTML = data
        .map(
            ({artist: {name}, title}) => `
    <li class="song">
    <span class="song-artist">
    <strong> 
    ${name}
    </strong>
    ${title}
    </span>
    <button class="btn" data-artist="${name}" data-song-title="${title}"> Lyrics </button>
    </li>
    `
        )
        .join("");

    if (prev || next) {
        insertNextAndPrevButtons({prev, next});
        return
    }

    prevAndNextContainer.innerHTML = "";
    // Map executa a funçao para cada item do array
    // Sempre retorna outro array
    // Join concatena os itens do array e os separa por virgula
    // Dentro das parentes dele voce pode definir o elemento separador
};

const fetchSongs = async (term) => {
    const data = await fetchData(`${apiURL}/suggest/${term}`); // Retorna outra promise
    insertSongsIntoPage(data);
};

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const searchTerm = searchInput.value.trim();
    // Trim Remove espaços em branco desnecessários

    if (!searchTerm) {
        // Caso searchTerm não exista (Seja vazia)
        songsContainer.innerHTML = `<li class="warning-message">Please enter a valid term! </li> `;
        return;
    }

    fetchSongs(searchTerm);
});

const insertLyricsIntoPage = ({ lyrics, artist, songTitle }) => {
    songsContainer.innerHTML = `
    <li class="lyrics-container">
    <h2> <strong>${songTitle} </strong> - ${artist}</h2>
    <p class="lyrics">${lyrics} </p>
    </li> 
    `;
};

const fetchLyrics = async (artist, songTitle) => {
    const data = await fetchData(`${apiURL}/v1/${artist}/${songTitle}`); // Retorna outra promise
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");

    insertLyricsIntoPage({ lyrics, artist, songTitle });
};

songsContainer.addEventListener("click", (event) => {
    const clickedElement = event.target;

    if (clickedElement.tagName === "BUTTON") {
        const artist = clickedElement.getAttribute("data-artist");
        const songTitle = clickedElement.getAttribute("data-song-title");

        prevAndNextContainer.innerHTML = "";

        fetchLyrics(artist, songTitle);
    }
});
