import type { Track } from '@/lib/types';

const covers = [
  'https://picsum.photos/seed/music1/400/400',
  'https://picsum.photos/seed/music2/400/400',
  'https://picsum.photos/seed/music3/400/400',
  'https://picsum.photos/seed/music4/400/400',
  'https://picsum.photos/seed/music5/400/400',
  'https://picsum.photos/seed/music6/400/400',
  'https://picsum.photos/seed/music7/400/400',
  'https://picsum.photos/seed/music8/400/400',
  'https://picsum.photos/seed/music9/400/400',
  'https://picsum.photos/seed/music10/400/400',
  'https://picsum.photos/seed/music11/400/400',
  'https://picsum.photos/seed/music12/400/400',
];

export const sampleTracks: Track[] = [
  // Tamil Film
  {
    id: '1', title: 'Venmathi Venmathiye', artist: 'S.P. Balasubrahmanyam', album: 'Minnale',
    duration: 298, genre: 'Tamil Film', language: 'Tamil', year: 2001, mood: 'Romantic',
    coverUrl: covers[0], type: 'audio', plays: 2400000, trending: true, featured: true,
  },
  {
    id: '2', title: 'Uyire Uyire', artist: 'A.R. Rahman', album: 'Bombay',
    duration: 312, genre: 'Tamil Film', language: 'Tamil', year: 1995, mood: 'Romantic',
    coverUrl: covers[1], type: 'audio', plays: 3800000, featured: true,
  },
  {
    id: '3', title: 'Kannaana Kanney', artist: 'D. Imman', album: 'Viswasam',
    duration: 276, genre: 'Tamil Film', language: 'Tamil', year: 2019, mood: 'Devotional',
    coverUrl: covers[2], type: 'audio', plays: 5200000, trending: true,
  },
  {
    id: '4', title: 'Rowdy Baby', artist: 'Dhanush & Dhee', album: 'Maari 2',
    duration: 234, genre: 'Tamil Film', language: 'Tamil', year: 2018, mood: 'Energetic',
    coverUrl: covers[3], type: 'audio', plays: 9800000, trending: true,
  },
  {
    id: '5', title: 'Nenjukkul Peidhidum', artist: 'Haricharan', album: 'Vaaranam Aayiram',
    duration: 321, genre: 'Tamil Film', language: 'Tamil', year: 2008, mood: 'Romantic',
    coverUrl: covers[4], type: 'audio', plays: 4100000,
  },
  {
    id: '6', title: 'Konjam Nilavu', artist: 'K.J. Yesudas', album: 'Ninaithale Inikkum',
    duration: 387, genre: 'Tamil Film', language: 'Tamil', year: 1979, mood: 'Nostalgic',
    coverUrl: covers[5], type: 'audio', plays: 1800000,
  },
  // Hindi Film
  {
    id: '7', title: 'Tum Hi Ho', artist: 'Arijit Singh', album: 'Aashiqui 2',
    duration: 261, genre: 'Hindi Film', language: 'Hindi', year: 2013, mood: 'Romantic',
    coverUrl: covers[6], type: 'audio', plays: 12000000, trending: true,
  },
  {
    id: '8', title: 'Ek Pyaar Ka Nagma Hai', artist: 'Lata Mangeshkar', album: 'Shor',
    duration: 298, genre: 'Hindi Film', language: 'Hindi', year: 1972, mood: 'Nostalgic',
    coverUrl: covers[7], type: 'audio', plays: 2200000,
  },
  {
    id: '9', title: 'Rang De Basanti', artist: 'A.R. Rahman', album: 'Rang De Basanti',
    duration: 276, genre: 'Hindi Film', language: 'Hindi', year: 2006, mood: 'Energetic',
    coverUrl: covers[8], type: 'audio', plays: 6700000,
  },
  {
    id: '10', title: 'Kesariya', artist: 'Arijit Singh', album: 'Brahmastra',
    duration: 246, genre: 'Hindi Film', language: 'Hindi', year: 2022, mood: 'Romantic',
    coverUrl: covers[9], type: 'audio', plays: 18000000, trending: true, featured: true,
  },
  // Carnatic Classical
  {
    id: '11', title: 'Vatapi Ganapatim Bhaje', artist: 'M.S. Subbulakshmi', album: 'Classical Gems',
    duration: 456, genre: 'Carnatic Classical', language: 'Sanskrit', year: 1968, raga: 'hamsadhwani',
    mood: 'Devotional', coverUrl: covers[10], type: 'audio', plays: 890000,
  },
  {
    id: '12', title: 'Bhaja Govindam', artist: 'M.S. Subbulakshmi', album: 'Bhaja Govindam',
    duration: 1823, genre: 'Carnatic Classical', language: 'Sanskrit', year: 1947, raga: 'shankarabharanam',
    mood: 'Devotional', coverUrl: covers[11], type: 'audio', plays: 3400000, featured: true,
  },
  {
    id: '13', title: 'Nagumomu', artist: 'M. Balamuralikrishna', album: 'Tyagaraja Kritis',
    duration: 387, genre: 'Carnatic Classical', language: 'Telugu', year: 1975, raga: 'abheri',
    mood: 'Peaceful', coverUrl: covers[0], type: 'audio', plays: 560000,
  },
  {
    id: '14', title: 'Shanmukhapriya Varnam', artist: 'Sanjay Subrahmanyan', album: 'Varnam Series',
    duration: 892, genre: 'Carnatic Classical', language: 'Tamil', year: 2002, raga: 'shankarabharanam',
    mood: 'Peaceful', coverUrl: covers[1], type: 'audio', plays: 230000,
  },
  // Hindustani Classical
  {
    id: '15', title: 'Raag Yaman Vilambit', artist: 'Pandit Bhimsen Joshi', album: 'Evening Ragas',
    duration: 2134, genre: 'Hindustani Classical', language: 'Hindi', year: 1988, raga: 'yaman',
    mood: 'Peaceful', coverUrl: covers[2], type: 'audio', plays: 678000,
  },
  {
    id: '16', title: 'Bhairavi Thumri', artist: 'Kishori Amonkar', album: 'Thumri Collection',
    duration: 1456, genre: 'Hindustani Classical', language: 'Hindi', year: 1979, raga: 'bhairavi',
    mood: 'Melancholic', coverUrl: covers[3], type: 'audio', plays: 345000,
  },
  // Devotional
  {
    id: '17', title: 'Hare Krishna Hare Rama', artist: 'ISKCON', album: 'Maha Mantra',
    duration: 567, genre: 'Devotional', language: 'Sanskrit', year: 1975, mood: 'Devotional',
    coverUrl: covers[4], type: 'audio', plays: 4500000,
  },
  {
    id: '18', title: 'Aum Namah Shivaya', artist: 'Uma Mohan', album: 'Shiva Mantras',
    duration: 892, genre: 'Devotional', language: 'Sanskrit', year: 2005, mood: 'Meditative',
    coverUrl: covers[5], type: 'audio', plays: 2300000,
  },
  {
    id: '19', title: 'Thiruppugazh - Murugan', artist: 'T.L. Maharajan', album: 'Thiruppugazh',
    duration: 423, genre: 'Devotional', language: 'Tamil', year: 1985, mood: 'Devotional',
    coverUrl: covers[6], type: 'audio', plays: 1200000,
  },
  {
    id: '20', title: 'Hanuman Chalisa', artist: 'Gulshan Kumar', album: 'Hanuman Chalisa',
    duration: 498, genre: 'Devotional', language: 'Hindi', year: 1992, mood: 'Devotional',
    coverUrl: covers[7], type: 'audio', plays: 28000000, trending: true,
  },
  // Telugu Film
  {
    id: '21', title: 'Manase Manase', artist: 'S.P. Balasubrahmanyam', album: 'Gharana Mogudu',
    duration: 312, genre: 'Telugu Film', language: 'Telugu', year: 1992, mood: 'Romantic',
    coverUrl: covers[8], type: 'audio', plays: 2100000,
  },
  {
    id: '22', title: 'Samajavaragamana', artist: 'Sid Sriram', album: 'Ala Vaikunthapurramuloo',
    duration: 248, genre: 'Telugu Film', language: 'Telugu', year: 2020, mood: 'Romantic',
    coverUrl: covers[9], type: 'audio', plays: 8900000, trending: true,
  },
  // Folk
  {
    id: '23', title: 'Kaaval Kottam', artist: 'Sivamani', album: 'Folk Fusion',
    duration: 287, genre: 'Folk', language: 'Tamil', year: 2015, mood: 'Festive',
    coverUrl: covers[10], type: 'audio', plays: 1500000,
  },
  {
    id: '24', title: 'Cholangattam', artist: 'Tribal Orchestra', album: 'Kerala Folk',
    duration: 345, genre: 'Folk', language: 'Malayalam', year: 2018, mood: 'Festive',
    coverUrl: covers[11], type: 'audio', plays: 980000,
  },
  // Fusion/Instrumental
  {
    id: '25', title: 'Kadri Gopalnath Saxophone', artist: 'Kadri Gopalnath', album: 'Saxophone Meets Carnatic',
    duration: 523, genre: 'Fusion', language: 'Tamil', year: 1999, raga: 'shankarabharanam',
    mood: 'Peaceful', coverUrl: covers[0], type: 'audio', plays: 780000,
  },
  {
    id: '26', title: 'Shakti - Remember Shakti', artist: 'John McLaughlin & Zakir Hussain', album: 'Remember Shakti',
    duration: 1234, genre: 'Fusion', language: 'Hindi', year: 1999, mood: 'Energetic',
    coverUrl: covers[1], type: 'audio', plays: 1200000, featured: true,
  },
  // Malayalam
  {
    id: '27', title: 'Thumbi Vaa', artist: 'K.J. Yesudas', album: 'Manichitrathazhu',
    duration: 278, genre: 'Malayalam Film', language: 'Malayalam', year: 1993, mood: 'Festive',
    coverUrl: covers[2], type: 'audio', plays: 3400000,
  },
  {
    id: '28', title: 'Entammede Jimikki Kammal', artist: 'Vineeth Sreenivasan', album: 'Velipadinte Pusthakam',
    duration: 234, genre: 'Malayalam Film', language: 'Malayalam', year: 2017, mood: 'Festive',
    coverUrl: covers[3], type: 'audio', plays: 7800000, trending: true,
  },
  // More Tamil
  {
    id: '29', title: 'Unnai Kaanadhu Naan', artist: 'A.R. Rahman', album: 'Kadal',
    duration: 267, genre: 'Tamil Film', language: 'Tamil', year: 2013, mood: 'Romantic',
    coverUrl: covers[4], type: 'audio', plays: 2800000,
  },
  {
    id: '30', title: 'Maruvarthai Pesade', artist: 'D. Imman', album: 'Enai Noki Paayum Thota',
    duration: 289, genre: 'Tamil Film', language: 'Tamil', year: 2019, mood: 'Melancholic',
    coverUrl: covers[5], type: 'audio', plays: 3600000,
  },
  {
    id: '31', title: 'Inaindha Kaigal', artist: 'Harris Jayaraj', album: 'Anniyan',
    duration: 334, genre: 'Tamil Film', language: 'Tamil', year: 2005, mood: 'Romantic',
    coverUrl: covers[6], type: 'audio', plays: 2100000,
  },
  {
    id: '32', title: 'Hey Nee Romba Azhaga Irukke', artist: 'Yuvan Shankar Raja', album: 'Sivi',
    duration: 312, genre: 'Tamil Film', language: 'Tamil', year: 2005, mood: 'Joyful',
    coverUrl: covers[7], type: 'audio', plays: 1900000,
  },
  {
    id: '33', title: 'Munbe Vaa', artist: 'A.R. Rahman', album: 'Sillunu Oru Kaadhal',
    duration: 287, genre: 'Tamil Film', language: 'Tamil', year: 2006, mood: 'Romantic',
    coverUrl: covers[8], type: 'audio', plays: 4700000, featured: true,
  },
  {
    id: '34', title: 'Kadhal Sadugudu', artist: 'A.R. Rahman', album: 'Alaipayuthey',
    duration: 267, genre: 'Tamil Film', language: 'Tamil', year: 2000, mood: 'Energetic',
    coverUrl: covers[9], type: 'audio', plays: 3200000,
  },
  {
    id: '35', title: 'Mayakkam Enna', artist: 'A.R. Rahman', album: 'Alaipayuthey',
    duration: 445, genre: 'Tamil Film', language: 'Tamil', year: 2000, mood: 'Melancholic',
    coverUrl: covers[10], type: 'audio', plays: 2900000,
  },
  {
    id: '36', title: 'Oh Manapenne', artist: 'Vivek-Mervin', album: 'Hiphop Tamizha',
    duration: 234, genre: 'Tamil Film', language: 'Tamil', year: 2021, mood: 'Joyful',
    coverUrl: covers[11], type: 'audio', plays: 5100000, trending: true,
  },
  {
    id: '37', title: 'Pattu Kuyile', artist: 'Ilaiyaraaja', album: 'Moondram Pirai',
    duration: 312, genre: 'Tamil Film', language: 'Tamil', year: 1982, mood: 'Melancholic',
    coverUrl: covers[0], type: 'audio', plays: 1600000,
  },
  {
    id: '38', title: 'Raja Raja Cholan Naan', artist: 'Ilaiyaraaja', album: 'Ponniyin Selvan',
    duration: 298, genre: 'Tamil Film', language: 'Tamil', year: 2022, mood: 'Festive',
    coverUrl: covers[1], type: 'audio', plays: 7800000, trending: true,
  },
  // More Hindi
  {
    id: '39', title: 'Ae Dil Hai Mushkil', artist: 'Arijit Singh', album: 'Ae Dil Hai Mushkil',
    duration: 279, genre: 'Hindi Film', language: 'Hindi', year: 2016, mood: 'Melancholic',
    coverUrl: covers[2], type: 'audio', plays: 9200000,
  },
  {
    id: '40', title: 'Kal Ho Naa Ho', artist: 'Sonu Nigam', album: 'Kal Ho Naa Ho',
    duration: 298, genre: 'Hindi Film', language: 'Hindi', year: 2003, mood: 'Melancholic',
    coverUrl: covers[3], type: 'audio', plays: 11000000, featured: true,
  },
  {
    id: '41', title: 'Channa Mereya', artist: 'Arijit Singh', album: 'Ae Dil Hai Mushkil',
    duration: 267, genre: 'Hindi Film', language: 'Hindi', year: 2016, mood: 'Melancholic',
    coverUrl: covers[4], type: 'audio', plays: 15000000, trending: true,
  },
  {
    id: '42', title: 'Baarishein', artist: 'Atif Aslam', album: 'Teri Galliyan',
    duration: 245, genre: 'Hindi Film', language: 'Hindi', year: 2014, mood: 'Romantic',
    coverUrl: covers[5], type: 'audio', plays: 7800000,
  },
  // More Carnatic
  {
    id: '43', title: 'Thyagaraja Pancharatna Krithi', artist: 'T.N. Seshagopalan', album: 'Pancharatna',
    duration: 1234, genre: 'Carnatic Classical', language: 'Telugu', year: 1995, raga: 'shankarabharanam',
    mood: 'Devotional', coverUrl: covers[6], type: 'audio', plays: 456000,
  },
  {
    id: '44', title: 'Mahaganapathim Manasa Smarami', artist: 'Chembai Vaidyanatha Bhagavathar', album: 'Classical Recordings',
    duration: 867, genre: 'Carnatic Classical', language: 'Sanskrit', year: 1958, raga: 'shankarabharanam',
    mood: 'Devotional', coverUrl: covers[7], type: 'audio', plays: 234000,
  },
  // Instrumental
  {
    id: '45', title: 'Raga Bhairava - Veena Solo', artist: 'E. Gayathri', album: 'Veena Melodies',
    duration: 1456, genre: 'Instrumental', language: 'Tamil', year: 2008, raga: 'bhairavi',
    mood: 'Meditative', coverUrl: covers[8], type: 'audio', plays: 178000,
  },
  {
    id: '46', title: 'Flute Raga Yaman', artist: 'Hariprasad Chaurasia', album: 'Flute at Midnight',
    duration: 2134, genre: 'Hindustani Classical', language: 'Hindi', year: 1992, raga: 'yaman',
    mood: 'Peaceful', coverUrl: covers[9], type: 'audio', plays: 567000,
  },
  // Kannada
  {
    id: '47', title: 'Bombe Helutaite', artist: 'Sonu Nigam & Shreya Ghoshal', album: 'Mungaru Male',
    duration: 289, genre: 'Kannada Film', language: 'Kannada', year: 2006, mood: 'Romantic',
    coverUrl: covers[10], type: 'audio', plays: 4500000,
  },
  {
    id: '48', title: 'Neene Beda Bidi Baruve', artist: 'Rajesh Krishnan', album: 'Duniya',
    duration: 312, genre: 'Kannada Film', language: 'Kannada', year: 2007, mood: 'Melancholic',
    coverUrl: covers[11], type: 'audio', plays: 2100000,
  },
  // More Folk
  {
    id: '49', title: 'Kabira', artist: 'Rekha Bhardwaj', album: 'Yeh Jawaani Hai Deewani',
    duration: 298, genre: 'Folk', language: 'Hindi', year: 2013, mood: 'Nostalgic',
    coverUrl: covers[0], type: 'audio', plays: 8900000,
  },
  {
    id: '50', title: 'Kesariya Balam', artist: 'Alka Yagnik', album: 'Rajasthani Folk',
    duration: 456, genre: 'Folk', language: 'Hindi', year: 2001, mood: 'Romantic',
    coverUrl: covers[1], type: 'audio', plays: 3200000,
  },
];

export const featuredTracks = sampleTracks.filter((t) => t.featured);
export const trendingTracks = sampleTracks.filter((t) => t.trending);

export const getTrackById = (id: string) => sampleTracks.find((t) => t.id === id);

export const getTracksByGenre = (genre: string) =>
  sampleTracks.filter((t) => t.genre === genre);

export const getTracksByMood = (mood: string) =>
  sampleTracks.filter((t) => t.mood === mood);

export const getTracksByRaga = (raga: string) =>
  sampleTracks.filter((t) => t.raga === raga);

export const searchTracks = (query: string) => {
  const q = query.toLowerCase();
  return sampleTracks.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q) ||
      t.album?.toLowerCase().includes(q) ||
      t.genre.toLowerCase().includes(q) ||
      t.language.toLowerCase().includes(q)
  );
};

export const genres = [...new Set(sampleTracks.map((t) => t.genre))];
export const moods = [...new Set(sampleTracks.map((t) => t.mood).filter(Boolean))];
export const languages = [...new Set(sampleTracks.map((t) => t.language))];
