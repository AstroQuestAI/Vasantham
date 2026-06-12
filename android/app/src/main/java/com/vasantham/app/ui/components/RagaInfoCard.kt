package com.vasantham.app.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ExpandLess
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.MusicNote
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.vasantham.app.data.model.Raga
import com.vasantham.app.ui.theme.*

private val noteColors = mapOf(
    'S' to AmberLight,
    'R' to Color(0xFFF87171),
    'G' to EmeraldGreen,
    'M' to Color(0xFF38BDF8),
    'P' to VioletLight,
    'D' to PinkLight,
    'N' to Color(0xFFFB923C),
)

@Composable
fun RagaInfoCard(
    raga: Raga,
    expandedByDefault: Boolean = true,
    modifier: Modifier = Modifier,
) {
    var expanded by remember { mutableStateOf(expandedByDefault) }

    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(AmberAccent.copy(alpha = 0.08f))
            .border(1.dp, AmberAccent.copy(alpha = 0.25f), RoundedCornerShape(16.dp))
    ) {
        // Header row
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clickable { expanded = !expanded }
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .background(AmberAccent, RoundedCornerShape(10.dp)),
                contentAlignment = Alignment.Center,
            ) {
                Icon(Icons.Default.MusicNote, contentDescription = null, tint = Color.Black, modifier = Modifier.size(20.dp))
            }
            Column(modifier = Modifier.weight(1f)) {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                    Text(text = raga.name, fontWeight = FontWeight.Bold, color = AmberLight, fontSize = 16.sp)
                    raga.carnaticName?.takeIf { it != raga.name }?.let {
                        Text(text = "Carnatic: $it", color = AmberLight.copy(alpha = 0.5f), fontSize = 11.sp)
                    }
                    raga.hindustaniName?.takeIf { it != raga.name }?.let {
                        Text(text = "Hindustani: $it", color = AmberLight.copy(alpha = 0.5f), fontSize = 11.sp)
                    }
                }
                Text(text = raga.mood, color = TextSecondary, fontSize = 12.sp, maxLines = 1)
            }
            Icon(
                if (expanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                contentDescription = null,
                tint = TextMuted,
            )
        }

        AnimatedVisibility(
            visible = expanded,
            enter = expandVertically(),
            exit = shrinkVertically(),
        ) {
            Column(
                modifier = Modifier.padding(start = 14.dp, end = 14.dp, bottom = 14.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                HorizontalDivider(color = AmberAccent.copy(alpha = 0.15f))

                // Description
                Text(text = raga.description, color = TextSecondary, fontSize = 13.sp, lineHeight = 19.sp)

                // Scales
                ScaleRow(label = "Aroha", scale = raga.arohana)
                ScaleRow(label = "Avaroha", scale = raga.avarohana)

                // Piano visualisation
                PianoDisplay(raga.semitones)

                // Meta
                Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                    raga.timeOfDay?.let { MetaChip("⏰", it) }
                    raga.season?.let { MetaChip("🌿", it) }
                    MetaChip("🎵", "${raga.semitones.size} notes")
                }
            }
        }
    }
}

@Composable
private fun ScaleRow(label: String, scale: String) {
    Row(horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.Top) {
        Text(text = label, color = TextMuted, fontSize = 11.sp, fontWeight = FontWeight.Medium,
            modifier = Modifier.width(52.dp))
        Text(
            text = buildAnnotatedString {
                scale.split(" ").forEach { note ->
                    val base = note.firstOrNull { it.isLetter() }
                    val color = noteColors[base] ?: TextPrimary
                    withStyle(SpanStyle(color = color, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace)) {
                        append(note)
                        append(" ")
                    }
                }
            },
            fontSize = 13.sp,
        )
    }
}

@Composable
private fun PianoDisplay(semitones: List<Int>) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(28.dp)
            .clip(RoundedCornerShape(6.dp)),
        horizontalArrangement = Arrangement.spacedBy(2.dp),
        verticalAlignment = Alignment.Bottom,
    ) {
        val blackKeys = setOf(1, 3, 6, 8, 10)
        for (i in 0..12) {
            val inRaga = semitones.contains(i)
            val isBlack = blackKeys.contains(i % 12)
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight(if (isBlack) 0.55f else 1f)
                    .background(
                        when {
                            inRaga && isBlack -> AmberAccent
                            inRaga -> AmberLight
                            isBlack -> BgSurface3
                            else -> BgSurface2.copy(alpha = 0.6f)
                        },
                        RoundedCornerShape(topStart = 2.dp, topEnd = 2.dp),
                    )
            )
        }
    }
    Text(
        text = "Piano keys — highlighted = notes in this raga",
        color = TextMuted,
        fontSize = 10.sp,
        modifier = Modifier.padding(top = 2.dp),
    )
}

@Composable
private fun MetaChip(emoji: String, text: String) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(4.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(emoji, fontSize = 12.sp)
        Text(text, color = AmberLight.copy(alpha = 0.7f), fontSize = 11.sp)
    }
}
