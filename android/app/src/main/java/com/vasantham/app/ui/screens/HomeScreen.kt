package com.vasantham.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.vasantham.app.data.formatDuration
import com.vasantham.app.data.formatPlays
import com.vasantham.app.data.model.Track
import com.vasantham.app.data.sampleTracks
import com.vasantham.app.ui.components.PlayingBars
import com.vasantham.app.ui.theme.*
import com.vasantham.app.viewmodel.PlayerState

private data class MoodEntry(
    val label: String,
    val emoji: String,
    val gradStart: Color,
    val gradEnd: Color,
)

private val moods = listOf(
    MoodEntry("Devotional", "🪔", MoodDevotional1, MoodDevotional2),
    MoodEntry("Romantic",   "💕", MoodRomantic1,   MoodRomantic2),
    MoodEntry("Energetic",  "⚡", MoodEnergetic1,  MoodEnergetic2),
    MoodEntry("Meditative", "🧘", MoodMeditative1, MoodMeditative2),
    MoodEntry("Festive",    "🥁", MoodFestive1,    MoodFestive2),
    MoodEntry("Peaceful",   "🌿", MoodPeaceful1,   MoodPeaceful2),
    MoodEntry("Nostalgic",  "🌅", MoodNostalgic1,  MoodNostalgic2),
    MoodEntry("Joyful",     "🎶", MoodJoyful1,     MoodJoyful2),
)

