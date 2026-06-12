package com.vasantham.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.vasantham.app.data.model.Track
import com.vasantham.app.data.sampleTracks
import com.vasantham.app.ui.components.TrackItem
import com.vasantham.app.ui.theme.*
import com.vasantham.app.viewmodel.PlayerState

@Composable
fun SearchScreen(
    playerState: PlayerState,
    onPlay: (Track, List<Track>) -> Unit,
    onAddToQueue: (Track) -> Unit,
    modifier: Modifier = Modifier,
) {
    var query by remember { mutableStateOf("") }
    val focusRequester = remember { FocusRequester() }

    val results = remember(query) {
        if (query.isBlank()) emptyList()
        else sampleTracks.filter { track ->
            track.title.contains(query, ignoreCase = true) ||
                track.artist.contains(query, ignoreCase = true) ||
                track.album.contains(query, ignoreCase = true) ||
                track.genre.contains(query, ignoreCase = true) ||
                (track.raga?.contains(query, ignoreCase = true) == true) ||
                track.language.contains(query, ignoreCase = true)
        }
    }

    LaunchedEffect(Unit) {
        focusRequester.requestFocus()
    }

    Column(modifier = modifier.fillMaxSize()) {
        // Search bar
        OutlinedTextField(
            value = query,
            onValueChange = { query = it },
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 14.dp)
                .focusRequester(focusRequester),
            placeholder = { Text("Search songs, artists, ragas…", color = TextMuted) },
            leadingIcon = { Icon(Icons.Default.Search, null, tint = VioletPrimary) },
            trailingIcon = {
                if (query.isNotEmpty()) {
                    IconButton(onClick = { query = "" }) {
                        Icon(Icons.Default.Close, null, tint = TextMuted)
                    }
                }
            },
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

        when {
            query.isBlank() -> {
                // Browse suggestions
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center,
                ) {
                    Text("🔍", fontSize = 48.sp)
                    Spacer(Modifier.height(16.dp))
                    Text(
                        "Search for songs, artists,\nragas, genres, or languages",
                        color = TextMuted,
                        fontSize = 15.sp,
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                    )
                }
            }

            results.isEmpty() -> {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center,
                ) {
                    Text("😕", fontSize = 48.sp)
                    Spacer(Modifier.height(16.dp))
                    Text("No results for \"$query\"", color = TextMuted, fontSize = 15.sp)
                }
            }

            else -> {
                Text(
                    "${results.size} results for \"$query\"",
                    color = TextMuted,
                    fontSize = 12.sp,
                    modifier = Modifier.padding(horizontal = 20.dp, vertical = 4.dp),
                )
                LazyColumn(contentPadding = PaddingValues(bottom = 16.dp)) {
                    items(results, key = { it.id }) { track ->
                        TrackItem(
                            track = track,
                            isPlaying = playerState.currentTrack?.id == track.id && playerState.isPlaying,
                            onClick = { onPlay(track, results) },
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
    }
}
