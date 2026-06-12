package com.vasantham.app.data.repository

import android.util.Log
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

private const val TAG = "JioSaavn"

@Singleton
class JioSaavnRepository @Inject constructor() {

    private val cache = ConcurrentHashMap<String, String>()
    private val gson = Gson()

    // Returns a direct streamable URL for the track.
    // Tries saavn.dev first; falls back to track.audioUrl.
    suspend fun resolveUrl(track: Track): String = withContext(Dispatchers.IO) {
        val fallback = track.audioUrl ?: ""
        val cacheKey = "${track.title}|${track.artist}"
        cache[cacheKey]?.let {
            Log.d(TAG, "CACHE HIT [${track.title}] => $it")
            return@withContext it
        }

        val query = URLEncoder.encode("${track.title} ${track.album}", "UTF-8")
        Log.d(TAG, "Searching: ${track.title} | ${track.album} | query=$query")
        return@withContext try {
            val conn = URL("https://saavn.sumit.co/api/search/songs?query=$query&limit=5")
                .openConnection() as HttpURLConnection
            conn.connectTimeout = 10_000
            conn.readTimeout = 10_000
            conn.setRequestProperty("User-Agent", "VasanthamApp/1.0")
            conn.setRequestProperty("Accept", "application/json")

            val code = conn.responseCode
            Log.d(TAG, "HTTP $code for query=$query")
            if (code != 200) {
                conn.disconnect()
                Log.w(TAG, "Non-200, falling back to: $fallback")
                return@withContext fallback
            }

            val body = conn.inputStream.bufferedReader().readText()
            conn.disconnect()
            Log.d(TAG, "Response length: ${body.length}")

            val root = gson.fromJson(body, JsonObject::class.java)
            val results = root.getAsJsonObject("data")
                ?.getAsJsonArray("results")
                ?.takeIf { it.size() > 0 }
                ?: run {
                    Log.w(TAG, "No results, falling back")
                    return@withContext fallback
                }

            // Log all candidates
            (0 until results.size()).forEach { i ->
                val r = results[i].asJsonObject
                Log.d(TAG, "  Candidate[$i]: ${r.get("name")?.asString} | ${r.getAsJsonObject("album")?.get("name")?.asString}")
            }

            val titleWords = track.title.lowercase().split(" ").filter { it.length > 2 }
            val bestMatch = (0 until results.size()).map { results[it].asJsonObject }
                .firstOrNull { result ->
                    val resultName = result.get("name")?.asString?.lowercase() ?: ""
                    titleWords.any { word -> resultName.contains(word) }
                } ?: run {
                    Log.w(TAG, "No title match found for '${track.title}', falling back")
                    return@withContext fallback
                }

            Log.d(TAG, "Best match: ${bestMatch.get("name")?.asString}")

            val url = bestMatch
                .getAsJsonArray("downloadUrl")
                ?.lastOrNull()
                ?.asJsonObject
                ?.get("url")?.asString
                ?: run {
                    Log.w(TAG, "No downloadUrl, falling back")
                    return@withContext fallback
                }

            Log.d(TAG, "RESOLVED [${track.title}] => $url")
            cache[cacheKey] = url
            url
        } catch (e: Exception) {
            Log.e(TAG, "Exception resolving ${track.title}: ${e.message}")
            fallback
        }
    }
}
