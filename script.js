document.addEventListener('DOMContentLoaded', () => {
    const heartSeal = document.getElementById('heart-seal');
    const letter = document.getElementById('letter');
    const cardContainer = document.getElementById('card-container');
    const backgroundMusic = document.getElementById('background-music');

    // Обработчик клика по сердцу
    heartSeal.addEventListener('click', () => {
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
            }
        }, 500); // Соответствует времени анимации
    });
});