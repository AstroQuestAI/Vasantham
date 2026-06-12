package com.vasantham.app.data.model

data class Raga(
    val id: String,
    val name: String,
    val carnaticName: String? = null,
    val hindustaniName: String? = null,
    val arohana: String,
    val avarohana: String,
    val mood: String,
    val timeOfDay: String? = null,
    val season: String? = null,
    val semitones: List<Int>,
    val description: String,
)
