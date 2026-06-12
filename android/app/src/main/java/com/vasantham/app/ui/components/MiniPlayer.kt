package com.vasantham.app.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
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
import coil.compose.AsyncImage
import com.vasantham.app.data.model.Track
import com.vasantham.app.ui.theme.*

@Composable
fun MiniPlayer(
    track: Track,
    isPlaying: Boolean,
    positionMs: Long,
    durationMs: Long,
    onPlayPause: () -> Unit,
    onNext: () -> Unit,
    onPrev: () -> Unit,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val progress = if (durationMs > 0) positionMs.toFloat() / durationMs else 0f

    // Vinyl rotation
    val rotation = remember { Animatable(0f) }
    LaunchedEffect(isPlaying) {
        if (isPlaying) {
            rotation.animateTo(
                targetValue = rotation.value + 360f,
                animationSpec = infiniteRepeatable(tween(6000, easing = LinearEasing)),
            )
        } else {
            rotation.stop()
        }
    }

    Column(modifier = modifier) {
        // Progress bar
        LinearProgressIndicator(
            progress = { progress },
            modifier = Modifier.fillMaxWidth().height(2.dp),
            color = VioletPrimary,
            trackColor = Color.White.copy(alpha = 0.08f),
        )

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(BgSurface.copy(alpha = 0.95f))
                .clickable { onClick() }
                .padding(horizontal = 16.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            // Spinning artwork
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(CircleShape)
                    .background(BgSurface3),
            ) {
                AsyncImage(
                    model = track.coverUrl,
                    contentDescription = null,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize().rotate(rotation.value),
                )
                // Center dot
                Box(
                    modifier = Modifier
                        .size(10.dp)
                        .align(Alignment.Center)
                        .background(BgSurface, CircleShape),
                )
            }

            // Track info
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = track.title,
                    fontWeight = FontWeight.SemiBold,
                    color = TextPrimary,
                    fontSize = 14.sp,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
                Row(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Text(
                        text = track.artist,
                        color = TextSecondary,
                        fontSize = 12.sp,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                        modifier = Modifier.weight(1f, fill = false),
                    )
                    track.raga?.let { raga ->
                        Surface(
                            shape = RoundedCornerShape(4.dp),
                            color = AmberAccent.copy(alpha = 0.18f),
                        ) {
                            Text(
                                text = raga.replaceFirstChar { it.uppercase() },
                                modifier = Modifier.padding(horizontal = 5.dp, vertical = 1.dp),
                                fontSize = 10.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = AmberLight,
                            )
                        }
                    }
                }
            }

            // Controls
            IconButton(onClick = onPrev) {
                Icon(Icons.Default.SkipPrevious, null, tint = TextSecondary, modifier = Modifier.size(28.dp))
            }

            // Play / Pause button
            Box(
                modifier = Modifier
                    .size(42.dp)
                    .background(
                        Brush.linearGradient(listOf(VioletPrimary, PinkSecondary)),
                        CircleShape,
                    )
                    .clickable { onPlayPause() },
                contentAlignment = Alignment.Center,
            ) {
                Icon(
                    if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                    contentDescription = if (isPlaying) "Pause" else "Play",
                    tint = Color.White,
                    modifier = Modifier.size(26.dp),
                )
            }

            IconButton(onClick = onNext) {
                Icon(Icons.Default.SkipNext, null, tint = TextSecondary, modifier = Modifier.size(28.dp))
            }
        }
    }
}
