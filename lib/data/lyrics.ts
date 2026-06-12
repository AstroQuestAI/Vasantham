export interface LyricWord {
  word: string;
  start: number;
  end: number;
}

export interface LyricLine {
  id: number;
  text: string;
  start: number;
  end: number;
  words: LyricWord[];
}

export const sampleLyrics: Record<string, LyricLine[]> = {
  '1': [
    { id: 0, text: 'Venmathi Venmathiye', start: 5, end: 10, words: [{ word: 'Venmathi', start: 5, end: 7.5 }, { word: 'Venmathiye', start: 7.5, end: 10 }] },
    { id: 1, text: 'Malai mele nee yeri', start: 11, end: 16, words: [{ word: 'Malai', start: 11, end: 12 }, { word: 'mele', start: 12, end: 13 }, { word: 'nee', start: 13, end: 14 }, { word: 'yeri', start: 14, end: 16 }] },
    { id: 2, text: 'Oru naadum pogamale', start: 17, end: 22, words: [{ word: 'Oru', start: 17, end: 18 }, { word: 'naadum', start: 18, end: 19.5 }, { word: 'pogamale', start: 19.5, end: 22 }] },
    { id: 3, text: 'Enmanam thedumae', start: 23, end: 28, words: [{ word: 'Enmanam', start: 23, end: 25 }, { word: 'thedumae', start: 25, end: 28 }] },
    { id: 4, text: 'Kaadhal enbadhu', start: 30, end: 34, words: [{ word: 'Kaadhal', start: 30, end: 32 }, { word: 'enbadhu', start: 32, end: 34 }] },
    { id: 5, text: 'Oru swapnam', start: 35, end: 39, words: [{ word: 'Oru', start: 35, end: 36 }, { word: 'swapnam', start: 36, end: 39 }] },
    { id: 6, text: 'Mugamum unakku theriyaadha', start: 40, end: 46, words: [{ word: 'Mugamum', start: 40, end: 41.5 }, { word: 'unakku', start: 41.5, end: 43 }, { word: 'theriyaadha', start: 43, end: 46 }] },
    { id: 7, text: 'Manasai pidichidum', start: 47, end: 52, words: [{ word: 'Manasai', start: 47, end: 49 }, { word: 'pidichidum', start: 49, end: 52 }] },
  ],
  '7': [
    { id: 0, text: 'Tum hi ho', start: 8, end: 12, words: [{ word: 'Tum', start: 8, end: 9 }, { word: 'hi', start: 9, end: 10 }, { word: 'ho', start: 10, end: 12 }] },
    { id: 1, text: 'Aashiqui tumse hi', start: 13, end: 18, words: [{ word: 'Aashiqui', start: 13, end: 15 }, { word: 'tumse', start: 15, end: 16.5 }, { word: 'hi', start: 16.5, end: 18 }] },
    { id: 2, text: 'Tum hi ho', start: 19, end: 23, words: [{ word: 'Tum', start: 19, end: 20 }, { word: 'hi', start: 20, end: 21 }, { word: 'ho', start: 21, end: 23 }] },
    { id: 3, text: 'Ab mera hai kya kasoor', start: 24, end: 30, words: [{ word: 'Ab', start: 24, end: 25 }, { word: 'mera', start: 25, end: 26 }, { word: 'hai', start: 26, end: 27 }, { word: 'kya', start: 27, end: 28 }, { word: 'kasoor', start: 28, end: 30 }] },
    { id: 4, text: 'Main tanha hoon', start: 31, end: 36, words: [{ word: 'Main', start: 31, end: 32 }, { word: 'tanha', start: 32, end: 34 }, { word: 'hoon', start: 34, end: 36 }] },
    { id: 5, text: 'Teri aankhon ke darmiyan', start: 37, end: 43, words: [{ word: 'Teri', start: 37, end: 38 }, { word: 'aankhon', start: 38, end: 40 }, { word: 'ke', start: 40, end: 41 }, { word: 'darmiyan', start: 41, end: 43 }] },
  ],
  '3': [
    { id: 0, text: 'Kannaana Kanney', start: 6, end: 11, words: [{ word: 'Kannaana', start: 6, end: 8.5 }, { word: 'Kanney', start: 8.5, end: 11 }] },
    { id: 1, text: 'Nee thookam kolveno', start: 12, end: 17, words: [{ word: 'Nee', start: 12, end: 13 }, { word: 'thookam', start: 13, end: 15 }, { word: 'kolveno', start: 15, end: 17 }] },
    { id: 2, text: 'Ennoda unavo maarvil', start: 18, end: 23, words: [{ word: 'Ennoda', start: 18, end: 19.5 }, { word: 'unavo', start: 19.5, end: 21 }, { word: 'maarvil', start: 21, end: 23 }] },
    { id: 3, text: 'Thookkam kolveno', start: 24, end: 29, words: [{ word: 'Thookkam', start: 24, end: 26.5 }, { word: 'kolveno', start: 26.5, end: 29 }] },
    { id: 4, text: 'Poigayil nindra', start: 30, end: 34, words: [{ word: 'Poigayil', start: 30, end: 32 }, { word: 'nindra', start: 32, end: 34 }] },
    { id: 5, text: 'Poo marindha ven nilave', start: 35, end: 41, words: [{ word: 'Poo', start: 35, end: 36 }, { word: 'marindha', start: 36, end: 38 }, { word: 'ven', start: 38, end: 39 }, { word: 'nilave', start: 39, end: 41 }] },
  ],
};
