package com.vasantham.app.audio

enum class AudioMode(
    val label: String,
    val emoji: String,
    val affectsAudio: Boolean,
) {
    NORMAL("Normal", "🎵", false),
    KARAOKE("Karaoke", "🎤", true),
    INSTRUMENTAL("Music Only", "🎸", true),
    VOCAL("Voice Only", "🗣️", true),
    PIANO("Piano", "🎹", false),
    SWARA("Swaras", "🎼", false),
}
