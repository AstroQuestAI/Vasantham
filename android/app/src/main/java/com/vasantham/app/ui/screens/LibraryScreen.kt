package com.vasantham.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
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
                track.album?.contains(query, ignoreCase = true) == true
            val matchesGenre = selectedGenre == null || track.genre.contains(selectedGenre!!, ignoreCase = true)
            val matchesLang = selectedLanguage == null || track.language == selectedLanguage
            matchesQuery && matchesGenre && matchesLang
        }
    }

    Column(modifier = modifier.fillMaxSize()) {
        // Header
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    Brush.verticalGradient(
                        listOf(VioletDark.copy(alpha = 0.4f), Color.Transparent)
                    )
                )
                .padding(horizontal = 20.dp, vertical = 16.dp),
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                Box(
                    modifier = Modifier
                        .width(4.dp)
                        .height(22.dp)
                        .background(
                            Brush.verticalGradient(listOf(VioletLight, PinkLight)),
                            RoundedCornerShape(2.dp),
                        )
                )
                Text(
                    "Your Library",
                    fontWeight = FontWeight.Black,
                    fontSize = 22.sp,
                    style = TextStyle(
                        brush = Brush.linearGradient(listOf(VioletLight, PinkLight))
                    ),
                )
            }
        }

        // Search bar
        OutlinedTextField(
            value = query,
            onValueChange = { query = it },
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp),
            placeholder = { Text("Search tracks, artists…", color = TextMuted) },
            leadingIcon = {
                Icon(Icons.Default.Search, null, tint = VioletLight)
            },
            singleLine = true,
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = VioletPrimary,
                unfocusedBorderColor = BorderVivid,
                focusedTextColor = TextPrimary,
                unfocusedTextColor = TextPrimary,
                cursorColor = AmberLight,
                focusedContainerColor = BgSurface2,
                unfocusedContainerColor = BgSurface2,
            ),
            shape = RoundedCornerShape(16.dp),
        )

        // Genre chips
        Row(
            modifier = Modifier
                .horizontalScroll(rememberScrollState())
                .padding(horizontal = 16.dp, vertical = 4.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            VividChip("All", selectedGenre == null, VioletPrimary, VioletLight) {
                selectedGenre = null
            }
            genres.forEach { genre ->
                VividChip(genre, selectedGenre == genre, PinkSecondary, PinkLight) {
                    selectedGenre = if (selectedGenre == genre) null else genre
                }
            }
        }

        // Language chips
        Row(
            modifier = Modifier
                .horizontalScroll(rememberScrollState())
                .padding(horizontal = 16.dp, vertical = 4.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            VividChip("All Languages", selectedLanguage == null, TealAccent, TealLight) {
                selectedLanguage = null
            }
            languages.forEach { lang ->
                VividChip(lang, selectedLanguage == lang, AmberAccent, AmberLight) {
                    selectedLanguage = if (selectedLanguage == lang) null else lang
                }
            }
        }

        // Track count
        Row(
            modifier = Modifier.padding(horizontal = 20.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp),
        ) {
            Box(
                modifier = Modifier
                    .background(
                        Brush.horizontalGradient(listOf(VioletPrimary, PinkSecondary)),
                        RoundedCornerShape(10.dp),
                    )
                    .padding(horizontal = 10.dp, vertical = 3.dp),
            ) {
                Text(
                    "${filtered.size}",
                    color = Color.White,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                )
            }
            Text("tracks", color = TextMuted, fontSize = 12.sp)
        }

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
                    color = BorderVivid.copy(alpha = 0.4f),
                    thickness = 0.5.dp,
                )
            }
        }
    }
}

@Composable
private fun VividChip(
    label: String,
    selected: Boolean,
    activeColor: Color,
    activeLabelColor: Color,
    onClick: () -> Unit,
) {
    Box(
        modifier = Modifier
            .clickable { onClick() }
            .then(
                if (selected)
                    Modifier.background(
                        Brush.horizontalGradient(listOf(activeColor, activeLabelColor.copy(alpha = 0.8f))),
                        RoundedCornerShape(20.dp),
                    )
                else
                    Modifier
                        .background(BgSurface3, RoundedCornerShape(20.dp))
                        .border(1.dp, activeLabelColor.copy(alpha = 0.3f), RoundedCornerShape(20.dp))
            )
            .padding(horizontal = 14.dp, vertical = 7.dp),
    ) {
        Text(
            label,
            color = if (selected) Color.White else TextSecondary,
            fontSize = 12.sp,
            fontWeight = if (selected) FontWeight.Bold else FontWeight.Normal,
        )
    }
}
