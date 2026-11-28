const form = document.querySelector('#investment-form');

if (form) {
  const fields = [
    ['outcome', 'Valuable outcome and conditions'],
    ['obstacle', 'Constraint and work that could disappear'],
    ['existing', 'Existing capabilities'],
    ['bet', 'Workflow change and bounded experiment'],
    ['purpose', 'Main purpose'],
    ['evidence', 'Prediction, quality, attention and total cost'],
    ['next', 'Later capability and reinvestment'],
    ['budget', 'Ownership, authority, budget and displaced work'],
    ['review', 'Review and stopping conditions'],
  ];
  const example = {
    outcome: 'A product team can complete an eligible experiment without waiting for a platform engineer to prepare and remove its preview environment. The initial scope is one service using synthetic data and existing access rules.',
    obstacle: 'The hypothesis is that repeated environment requests delay experiments. Follow recent cases to distinguish provisioning waits from unclear product questions or missing participants. Remove the request handoff for eligible work instead of processing its tickets faster.',
    existing: 'The platform team has deployment templates, synthetic data, access controls and usage telemetry. Check whether these can create isolated environments with a cost limit and reliable expiry, and identify the work needed to connect them.',
    bet: 'For one service, provision an isolated preview when an eligible experiment branch is ready and remove it when the branch closes or expires. Retire the routine setup request. Record failures and route unsupported configurations to the platform owner; a person still decides what the product experiment should establish.',
    evidence: 'Prediction: eligible experiments reach a usable product decision sooner with fewer platform interventions and within the agreed quality and cost limits. Compare time from experiment readiness to decision, total human attention, compute, failed provisioning and cleanup. If environment waits disappear but decisions do not arrive sooner, investigate the next constraint.',
    next: 'Reinvest some recovered platform time in the next constraint. The provisioning, expiry and telemetry might help build independent agent investigations of alternative designs. Measure what transfers, what must be added and whether the earlier investment makes that new capability cheaper or more effective.',
    budget: 'Illustrative cap: two days to build and half a day for adoption. The platform owner and product team agree the eligible scope, compute and upkeep budgets, authority to retire the request step, and which planned work moves. Include oversight and failed attempts in the account.',
    review: 'Review after five eligible experiments or twelve weeks, whichever comes first. Keep only if the full workflow improves under the agreed quality and cost limits. Simplify or stop if environments outlive their expiry, support exceeds the cap or the need disappears; retain a manual route for exceptions.',
  };
  const status = document.querySelector('#investment-status');
  const fallback = document.querySelector('#investment-copy-fallback');
  const output = document.querySelector('#investment-note');
  const exampleButton = document.querySelector('#use-investment-example');

  function note() {
    const values = new FormData(form);
    return '# Engineering transformation investment\n\n' + fields.map(([name, label]) => {
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
