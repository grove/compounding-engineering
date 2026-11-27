/**
 * A browser version of the duplicate-payment scenario in the billing lab.
 * Sequential, in-memory replay only; no real payments or network requests.
 * Source: https://github.com/grove/patterns-of-compounding-engineering/tree/main/examples
 */

const PAYMENT_EVENTS = Object.freeze([
  Object.freeze({
    id: 'evt_001',
    type: 'payment_succeeded',
    invoice_id: 'inv_001',
    amount_cents: 2400,
  }),
  Object.freeze({
    id: 'evt_001',
    type: 'payment_succeeded',
    invoice_id: 'inv_001',
    amount_cents: 2400,
  }),
]);

/** Replay deliveries from an unpaid starting state, without mutating the input. */
export function replayPaymentEvents(events, { deduplicate = true } = {}) {
  if (!Array.isArray(events) || events.length === 0) {
    throw new TypeError('Provide at least one payment event.');
  }
  if (typeof deduplicate !== 'boolean') {
    throw new TypeError('deduplicate must be a boolean.');
  }

  const seen = new Map();
  let paidCents = 0;
  let appliedEvents = 0;

  const deliveries = events.map((event, index) => {
    if (!event || typeof event.id !== 'string' || !event.id.trim()
      || typeof event.invoice_id !== 'string' || !event.invoice_id.trim()
      || event.type !== 'payment_succeeded'
      || !Number.isSafeInteger(event.amount_cents) || event.amount_cents <= 0) {
      throw new TypeError('Each event needs an ID, invoice ID, payment type and positive integer amount.');
    }
    if (event.invoice_id !== events[0].invoice_id) {
      throw new TypeError('This example replays payments for one invoice.');
    }

    const previous = seen.get(event.id);
    if (previous && (previous.amount_cents !== event.amount_cents
      || previous.invoice_id !== event.invoice_id || previous.type !== event.type)) {
      throw new TypeError('A repeated event ID must have the same payload.');
    }

    const applied = !deduplicate || !previous;
    if (applied) {
      paidCents += event.amount_cents;
      if (!Number.isSafeInteger(paidCents)) {
        throw new RangeError('The recorded total is too large for this example.');
      }
      appliedEvents += 1;
    }
    seen.set(event.id, event);

    return {
      number: index + 1,
      eventId: event.id,
      amountCents: event.amount_cents,
      applied,
    };
  });

  return { paidCents, appliedEvents, deliveries };
}

const initializedRoots = new WeakSet();
const formatAmount = (minorUnits) => (minorUnits / 100).toFixed(2);

/** Enhance the teaching example only when its complete HTML is present. */
export function initPaymentDemo(root = document) {
  if (initializedRoots.has(root)) return false;

  const runButton = root.querySelector('#replay-payment');
  const resetButton = root.querySelector('#reset-payment');
  const eventRows = root.querySelector('#payment-events');
  const result = root.querySelector('#payment-result');
  const total = root.querySelector('#payment-total');
  const count = root.querySelector('#payment-count');
  const choices = [...root.querySelectorAll('input[name="payment-handler"]')];

  if (!runButton || !resetButton || !eventRows || !result || !total || !count
    || !choices.some((choice) => choice.value === 'buggy')
    || !choices.some((choice) => choice.value === 'fixed')) return false;

  initializedRoots.add(root);
  const doc = eventRows.ownerDocument;
  result.setAttribute('role', 'status');
  result.setAttribute('aria-live', 'polite');
  result.setAttribute('aria-atomic', 'true');

  function clearReplay(message = 'Ready. Replay the same payment event twice.') {
    const row = doc.createElement('tr');
    const cell = doc.createElement('td');
    cell.colSpan = 3;
    cell.textContent = 'No events replayed yet.';
    row.append(cell);
    eventRows.replaceChildren(row);
    total.textContent = '0.00';
    count.textContent = '0';
    result.textContent = message;
    result.dataset.state = 'idle';
  }

  runButton.addEventListener('click', (event) => {
    event.preventDefault();
    const deduplicate = choices.some((choice) => choice.checked && choice.value === 'fixed');
    const replay = replayPaymentEvents(PAYMENT_EVENTS, { deduplicate });

    eventRows.replaceChildren(...replay.deliveries.map((delivery) => {
      const row = doc.createElement('tr');
      row.dataset.applied = String(delivery.applied);
      const values = [
        String(delivery.number),
        delivery.eventId,
        delivery.applied ? `Applied +${formatAmount(delivery.amountCents)}` : 'Duplicate ignored',
      ];
      values.forEach((value) => {
        const cell = doc.createElement('td');
        cell.textContent = value;
        row.append(cell);
      });
      return row;
    }));

    total.textContent = formatAmount(replay.paidCents);
    count.textContent = String(replay.appliedEvents);
    result.dataset.state = deduplicate ? 'fixed' : 'buggy';
    result.textContent = deduplicate
      ? 'Recorded 24.00. The second delivery was ignored: its event ID was already seen.'
      : 'Recorded 48.00 for a 24.00 payment. The same event was applied twice.';
  });

  resetButton.addEventListener('click', (event) => {
    event.preventDefault();
    clearReplay();
  });

  choices.forEach((choice) => {
    choice.addEventListener('change', () => {
      clearReplay(`${choice.value === 'fixed' ? 'Fixed' : 'Buggy'} handler selected. Replay the same event twice.`);
    });
  });

  if (!choices.some((choice) => choice.checked)) {
    choices.find((choice) => choice.value === 'buggy').checked = true;
  }
  runButton.disabled = false;
  resetButton.disabled = false;
  clearReplay();
  return true;
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initPaymentDemo(), { once: true });
  } else {
    initPaymentDemo();
  }
}
