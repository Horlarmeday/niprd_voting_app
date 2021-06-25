import _ from 'lodash';
import moment from 'moment-timezone';

export function groupByCandidate(data) {
  return _(data)
    .groupBy(x => x.candidate_id)
    .map((value, key) => ({ candidate: key, data: value }))
    .value();
}

export function restrictedTime() {
  const timezone = 'Africa/Lagos';
  const now = moment().tz(timezone);
  const startTime = moment()
    .month(5)
    .date(25)
    .hours(7)
    .minutes(0)
    .seconds(0)
    .milliseconds(0)
    .tz(timezone);
  const endTime = moment()
    .month(5)
    .date(25)
    .hours(15)
    .minutes(0)
    .seconds(0)
    .milliseconds(0)
    .tz(timezone);

  return { now, startTime, endTime };
}

export function sumArray(arr) {
  return arr.reduce((a, b) => +a + +b, 0);
}
