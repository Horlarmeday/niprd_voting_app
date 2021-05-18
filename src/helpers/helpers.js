import _ from 'lodash';

export function groupByCandidate(data) {
  return _(data)
    .groupBy(x => x.candidate_id)
    .map((value, key) => ({ candidate: key, data: value }))
    .value();
}
