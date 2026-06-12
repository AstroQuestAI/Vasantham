package com.vasantham.app.data.repository

import com.vasantham.app.data.model.Track
import com.vasantham.app.data.sampleTracks
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class MediaRepository @Inject constructor() {

    fun getAllTracks(): List<Track> = sampleTracks

    fun getFeaturedTracks(): List<Track> = sampleTracks.filter { it.isFeatured }

    fun getTrendingTracks(): List<Track> = sampleTracks.filter { it.isTrending }

    fun search(query: String): List<Track> {
        if (query.isBlank()) return sampleTracks
        val q = query.lowercase()
        return sampleTracks.filter { t ->
            t.title.lowercase().contains(q) ||
                t.artist.lowercase().contains(q) ||
                t.album?.lowercase()?.contains(q) == true ||
                t.genre.lowercase().contains(q) ||
                t.language.lowercase().contains(q) ||
                t.raga?.lowercase()?.contains(q) == true ||
                t.mood?.lowercase()?.contains(q) == true
        }
    }

    fun getByGenre(genre: String): List<Track> =
        sampleTracks.filter { it.genre.equals(genre, ignoreCase = true) }

    fun getByMood(mood: String): List<Track> =
        sampleTracks.filter { it.mood.equals(mood, ignoreCase = true) }

    fun getById(id: String): Track? = sampleTracks.firstOrNull { it.id == id }

    fun getGenres(): List<String> = sampleTracks.map { it.genre }.distinct().sorted()

    fun getLanguages(): List<String> = sampleTracks.map { it.language }.distinct().sorted()
}
