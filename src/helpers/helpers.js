import _ from 'lodash';

export function groupByCandidate(data) {
  return _(data)
    .groupBy(x => x.candidate_id)
    .map((value, key) => ({ candidate: key, data: value }))
    .value();
}

function setTime(hour, minute, seconds) {
  const now = new Date();
  now.setDate(now.getDate());
  now.setHours(hour);
  now.setMinutes(minute);
  now.setMilliseconds(seconds);
  return now;
}

export function restrictedTime() {
  const n = new Date();
  const now = ((n.getHours() % 12 || 12) < 10 ? '0' : '') + (n.getHours() % 12 || 12);

  const startHour = setTime(6, 30, 0);
  const start = startHour.getHours();

  const endHour = setTime(8, 30, 0);
  const end = endHour.getHours();

  return { now, start, end };
}
