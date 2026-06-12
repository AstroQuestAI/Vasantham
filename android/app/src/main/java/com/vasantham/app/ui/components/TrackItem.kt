package com.vasantham.app.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.QueueMusic
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
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
import com.vasantham.app.ui.theme.*

@Composable
fun TrackItem(
    track: Track,
    isPlaying: Boolean,
    onClick: () -> Unit,
    onAddToQueue: () -> Unit,
    modifier: Modifier = Modifier,
) {
    var showMenu by remember { mutableStateOf(false) }

    Row(
        modifier = modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .background(if (isPlaying) VioletPrimary.copy(alpha = 0.08f) else Color.Transparent)
            .padding(horizontal = 16.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        // Artwork
        Box(
            modifier = Modifier
                .size(50.dp)
                .clip(RoundedCornerShape(10.dp))
                .background(BgSurface3),
        ) {
            AsyncImage(
                model = track.coverUrl,
                contentDescription = track.title,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize(),
            )
            if (isPlaying) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(VioletPrimary.copy(alpha = 0.5f)),
                    contentAlignment = Alignment.Center,
                ) {
                    PlayingBars()
                }
            }
        }

        // Info
        Column(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(3.dp),
        ) {
            Text(
                text = track.title,
                style = MaterialTheme.typography.titleMedium.copy(
                    fontWeight = FontWeight.SemiBold,
                    color = if (isPlaying) VioletLight else TextPrimary,
                ),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = track.artist,
                    style = MaterialTheme.typography.bodyMedium,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.weight(1f, fill = false),
                )
                if (track.raga != null) {
                    Surface(
                        shape = RoundedCornerShape(4.dp),
                        color = AmberAccent.copy(alpha = 0.15f),
                    ) {
                        Text(
                            text = track.raga.replaceFirstChar { it.uppercase() },
                            modifier = Modifier.padding(horizontal = 5.dp, vertical = 1.dp),
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = AmberLight,
                                fontWeight = FontWeight.SemiBold,
                            ),
                        )
                    }
                }
            }
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = track.genre.split(" ").last(),
                    style = MaterialTheme.typography.labelSmall,
                )
                Text("·", style = MaterialTheme.typography.labelSmall)
                Text(
                    text = formatDuration(track.duration),
                    style = MaterialTheme.typography.labelSmall.copy(fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace),
                )
                if (track.plays > 0) {
                    Text("·", style = MaterialTheme.typography.labelSmall)
                    Text(
                        text = "${formatPlays(track.plays)} plays",
                        style = MaterialTheme.typography.labelSmall,
                    )
                }
            }
        }

        // Overflow menu
        Box {
            IconButton(onClick = { showMenu = true }) {
                Icon(Icons.Default.MoreVert, contentDescription = "More", tint = TextMuted)
            }
            DropdownMenu(
                expanded = showMenu,
                onDismissRequest = { showMenu = false },
                modifier = Modifier.background(BgSurface2),
            ) {
                DropdownMenuItem(
                    text = { Text("Play now", color = TextPrimary) },
                    onClick = { showMenu = false; onClick() },
                    leadingIcon = { Icon(Icons.Default.PlayArrow, null, tint = VioletLight) },
                )
                DropdownMenuItem(
                    text = { Text("Add to queue", color = TextPrimary) },
                    onClick = { showMenu = false; onAddToQueue() },
                    leadingIcon = { Icon(Icons.Default.QueueMusic, null, tint = PinkSecondary) },
                )
            }
        }
    }
}

@Composable
fun PlayingBars() {
    val infiniteTransition = rememberInfiniteTransition(label = "bars")
    val h1 by infiniteTransition.animateFloat(initialValue = 4f, targetValue = 18f, animationSpec = infiniteRepeatable(tween(600), RepeatMode.Reverse), label = "h1")
    val h2 by infiniteTransition.animateFloat(initialValue = 18f, targetValue = 4f, animationSpec = infiniteRepeatable(tween(800), RepeatMode.Reverse), label = "h2")
    val h3 by infiniteTransition.animateFloat(initialValue = 10f, targetValue = 22f, animationSpec = infiniteRepeatable(tween(700), RepeatMode.Reverse), label = "h3")

    Row(
        horizontalArrangement = Arrangement.spacedBy(2.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        listOf(h1, h2, h3).forEach { h ->
            Box(
                modifier = Modifier
                    .width(3.dp)
                    .height(h.dp)
                    .background(Color.White, RoundedCornerShape(2.dp))
            )
        }
    }
}
