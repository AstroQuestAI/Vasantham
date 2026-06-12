package com.vasantham.app.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.ui.draw.drawBehind
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

    val accentColor = VioletLight
    Row(
        modifier = modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .then(
                if (isPlaying) Modifier.drawBehind {
                    // vivid left accent bar
                    drawRect(
                        brush = Brush.verticalGradient(
                            listOf(accentColor, PinkLight),
                            startY = 0f,
                            endY = size.height,
                        ),
                        size = androidx.compose.ui.geometry.Size(6f, size.height),
                    )
                    // tinted row background
                    drawRect(
                        color = VioletPrimary.copy(alpha = 0.10f),
                    )
                } else Modifier
            )
            .padding(horizontal = 16.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        // Artwork
        Box(
            modifier = Modifier
                .size(52.dp)
                .clip(RoundedCornerShape(12.dp))
                .border(
                    width = if (isPlaying) 2.dp else 0.dp,
                    brush = Brush.linearGradient(listOf(VioletLight, PinkLight)),
                    shape = RoundedCornerShape(12.dp),
                )
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
                        .background(VioletPrimary.copy(alpha = 0.45f)),
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
                fontWeight = FontWeight.SemiBold,
                color = if (isPlaying) VioletLight else TextPrimary,
                fontSize = 15.sp,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp),
                verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = track.artist,
                    color = TextSecondary,
                    fontSize = 13.sp,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.weight(1f, fill = false),
                )
                if (track.raga != null) {
                    Surface(
                        shape = RoundedCornerShape(5.dp),
                        color = AmberAccent.copy(alpha = 0.18f),
                    ) {
                        Text(
                            text = track.raga.replaceFirstChar { it.uppercase() },
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = AmberLight,
                        )
                    }
                }
            }
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp),
                verticalAlignment = Alignment.CenterVertically) {
                Surface(
                    shape = RoundedCornerShape(4.dp),
                    color = VioletPrimary.copy(alpha = 0.14f),
                ) {
                    Text(
                        text = track.genre.split(" ").last(),
                        modifier = Modifier.padding(horizontal = 5.dp, vertical = 1.dp),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Medium,
                        color = VioletLight,
                    )
                }
                Text("·", color = TextMuted, fontSize = 10.sp)
                Text(
                    text = formatDuration(track.duration),
                    color = TextMuted,
                    fontSize = 10.sp,
                )
                if (track.plays > 0) {
                    Text("·", color = TextMuted, fontSize = 10.sp)
                    Text(
                        text = "${formatPlays(track.plays)} plays",
                        color = TealLight.copy(alpha = 0.8f),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Medium,
                    )
                }
            }
        }

        // Overflow menu
        Box {
            IconButton(onClick = { showMenu = true }) {
                Icon(Icons.Default.MoreVert, contentDescription = "More",
                    tint = TextMuted, modifier = Modifier.size(22.dp))
            }
            DropdownMenu(
                expanded = showMenu,
                onDismissRequest = { showMenu = false },
                modifier = Modifier.background(BgCard),
            ) {
                DropdownMenuItem(
                    text = { Text("Play now", color = TextPrimary, fontWeight = FontWeight.SemiBold) },
                    onClick = { showMenu = false; onClick() },
                    leadingIcon = {
                        Icon(Icons.Default.PlayArrow, null, tint = VioletLight)
                    },
                )
                DropdownMenuItem(
                    text = { Text("Add to queue", color = TextPrimary) },
                    onClick = { showMenu = false; onAddToQueue() },
                    leadingIcon = {
                        Icon(Icons.Default.QueueMusic, null, tint = PinkSoft)
                    },
                )
            }
        }
    }
}

@Composable
fun PlayingBars() {
    val infiniteTransition = rememberInfiniteTransition(label = "bars")
    val h1 by infiniteTransition.animateFloat(initialValue = 4f, targetValue = 18f,
        animationSpec = infiniteRepeatable(tween(600), RepeatMode.Reverse), label = "h1")
    val h2 by infiniteTransition.animateFloat(initialValue = 18f, targetValue = 4f,
        animationSpec = infiniteRepeatable(tween(800), RepeatMode.Reverse), label = "h2")
    val h3 by infiniteTransition.animateFloat(initialValue = 10f, targetValue = 22f,
        animationSpec = infiniteRepeatable(tween(700), RepeatMode.Reverse), label = "h3")

    Row(
        horizontalArrangement = Arrangement.spacedBy(2.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        listOf(h1 to VioletLight, h2 to PinkLight, h3 to AmberLight).forEach { (h, c) ->
            Box(
                modifier = Modifier
                    .width(3.dp)
                    .height(h.dp)
                    .background(c, RoundedCornerShape(2.dp))
            )
        }
    }
}
