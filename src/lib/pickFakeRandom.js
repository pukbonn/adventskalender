export function pickFakeRandom(options, fakeRandomness) {
  const hash = (fakeRandomness * 2_654_435_761) >>> 0 // Knuth multiplicative hash
  const randomOption = options[hash % options.length]
  return randomOption
}
