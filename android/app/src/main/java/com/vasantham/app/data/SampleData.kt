package com.vasantham.app.data

import com.vasantham.app.data.model.Raga
import com.vasantham.app.data.model.Track

private val covers = listOf(
    "https://picsum.photos/seed/music1/400/400",
    "https://picsum.photos/seed/music2/400/400",
    "https://picsum.photos/seed/music3/400/400",
    "https://picsum.photos/seed/music4/400/400",
    "https://picsum.photos/seed/music5/400/400",
    "https://picsum.photos/seed/music6/400/400",
    "https://picsum.photos/seed/music7/400/400",
    "https://picsum.photos/seed/music8/400/400",
    "https://picsum.photos/seed/music9/400/400",
    "https://picsum.photos/seed/music10/400/400",
    "https://picsum.photos/seed/music11/400/400",
    "https://picsum.photos/seed/music12/400/400",
)

// Royalty-free stereo MP3 samples (SoundHelix CC-licensed) used for POC playback demo.
// Replace with real licensed tracks before production release.
private val audios = (1..17).map {
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-$it.mp3"
}
private fun audio(i: Int) = audios[(i - 1) % audios.size]

val sampleTracks = listOf(
    Track("1",  "Venmathi Venmathiye",       "S.P. Balasubrahmanyam",    "Minnale",                  298_000L, "Tamil Film",           "Tamil",    2001, mood = "Romantic",    coverUrl = covers[0],  audioUrl = audio(1),  plays = 2_400_000, isTrending = true, isFeatured = true),
    Track("2",  "Uyire Uyire",               "A.R. Rahman",              "Bombay",                   312_000L, "Tamil Film",           "Tamil",    1995, mood = "Romantic",    coverUrl = covers[1],  audioUrl = audio(2),  plays = 3_800_000, isFeatured = true),
    Track("3",  "Kannaana Kanney",           "D. Imman",                 "Viswasam",                 276_000L, "Tamil Film",           "Tamil",    2019, mood = "Devotional",  coverUrl = covers[2],  audioUrl = audio(3),  plays = 5_200_000, isTrending = true),
    Track("4",  "Rowdy Baby",               "Dhanush & Dhee",           "Maari 2",                  234_000L, "Tamil Film",           "Tamil",    2018, mood = "Energetic",   coverUrl = covers[3],  audioUrl = audio(4),  plays = 9_800_000, isTrending = true),
    Track("5",  "Nenjukkul Peidhidum",       "Haricharan",               "Vaaranam Aayiram",         321_000L, "Tamil Film",           "Tamil",    2008, mood = "Romantic",    coverUrl = covers[4],  audioUrl = audio(5),  plays = 4_100_000),
    Track("6",  "Konjam Nilavu",             "K.J. Yesudas",             "Ninaithale Inikkum",       387_000L, "Tamil Film",           "Tamil",    1979, mood = "Nostalgic",   coverUrl = covers[5],  audioUrl = audio(6),  plays = 1_800_000),
    Track("7",  "Tum Hi Ho",                "Arijit Singh",             "Aashiqui 2",               261_000L, "Hindi Film",           "Hindi",    2013, mood = "Romantic",    coverUrl = covers[6],  audioUrl = audio(7),  plays = 12_000_000, isTrending = true),
    Track("8",  "Ek Pyaar Ka Nagma Hai",    "Lata Mangeshkar",          "Shor",                     298_000L, "Hindi Film",           "Hindi",    1972, mood = "Nostalgic",   coverUrl = covers[7],  audioUrl = audio(8),  plays = 2_200_000),
    Track("9",  "Rang De Basanti",           "A.R. Rahman",              "Rang De Basanti",          276_000L, "Hindi Film",           "Hindi",    2006, mood = "Energetic",   coverUrl = covers[8],  audioUrl = audio(9),  plays = 6_700_000),
    Track("10", "Kesariya",                  "Arijit Singh",             "Brahmastra",               246_000L, "Hindi Film",           "Hindi",    2022, mood = "Romantic",    coverUrl = covers[9],  audioUrl = audio(10), plays = 18_000_000, isTrending = true, isFeatured = true),
    Track("11", "Vatapi Ganapatim Bhaje",    "M.S. Subbulakshmi",        "Classical Gems",           456_000L, "Carnatic Classical",   "Sanskrit", 1968, raga = "hamsadhwani",    mood = "Devotional",  coverUrl = covers[10], audioUrl = audio(11), plays = 890_000),
    Track("12", "Bhaja Govindam",            "M.S. Subbulakshmi",        "Bhaja Govindam",         1_823_000L, "Carnatic Classical",   "Sanskrit", 1947, raga = "shankarabharanam", mood = "Devotional", coverUrl = covers[11], audioUrl = audio(12), plays = 3_400_000, isFeatured = true),
    Track("13", "Nagumomu",                  "M. Balamuralikrishna",     "Tyagaraja Kritis",         387_000L, "Carnatic Classical",   "Telugu",   1975, raga = "abheri",         mood = "Peaceful",    coverUrl = covers[0],  audioUrl = audio(13), plays = 560_000),
    Track("14", "Shanmukhapriya Varnam",     "Sanjay Subrahmanyan",      "Varnam Series",            892_000L, "Carnatic Classical",   "Tamil",    2002, raga = "shankarabharanam", mood = "Peaceful",  coverUrl = covers[1],  audioUrl = audio(14), plays = 230_000),
    Track("15", "Raag Yaman Vilambit",       "Pandit Bhimsen Joshi",     "Evening Ragas",          2_134_000L, "Hindustani Classical", "Hindi",    1988, raga = "yaman",          mood = "Peaceful",    coverUrl = covers[2],  audioUrl = audio(15), plays = 678_000),
    Track("16", "Bhairavi Thumri",           "Kishori Amonkar",          "Thumri Collection",      1_456_000L, "Hindustani Classical", "Hindi",    1979, raga = "bhairavi",       mood = "Melancholic", coverUrl = covers[3],  audioUrl = audio(16), plays = 345_000),
    Track("17", "Hare Krishna Hare Rama",    "ISKCON",                   "Maha Mantra",              567_000L, "Devotional",           "Sanskrit", 1975, mood = "Devotional",   coverUrl = covers[4],  audioUrl = audio(17), plays = 4_500_000),
    Track("18", "Aum Namah Shivaya",         "Uma Mohan",                "Shiva Mantras",            892_000L, "Devotional",           "Sanskrit", 2005, mood = "Meditative",   coverUrl = covers[5],  audioUrl = audio(1),  plays = 2_300_000),
    Track("19", "Hanuman Chalisa",           "Gulshan Kumar",            "Hanuman Chalisa",          498_000L, "Devotional",           "Hindi",    1992, mood = "Devotional",   coverUrl = covers[6],  audioUrl = audio(2),  plays = 28_000_000, isTrending = true),
    Track("20", "Samajavaragamana",          "Sid Sriram",               "Ala Vaikunthapurramuloo", 248_000L, "Telugu Film",          "Telugu",   2020, mood = "Romantic",    coverUrl = covers[7],  audioUrl = audio(3),  plays = 8_900_000, isTrending = true),
    Track("21", "Manase Manase",             "S.P. Balasubrahmanyam",    "Gharana Mogudu",           312_000L, "Telugu Film",          "Telugu",   1992, mood = "Romantic",    coverUrl = covers[8],  audioUrl = audio(4),  plays = 2_100_000),
    Track("22", "Entammede Jimikki Kammal",  "Vineeth Sreenivasan",      "Velipadinte Pusthakam",    234_000L, "Malayalam Film",       "Malayalam",2017, mood = "Festive",     coverUrl = covers[9],  audioUrl = audio(5),  plays = 7_800_000, isTrending = true),
    Track("23", "Thumbi Vaa",               "K.J. Yesudas",             "Manichitrathazhu",         278_000L, "Malayalam Film",       "Malayalam",1993, mood = "Festive",     coverUrl = covers[10], audioUrl = audio(6),  plays = 3_400_000),
    Track("24", "Bombe Helutaite",           "Sonu Nigam & Shreya Ghoshal","Mungaru Male",           289_000L, "Kannada Film",         "Kannada",  2006, mood = "Romantic",    coverUrl = covers[11], audioUrl = audio(7),  plays = 4_500_000),
    Track("25", "Munbe Vaa",                "A.R. Rahman",              "Sillunu Oru Kaadhal",      287_000L, "Tamil Film",           "Tamil",    2006, mood = "Romantic",    coverUrl = covers[0],  audioUrl = audio(8),  plays = 4_700_000, isFeatured = true),
    Track("26", "Raja Raja Cholan Naan",     "Ilaiyaraaja",              "Ponniyin Selvan",          298_000L, "Tamil Film",           "Tamil",    2022, mood = "Festive",     coverUrl = covers[1],  audioUrl = audio(9),  plays = 7_800_000, isTrending = true),
    Track("27", "Channa Mereya",             "Arijit Singh",             "Ae Dil Hai Mushkil",       267_000L, "Hindi Film",           "Hindi",    2016, mood = "Melancholic",  coverUrl = covers[2],  audioUrl = audio(10), plays = 15_000_000, isTrending = true),
    Track("28", "Kal Ho Naa Ho",             "Sonu Nigam",               "Kal Ho Naa Ho",            298_000L, "Hindi Film",           "Hindi",    2003, mood = "Melancholic",  coverUrl = covers[3],  audioUrl = audio(11), plays = 11_000_000, isFeatured = true),
    Track("29", "Raag Yaman Flute",          "Hariprasad Chaurasia",     "Flute at Midnight",      2_134_000L, "Hindustani Classical", "Hindi",    1992, raga = "yaman",          mood = "Peaceful",    coverUrl = covers[4],  audioUrl = audio(12), plays = 567_000),
    Track("30", "Veena Raga Bhairavi",       "E. Gayathri",              "Veena Melodies",         1_456_000L, "Carnatic Classical",   "Tamil",    2008, raga = "bhairavi",       mood = "Meditative",  coverUrl = covers[5],  audioUrl = audio(13), plays = 178_000),
    Track("31", "Kabira",                    "Rekha Bhardwaj",           "Yeh Jawaani Hai Deewani",  298_000L, "Folk",                 "Hindi",    2013, mood = "Nostalgic",    coverUrl = covers[6],  audioUrl = audio(14), plays = 8_900_000),
    Track("32", "Rowdy Baby Remix",          "DJ Vasantham",             "Remix Vol.1",              198_000L, "Tamil Film",           "Tamil",    2023, mood = "Energetic",    coverUrl = covers[7],  audioUrl = audio(15), plays = 2_100_000, isTrending = true),
    Track("33", "Oh Manapenne",              "Vivek-Mervin",             "Hiphop Tamizha",           234_000L, "Tamil Film",           "Tamil",    2021, mood = "Joyful",       coverUrl = covers[8],  audioUrl = audio(16), plays = 5_100_000, isTrending = true),
    Track("34", "Pattu Kuyile",              "Ilaiyaraaja",              "Moondram Pirai",           312_000L, "Tamil Film",           "Tamil",    1982, mood = "Melancholic",  coverUrl = covers[9],  audioUrl = audio(17), plays = 1_600_000),
    Track("35", "Kadhal Sadugudu",           "A.R. Rahman",              "Alaipayuthey",             267_000L, "Tamil Film",           "Tamil",    2000, mood = "Energetic",    coverUrl = covers[10], audioUrl = audio(1),  plays = 3_200_000),
)

