package com.vasantham.app.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.vasantham.app.data.model.Raga
import com.vasantham.app.ui.theme.*

// Semitone → swara short name (Indian classical)
private val swaraNames = mapOf(
    0 to "Sa", 1 to "Ri♭", 2 to "Ri", 3 to "Ga♭", 4 to "Ga",
    5 to "Ma", 6 to "Ma#", 7 to "Pa", 8 to "Dha♭", 9 to "Dha",
    10 to "Ni♭", 11 to "Ni",
)

// Semitone colour for active swara
private val swaraColor = mapOf(
    0 to CoralLight,   // Sa  - tonic
    1 to EmeraldLight, // Ri♭
    2 to EmeraldLight, // Ri
    3 to CyanBright,   // Ga♭
    4 to CyanBright,   // Ga
    5 to VioletLight,  // Ma
    6 to VioletLight,  // Ma#
    7 to PinkLight,    // Pa  - dominant
    8 to AmberLight,   // Dha♭
    9 to AmberLight,   // Dha
    10 to OrangeLight, // Ni♭
    11 to OrangeLight, // Ni
)

// White key order (semitones): C D E F G A B
private val whiteKeySemitones = listOf(0, 2, 4, 5, 7, 9, 11)

// Black key (semitone, fraction offset from left in white-key units)
private val blackKeys = listOf(
    1 to 0.64f,   // Ri♭ between Sa and Ri
    3 to 1.64f,   // Ga♭ between Ri and Ga
    6 to 3.64f,   // Ma# between Ma and Pa
    8 to 4.64f,   // Dha♭ between Pa and Dha
    10 to 5.64f,  // Ni♭ between Dha and Ni
)

@Composable
fun PianoKeyboard(
    raga: Raga?,
    modifier: Modifier = Modifier,
) {
    val active = raga?.semitones?.toSet() ?: emptySet()

    // Pulse animation for active keys
    val pulse by rememberInfiniteTransition(label = "pulse").animateFloat(
        initialValue = 0.55f,
        targetValue = 0.85f,
        animationSpec = infiniteRepeatable(tween(1200, easing = FastOutSlowInEasing), RepeatMode.Reverse),
        label = "pulse"
    )

    Column(modifier = modifier) {
        // Raga label
        if (raga != null) {
            Row(
                modifier = Modifier.padding(bottom = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp),
            ) {
                Box(
                    modifier = Modifier
                        .width(3.dp)
                        .height(14.dp)
                        .background(
                            Brush.verticalGradient(listOf(AmberLight, OrangeLight)),
                            RoundedCornerShape(2.dp),
                        )
                )
                Text(
                    "${raga.name} — ${raga.semitones.size} notes",
                    color = AmberLight,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                )
            }
        }

        // Piano keyboard
        BoxWithConstraints(
            modifier = Modifier
                .fillMaxWidth()
                .height(96.dp)
                .clip(RoundedCornerShape(10.dp))
                .background(Color(0xFF0D0A1A))
                .padding(4.dp),
        ) {
            val whiteW = maxWidth / whiteKeySemitones.size
            val blackW = whiteW * 0.58f
            val blackH = 0.60f

            // ── White keys ──
            Row(modifier = Modifier.fillMaxSize()) {
                whiteKeySemitones.forEach { semi ->
                    val isActive = semi in active
                    val keyColor = if (isActive) swaraColor[semi]!! else Color.White
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .fillMaxHeight()
                            .padding(horizontal = 1.dp)
                            .clip(RoundedCornerShape(bottomStart = 6.dp, bottomEnd = 6.dp))
                            .background(
                                if (isActive)
                                    Brush.verticalGradient(
                                        listOf(keyColor.copy(alpha = pulse), keyColor)
                                    )
                                else
                                    Brush.verticalGradient(
                                        listOf(Color.White, Color(0xFFE8E8E8))
                                    )
                            )
                            .then(
                                if (isActive) Modifier.border(
                                    1.dp,
                                    keyColor.copy(alpha = 0.9f),
                                    RoundedCornerShape(bottomStart = 6.dp, bottomEnd = 6.dp),
                                ) else Modifier
                            ),
                        contentAlignment = Alignment.BottomCenter,
                    ) {
                        Text(
                            swaraNames[semi] ?: "",
                            fontSize = 6.5.sp,
                            color = if (isActive) Color(0xFF0D0A1A) else Color(0xFF999999),
                            fontWeight = if (isActive) FontWeight.ExtraBold else FontWeight.Normal,
                            modifier = Modifier.padding(bottom = 3.dp),
                        )
                    }
                }
            }

            // ── Black keys (overlaid) ──
            blackKeys.forEach { (semi, offset) ->
                val isActive = semi in active
                val keyColor = if (isActive) swaraColor[semi]!! else Color(0xFF1A1530)
                Box(
                    modifier = Modifier
                        .offset(x = whiteW * offset)
                        .width(blackW)
                        .fillMaxHeight(blackH)
                        .clip(RoundedCornerShape(bottomStart = 4.dp, bottomEnd = 4.dp))
                        .background(
                            if (isActive)
                                Brush.verticalGradient(listOf(keyColor.copy(alpha = pulse + 0.1f), keyColor))
                            else
                                Brush.verticalGradient(listOf(Color(0xFF2A2050), Color(0xFF0D0A1A)))
                        ),
                    contentAlignment = Alignment.BottomCenter,
                ) {
                    if (isActive) {
                        Text(
                            swaraNames[semi]?.take(2) ?: "",
                            fontSize = 5.5.sp,
                            color = Color(0xFF0D0A1A),
                            fontWeight = FontWeight.ExtraBold,
                            modifier = Modifier.padding(bottom = 2.dp),
                        )
                    }
                }
            }
        }

        // Arohana / Avarohana beneath keys
        if (raga != null) {
            Spacer(Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                ScaleLabel("↑ Arohana", raga.arohana, VioletLight, modifier = Modifier.weight(1f))
                ScaleLabel("↓ Avarohana", raga.avarohana, PinkLight, modifier = Modifier.weight(1f))
            }
        }
    }
}

@Composable
private fun ScaleLabel(title: String, scale: String, color: Color, modifier: Modifier = Modifier) {
    Column(modifier = modifier) {
        Text(title, color = color.copy(alpha = 0.7f), fontSize = 9.sp, fontWeight = FontWeight.SemiBold)
        Text(
            scale,
            color = TextPrimary,
            fontSize = 10.sp,
            fontWeight = FontWeight.Medium,
            lineHeight = 14.sp,
        )
    }
}
