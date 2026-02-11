document.addEventListener('DOMContentLoaded', () => {
    const heartSeal = document.getElementById('heart-seal');
    const letter = document.getElementById('letter');
    const cardContainer = document.getElementById('card-container');
    const audioPlayer = document.getElementById('audioPlayer');
    const playButton = document.getElementById('playButton');

    // Текст песни с таймингами (время в секундах)
    const lyrics = [
        { time: 10, text: "Знакомьтесь, месье - это моя муза" },
        { time: 13, text: "Своими карими глазами жалит, как медуза" },
        { time: 16, text: "Я знаю, что на свете ни одна гламурная коза" },
        { time: 19, text: "Не будет меня так любить, как любит она" },
        { time: 22, text: "Моя муза - богиня, её имя - победа" },
        { time: 24, text: "Она готовит мои строки, чтоб ты ими отобедал" },
        { time: 27, text: "Нежная, как плед, создатель каждого куплета" },
        { time: 30, text: "Сильная, как ветер, поклонница чёрного цвета" },
        { time: 33, text: "Верность её кредо, изящная пантера" },
        { time: 35, text: "Разрывает вас на части, пробирает как холера" },
        { time: 38, text: "В этих городских притонах муза - моя вера" },
        { time: 41, text: "Одновременно нищенка, одновременно королева" },
        { time: 43, text: "Её кожа, её тело, шоколадные куски" },
        { time: 46, text: "Волосы, как амазонка, заплетает в колоски" },
        { time: 49, text: "Пока вы, блять, сношаетесь друг с другом от тоски" },
        { time: 52, text: "Моя муза в стороне забивает косяки" },
        { time: 54, text: "Произноси её фамилию как заклинание" },
        { time: 57, text: "Только она одна способна исполнять желания" },
        { time: 60, text: "Приоткрывает губы, происходит замыкание" },
        { time: 63, text: "Муза, если окочурюсь, я скажу тебе заранее" },
        { time: 66, text: "Неважно расстояние, она внутри меня" },
        { time: 68, text: "Пусть только выделяет сок, и не нужно нихуя" },
        { time: 71, text: "Это изысканная похоть, вам сюда нельзя" },
        { time: 74, text: "Удары в её сторону я принимаю на себя" },
        { time: 77, text: "Даже дворами темными всегда меня искала" },
        { time: 79, text: "На её фоне ваши чувства сделаны из кала" },
        { time: 82, text: "Среди толпы грязных людей себя не замарала" },
        { time: 85, text: "Она шагала по шакалам, как по полотнам шагала" },
        { time: 89, text: "Знакомьтесь, месье - это моя муза" },
        { time: 93, text: "Своими карими глазами жалит, как медуза" },
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
