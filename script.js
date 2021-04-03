$ = document.querySelectorAll.bind(document); // Hehe :) poor man's JQuery

const render = (selector, dom) =>
  $(selector).forEach((ele) => {
    ele.innerHTML = dom;
  });

const renderCard = (cardClassName, { time, prevTime }) => {
  if (!/\.timer__(day|hour|minute|second)/.test(cardClassName)) {
    throw new Error(`Invalid card class: ${cardClassName}`);
  }

  const topCard = `
    <div class="timer__card-top">
      <div class="timer__card-top-digits">
        ${String(time).padStart(2, 0)}
      </div>
    </div>
  `;

  const bottomCard = `
    <div class="timer__card-bottom">
      <div class="timer__card-bottom-digits">
        ${String(prevTime || time).padStart(2, 0)}
      </div>
    </div>
  `;


  if (!prevTime) {
    render(cardClassName, `${topCard}${bottomCard}`);
    return;
  }

  const animatedTopCard = `
    <div class="timer__card-top animated">
      <div class="timer__card-top-digits">
        ${String(prevTime || time).padStart(2, 0)}
      </div>
    </div>
  `;

  const animatedBottomCard = `
    <div class="timer__card-bottom animated">
      <div class="timer__card-bottom-digits">
        ${String(time).padStart(2, 0)}
      </div>
    </div>
  `;

  render(
    cardClassName,
    `
    ${topCard}
    ${animatedTopCard}
    ${bottomCard}
    ${animatedBottomCard}
    `
  );
};

const renderClock = (prevTime, { days, hours, minutes, seconds }) => {
  if (prevTime.days !== days) {
    renderCard(".timer__day", { prevTime: prevTime.days, time: days });
  }

  if (prevTime.hours !== hours) {
    renderCard(".timer__hour", { prevTime: prevTime.hours, time: hours });
  }

  if (prevTime.minutes !== minutes) {
    renderCard(".timer__minute", { prevTime: prevTime.minutes, time: minutes });
  }

  if (prevTime.seconds !== seconds) {
    renderCard(".timer__second", { prevTime: prevTime.seconds, time: seconds });
  }
};

const renderTest = (_, { days }) => {
  renderCard(".timer__day", { prevTime: days - 1, time: days });
  renderCard(".timer__hour", { prevTime: days - 1, time: days });
  renderCard(".timer__minute", { prevTime: days - 1, time: days });
  renderCard(".timer__second", { prevTime: days - 1, time: days });
};

function countdown(days) {
  let currentTime = {
    days: days,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };
  renderClock({}, currentTime);

  let seconds = days * 24 * 60 * 60;
  const interval = setInterval(() => {
    if (seconds <= 0) {
      clearInterval(interval);
      return;
    }
    seconds -= 1;

    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const nextTime = {
      days: Math.floor(days % 99),
      hours: Math.floor(hours % 24),
      minutes: Math.floor(minutes % 60),
      seconds: Math.floor(seconds % 60),
    };

    renderClock(currentTime, nextTime);
    currentTime = nextTime;
  }, 1000);
}

countdown(14);
