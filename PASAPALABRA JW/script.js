
const rosco = document.getElementById('rosco');
const questionText = document.getElementById('question-text');
const btnPass = document.getElementById('btn-pass');
const btnCorrect = document.getElementById('btn-correct');
const btnWrong = document.getElementById('btn-wrong');

let questionsByLetter = {};
let selectedQuestions = {};
let currentLetter = null;

// Carga de preguntas
fetch('pasapalabra_questions.json')
  .then(res => res.json())
  .then(data => {
    // Agrupar preguntas por letra
    data.forEach(item => {
      const L = item.Letra.toUpperCase();
      if (!questionsByLetter[L]) questionsByLetter[L] = [];
      questionsByLetter[L].push(item);
    });
    initRosco();
  });

function initRosco() {
  const letters = Object.keys(questionsByLetter).sort();
  const total = letters.length;
  const radius = 180;

  // Selección aleatoria por letra
  letters.forEach(L => {
    const arr = questionsByLetter[L];
    selectedQuestions[L] = arr[Math.floor(Math.random() * arr.length)];
  });

  // Dibujar círculo de letras
  letters.forEach((L, i) => {
    const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
    const x = radius * Math.cos(angle) + 200 - 20;
    const y = radius * Math.sin(angle) + 200 - 20;
    const div = document.createElement('div');
    div.className = 'letter';
    div.style.left = x + 'px';
    div.style.top = y + 'px';
    div.textContent = L;
    div.dataset.letter = L;
    div.addEventListener('click', () => selectLetter(L, div));
    rosco.appendChild(div);
  });
}

function selectLetter(L, div) {
  currentLetter = L;
  const q = selectedQuestions[L];
  questionText.textContent = q ? q.Pregunta : 'Sin pregunta';
}

btnPass.addEventListener('click', () => markLetter('passed'));
btnCorrect.addEventListener('click', () => markLetter('correct'));
btnWrong.addEventListener('click', () => markLetter('wrong'));

function markLetter(status) {
  if (!currentLetter) return;
  const div = document.querySelector(`.letter[data-letter="${currentLetter}"]`);
  div.classList.remove('correct', 'wrong');
  if (status === 'correct') div.classList.add('correct');
  if (status === 'wrong') div.classList.add('wrong');
  // Pasar o reset de estado
  currentLetter = null;
  questionText.textContent = 'Selecciona otra letra';
}
