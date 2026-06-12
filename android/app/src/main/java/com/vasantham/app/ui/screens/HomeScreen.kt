package com.vasantham.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.vasantham.app.data.formatDuration
import com.vasantham.app.data.formatPlays
import com.vasantham.app.data.model.Track
import com.vasantham.app.data.sampleTracks
import com.vasantham.app.ui.theme.*
import com.vasantham.app.viewmodel.PlayerState

private val moods = listOf(
    "Devotional" to ("🪔" to Color(0xFFF59E0B)),
    "Romantic" to ("💕" to Color(0xFFEC4899)),
    "Energetic" to ("⚡" to Color(0xFFFACC15)),
    "Meditative" to ("🧘" to Color(0xFF818CF8)),
    "Festive" to ("🥁" to Color(0xFFEF4444)),
    "Peaceful" to ("🌿" to Color(0xFF10B981)),
    "Nostalgic" to ("🌅" to Color(0xFFF97316)),
    "Joyful" to ("🎶" to Color(0xFF8B5CF6)),
)

@Composable
fun HomeScreen(
    playerState: PlayerState,
    onPlay: (Track, List<Track>) -> Unit,
    onAddToQueue: (Track) -> Unit,
    modifier: Modifier = Modifier,
) {
    val featured = sampleTracks.filter { it.isFeatured }
    val trending = sampleTracks.filter { it.isTrending }
    val classical = sampleTracks.filter { it.genre.contains("Classical") }

    LazyColumn(
        modifier = modifier.fillMaxSize(),
        contentPadding = PaddingValues(bottom = 16.dp),
    ) {
        // App header
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 20.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
            ) {
                Column {
                    Text("Vasantham", fontWeight = FontWeight.Bold, fontSize = 26.sp,
                        color = VioletLight)
                    Text("वसन्थम् · Music for All", color = TextMuted, fontSize = 12.sp)
                }
                Text("🎵", fontSize = 28.sp)
            }
        }

        // Featured track hero
        if (featured.isNotEmpty()) {
            item {
                SectionTitle("Featured")
                Spacer(Modifier.height(8.dp))
                FeaturedHero(
                    track = featured.first(),
                    isPlaying = playerState.currentTrack?.id == featured.first().id && playerState.isPlaying,
                    onPlay = { onPlay(featured.first(), featured) },
                )
                Spacer(Modifier.height(20.dp))
            }
        }

        // Mood tiles
        item {
            SectionTitle("How are you feeling?")
            Spacer(Modifier.height(10.dp))
            LazyRow(
                contentPadding = PaddingValues(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
            ) {
                items(moods) { (mood, pair) ->
                    val (emoji, color) = pair
                    MoodTile(mood = mood, emoji = emoji, color = color)
                }
            }
            Spacer(Modifier.height(20.dp))
        }

        // Trending
        item {
            SectionTitle("Trending Now 🔥")
            Spacer(Modifier.height(10.dp))
        }
        item {
            LazyRow(
                contentPadding = PaddingValues(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                items(trending) { track ->
                    TrendingCard(
                        track = track,
                        isPlaying = playerState.currentTrack?.id == track.id && playerState.isPlaying,
                        onClick = { onPlay(track, trending) },
                    )
                }
            }
            Spacer(Modifier.height(20.dp))
        }

        // Classical
        item {
            SectionTitle("Indian Classical 🎵")
            Spacer(Modifier.height(10.dp))
        }
        item {
            LazyRow(
                contentPadding = PaddingValues(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                items(classical) { track ->
                    TrendingCard(
                        track = track,
                        isPlaying = playerState.currentTrack?.id == track.id && playerState.isPlaying,
                        onClick = { onPlay(track, classical) },
                    )
                }
            }
            Spacer(Modifier.height(8.dp))
        }
    }
}

@Composable
private fun SectionTitle(text: String) {
    Text(
        text = text,
        fontWeight = FontWeight.Bold,
        fontSize = 18.sp,
        color = TextPrimary,
        modifier = Modifier.padding(horizontal = 20.dp),
    )
}

@Composable
private fun FeaturedHero(track: Track, isPlaying: Boolean, onPlay: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(220.dp)
            .padding(horizontal = 20.dp)
            .clip(RoundedCornerShape(20.dp))
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
                        listOf(Color.Transparent, BgDeep.copy(alpha = 0.9f)),
                    )
                )
        )
        Column(
            modifier = Modifier
                .align(Alignment.BottomStart)
                .padding(16.dp),
        ) {
            Text(
                text = track.title,
                fontWeight = FontWeight.Bold,
                fontSize = 20.sp,
                color = Color.White,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            Text(track.artist, color = Color.White.copy(alpha = 0.7f), fontSize = 13.sp)
            Spacer(Modifier.height(10.dp))
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Box(
                    modifier = Modifier
                        .height(38.dp)
                        .clip(RoundedCornerShape(20.dp))
                        .background(Brush.linearGradient(listOf(VioletPrimary, PinkSecondary)))
                        .clickable { onPlay() }
                        .padding(horizontal = 20.dp),
                    contentAlignment = Alignment.Center,
                ) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Icon(
                            if (isPlaying) Icons.Default.PlayArrow else Icons.Default.PlayArrow,
                            null, tint = Color.White, modifier = Modifier.size(18.dp)
                        )
                        Text(
                            if (isPlaying) "Playing" else "Play Now",
                            color = Color.White, fontWeight = FontWeight.SemiBold, fontSize = 13.sp,
                        )
                    }
                }
                Text(formatDuration(track.duration), color = Color.White.copy(alpha = 0.5f), fontSize = 12.sp)
            }
        }
    }
}

