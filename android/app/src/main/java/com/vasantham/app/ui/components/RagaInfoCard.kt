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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
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
    'R' to CoralLight,
    'G' to EmeraldLight,
    'M' to CyanBright,
    'P' to VioletLight,
    'D' to PinkLight,
    'N' to OrangeLight,
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
            .clip(RoundedCornerShape(18.dp))
            .background(
                Brush.verticalGradient(
                    listOf(
                        AmberAccent.copy(alpha = 0.12f),
                        VioletPrimary.copy(alpha = 0.06f),
                    )
                )
            )
            .border(
                1.dp,
                Brush.linearGradient(listOf(AmberAccent.copy(alpha = 0.5f), VioletLight.copy(alpha = 0.3f))),
                RoundedCornerShape(18.dp),
            )
    ) {
        // Header
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
                    .size(40.dp)
                    .background(
                        Brush.linearGradient(listOf(AmberAccent, OrangeAccent)),
                        RoundedCornerShape(12.dp),
                    ),
                contentAlignment = Alignment.Center,
            ) {
                Icon(Icons.Default.MusicNote, contentDescription = null,
                    tint = Color.White, modifier = Modifier.size(22.dp))
            }
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = raga.name,
                    fontWeight = FontWeight.Bold,
                    fontSize = 17.sp,
                    style = TextStyle(
                        brush = Brush.linearGradient(listOf(AmberLight, OrangeLight))
                    ),
                )
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    raga.carnaticName?.takeIf { it != raga.name }?.let {
                        Text("Carnatic: $it", color = TealLight.copy(alpha = 0.8f), fontSize = 11.sp)
                    }
                    raga.hindustaniName?.takeIf { it != raga.name }?.let {
                        Text("Hindustani: $it", color = VioletLight.copy(alpha = 0.8f), fontSize = 11.sp)
                    }
                }
                Text(raga.mood, color = TextSecondary, fontSize = 12.sp, maxLines = 1)
            }
            Box(
                modifier = Modifier
                    .size(30.dp)
                    .background(
                        if (expanded) VioletPrimary.copy(alpha = 0.25f)
                        else Color.White.copy(alpha = 0.06f),
                        RoundedCornerShape(8.dp),
                    ),
                contentAlignment = Alignment.Center,
            ) {
                Icon(
                    if (expanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                    contentDescription = null,
                    tint = if (expanded) VioletLight else TextMuted,
                    modifier = Modifier.size(20.dp),
                )
            }
        }

        AnimatedVisibility(
            visible = expanded,
            enter = expandVertically(),
            exit = shrinkVertically(),
        ) {
            Column(
                modifier = Modifier.padding(start = 14.dp, end = 14.dp, bottom = 16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                HorizontalDivider(
                    color = AmberAccent.copy(alpha = 0.18f),
                    thickness = 1.dp,
                )

                Text(
                    text = raga.description,
                    color = TextSecondary,
                    fontSize = 13.sp,
                    lineHeight = 20.sp,
                )

                // Scales with label chips
                ScaleRow(label = "Aroha ↑", scale = raga.arohana)
                ScaleRow(label = "Avaroha ↓", scale = raga.avarohana)

                // Piano
                PianoDisplay(raga.semitones)

                // Meta chips
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    raga.timeOfDay?.let { MetaChip("⏰", it, VioletPrimary, VioletLight) }
                    raga.season?.let { MetaChip("🌿", it, EmeraldGreen, EmeraldLight) }
                    MetaChip("🎵", "${raga.semitones.size} notes", AmberAccent, AmberLight)
                }
            }
        }
    }
}

@Composable
private fun ScaleRow(label: String, scale: String) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(10.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Surface(
            shape = RoundedCornerShape(6.dp),
            color = BgSurface3,
        ) {
            Text(
                text = label,
                color = TextMuted,
                fontSize = 10.sp,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier.padding(horizontal = 6.dp, vertical = 3.dp),
            )
        }
        Text(
            text = buildAnnotatedString {
                scale.split(" ").forEach { note ->
                    val base = note.firstOrNull { it.isLetter() }
                    val color = noteColors[base] ?: TextPrimary
                    withStyle(
                        SpanStyle(
                            color = color,
                            fontWeight = FontWeight.Bold,
                            fontFamily = FontFamily.Monospace,
                            background = color.copy(alpha = 0.10f),
                        )
                    ) {
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
    Column {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(34.dp)
                .clip(RoundedCornerShape(8.dp)),
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
                                inRaga && isBlack ->
                                    Brush.verticalGradient(listOf(AmberLight, AmberAccent))
                                inRaga ->
                                    Brush.verticalGradient(listOf(GoldLight, AmberLight))
                                isBlack ->
                                    Brush.verticalGradient(listOf(BgSurface3, BgDeep))
                                else ->
                                    Brush.verticalGradient(listOf(BgSurface2, BgSurface3))
                            },
                            RoundedCornerShape(topStart = 3.dp, topEnd = 3.dp),
                        )
                )
            }
        }
        Text(
            text = "Piano keys — highlighted = notes in this raga",
            color = TextMuted,
            fontSize = 10.sp,
            modifier = Modifier.padding(top = 3.dp),
        )
    }
}

@Composable
private fun MetaChip(emoji: String, text: String, bgColor: Color, textColor: Color) {
    Surface(
        shape = RoundedCornerShape(10.dp),
        color = bgColor.copy(alpha = 0.18f),
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            horizontalArrangement = Arrangement.spacedBy(4.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(emoji, fontSize = 12.sp)
            Text(text, color = textColor, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
        }
    }
}
