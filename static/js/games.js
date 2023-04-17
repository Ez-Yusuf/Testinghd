function firstSection(callback) {
  const spinner = document.getElementById('spinner-container');
spinner.innerHTML = '<div class="spinner"></div>';

fetch('/assets/JSON/games.json')
    .then((response) => response.json())
    .then((data) => {
        const container = document.getElementById('card-container');
        for (const game of data) {
            const card = document.createElement('div');
            card.classList.add('card');
            const link = document.createElement('a');
            const image = document.createElement('img');
            image.classList.add('cardimage');
            image.src = game.image;
            const name = document.createElement('p');
            name.classList.add('cardname');
            name.textContent = game.name;
            link.appendChild(image);
            link.appendChild(name);
            card.appendChild(link);
            container.appendChild(card);
        }

        spinner.remove();
    })
    .catch((error) => {
        spinner.remove();
        console.error(error);
    });
  callback();
}

function secondSection() {
  const tiltEffectSettings = {
  max: 10, // max tilt rotation (degrees (deg))
  perspective: 1000, // transform perspective, the lower the more extreme the tilt gets (pixels (px))
  scale: 1.05, // transform scale - 2 = 200%, 1.5 = 150%, etc..
  speed: 500, // speed (transition-duration) of the enter/exit transition (milliseconds (ms))
  easing: 'cubic-bezier(.03,.98,.52,.99)' // easing (transition-timing-function) of the enter/exit transition
};

const cards = document.querySelectorAll('.card');

cards.forEach(card => {
  card.addEventListener('mouseenter', cardMouseEnter);
  card.addEventListener('mousemove', cardMouseMove);
  card.addEventListener('mouseleave', cardMouseLeave);
});

function cardMouseEnter(event) {
  setTransition(event);
}

function cardMouseMove(event) {
  const card = event.currentTarget;
  const cardWidth = card.offsetWidth;
  const cardHeight = card.offsetHeight;
  const centerX = card.offsetLeft + cardWidth / 2;
  const centerY = card.offsetTop + cardHeight / 2;
  const mouseX = event.clientX - centerX;
  const mouseY = event.clientY - centerY;
  const rotateXUncapped = (+1) * tiltEffectSettings.max * mouseY / (cardHeight / 2);
  const rotateYUncapped = (-1) * tiltEffectSettings.max * mouseX / (cardWidth / 2);
  const rotateX = rotateXUncapped < -tiltEffectSettings.max ? -tiltEffectSettings.max :
    (rotateXUncapped > tiltEffectSettings.max ? tiltEffectSettings.max : rotateXUncapped);
  const rotateY = rotateYUncapped < -tiltEffectSettings.max ? -tiltEffectSettings.max :
    (rotateYUncapped > tiltEffectSettings.max ? tiltEffectSettings.max : rotateYUncapped);

  card.style.transform = `perspective(${tiltEffectSettings.perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) 
                          scale3d(${tiltEffectSettings.scale}, ${tiltEffectSettings.scale}, ${tiltEffectSettings.scale})`;
}

function cardMouseLeave(event) {
  event.currentTarget.style.transform = `perspective(${tiltEffectSettings.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  setTransition(event);
}

function setTransition(event) {
  const card = event.currentTarget;
  clearTimeout(card.transitionTimeoutId);
  card.style.transition = `transform ${tiltEffectSettings.speed}ms ${tiltEffectSettings.easing}`;
  card.transitionTimeoutId = setTimeout(() => {
    card.style.transition = '';
  }, tiltEffectSettings.speed);
}
}

firstSection(function() {
  secondSection();
});
