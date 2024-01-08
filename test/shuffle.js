//  https://en.wikipedia.org/wiki/Fisher–Yates_shuffle

//  shuffle :: Array a -> Undefined
export default xs => {
  for (let i = xs.length - 1; i > 0; i -= 1) {
    const j = Math.floor (Math.random () * (i + 1));
    [xs[i], xs[j]] = [xs[j], xs[i]];
  }
};
