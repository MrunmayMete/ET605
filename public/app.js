const userId = 'demo-user';
let conceptIndex = 0;
let currentConcept = null;
let currentQuestion = null;
const conceptIds = ['c1','c2','c3','c4','c5','c6'];

async function getJson(url, opts) {
  const r = await fetch(url, opts);
  return r.json();
}

async function loadConcept() {
  const conceptId = conceptIds[conceptIndex] || conceptIds.at(-1);
  const concepts = await getJson('/concept');
  currentConcept = concepts.find(c => c.id === conceptId);
  renderConcept();
  await loadQuestion();
  await renderProgress();
}

async function loadQuestion() {
  currentQuestion = await getJson(`/next-question?userId=${userId}&conceptId=${currentConcept.id}`);
  renderQuestion();
}

function renderConcept() {
  document.getElementById('concept').innerHTML = `
    <h2>Concept: ${currentConcept.title}</h2>
    <p>${currentConcept.content}</p>
    <p><strong>Example:</strong> ${currentConcept.example}</p>
    <p><strong>Story:</strong> ${currentConcept.story_example}</p>
    <span class='badge'>Concept ${conceptIndex + 1} / ${conceptIds.length}</span>
  `;
}

function renderQuestion() {
  const q = currentQuestion;
  const options = q.options.length
    ? q.options.map(o => `<label class='option'><input type='radio' name='ans' value='${o}'> ${o}</label>`).join('')
    : `<input id='ansInput' placeholder='Type your answer'>`;

  document.getElementById('question').innerHTML = `
    <h3>Question (${q.difficulty}, ${q.kc})</h3>
    <p>${q.prompt}</p>
    ${options}
    <button id='submitBtn'>Submit Answer</button>
  `;

  document.getElementById('submitBtn').onclick = submitAnswer;
}

async function submitAnswer() {
  let answer = '';
  const checked = document.querySelector("input[name='ans']:checked");
  if (checked) answer = checked.value;
  const ansInput = document.getElementById('ansInput');
  if (ansInput) answer = ansInput.value;

  const result = await getJson('/submit-answer', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      userId,
      conceptId: currentConcept.id,
      questionId: currentQuestion.id,
      answer
    })
  });

  const msgClass = result.correct ? 'good' : 'bad';
  document.getElementById('feedback').innerHTML = `
    <h3>Feedback</h3>
    <p class='${msgClass}'>${result.feedback} Mastery: ${(result.mastery * 100).toFixed(0)}%</p>
    ${result.hint ? `<p><strong>Hint:</strong> ${result.hint}</p>` : ''}
    ${result.explanation ? `<p><strong>Explanation:</strong> ${result.explanation}</p>` : ''}
    ${result.remedial ? `<p><strong>Remedial:</strong> ${result.remedial}</p>` : ''}
    ${result.errorType ? `<p><strong>Error type:</strong> ${result.errorType}</p>` : ''}
    <p><strong>Action:</strong> ${result.decision.action}</p>
  `;

  if (result.decision.action === 'next_concept') conceptIndex = Math.min(conceptIndex + 1, conceptIds.length - 1);
  await loadConcept();
}

async function renderProgress() {
  const learner = await getJson(`/learner?userId=${userId}`);
  document.getElementById('progress').innerHTML = `
    <h3>Progress</h3>
    <p>Attempts: ${learner.attempts} | Accuracy: ${(learner.accuracy * 100).toFixed(0)}% | Hints used: ${learner.hints_used}</p>
    <pre>${JSON.stringify({concept_mastery: learner.concept_mastery, kc_mastery: learner.kc_mastery}, null, 2)}</pre>
  `;
}

loadConcept();
