const form = document.querySelector('#investment-form');

if (form) {
  const fields = [
    ['outcome', 'Desired capability'],
    ['obstacle', 'Obstacle and alternatives'],
    ['existing', 'Existing capabilities'],
    ['bet', 'Smallest experiment'],
    ['purpose', 'Main purpose'],
    ['evidence', 'Prediction and evidence'],
    ['next', 'Possible later capability'],
    ['budget', 'People, budget and displaced work'],
    ['review', 'Review and stopping conditions'],
  ];
  const example = {
    outcome: "A billing engineer can assess a routine schema migration without waiting for the orders team's specialist. Unfamiliar migrations still go to the specialist.",
    obstacle: 'Recent reviews waited for help interpreting lock behavior. Check whether test setup caused the wait or whether nobody had agreed the acceptable downtime. Consider narrowing the approval rule if its original reason no longer applies.',
    existing: 'Orders has lock traces, synthetic traffic cases and a database sandbox. Billing needs access and time to check whether its traffic and schema assumptions fit. A specialist can review the expected results.',
    bet: 'Adapt one case for an eligible billing migration. Ask a billing engineer to predict the lock behavior, run the check and explain its limits before comparing their judgment with the specialist.',
    evidence: 'Prediction: the receiving engineer can judge an eligible migration under the same acceptance standard without specialist help on the next attempt. Record disagreements, support, setup and review effort. If releases still wait for a downtime decision, take that decision to its owner.',
    next: 'The reviewed cases might supply inputs for a recovery rehearsal. Check later what transfers, what must be rebuilt and whether the earlier investment reduces effort or improves the result.',
    budget: 'Illustrative cap: two days to build and half a day for the receiver. Orders owns the experiment; billing names the receiving engineer. Product and engineering leads agree which work moves, the upkeep cap and who can approve changes to release rules.',
    review: 'Review after three eligible migrations or twelve weeks, whichever comes first. Stop or simplify if the check misleads, support exceeds the cap or the need disappears. Keep required release safeguards in place.',
  };
  const status = document.querySelector('#investment-status');
  const fallback = document.querySelector('#investment-copy-fallback');
  const output = document.querySelector('#investment-note');
  const exampleButton = document.querySelector('#use-investment-example');

  function note() {
    const values = new FormData(form);
    return '# Capability investment\n\n' + fields.map(([name, label]) => {
      const value = String(values.get(name) ?? '').trim();
      return `## ${label}\n${value || '(Not yet decided)'}`;
    }).join('\n\n');
  }

  // Keep the worksheet on the page even if Enter is used in a form control.
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', () => {
    status.textContent = '';
    if (!fallback.hidden) output.value = note();
  });

  exampleButton.addEventListener('click', () => {
    let filled = 0;
    for (const [name, value] of Object.entries(example)) {
      const field = form.elements.namedItem(name);
      if (!field.value.trim()) {
        field.value = value;
        filled += 1;
      }
    }
    if (!fallback.hidden) output.value = note();
    status.textContent = filled
      ? `Filled ${filled} empty fields with the hypothetical example. Your existing answers and selected purpose are unchanged.`
      : 'All fields already contain answers. Your entries are unchanged.';
  });

  document.querySelector('#copy-investment').addEventListener('click', async () => {
    const text = note();
    try {
      await navigator.clipboard.writeText(text);
      fallback.hidden = true;
      status.textContent = 'Copied. Paste the note into your issue or planning document.';
    } catch {
      fallback.hidden = false;
      output.value = text;
      output.focus();
      output.select();
      status.textContent = 'Automatic copying is unavailable. Your note is selected below; copy it with your keyboard or device menu.';
    }
  });

  document.querySelector('#print-investment').addEventListener('click', () => {
    window.print();
  });

  // Textareas can scroll on screen; expand them so printing includes every answer.
  const heights = new Map();
  window.addEventListener('beforeprint', () => {
    for (const field of form.querySelectorAll('textarea')) {
      heights.set(field, field.style.height);
      field.style.height = 'auto';
      field.style.height = `${field.scrollHeight}px`;
    }
  });
  window.addEventListener('afterprint', () => {
    for (const [field, height] of heights) field.style.height = height;
    heights.clear();
  });

  exampleButton.hidden = false;
  document.querySelector('#worksheet-actions').hidden = false;
}
