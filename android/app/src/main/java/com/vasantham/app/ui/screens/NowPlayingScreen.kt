package com.vasantham.app.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.media3.common.Player
import coil.compose.AsyncImage
import com.vasantham.app.data.formatDuration
import com.vasantham.app.data.getRagaForTrack
import com.vasantham.app.data.model.Raga
import com.vasantham.app.ui.components.RagaInfoCard
import com.vasantham.app.ui.theme.*
import com.vasantham.app.viewmodel.PlayerState

@Composable
fun NowPlayingScreen(
    playerState: PlayerState,
    onPlayPause: () -> Unit,
    onNext: () -> Unit,
    onPrev: () -> Unit,
    onSeek: (Long) -> Unit,
    onToggleShuffle: () -> Unit,
    onCycleRepeat: () -> Unit,
    onBack: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val track = playerState.currentTrack ?: return
    val raga = remember(track.raga) { getRagaForTrack(track) }

    val progress = if (playerState.durationMs > 0)
        playerState.currentPositionMs.toFloat() / playerState.durationMs else 0f

    // Vinyl rotation
    val rotation = remember { Animatable(0f) }
    LaunchedEffect(playerState.isPlaying) {
        if (playerState.isPlaying) {
            rotation.animateTo(
                targetValue = rotation.value + 360f,
                animationSpec = infiniteRepeatable(tween(8000, easing = LinearEasing)),
            )
        } else {
            rotation.stop()
        }
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState()),
    ) {
        // Top bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 16.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.Default.KeyboardArrowDown, null, tint = TextPrimary, modifier = Modifier.size(30.dp))
            }
            Column(modifier = Modifier.weight(1f), horizontalAlignment = Alignment.CenterHorizontally) {
                Text("Now Playing", color = TextMuted, fontSize = 12.sp)
                Text(track.album, color = TextPrimary, fontWeight = FontWeight.SemiBold,
                    fontSize = 14.sp, maxLines = 1, overflow = TextOverflow.Ellipsis)
            }
            Spacer(Modifier.size(48.dp))
        }

        // Vinyl artwork
        Box(
            modifier = Modifier
                .size(280.dp)
                .align(Alignment.CenterHorizontally)
                .clip(CircleShape)
                .background(BgSurface3),
        ) {
            AsyncImage(
                model = track.coverUrl,
                contentDescription = track.title,
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .fillMaxSize()
                    .rotate(rotation.value),
            )
            // Inner groove circles
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .align(Alignment.Center)
                    .background(BgDeep, CircleShape),
            )
            Box(
                modifier = Modifier
                    .size(18.dp)
                    .align(Alignment.Center)
                    .background(BgSurface3, CircleShape),
            )
        }

        Spacer(Modifier.height(28.dp))

        // Track info
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 28.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Text(
                text = track.title,
                fontWeight = FontWeight.Bold,
                fontSize = 22.sp,
                color = TextPrimary,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            Spacer(Modifier.height(4.dp))
            Text(track.artist, color = TextSecondary, fontSize = 15.sp)
            Spacer(Modifier.height(8.dp))

            // Raga badge
            track.raga?.let { ragaName ->
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = AmberAccent.copy(alpha = 0.18f),
                ) {
                    Text(
                        text = ragaName.replaceFirstChar { it.uppercase() },
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = AmberLight,
                    )
                }
            }
        }

        Spacer(Modifier.height(24.dp))

        // Progress
        Column(modifier = Modifier.padding(horizontal = 28.dp)) {
            Slider(
                value = progress,
                onValueChange = { frac ->
                    onSeek((frac * playerState.durationMs).toLong())
                },
                colors = SliderDefaults.colors(
                    thumbColor = VioletPrimary,
                    activeTrackColor = VioletPrimary,
                    inactiveTrackColor = BgSurface3,
                ),
            )
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
            ) {
                Text(formatDuration(playerState.currentPositionMs), color = TextMuted, fontSize = 11.sp)
                Text(formatDuration(playerState.durationMs), color = TextMuted, fontSize = 11.sp)
            }
        }

        Spacer(Modifier.height(16.dp))

        // Controls
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            // Shuffle
            IconButton(onClick = onToggleShuffle) {
                Icon(
                    Icons.Default.Shuffle, null,
                    tint = if (playerState.isShuffled) VioletLight else TextSecondary,
                    modifier = Modifier.size(26.dp),
                )
            }

            // Previous
            IconButton(onClick = onPrev, modifier = Modifier.size(56.dp)) {
                Icon(Icons.Default.SkipPrevious, null, tint = TextPrimary, modifier = Modifier.size(36.dp))
            }

            // Play/Pause
            Box(
                modifier = Modifier
                    .size(64.dp)
                    .background(
                        Brush.linearGradient(listOf(VioletPrimary, PinkSecondary)),
                        CircleShape,
                    )
                    .clickable { onPlayPause() },
                contentAlignment = Alignment.Center,
            ) {
                Icon(
                    if (playerState.isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                    contentDescription = if (playerState.isPlaying) "Pause" else "Play",
                    tint = Color.White,
                    modifier = Modifier.size(36.dp),
                )
            }

            // Next
            IconButton(onClick = onNext, modifier = Modifier.size(56.dp)) {
                Icon(Icons.Default.SkipNext, null, tint = TextPrimary, modifier = Modifier.size(36.dp))
            }

            // Repeat
            IconButton(onClick = onCycleRepeat) {
                Icon(
                    when (playerState.repeatMode) {
                        Player.REPEAT_MODE_ONE -> Icons.Default.RepeatOne
                        else -> Icons.Default.Repeat
                    },
                    null,
                    tint = if (playerState.repeatMode != Player.REPEAT_MODE_OFF) VioletLight else TextSecondary,
                    modifier = Modifier.size(26.dp),
                )
            }
        }

        Spacer(Modifier.height(28.dp))

        // Raga info
        if (raga != null) {
            Column(modifier = Modifier.padding(horizontal = 16.dp)) {
                Text(
                    "Raga Details",
                    fontWeight = FontWeight.SemiBold,
                    color = TextPrimary,
                    fontSize = 16.sp,
                    modifier = Modifier.padding(bottom = 10.dp),
                )
                RagaInfoCard(raga = raga, expandedByDefault = false)
            }
            Spacer(Modifier.height(20.dp))
        }

        // Queue
        if (playerState.queue.isNotEmpty()) {
            Text(
                "Queue (${playerState.queue.size})",
                fontWeight = FontWeight.SemiBold,
                color = TextPrimary,
                fontSize = 16.sp,
                modifier = Modifier.padding(horizontal = 20.dp, vertical = 8.dp),
            )
            playerState.queue.take(5).forEachIndexed { idx, t ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    Text(
                        "${playerState.queueIndex + idx + 1}",
                        color = TextMuted,
                        fontSize = 12.sp,
                        modifier = Modifier.width(20.dp),
                    )
                    AsyncImage(
                        model = t.coverUrl,
                        contentDescription = null,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .size(40.dp)
                            .clip(RoundedCornerShape(8.dp)),
                    )
                    Column(modifier = Modifier.weight(1f)) {
                        Text(t.title, color = TextPrimary, fontSize = 13.sp,
                            maxLines = 1, overflow = TextOverflow.Ellipsis)
                        Text(t.artist, color = TextSecondary, fontSize = 11.sp)
                    }
                    Text(formatDuration(t.duration), color = TextMuted, fontSize = 11.sp)
                }
            }
            if (playerState.queue.size > 5) {
                Text(
                    "+${playerState.queue.size - 5} more",
                    color = TextMuted,
                    fontSize = 12.sp,
                    modifier = Modifier.padding(horizontal = 20.dp, vertical = 4.dp),
                )
            }
        }

        Spacer(Modifier.height(24.dp))
    }
}
