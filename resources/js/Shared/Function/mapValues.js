export function mapValues(obj, fn){
  
  return Object.keys(obj).reduce((acc, k) => {
    acc[k] = fn(obj[k], k, obj);
    return acc;
  }, {})

  // from https://www.30secondsofcode.org/js/s/map-values
}