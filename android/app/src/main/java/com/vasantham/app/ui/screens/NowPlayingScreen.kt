package com.vasantham.app.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.*
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
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
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.media3.common.Player
import coil.compose.AsyncImage
import com.vasantham.app.audio.AudioMode
import com.vasantham.app.data.formatDuration
import com.vasantham.app.data.getRagaForTrack
import com.vasantham.app.ui.components.PianoKeyboard
import com.vasantham.app.ui.components.RagaInfoCard
import com.vasantham.app.ui.components.SwaraDisplay
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
    onSetMode: (AudioMode) -> Unit,
    onBack: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val track = playerState.currentTrack ?: return
    val raga = remember(track.raga) { getRagaForTrack(track) }

    val progress = if (playerState.durationMs > 0)
        playerState.currentPositionMs.toFloat() / playerState.durationMs else 0f

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

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    0f to VioletDark.copy(alpha = 0.6f),
                    0.35f to BgDeep,
                    1f to BgDeep,
                )
            )
    ) {
        // Ambient glow
        Box(
            modifier = Modifier
                .size(320.dp)
                .align(Alignment.TopCenter)
                .offset(y = (-60).dp)
                .background(
                    Brush.radialGradient(
                        listOf(VioletPrimary.copy(alpha = 0.25f), PinkSecondary.copy(alpha = 0.08f), Color.Transparent)
                    )
                )
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState()),
        ) {
            // Top bar
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 18.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .background(Color.White.copy(alpha = 0.08f), RoundedCornerShape(12.dp))
                        .clickable { onBack() },
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(Icons.Default.KeyboardArrowDown, null, tint = TextPrimary, modifier = Modifier.size(28.dp))
                }
                Column(
                    modifier = Modifier.weight(1f),
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    Text("Now Playing", color = TextMuted, fontSize = 12.sp, fontWeight = FontWeight.Medium)
                    Text(
                        track.album.orEmpty(),
                        style = TextStyle(brush = Brush.linearGradient(listOf(VioletLight, PinkLight))),
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                }
                Spacer(Modifier.size(40.dp))
            }

            // Vinyl
            Box(
                modifier = Modifier
                    .size(260.dp)
                    .align(Alignment.CenterHorizontally)
                    .border(3.dp, Brush.sweepGradient(listOf(VioletPrimary, PinkSecondary, AmberAccent, VioletPrimary)), CircleShape)
                    .clip(CircleShape)
                    .background(BgSurface3),
            ) {
                AsyncImage(
                    model = track.coverUrl,
                    contentDescription = track.title,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize().rotate(rotation.value),
                )
                Box(Modifier.size(80.dp).align(Alignment.Center).background(BgDeep, CircleShape))
                Box(
                    Modifier.size(20.dp).align(Alignment.Center)
                        .background(Brush.radialGradient(listOf(VioletLight, VioletPrimary)), CircleShape)
                )
            }

            Spacer(Modifier.height(24.dp))

            // Track info
            Column(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 28.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Text(
                    text = track.title,
                    fontWeight = FontWeight.Black,
                    fontSize = 22.sp,
                    style = TextStyle(brush = Brush.linearGradient(listOf(TextPrimary, VioletLight))),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
                Spacer(Modifier.height(4.dp))
                Text(track.artist, color = TextSecondary, fontSize = 15.sp)
                Spacer(Modifier.height(8.dp))
                track.raga?.let { ragaName ->
                    Surface(shape = RoundedCornerShape(10.dp), color = AmberAccent.copy(alpha = 0.20f)) {
                        Text(
                            "🎼 ${ragaName.replaceFirstChar { it.uppercase() }}",
                            modifier = Modifier.padding(horizontal = 14.dp, vertical = 5.dp),
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = AmberLight,
                        )
                    }
                }
            }

            Spacer(Modifier.height(20.dp))

            // Progress bar
            Column(modifier = Modifier.padding(horizontal = 24.dp)) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(5.dp)
                        .clip(RoundedCornerShape(3.dp))
                        .background(BgSurface3),
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth(progress)
                            .fillMaxHeight()
                            .background(Brush.horizontalGradient(listOf(VioletPrimary, PinkSecondary, AmberLight)))
                    )
                }
                Slider(
                    value = progress,
                    onValueChange = { onSeek((it * playerState.durationMs).toLong()) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = SliderDefaults.colors(
                        thumbColor = AmberLight,
                        activeTrackColor = Color.Transparent,
                        inactiveTrackColor = Color.Transparent,
                    ),
                )
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text(formatDuration(playerState.currentPositionMs), color = VioletLight, fontSize = 12.sp, fontWeight = FontWeight.Medium)
                    Text(formatDuration(playerState.durationMs), color = TextMuted, fontSize = 12.sp)
                }
            }

            Spacer(Modifier.height(10.dp))

            // Transport controls
            Row(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                IconButton(onClick = onToggleShuffle) {
                    Icon(Icons.Default.Shuffle, null,
                        tint = if (playerState.isShuffled) TealLight else TextMuted,
                        modifier = Modifier.size(26.dp))
                }
                Box(
                    modifier = Modifier
                        .size(50.dp)
                        .background(Color.White.copy(alpha = 0.08f), CircleShape)
                        .clickable { onPrev() },
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(Icons.Default.SkipPrevious, null, tint = TextPrimary, modifier = Modifier.size(30.dp))
                }
                Box(
                    modifier = Modifier
                        .size(66.dp)
                        .background(Brush.linearGradient(listOf(VioletPrimary, PinkSecondary)), CircleShape)
                        .clickable { onPlayPause() },
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(
                        if (playerState.isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(36.dp),
                    )
                }
                Box(
                    modifier = Modifier
                        .size(50.dp)
                        .background(Color.White.copy(alpha = 0.08f), CircleShape)
                        .clickable { onNext() },
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(Icons.Default.SkipNext, null, tint = TextPrimary, modifier = Modifier.size(30.dp))
                }
                IconButton(onClick = onCycleRepeat) {
                    Icon(
                        when (playerState.repeatMode) {
                            Player.REPEAT_MODE_ONE -> Icons.Default.RepeatOne
                            else -> Icons.Default.Repeat
                        },
                        null,
                        tint = if (playerState.repeatMode != Player.REPEAT_MODE_OFF) PinkLight else TextMuted,
                        modifier = Modifier.size(26.dp),
                    )
                }
            }

            Spacer(Modifier.height(20.dp))

            // ── Mode switcher ──────────────────────────────────────────
            Column(modifier = Modifier.padding(horizontal = 16.dp)) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier.padding(bottom = 10.dp),
                ) {
                    Box(
                        modifier = Modifier
                            .width(3.dp)
                            .height(14.dp)
                            .background(
                                Brush.verticalGradient(listOf(TealLight, VioletLight)),
                                RoundedCornerShape(2.dp),
                            )
                    )
                    Text(
                        "Playback Mode",
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        style = TextStyle(brush = Brush.linearGradient(listOf(TealLight, VioletLight))),
                    )
                }

                Row(
                    modifier = Modifier.horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    AudioMode.entries.forEach { mode ->
                        ModeChip(
                            mode = mode,
                            selected = playerState.audioMode == mode,
                            onClick = { onSetMode(mode) },
                        )
                    }
                }

                // DSP active indicator
                if (playerState.audioMode.affectsAudio) {
                    Spacer(Modifier.height(10.dp))
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(TealAccent.copy(alpha = 0.10f), RoundedCornerShape(10.dp))
                            .padding(horizontal = 12.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        DspPulseIndicator()
                        Column {
                            Text(
                                "DSP active · ${playerState.audioMode.label}",
                                color = TealLight,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                            )
                            Text(
                                when (playerState.audioMode) {
                                    AudioMode.KARAOKE, AudioMode.INSTRUMENTAL ->
                                        "Mid-side separation · centre channel removed · instruments isolated"
                                    AudioMode.VOCAL ->
                                        "Mid-side separation · side channels removed · vocals isolated"
                                    else -> ""
                                },
                                color = TextMuted,
                                fontSize = 9.sp,
                                lineHeight = 12.sp,
                            )
                        }
                    }
                }

                // ── Piano panel ────────────────────────────────────────
                AnimatedVisibility(
                    visible = playerState.audioMode == AudioMode.PIANO,
                    enter = expandVertically() + fadeIn(),
                    exit = shrinkVertically() + fadeOut(),
                ) {
                    Column(modifier = Modifier.padding(top = 16.dp)) {
                        PianoKeyboard(
                            raga = raga,
                            modifier = Modifier.fillMaxWidth(),
                        )
                        if (raga == null) {
                            Spacer(Modifier.height(8.dp))
                            Text(
                                "No raga data for this track.\nThe keyboard shows all 12 notes.",
                                color = TextMuted,
                                fontSize = 11.sp,
                                lineHeight = 15.sp,
                            )
                        }
                    }
                }

                // ── Swara panel ───────────────────────────────────────
                AnimatedVisibility(
                    visible = playerState.audioMode == AudioMode.SWARA,
                    enter = expandVertically() + fadeIn(),
                    exit = shrinkVertically() + fadeOut(),
                ) {
                    Column(modifier = Modifier.padding(top = 16.dp)) {
                        SwaraDisplay(
                            raga = raga,
                            modifier = Modifier.fillMaxWidth(),
                        )
                        if (raga == null) {
                            Text(
                                "No raga data for this track.",
                                color = TextMuted,
                                fontSize = 11.sp,
                            )
                        }
                    }
                }
            }

            Spacer(Modifier.height(20.dp))

            // ── Raga details card ────────────────────────────────────
            if (raga != null) {
                Column(modifier = Modifier.padding(horizontal = 16.dp)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.padding(bottom = 10.dp),
                    ) {
                        Box(
                            modifier = Modifier
                                .width(4.dp)
                                .height(20.dp)
                                .background(
                                    Brush.verticalGradient(listOf(AmberLight, OrangeLight)),
                                    RoundedCornerShape(2.dp),
                                )
                        )
                        Text(
                            "Raga Details",
                            fontWeight = FontWeight.Bold,
                            fontSize = 17.sp,
                            style = TextStyle(brush = Brush.linearGradient(listOf(AmberLight, OrangeLight))),
                        )
                    }
                    RagaInfoCard(raga = raga, expandedByDefault = false)
                }
                Spacer(Modifier.height(20.dp))
            }

            // ── Up Next ───────────────────────────────────────────────
            if (playerState.queue.isNotEmpty()) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.padding(horizontal = 20.dp, vertical = 8.dp),
                ) {
                    Box(
                        modifier = Modifier
                            .width(4.dp)
                            .height(20.dp)
                            .background(
                                Brush.verticalGradient(listOf(TealLight, VioletLight)),
                                RoundedCornerShape(2.dp),
                            )
                    )
                    Text(
                        "Up Next",
                        fontWeight = FontWeight.Bold,
                        fontSize = 17.sp,
                        style = TextStyle(brush = Brush.linearGradient(listOf(TealLight, VioletLight))),
                    )
                }
                playerState.queue.take(5).forEachIndexed { idx, t ->
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(horizontal = 20.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                    ) {
                        Box(
                            modifier = Modifier
                                .size(28.dp)
                                .background(
                                    Brush.linearGradient(listOf(VioletPrimary, PinkSecondary)),
                                    RoundedCornerShape(8.dp),
                                ),
                            contentAlignment = Alignment.Center,
                        ) {
                            Text("${playerState.queueIndex + idx + 1}", color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                        AsyncImage(
                            model = t.coverUrl,
                            contentDescription = null,
                            contentScale = ContentScale.Crop,
                            modifier = Modifier.size(40.dp).clip(RoundedCornerShape(10.dp)),
                        )
                        Column(modifier = Modifier.weight(1f)) {
                            Text(t.title, color = TextPrimary, fontSize = 13.sp, fontWeight = FontWeight.SemiBold, maxLines = 1, overflow = TextOverflow.Ellipsis)
                            Text(t.artist, color = TextSecondary, fontSize = 11.sp)
                        }
                        Text(formatDuration(t.duration), color = TextMuted, fontSize = 11.sp)
                    }
                }
                if (playerState.queue.size > 5) {
                    Text(
                        "+ ${playerState.queue.size - 5} more",
                        color = VioletLight.copy(alpha = 0.7f),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium,
                        modifier = Modifier.padding(horizontal = 20.dp, vertical = 4.dp),
                    )
                }
            }

            Spacer(Modifier.height(28.dp))
        }
    }
}

