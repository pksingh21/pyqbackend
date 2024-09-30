const deepEqual = (obj1: any, obj2: any): boolean => {
  // Check if both are the same reference
  if (obj1 === obj2) return true;

  // Check if both are arrays
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false; // Check if arrays are of the same length

    // Recursively check each element in the array
    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqual(obj1[i], obj2[i])) return false;
    }
    return true;
  }

  // If one is array and the other isn't, they aren't equal
  if (Array.isArray(obj1) || Array.isArray(obj2)) {
    return false;
  }

  // If either is not an object or null, they are not equal
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }

  // Check if both objects have the same number of keys
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;

  // Recursively check each key-value pair
  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
};

export default deepEqual;
