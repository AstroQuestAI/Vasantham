package com.vasantham.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.vasantham.app.data.model.Track
import com.vasantham.app.data.sampleTracks
import com.vasantham.app.ui.components.TrackItem
import com.vasantham.app.ui.theme.*
import com.vasantham.app.viewmodel.PlayerState

@Composable
fun LibraryScreen(
    playerState: PlayerState,
    onPlay: (Track, List<Track>) -> Unit,
    onAddToQueue: (Track) -> Unit,
    modifier: Modifier = Modifier,
) {
    var query by remember { mutableStateOf("") }
    var selectedGenre by remember { mutableStateOf<String?>(null) }
    var selectedLanguage by remember { mutableStateOf<String?>(null) }

    val genres = remember { sampleTracks.map { it.genre.split(" ").last() }.distinct().sorted() }
    val languages = remember { sampleTracks.map { it.language }.distinct().sorted() }

    val filtered = remember(query, selectedGenre, selectedLanguage) {
        sampleTracks.filter { track ->
            val matchesQuery = query.isBlank() ||
                track.title.contains(query, ignoreCase = true) ||
                track.artist.contains(query, ignoreCase = true) ||
                track.album.contains(query, ignoreCase = true)
            val matchesGenre = selectedGenre == null || track.genre.contains(selectedGenre!!, ignoreCase = true)
            val matchesLang = selectedLanguage == null || track.language == selectedLanguage
            matchesQuery && matchesGenre && matchesLang
        }
    }

    Column(modifier = modifier.fillMaxSize()) {
        // Search bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 14.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            OutlinedTextField(
                value = query,
                onValueChange = { query = it },
                modifier = Modifier.weight(1f),
                placeholder = { Text("Search tracks, artists…", color = TextMuted) },
                leadingIcon = { Icon(Icons.Default.Search, null, tint = TextMuted) },
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = VioletPrimary,
                    unfocusedBorderColor = BgSurface3,
                    focusedTextColor = TextPrimary,
                    unfocusedTextColor = TextPrimary,
                    cursorColor = VioletPrimary,
                    focusedContainerColor = BgSurface2,
                    unfocusedContainerColor = BgSurface2,
                ),
                shape = RoundedCornerShape(14.dp),
            )
        }

        // Genre chips
        Row(
            modifier = Modifier
                .horizontalScroll(rememberScrollState())
                .padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            FilterChip(
                selected = selectedGenre == null,
                onClick = { selectedGenre = null },
                label = { Text("All") },
            )
            genres.forEach { genre ->
                FilterChip(
                    selected = selectedGenre == genre,
                    onClick = { selectedGenre = if (selectedGenre == genre) null else genre },
                    label = { Text(genre) },
                )
            }
        }

        Spacer(Modifier.height(6.dp))

        // Language chips
        Row(
            modifier = Modifier
                .horizontalScroll(rememberScrollState())
                .padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            FilterChip(
                selected = selectedLanguage == null,
                onClick = { selectedLanguage = null },
                label = { Text("All Languages") },
            )
            languages.forEach { lang ->
                FilterChip(
                    selected = selectedLanguage == lang,
                    onClick = { selectedLanguage = if (selectedLanguage == lang) null else lang },
                    label = { Text(lang) },
                )
            }
        }

        Spacer(Modifier.height(8.dp))

        // Track count
        Text(
            text = "${filtered.size} tracks",
            color = TextMuted,
            fontSize = 12.sp,
            modifier = Modifier.padding(horizontal = 20.dp, vertical = 4.dp),
        )

        LazyColumn(contentPadding = PaddingValues(bottom = 16.dp)) {
            items(filtered, key = { it.id }) { track ->
                TrackItem(
                    track = track,
                    isPlaying = playerState.currentTrack?.id == track.id && playerState.isPlaying,
                    onClick = { onPlay(track, filtered) },
                    onAddToQueue = { onAddToQueue(track) },
                )
                HorizontalDivider(
                    modifier = Modifier.padding(horizontal = 16.dp),
                    color = BgSurface3.copy(alpha = 0.5f),
                    thickness = 0.5.dp,
                )
            }
        }
    }
}
