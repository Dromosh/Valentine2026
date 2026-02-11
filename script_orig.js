document.addEventListener('DOMContentLoaded', () => {
    const heartSeal = document.getElementById('heart-seal');
    const letter = document.getElementById('letter');
    const cardContainer = document.getElementById('card-container');
    const backgroundMusic = document.getElementById('background-music');
    const lyricsContainer = document.getElementById('lyrics-container');

    // Lyrics array - you can customize these with actual song lyrics
    const lyrics = [
        "Ты мой самый лучший друг",
        "Самый близкий человек",
        "С днем святого Валентина",
        "Люблю тебя навек",
        "Сердце бьется в такт любви",
        "Ты в моей душе живи",
        "Пусть весь мир узнает",
        "Как сильно я люблю"
    ];

    // Function to create and show a lyric line
    function showLyric(text) {
        const lyricElement = document.createElement('div');
        lyricElement.className = 'lyric-line';
        lyricElement.textContent = text;
        
        // Random position around the card
        const positions = [
            { top: '10%', left: '10%' },
            { top: '10%', left: '50%' },
            { top: '10%', left: '90%' },
            { top: '50%', left: '10%' },
            { top: '50%', left: '90%' },
            { top: '90%', left: '10%' },
            { top: '90%', left: '50%' },
            { top: '90%', left: '90%' }
        ];
        
        const randomPosition = positions[Math.floor(Math.random() * positions.length)];
        lyricElement.style.top = randomPosition.top;
        lyricElement.style.left = randomPosition.left;
        
        lyricsContainer.appendChild(lyricElement);
        
        // Remove the lyric after some time
        setTimeout(() => {
            lyricElement.remove();
        }, 3000);
    }

    // Function to play lyrics in sync with music
    function playLyrics() {
        lyrics.forEach((lyric, index) => {
            setTimeout(() => {
                showLyric(lyric);
            }, index * 2000); // Show each lyric every 2 seconds
        });
    }

    // Обработчик клика по контейнеру письма
    letter.addEventListener('click', () => {
        // Плавно скрываем сердце
        heartSeal.style.opacity = '0';
        
        // Через короткую задержку показываем карточку
        setTimeout(() => {
            letter.style.opacity = '0';
            letter.style.pointerEvents = 'none';
            
            // Добавляем активный класс контейнеру карточки
            cardContainer.classList.add('active');
            
            // Запускаем воспроизведение фоновой музыки (если есть)
            if(backgroundMusic.src && backgroundMusic.src !== window.location.href) {
                backgroundMusic.play().catch(e => console.log("Ошибка воспроизведения аудио:", e));
                
                // Start showing lyrics
                playLyrics();
            }
        }, 500); // Соответствует времени анимации
    });
});