val ragas = listOf(
    Raga("yaman", "Yaman", carnaticName = "Kalyani", hindustaniName = "Yaman", arohana = "S R G M(#) P D N S", avarohana = "S N D P M(#) G R S", mood = "Romantic, Peaceful", timeOfDay = "Evening", season = "Spring", semitones = listOf(0, 2, 4, 6, 7, 9, 11), description = "The evening raga of love and devotion, evoking a serene and romantic mood."),
    Raga("bhairavi", "Bhairavi", carnaticName = "Todi", hindustaniName = "Bhairavi", arohana = "S R(b) G(b) M P D(b) N(b) S", avarohana = "S N(b) D(b) P M G(b) R(b) S", mood = "Melancholic, Devotional", timeOfDay = "Morning", season = "All seasons", semitones = listOf(0, 1, 3, 5, 7, 8, 10), description = "A morning raga of deep emotion, often used in devotional and farewell compositions."),
    Raga("shankarabharanam", "Shankarabharanam", carnaticName = "Shankarabharanam", arohana = "S R G M P D N S", avarohana = "S N D P M G R S", mood = "Auspicious, Complete", timeOfDay = "All day", season = "All seasons", semitones = listOf(0, 2, 4, 5, 7, 9, 11), description = "The complete major scale in Indian classical music, considered the mother of all ragas."),
    Raga("hamsadhwani", "Hamsadhwani", carnaticName = "Hamsadhwani", arohana = "S R G P N S", avarohana = "S N P G R S", mood = "Auspicious, Joyful", timeOfDay = "Evening", season = "All seasons", semitones = listOf(0, 2, 4, 7, 11), description = "A pentatonic raga of auspiciousness and celebration, widely used in concerts and devotional music."),
    Raga("abheri", "Abheri", carnaticName = "Abheri", hindustaniName = "Bhimpalasi", arohana = "S G M D N S", avarohana = "S N D M G R S", mood = "Melancholic, Devotional", timeOfDay = "Afternoon", season = "All seasons", semitones = listOf(0, 3, 5, 9, 11), description = "A raga of deep devotional sentiment, associated with compositions on Lord Murugan and Ganesha."),
    Raga("bhoopali", "Bhoopali", carnaticName = "Mohanam", hindustaniName = "Bhoopali", arohana = "S R G P D S", avarohana = "S D P G R S", mood = "Joyful, Peaceful", timeOfDay = "Evening", season = "Spring", semitones = listOf(0, 2, 4, 7, 9), description = "A pentatonic raga of joy and serenity, perfect for festive occasions."),
    Raga("kalyani", "Kalyani", carnaticName = "Kalyani", hindustaniName = "Yaman", arohana = "S R G M(#) P D N S", avarohana = "S N D P M(#) G R S", mood = "Serene, Romantic, Auspicious", timeOfDay = "Evening", season = "Spring", semitones = listOf(0, 2, 4, 6, 7, 9, 11), description = "The queen of all ragas in Carnatic music — a complete, seven-note raga of immense beauty."),
)

fun getRagaForTrack(track: Track): Raga? {
    val key = track.raga?.lowercase()?.trim() ?: return null
    return ragas.firstOrNull { r ->
        r.id == key ||
            r.name.lowercase() == key ||
            r.carnaticName?.lowercase() == key ||
            r.hindustaniName?.lowercase() == key
    }
}

fun formatDuration(ms: Long): String {
    val totalSec = ms / 1000
    val min = totalSec / 60
    val sec = totalSec % 60
    return "%d:%02d".format(min, sec)
}

fun formatPlays(plays: Long): String = when {
    plays >= 1_000_000 -> "%.1fM".format(plays / 1_000_000.0)
    plays >= 1_000 -> "${plays / 1_000}K"
    else -> plays.toString()
}
