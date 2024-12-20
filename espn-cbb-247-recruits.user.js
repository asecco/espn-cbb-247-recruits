// ==UserScript==
// @name         ESPN CBB 247 Recruits
// @description  Adds high school ranking to ESPN College Basketball player pages
// @namespace    https://github.com/asecco/espn-cbb-247-recruits
// @version      1.2.0
// @author       Andrew https://github.com/asecco
// @license      MIT
// @grant        none
// @match        https://www.espn.com/mens-college-basketball/player/*
// @icon         https://github.com/asecco/espn-cbb-247-recruits/raw/main/icon-64.png
// ==/UserScript==

const getPlayerName = () => {
    let name = window.location.pathname.split("/").pop()
    name = name.replace(/-/g, ' ');
    return name
}

const getPlayerYear = () => {
    const playerYearElement = document.querySelectorAll('.Table__TBODY')[1];
    const lastChild = playerYearElement ? playerYearElement.lastElementChild : null;

    if (lastChild) {
        let playerYear = lastChild.textContent.trim();
        return playerYear ? playerYear.split('-')[0] : null;
    }
    return null;
}

const normalizeName = (name) => {
    return name.replace(/ jr/g, '').toUpperCase();
};

const removeExistingRecruitingInfo = () => {
    const existingPlayerInfo = document.querySelector('.recruiting-info');
    if (existingPlayerInfo) {
        existingPlayerInfo.remove();
    }
}

const updateRecruitingInfo = (ranking) => {
    removeExistingRecruitingInfo();

    const playerInfo = document.createElement('li');
    playerInfo.classList.add('recruiting-info');
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');

    div1.classList.add('ttu');
    div1.textContent = 'HS RANKING';

    div2.classList.add('fw-medium', 'clr-black');
    div2.textContent = ranking;

    playerInfo.appendChild(div1);
    playerInfo.appendChild(div2);

    const playerBioList = document.querySelector('.PlayerHeader__Bio_List');
    if (playerBioList) {
        playerBioList.appendChild(playerInfo);
    }
};

const recruitingSearch = async (redshirt = undefined) => {
    const espnName = getPlayerName();
    const espnYear = redshirt || getPlayerYear();
    const baseUrl = `https://247sports.com/Season/${espnYear}-Basketball/CompositeRecruitRankings/`;
    const maxPage = 5;
    let playerFound = false;

    if (!espnName || !espnYear) {
        return;
    }

    updateRecruitingInfo('Searching 247Sports...', false);

    for (let page = 1; page <= maxPage; page++) {
        const url = `${baseUrl}?page=${page}`;

        try {
            const response = await fetch(url);
            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, "text/html");

            const listItems = doc.querySelectorAll('li.rankings-page__list-item');
            listItems.forEach(item => {
                const recruit = item.querySelector('.recruit .rankings-page__name-link');
                const rankColumn = item.querySelector('.rank-column .primary').childNodes[0];
                const rating = item.querySelector('.rating .rankings-page__star-and-score');

                const playerName = recruit ? recruit.textContent.trim() : 'N/A';
                const rank = rankColumn ? rankColumn.textContent.trim() : 'N/A';

                let starCount = 0;
                if (rating) {
                    const yellowStars = rating.querySelectorAll('.icon-starsolid.yellow');
                    starCount = yellowStars.length;
                }

                const playerNameNormalized = normalizeName(playerName);
                const espnNameNormalized = normalizeName(espnName);

                if (playerNameNormalized === espnNameNormalized) {
                    const ranking = `${starCount}⭐ #${rank}(${espnYear})`;
                    updateRecruitingInfo(ranking);
                    playerFound = true;
                }
            });
        } catch (error) {
            console.log("Error fetching recruiting info:", error);
        }

        if (playerFound) break;
    }

    if (!playerFound) {
        if (redshirt === undefined) {
            recruitingSearch(espnYear - 1);
        } else {
            const ranking = `0⭐ NR(${espnYear})`;
            updateRecruitingInfo(ranking, true);
        }
    }
}

const urlObserver = () => {
    let currentPlayerId = getPlayerIdFromURL();
    const observer = new MutationObserver(() => {
        const newPlayerId = getPlayerIdFromURL();
        if (newPlayerId !== currentPlayerId) {
            currentPlayerId = newPlayerId;
            setTimeout(recruitingSearch, 500);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
};

const getPlayerIdFromURL = () => {
    const id = window.location.href.match(/\/id\/(\d+)\//);
    return id ? id[1] : null;
};


recruitingSearch();

urlObserver();