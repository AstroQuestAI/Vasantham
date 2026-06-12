package com.vasantham.app.data.model

data class Track(
    val id: String,
    val title: String,
    val artist: String,
    val album: String? = null,
    val duration: Long,           // milliseconds
    val genre: String,
    val language: String,
    val year: Int,
    val raga: String? = null,
    val mood: String? = null,
    val coverUrl: String,
    val audioUrl: String? = null,
    val videoUrl: String? = null,
    val plays: Long = 0,
    val isFeatured: Boolean = false,
    val isTrending: Boolean = false,
)
