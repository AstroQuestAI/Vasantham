package com.vasantham.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
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
                track.album?.contains(query, ignoreCase = true) == true ||
                track.genre.contains(query, ignoreCase = true) ||
                (track.raga?.contains(query, ignoreCase = true) == true) ||
                track.language.contains(query, ignoreCase = true)
        }
    }

    LaunchedEffect(Unit) {
        focusRequester.requestFocus()
    }

    Column(modifier = modifier.fillMaxSize()) {
        // Header
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    Brush.verticalGradient(
                        listOf(PinkSecondary.copy(alpha = 0.35f), Color.Transparent)
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
                            Brush.verticalGradient(listOf(PinkLight, AmberLight)),
                            RoundedCornerShape(2.dp),
                        )
                )
                Text(
                    "Search",
                    fontWeight = FontWeight.Black,
                    fontSize = 22.sp,
                    style = TextStyle(
                        brush = Brush.linearGradient(listOf(PinkLight, AmberLight))
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
                .padding(horizontal = 16.dp, vertical = 8.dp)
                .focusRequester(focusRequester),
            placeholder = { Text("Songs, artists, ragas…", color = TextMuted) },
            leadingIcon = {
                Icon(Icons.Default.Search, null, tint = PinkSoft)
            },
            trailingIcon = {
                if (query.isNotEmpty()) {
                    IconButton(onClick = { query = "" }) {
                        Icon(Icons.Default.Close, null, tint = TextMuted)
                    }
                }
            },
            singleLine = true,
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = PinkSecondary,
                unfocusedBorderColor = BorderVivid,
                focusedTextColor = TextPrimary,
                unfocusedTextColor = TextPrimary,
                cursorColor = AmberLight,
                focusedContainerColor = BgSurface2,
                unfocusedContainerColor = BgSurface2,
            ),
            shape = RoundedCornerShape(16.dp),
        )

        when {
            query.isBlank() -> {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 32.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center,
                ) {
                    Box(
                        modifier = Modifier
                            .size(100.dp)
                            .background(
                                Brush.radialGradient(
                                    listOf(
                                        PinkSecondary.copy(alpha = 0.25f),
                                        VioletPrimary.copy(alpha = 0.10f),
                                        Color.Transparent,
                                    )
                                )
                            ),
                        contentAlignment = Alignment.Center,
                    ) {
                        Text("🔍", fontSize = 48.sp)
                    }
                    Spacer(Modifier.height(16.dp))
                    Text(
                        "Find your music",
                        fontWeight = FontWeight.Bold,
                        fontSize = 20.sp,
                        style = TextStyle(
                            brush = Brush.linearGradient(listOf(PinkLight, AmberLight))
                        ),
                    )
                    Spacer(Modifier.height(8.dp))
                    Text(
                        "Search songs, artists, ragas,\ngenres, or languages",
                        color = TextSecondary,
                        fontSize = 14.sp,
                        textAlign = TextAlign.Center,
                        lineHeight = 20.sp,
                    )
                }
            }

            results.isEmpty() -> {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 32.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center,
                ) {
                    Text("😕", fontSize = 48.sp)
                    Spacer(Modifier.height(16.dp))
                    Text(
                        "Nothing found",
                        fontWeight = FontWeight.Bold,
                        fontSize = 20.sp,
                        color = TextPrimary,
                    )
                    Spacer(Modifier.height(8.dp))
                    Text(
                        "No results for \"$query\"",
                        color = TextSecondary,
                        fontSize = 14.sp,
                        textAlign = TextAlign.Center,
                    )
                }
            }

            else -> {
                Row(
                    modifier = Modifier.padding(horizontal = 20.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    Box(
                        modifier = Modifier
                            .background(
                                Brush.horizontalGradient(listOf(PinkSecondary, AmberAccent)),
                                RoundedCornerShape(10.dp),
                            )
                            .padding(horizontal = 10.dp, vertical = 3.dp),
                    ) {
                        Text(
                            "${results.size}",
                            color = Color.White,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                        )
                    }
                    Text(
                        "results for \"$query\"",
                        color = TextSecondary,
                        fontSize = 12.sp,
                    )
                }
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
                            color = BorderVivid.copy(alpha = 0.4f),
                            thickness = 0.5.dp,
                        )
                    }
                }
            }
        }
    }
}