@Composable
fun HomeScreen(
    playerState: PlayerState,
    onPlay: (Track, List<Track>) -> Unit,
    onAddToQueue: (Track) -> Unit,
    modifier: Modifier = Modifier,
) {
    val featured = sampleTracks.filter { it.isFeatured }
    val trending  = sampleTracks.filter { it.isTrending }
    val classical = sampleTracks.filter { it.genre.contains("Classical") }

    LazyColumn(
        modifier = modifier.fillMaxSize(),
        contentPadding = PaddingValues(bottom = 24.dp),
    ) {
        // ── App header ──────────────────────────────────────────────────────
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        Brush.verticalGradient(
                            listOf(VioletDark.copy(alpha = 0.6f), Color.Transparent)
                        )
                    )
                    .padding(horizontal = 20.dp, vertical = 22.dp),
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                ) {
                    Column {
                        Text(
                            "Vasantham",
                            fontWeight = FontWeight.Black,
                            fontSize = 30.sp,
                            style = TextStyle(
                                brush = Brush.linearGradient(
                                    listOf(VioletLight, PinkLight, AmberLight)
                                )
                            ),
                        )
                        Text(
                            "वसन्थम् · Music for the Soul",
                            color = TextSecondary,
                            fontSize = 12.sp,
                        )
                    }
                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .background(
                                Brush.linearGradient(listOf(VioletPrimary, PinkSecondary)),
                                RoundedCornerShape(16.dp),
                            ),
                        contentAlignment = Alignment.Center,
                    ) {
                        Text("🎵", fontSize = 22.sp)
                    }
                }
            }
        }

        // ── Featured hero ───────────────────────────────────────────────────
        if (featured.isNotEmpty()) {
            item {
                GradientSectionTitle("✨ Featured", VioletLight, PinkLight)
                Spacer(Modifier.height(10.dp))
                FeaturedHero(
                    track = featured.first(),
                    isPlaying = playerState.currentTrack?.id == featured.first().id && playerState.isPlaying,
                    onPlay = { onPlay(featured.first(), featured) },
                )
                Spacer(Modifier.height(24.dp))
            }
        }

        // ── Mood tiles ──────────────────────────────────────────────────────
        item {
            GradientSectionTitle("How are you feeling?", AmberLight, OrangeLight)
            Spacer(Modifier.height(12.dp))
            LazyRow(
                contentPadding = PaddingValues(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                items(moods) { mood -> MoodTile(mood) }
            }
            Spacer(Modifier.height(24.dp))
        }

        // ── Trending ────────────────────────────────────────────────────────
        item {
            GradientSectionTitle("🔥 Trending Now", CoralRed, OrangeLight)
            Spacer(Modifier.height(12.dp))
        }
        item {
            LazyRow(
                contentPadding = PaddingValues(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(14.dp),
            ) {
                items(trending.take(10)) { track ->
                    TrackCard(
                        track = track,
                        isPlaying = playerState.currentTrack?.id == track.id && playerState.isPlaying,
                        accentColor = PinkSoft,
                        onClick = { onPlay(track, trending) },
                    )
                }
            }
            Spacer(Modifier.height(24.dp))
        }

        // ── Classical ───────────────────────────────────────────────────────
        item {
            GradientSectionTitle("🎵 Indian Classical", AmberGold, TealLight)
            Spacer(Modifier.height(12.dp))
        }
        item {
            LazyRow(
                contentPadding = PaddingValues(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(14.dp),
            ) {
                items(classical) { track ->
                    TrackCard(
                        track = track,
                        isPlaying = playerState.currentTrack?.id == track.id && playerState.isPlaying,
                        accentColor = AmberLight,
                        onClick = { onPlay(track, classical) },
                    )
                }
            }
            Spacer(Modifier.height(24.dp))
        }

        // ── All tracks quick access ─────────────────────────────────────────
        item {
            GradientSectionTitle("🎧 All Tracks", TealLight, VioletLight)
            Spacer(Modifier.height(12.dp))
        }
        item {
            LazyRow(
                contentPadding = PaddingValues(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(14.dp),
            ) {
                items(sampleTracks.takeLast(8)) { track ->
                    TrackCard(
                        track = track,
                        isPlaying = playerState.currentTrack?.id == track.id && playerState.isPlaying,
                        accentColor = VioletLight,
                        onClick = { onPlay(track, sampleTracks) },
                    )
                }
            }
        }
    }
}

@Composable
private fun GradientSectionTitle(text: String, color1: Color, color2: Color) {
    Row(
        modifier = Modifier.padding(horizontal = 20.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        Box(
            modifier = Modifier
                .width(4.dp)
                .height(22.dp)
                .background(
                    Brush.verticalGradient(listOf(color1, color2)),
                    RoundedCornerShape(2.dp),
                )
        )
        Text(
            text = text,
            fontWeight = FontWeight.Bold,
            fontSize = 18.sp,
            style = TextStyle(
                brush = Brush.linearGradient(listOf(color1, color2))
            ),
        )
    }
}

@Composable
private fun FeaturedHero(track: Track, isPlaying: Boolean, onPlay: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(248.dp)
            .padding(horizontal = 16.dp)
            .clip(RoundedCornerShape(24.dp))
            .border(
                width = 1.5.dp,
                brush = Brush.linearGradient(listOf(VioletLight, PinkLight, AmberLight)),
                shape = RoundedCornerShape(24.dp),
            )
            .clickable { onPlay() },
    ) {
        AsyncImage(
            model = track.coverUrl,
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize(),
        )
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        0f to Color.Transparent,
                        0.45f to BgDeep.copy(alpha = 0.25f),
                        1f to BgDeep.copy(alpha = 0.93f),
                    )
                )
        )
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.horizontalGradient(
                        listOf(VioletPrimary.copy(alpha = 0.22f), Color.Transparent)
                    )
                )
        )

        Column(
            modifier = Modifier
                .align(Alignment.BottomStart)
                .padding(20.dp),
        ) {
            if (track.raga != null) {
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = AmberAccent.copy(alpha = 0.92f),
                    modifier = Modifier.padding(bottom = 8.dp),
                ) {
                    Text(
                        text = "🎼 ${track.raga.replaceFirstChar { it.uppercase() }}",
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 3.dp),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.Black,
                    )
                }
            }
            Text(
                text = track.title,
                fontWeight = FontWeight.Black,
                fontSize = 22.sp,
                color = Color.White,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            Text(track.artist, color = Color.White.copy(alpha = 0.78f), fontSize = 14.sp)
            Spacer(Modifier.height(12.dp))
            Row(
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Box(
                    modifier = Modifier
                        .height(42.dp)
                        .clip(RoundedCornerShape(21.dp))
                        .background(Brush.linearGradient(listOf(VioletPrimary, PinkSecondary)))
                        .clickable { onPlay() }
                        .padding(horizontal = 22.dp),
                    contentAlignment = Alignment.Center,
                ) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Icon(Icons.Default.PlayArrow, null, tint = Color.White,
                            modifier = Modifier.size(20.dp))
                        Text(
                            if (isPlaying) "Now Playing" else "Play Now",
                            color = Color.White,
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp,
                        )
                    }
                }
                Box(
                    modifier = Modifier
                        .height(42.dp)
                        .clip(RoundedCornerShape(21.dp))
                        .background(Color.White.copy(alpha = 0.14f))
                        .padding(horizontal = 14.dp),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        formatDuration(track.duration),
                        color = Color.White.copy(alpha = 0.88f),
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium,
                    )
                }
            }
        }
    }
}

