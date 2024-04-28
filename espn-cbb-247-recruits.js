// ==UserScript==
// @name         ESPN CBB 247 Recruits
// @description  Adds high school ranking to ESPN College Basketball player pages
// @namespace    https://github.com/asecco/espn-cbb-247-recruits
// @version      0.1
// @author       Andrew https://github.com/asecco
// @license      MIT
// @grant        none
// @match        https://www.espn.com/mens-college-basketball/player/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=espn.com
// ==/UserScript==

const getPlayerName = () => {
    let name = window.location.pathname.split("/").pop()
    name = name.replace(/-/g, ' ');
    return name
}

const getPlayerYear = () => {
    const playerYearElement = document.querySelector('.Table__TBODY tr:last-child');
    let playerYear = playerYearElement ? playerYearElement.textContent.trim() : null;
    return playerYear ? playerYear.split('-')[0] : null;
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

const recruitingSearch = async () => {
    const espnName = getPlayerName();
    const espnYear = getPlayerYear();
    const baseUrl = `https://247sports.com/Season/${espnYear}-Basketball/CompositeRecruitRankings/`;
    let playerFound = false;

    if (!espnName || !espnYear) {
        return;
    }

    for (let page = 1; page <= 5; page++) {
        const url = `${baseUrl}?page=${page}`;

        try {
            const response = await fetch(url);
            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, "text/html");

            const listItems = doc.querySelectorAll('li.rankings-page__list-item');
            listItems.forEach(item => {
                const recruit = item.querySelector('.recruit .rankings-page__name-link');
                const rankColumn = item.querySelector('.rank-column .primary');
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
                    removeExistingRecruitingInfo();
                    const playerInfo = document.createElement('li');
                    playerInfo.classList.add('recruiting-info');
                    const div1 = document.createElement('div');
                    const div2 = document.createElement('div');

                    div1.classList.add('ttu');
                    div1.textContent = 'HS RANKING';

                    div2.classList.add('fw-medium', 'clr-black');
                    div2.textContent = `${starCount}⭐ #${rank}(${espnYear})`;

                    playerInfo.appendChild(div1);
                    playerInfo.appendChild(div2);

                    const playerBioList = document.querySelector('.PlayerHeader__Bio_List');
                    playerBioList.appendChild(playerInfo);
                    playerFound = true;
                }
            });
        } catch (error) {
            console.log("Error fetching recruiting info:", error);
        }

        if (playerFound) break;
    }

    if (!playerFound) {
        removeExistingRecruitingInfo();
        console.log(`Player '${espnName}' not found in the 247 rankings.`);
    }
}

const urlObserver = () => {
    let currentURL = window.location.href;
    const observer = new MutationObserver(() => {
        if (window.location.href !== currentURL) {
            currentURL = window.location.href;
            setTimeout(recruitingSearch, 500);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
};

recruitingSearch();

urlObserver();