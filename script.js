document.addEventListener('DOMContentLoaded', () => {
    const heartSeal = document.getElementById('heart-seal');
    const letter = document.getElementById('letter');
    const cardContainer = document.getElementById('card-container');
    const audioPlayer = document.getElementById('audioPlayer');
    const playButton = document.getElementById('playButton');

    // Текст песни с таймингами (время в секундах)
    const lyrics = [
        { time: 1, text: "" },
        { time: 3, text: "" },
        { time: 5, text: "" },
        { time: 7, text: "" },
        { time: 9, text: "" },
        { time: 11, text: "" },
        { time: 13, text: "" },
        { time: 15, text: "" },
        { time: 17, text: "" },
        { time: 19, text: "" },
        { time: 21, text: "" },
        { time: 23, text: "" }
    ];

    // Текущий индекс текста
    let currentLyricIndex = 0;
    let isPlaying = false;
    let lyricTimeouts = [];

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
            
            // Автоматически запускаем воспроизведение музыки при открытии письма
            if (!isPlaying) {
                // Сбрасываем состояние
                currentLyricIndex = 0;
                lyricTimeouts.forEach(t => clearTimeout(t));
                lyricTimeouts = [];

                // Удаляем старые тексты
                document.querySelectorAll('.lyric').forEach(el => el.remove());

                // Проигрываем аудио
                audioPlayer.currentTime = 0;
                audioPlayer.play().then(() => {
                    isPlaying = true;
                    
                    // Запускаем синхронизацию
                    syncLyrics();
                }).catch(error => {
                    console.error('Ошибка воспроизведения:', error);
                    alert('Не удалось воспроизвести аудио. Проверьте файл.');
                });
            }
        }, 500); // Соответствует времени анимации
    });

    // Функция создания текста вокруг карточки
    function createLyric(text) {
        const lyricElement = document.createElement('div');
        lyricElement.className = 'lyric';
        lyricElement.textContent = text;

        // Получаем размеры карточки
        const cardRect = cardContainer.getBoundingClientRect();
        const containerRect = document.body.getBoundingClientRect();

        // Вычисляем безопасную зону вокруг карточки (отступ 100px)
        const safeMargin = 150;

        // Определяем возможные позиции вокруг карточки
        const positions = [
            // Сверху
            {
                x: getRandom(cardRect.left + safeMargin, cardRect.right - safeMargin),
                y: cardRect.top - 100
            },
            // Снизу
            {
                x: getRandom(cardRect.left + safeMargin, cardRect.right - safeMargin),
                y: cardRect.bottom + 50
            },
            // Слева
            {
                x: cardRect.left - getRandom(100, 300),
                y: getRandom(cardRect.top, cardRect.bottom)
            },
            // Справа
            {
                x: cardRect.right + getRandom(100, 300),
                y: getRandom(cardRect.top, cardRect.bottom)
            },
            // Верхний левый угол
            {
                x: cardRect.left - getRandom(100, 250),
                y: cardRect.top - getRandom(50, 150)
            },
            // Верхний правый угол
            {
                x: cardRect.right + getRandom(100, 250),
                y: cardRect.top - getRandom(50, 150)
            },
            // Нижний левый угол
            {
                x: cardRect.left - getRandom(100, 250),
                y: cardRect.bottom + getRandom(50, 150)
            },
            // Нижний правый угол
            {
                x: cardRect.right + getRandom(100, 250),
                y: cardRect.bottom + getRandom(50, 150)
            }
        ];

        // Выбираем случайную позицию
        const pos = positions[Math.floor(Math.random() * positions.length)];

        // Устанавливаем позицию
        lyricElement.style.left = `${pos.x}px`;
        lyricElement.style.top = `${pos.y}px`;

        // Случайный поворот для разнообразия
        const rotation = getRandom(-15, 15);
        lyricElement.style.transform = `rotate(${rotation}deg) scale(0.5)`;

        document.body.appendChild(lyricElement);

        // Показываем текст с анимацией
        setTimeout(() => {
            lyricElement.classList.add('show');
        }, 10);

        // Скрываем через 3 секунды
        setTimeout(() => {
            lyricElement.classList.add('fade-out');
            setTimeout(() => {
                lyricElement.remove();
            }, 800);
        }, 3000);

        return lyricElement;
    }

    // Вспомогательная функция для случайных чисел
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Функция синхронизации текста с аудио
    function syncLyrics() {
        if (currentLyricIndex >= lyrics.length) {
            return;
        }

        const currentTime = audioPlayer.currentTime;
        const currentLyric = lyrics[currentLyricIndex];

        // Если время подошло, показываем текст
        if (currentTime >= currentLyric.time - 0.2) {
            createLyric(currentLyric.text);
            currentLyricIndex++;
        }

        // Продолжаем проверять, если песня ещё играет
        if (!audioPlayer.paused && currentLyricIndex < lyrics.length) {
            const timeout = setTimeout(syncLyrics, 50);
            lyricTimeouts.push(timeout);
        }
    }

    // Обработчик кнопки
    playButton.addEventListener('click', () => {
        if (!isPlaying) {
            // Сбрасываем состояние
            currentLyricIndex = 0;
            lyricTimeouts.forEach(t => clearTimeout(t));
            lyricTimeouts = [];

            // Удаляем старые тексты
            document.querySelectorAll('.lyric').forEach(el => el.remove());

            // Проигрываем аудио
            audioPlayer.currentTime = 0;
            audioPlayer.play().then(() => {
                isPlaying = true;
                playButton.textContent = "⏸️ Пауза";
                
                // Запускаем синхронизацию
                syncLyrics();
            }).catch(error => {
                console.error('Ошибка воспроизведения:', error);
                alert('Не удалось воспроизвести аудио. Проверьте файл.');
            });
        } else {
            // Пауза
            audioPlayer.pause();
            isPlaying = false;
            playButton.textContent = "▶️ Продолжить";
            
            // Очищаем таймауты
            lyricTimeouts.forEach(t => clearTimeout(t));
            lyricTimeouts = [];
        }
    });

    // Когда аудио заканчивается
    audioPlayer.addEventListener('ended', () => {
        isPlaying = false;
        playButton.textContent = "▶️ Воспроизвести";
        currentLyricIndex = 0;
    });

    // Обработчик ошибок аудио
    audioPlayer.addEventListener('error', (e) => {
        console.error('Ошибка аудио:', e);
        alert('Ошибка загрузки аудио. Проверьте путь к файлу.');
    });
});