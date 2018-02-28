const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const sessionTime = document.querySelector('.session-length');
const breakTime = document.querySelector('.break-length');
const minus = document.querySelectorAll('.minus');
const plus = document.querySelectorAll('.plus');
const start = document.querySelector('.start');
const stop = document.querySelector('.stop');
const fill = document.querySelector('.fill');
const displayDiv = document.querySelector('.display');
let countdown; // keep track of time left
let task = true; // to track our state. True = session; false = break
const sessionClr = 'rgb(153, 204, 0)';
const breakClr = 'rgb(255,50,50)';

function updateFill(percentage) {
  fill.style.height = `${percentage * 100}%`;
  fill.style.backgroundColor = `${task ? sessionClr : breakClr}`;
  if (!task) {
    displayDiv.style.border = `3px solid ${breakClr}`;
  } else {
    displayDiv.style.border = `3px solid ${sessionClr}`;
  }
}

function clearStyles() {
  fill.style.height = '0%';
  fill.style.backgroundColor = '#fff';
  displayDiv.style.border = `3px solid ${sessionClr}`;
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;

  const display = `${minutes}:${remainder < 10 ? '0' : ''}${remainder}`;
  document.title = display;
  timerDisplay.textContent = display;
}

function displayTimeEnd(time) {
  // Time is an int value representing the number of milliseconds since January 1, 1970
  const end = new Date(time);
  const hours = end.getHours();
  const minutes = end.getMinutes();
  endTime.textContent = `${task ? 'Session' : 'Break'} ends at ${hours > 12 ? hours - 12 : hours}:${
    minutes < 10 ? '0' : ''
  }${minutes}${hours > 12 ? 'PM' : 'AM'}`;
}

function timer(seconds) {
  // prevent existing timers from running
  clearTimeout(countdown);
  // log time our timer starts
  const now = Date.now();
  // convert time to ms for our Date object
  const then = now + seconds * 1000;
  const totalSeconds = Math.round(then - now) / 1000;
  displayTimeLeft(seconds);
  displayTimeEnd(then);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    if (secondsLeft <= 0 && task) {
      clearInterval(countdown);
      task = false;
      updateFill(0);
      startTimer();
    } else if (secondsLeft <= 0) {
      clearInterval(countdown);
      return 0;
    } else {
      updateFill((totalSeconds - secondsLeft) / totalSeconds);
      displayTimeLeft(secondsLeft);
    }
  }, 1000);
}

function decreaseSessionTime() {
  this.nextElementSibling.textContent =
    this.nextElementSibling.textContent <= 0 ? 0 : parseInt(this.nextElementSibling.textContent) - 1;
}

function addSessionTime() {
  this.previousElementSibling.textContent = parseInt(this.previousElementSibling.textContent) + 1;
}

function startTimer() {
  clearStyles();
  let seconds;
  if (task) {
    // grab the session time from our session var
    seconds = parseInt(sessionTime.textContent) * 60;
  } else {
    seconds = parseInt(breakTime.textContent) * 60;
  }
  timer(seconds);
}

minus.forEach(btn => btn.addEventListener('click', decreaseSessionTime));
plus.forEach(btn => btn.addEventListener('click', addSessionTime));
start.addEventListener('click', () => {
  task = true;
  startTimer();
});
stop.addEventListener('click', () => {
  clearStyles();
  clearInterval(countdown);
  const now = Date.now();
  // convert time to ms for our Date object
  const then = now * 1000;
  displayTimeLeft(0);
  displayTimeEnd(then);
});