@Composable
private fun ModeChip(mode: AudioMode, selected: Boolean, onClick: () -> Unit) {
    val (bgModifier, textColor) = if (selected) {
        val colors = when {
            mode.affectsAudio -> listOf(TealAccent, TealLight.copy(alpha = 0.8f))
            mode == AudioMode.PIANO -> listOf(AmberAccent, AmberLight.copy(alpha = 0.8f))
            mode == AudioMode.SWARA -> listOf(VioletPrimary, VioletLight.copy(alpha = 0.8f))
            else -> listOf(BgSurface3, BgSurface3)
        }
        Modifier.background(Brush.horizontalGradient(colors), RoundedCornerShape(20.dp)) to Color.White
    } else {
        Modifier
            .background(BgSurface3, RoundedCornerShape(20.dp))
            .border(
                1.dp,
                when {
                    mode.affectsAudio -> TealLight.copy(alpha = 0.3f)
                    mode == AudioMode.PIANO -> AmberLight.copy(alpha = 0.3f)
                    mode == AudioMode.SWARA -> VioletLight.copy(alpha = 0.3f)
                    else -> BorderVivid.copy(alpha = 0.3f)
                },
                RoundedCornerShape(20.dp),
            ) to TextSecondary
    }

    Box(
        modifier = Modifier
            .clickable { onClick() }
            .then(bgModifier)
            .padding(horizontal = 14.dp, vertical = 8.dp),
    ) {
        Text(
            "${mode.emoji} ${mode.label}",
            color = textColor,
            fontSize = 12.sp,
            fontWeight = if (selected) FontWeight.Bold else FontWeight.Normal,
        )
    }
}

@Composable
private fun DspPulseIndicator() {
    val infiniteTransition = rememberInfiniteTransition(label = "dsp")
    val scale by infiniteTransition.animateFloat(
        initialValue = 0.6f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(tween(600), RepeatMode.Reverse),
        label = "scale",
    )
    Box(
        modifier = Modifier
            .size(10.dp)
            .background(TealLight.copy(alpha = scale), CircleShape)
    )
}
