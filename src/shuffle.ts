function shuffle<T>(array: T[] | readonly T[]): T[] {
  let shuffled = array.slice(0, array.length),
    j: number,
    x: T;
  for (let i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * i);
    x = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = x;
  }
  return shuffled;
}

export default shuffle;
