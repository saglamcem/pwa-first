// {
//   "error": false,
//   "category": "Dark",
//   "type": "twopart",
//   "setup": "What do an orgasm and a pulse have in common?",
//   "delivery": "I don't care if she has one.",
//   "flags": {
//   "nsfw": true,
//     "religious": false,
//     "political": false,
//     "racist": false,
//     "sexist": false,
//     "explicit": true
// },
//   "id": 101,
//   "safe": false,
//   "lang": "en"
// }

interface CoreJoke {
  error: boolean;
  category: string;
  type: string;
  flags: {[flag: string]: boolean};
  id: string;
  safe: boolean;
  lang: string;
}

export type Joke =
  | CoreJoke & { type: 'twopart', setup: string, delivery: string }
  | CoreJoke & { type: 'single', joke: string }
