import _ from "lodash";

export function includesDeep(array: Array<any>, target: any) {
  return array.some(item => _.isEqual(item, target));
}

export function deepEqual(obj1: any, obj2: any) {
  return _.isEqual(obj1, obj2);
}
