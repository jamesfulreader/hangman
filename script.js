const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');

const figureParts = document.querySelectorAll('.figure-part');

getWord();
const correctLetters = [];
const wrongLetters = [];

async function getWord() {
    const res = await fetch(
        'https://random-word-api.herokuapp.com/word?number=1'
    );
    const data = await res.json();
    const word = data[0].toString();
    displayWord(word);
}

function showNotification() {
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

function displayWord(word) {
    wordEl.innerHTML = `
        ${word
            .split('')
            .map(
                (letter) => `
                <span class="letter">${
                    correctLetters.includes(letter) ? letter : ''
                }</span>
            `
            )
            .join('')}
    `;
    const innerWord = wordEl.innerText.replace(/\n/g, '');

    if (innerWord === word) {
        finalMessage.innerText = 'Congratualtions! You have won!';
        popup.style.display = 'flex';
    }

    getKeyPress(word);
}

function getKeyPress(word) {
    window.addEventListener('keydown', (e) => {
       
            const letter = e.key;
            if (word.includes(letter)) {
                if (!correctLetters.includes(letter)) {
                    correctLetters.push(letter);
                    displayWord(word);
                } else {
                    showNotification();
                }
            } else {
                if (!wrongLetters.includes(letter)) {
                    wrongLetters.push(letter);

                    updateWrongLettersEl();
                } else {
                    showNotification();
                }
            }
        }
    );
}

function updateWrongLettersEl() {
    wrongLettersEl.innerHTML = `${
        wrongLetters.length > 0 ? '<p>Wrong</p>' : ''
    } ${wrongLetters.map((letter) => `<span>${letter}</span>`)}`;

    figureParts.forEach((part, index) => {
        const errors = wrongLetters.length;

        if (index < errors) {
            part.style.display = 'block';
        } else {
            part.style.display = 'none';
        }
    });

    if (wrongLetters.length === figureParts.length) {
        finalMessage.innerText = 'Unfortunately, You Have Lost';
        popup.style.display = 'flex';
        playAgainBtnClick();
    }
}

function playAgainBtnClick() {
    playAgainBtn.addEventListener('click', () => {
        window.location.reload();
    });
}