@Composable
private fun TrendingCard(track: Track, isPlaying: Boolean, onClick: () -> Unit) {
    Column(
        modifier = Modifier
            .width(140.dp)
            .clickable { onClick() },
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(1f)
                .clip(RoundedCornerShape(14.dp))
                .background(BgSurface3),
        ) {
            AsyncImage(
                model = track.coverUrl,
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize(),
            )
            if (isPlaying) {
                Box(
                    Modifier.fillMaxSize().background(VioletPrimary.copy(alpha = 0.5f)),
                    contentAlignment = Alignment.Center,
                ) { PlayingBars() }
            }
            if (track.raga != null) {
                Surface(
                    modifier = Modifier.align(Alignment.TopStart).padding(6.dp),
                    shape = RoundedCornerShape(6.dp),
                    color = AmberAccent.copy(alpha = 0.85f),
                ) {
                    Text(
                        text = track.raga.replaceFirstChar { it.uppercase() },
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                        fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color.Black,
                    )
                }
            }
        }
        Spacer(Modifier.height(8.dp))
        Text(track.title, fontWeight = FontWeight.SemiBold, color = if (isPlaying) VioletLight else TextPrimary,
            fontSize = 13.sp, maxLines = 1, overflow = TextOverflow.Ellipsis)
        Text(track.artist, color = TextSecondary, fontSize = 11.sp, maxLines = 1, overflow = TextOverflow.Ellipsis)
        if (track.plays > 0) {
            Text("${formatPlays(track.plays)} plays", color = TextMuted, fontSize = 10.sp)
        }
    }
}

@Composable
private fun MoodTile(mood: String, emoji: String, color: Color) {
    Column(
        modifier = Modifier
            .width(72.dp)
            .clickable { },
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        Box(
            modifier = Modifier
                .size(52.dp)
                .background(color.copy(alpha = 0.15f), RoundedCornerShape(14.dp))
                .clip(RoundedCornerShape(14.dp)),
            contentAlignment = Alignment.Center,
        ) {
            Text(emoji, fontSize = 24.sp)
        }
        Text(mood, color = TextSecondary, fontSize = 11.sp, maxLines = 1, overflow = TextOverflow.Ellipsis)
    }
}
