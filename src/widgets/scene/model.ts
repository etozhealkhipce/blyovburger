import { createStore, createEvent } from "effector";

export const $words = createStore([
  "БУРГЕР",
  "БУРГЕР",
  "БУРГЕР",
  "БУРГЕР",
  "БУРГЕР",
  "БУРГЕР",
  "БУРГЕР",
  "БУРГЕР",
  "БУРГЕР",
  "БУРГЕР",
  "БУРГЕР",
]);

export const removeWord = createEvent<number>();
$words.on(removeWord, (state, index: number) =>
  state.filter((_, i) => i !== index),
);

export const $visibleWords = createStore<number[]>([]);
export const showNextWord = createEvent<void>();

$visibleWords.on(showNextWord, (state) => {
  const nextIndex = state.length;
  if (nextIndex < $words.getState().length) {
    return [...state, nextIndex];
  }
  return state;
});