@Composable
private fun TrackCard(
    track: Track,
    isPlaying: Boolean,
    accentColor: Color,
    onClick: () -> Unit,
) {
    Column(
        modifier = Modifier
            .width(152.dp)
            .clickable { onClick() },
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(1f)
                .clip(RoundedCornerShape(18.dp))
                .then(
                    if (isPlaying) Modifier.border(
                        2.dp,
                        Brush.linearGradient(listOf(accentColor, PinkLight)),
                        RoundedCornerShape(18.dp),
                    ) else Modifier
                )
                .background(BgSurface3),
        ) {
            AsyncImage(
                model = track.coverUrl,
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize(),
            )
            Box(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .fillMaxWidth()
                    .fillMaxHeight(0.4f)
                    .background(
                        Brush.verticalGradient(
                            listOf(Color.Transparent, BgDeep.copy(alpha = 0.75f))
                        )
                    )
            )
            if (isPlaying) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(accentColor.copy(alpha = 0.32f)),
                    contentAlignment = Alignment.Center,
                ) { PlayingBars() }
            }
            if (track.raga != null) {
                Surface(
                    modifier = Modifier.align(Alignment.TopStart).padding(7.dp),
                    shape = RoundedCornerShape(8.dp),
                    color = AmberAccent.copy(alpha = 0.9f),
                ) {
                    Text(
                        text = track.raga.replaceFirstChar { it.uppercase() },
                        modifier = Modifier.padding(horizontal = 7.dp, vertical = 2.dp),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.Black,
                    )
                }
            }
        }
        Spacer(Modifier.height(8.dp))
        Text(
            track.title,
            fontWeight = FontWeight.SemiBold,
            color = if (isPlaying) accentColor else TextPrimary,
            fontSize = 13.sp,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
        )
        Text(track.artist, color = TextSecondary, fontSize = 11.sp,
            maxLines = 1, overflow = TextOverflow.Ellipsis)
        if (track.plays > 0) {
            Text(
                "${formatPlays(track.plays)} plays",
                color = accentColor.copy(alpha = 0.72f),
                fontSize = 10.sp,
                fontWeight = FontWeight.Medium,
            )
        }
    }
}

@Composable
private fun MoodTile(mood: MoodEntry) {
    Column(
        modifier = Modifier
            .width(80.dp)
            .clickable { },
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        Box(
            modifier = Modifier
                .size(62.dp)
                .background(
                    Brush.linearGradient(listOf(mood.gradStart, mood.gradEnd)),
                    RoundedCornerShape(20.dp),
                )
                .border(
                    1.dp,
                    mood.gradEnd.copy(alpha = 0.5f),
                    RoundedCornerShape(20.dp),
                ),
            contentAlignment = Alignment.Center,
        ) {
            Text(mood.emoji, fontSize = 28.sp)
        }
        Text(
            mood.label,
            color = TextSecondary,
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
        )
    }
}
