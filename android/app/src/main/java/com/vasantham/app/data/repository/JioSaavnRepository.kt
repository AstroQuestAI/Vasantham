package com.vasantham.app.data.repository

import com.google.gson.Gson
import com.google.gson.JsonObject
import com.vasantham.app.data.model.Track
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder
import java.util.concurrent.ConcurrentHashMap
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class JioSaavnRepository @Inject constructor() {

    private val cache = ConcurrentHashMap<String, String>()
    private val gson = Gson()

    // Returns a direct streamable URL for the track.
    // Tries saavn.dev first; falls back to track.audioUrl.
    suspend fun resolveUrl(track: Track): String = withContext(Dispatchers.IO) {
        val fallback = track.audioUrl ?: ""
        val cacheKey = "${track.title}|${track.artist}"
        cache[cacheKey]?.let { return@withContext it }

        // Include album in query for disambiguation; fetch top 5 so we can validate.
        val query = URLEncoder.encode("${track.title} ${track.album}", "UTF-8")
        return@withContext try {
            val conn = URL("https://saavn.dev/api/search/songs?query=$query&limit=5")
                .openConnection() as HttpURLConnection
            conn.connectTimeout = 10_000
            conn.readTimeout = 10_000
            conn.setRequestProperty("User-Agent", "VasanthamApp/1.0")
            conn.setRequestProperty("Accept", "application/json")

            if (conn.responseCode != 200) {
                conn.disconnect()
                return@withContext fallback
            }

            val root = gson.fromJson(
                conn.inputStream.bufferedReader().readText(),
                JsonObject::class.java
            )
            conn.disconnect()

            val results = root.getAsJsonObject("data")
                ?.getAsJsonArray("results")
                ?.takeIf { it.size() > 0 }
                ?: return@withContext fallback

            // Find the best matching result: song name must contain the track title
            // (case-insensitive) to avoid playing a completely wrong song.
            val titleWords = track.title.lowercase().split(" ").filter { it.length > 2 }
            val bestMatch = (0 until results.size()).map { results[it].asJsonObject }
                .firstOrNull { result ->
                    val resultName = result.get("name")?.asString?.lowercase() ?: ""
                    titleWords.any { word -> resultName.contains(word) }
                } ?: return@withContext fallback

            // Pick 320 kbps (last entry in downloadUrl array)
            val url = bestMatch
                .getAsJsonArray("downloadUrl")
                ?.lastOrNull()
                ?.asJsonObject
                ?.get("url")?.asString
                ?: return@withContext fallback

            cache[cacheKey] = url
            url
        } catch (e: Exception) {
            fallback
        }
    }
}
