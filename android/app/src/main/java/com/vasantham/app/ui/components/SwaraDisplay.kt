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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.vasantham.app.data.model.Raga
import com.vasantham.app.ui.theme.*

private data class SwaraInfo(
    val semitone: Int,
    val shortName: String,   // e.g. "Sa", "Ri"
    val fullName: String,    // e.g. "Shadja", "Rishabha"
    val variant: String,     // "shuddha", "komal", "tivra", or ""
    val color: Color,
    val isBlack: Boolean,    // corresponds to a black piano key
)

private val allSwaras = listOf(
    SwaraInfo(0,  "Sa",    "Shadja",      "",         CoralLight,   false),
    SwaraInfo(1,  "Ri♭",   "Rishabha",    "komal",    EmeraldLight, true),
    SwaraInfo(2,  "Ri",    "Rishabha",    "shuddha",  EmeraldLight, false),
    SwaraInfo(3,  "Ga♭",   "Gandhara",    "komal",    CyanBright,   true),
    SwaraInfo(4,  "Ga",    "Gandhara",    "shuddha",  CyanBright,   false),
    SwaraInfo(5,  "Ma",    "Madhyama",    "shuddha",  VioletLight,  false),
    SwaraInfo(6,  "Ma#",   "Madhyama",    "tivra",    VioletLight,  true),
    SwaraInfo(7,  "Pa",    "Panchama",    "",         PinkLight,    false),
    SwaraInfo(8,  "Dha♭",  "Dhaivata",   "komal",    AmberLight,   true),
    SwaraInfo(9,  "Dha",   "Dhaivata",   "shuddha",  AmberLight,   false),
    SwaraInfo(10, "Ni♭",   "Nishada",    "komal",    OrangeLight,  true),
    SwaraInfo(11, "Ni",    "Nishada",    "shuddha",  OrangeLight,  false),
)

@Composable
fun SwaraDisplay(
    raga: Raga?,
    modifier: Modifier = Modifier,
) {
    val active = raga?.semitones?.toSet() ?: emptySet()

    val pulse by rememberInfiniteTransition(label = "swara").animateFloat(
        initialValue = 0.30f,
        targetValue = 0.80f,
        animationSpec = infiniteRepeatable(tween(1400, easing = FastOutSlowInEasing), RepeatMode.Reverse),
        label = "pulse",
    )

    Column(modifier = modifier) {
        // Title bar
        if (raga != null) {
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
                            Brush.verticalGradient(listOf(VioletLight, PinkLight)),
                            RoundedCornerShape(2.dp),
                        )
                )
                Text(
                    "${raga.name} · ${active.size} swaras · ${raga.mood}",
                    color = VioletLight,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                )
            }
        }

        // 12-swara grid: 2 rows × 6 columns
        // Row 1: Sa, Ri♭, Ri, Ga♭, Ga, Ma
        // Row 2: Ma#, Pa, Dha♭, Dha, Ni♭, Ni
        val rows = listOf(allSwaras.take(6), allSwaras.drop(6))
        rows.forEach { rowSwaras ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 2.dp),
                horizontalArrangement = Arrangement.spacedBy(4.dp),
            ) {
                rowSwaras.forEach { swara ->
                    SwaraCell(
                        swara = swara,
                        isActive = swara.semitone in active,
                        pulse = pulse,
                        modifier = Modifier.weight(1f),
                    )
                }
            }
        }

        // Raga info row
        if (raga != null) {
            Spacer(Modifier.height(10.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                RagaMetaPill("Time", raga.timeOfDay ?: "Any", TealLight, modifier = Modifier.weight(1f))
                RagaMetaPill("Season", raga.season ?: "All", AmberLight, modifier = Modifier.weight(1f))
                RagaMetaPill("Mood", raga.mood.split(",").first().trim(), PinkLight, modifier = Modifier.weight(1f))
            }
        }
    }
}

@Composable
private fun SwaraCell(
    swara: SwaraInfo,
    isActive: Boolean,
    pulse: Float,
    modifier: Modifier = Modifier,
) {
    val bgColor = if (isActive) swara.color else BgSurface3
    val textColor = if (isActive) Color(0xFF0D0A1A) else TextMuted

    Box(
        modifier = modifier
            .aspectRatio(0.72f)
            .then(
                if (isActive)
                    Modifier.background(
                        Brush.verticalGradient(
                            listOf(swara.color.copy(alpha = 0.5f + pulse * 0.4f), swara.color)
                        ),
                        RoundedCornerShape(8.dp),
                    ).border(1.dp, swara.color, RoundedCornerShape(8.dp))
                else
                    Modifier
                        .background(
                            if (swara.isBlack) Color(0xFF0D0A1A) else BgSurface3,
                            RoundedCornerShape(8.dp),
                        )
                        .border(
                            0.5.dp,
                            BorderVivid.copy(alpha = 0.25f),
                            RoundedCornerShape(8.dp),
                        )
            ),
        contentAlignment = Alignment.Center,
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                swara.shortName,
                color = if (isActive) textColor else if (swara.isBlack) TextMuted.copy(alpha = 0.5f) else TextSecondary,
                fontSize = 10.sp,
                fontWeight = if (isActive) FontWeight.ExtraBold else FontWeight.Normal,
                textAlign = TextAlign.Center,
            )
            if (swara.variant.isNotEmpty()) {
                Text(
                    swara.variant.take(3),
                    color = if (isActive) textColor.copy(alpha = 0.7f) else TextMuted.copy(alpha = 0.4f),
                    fontSize = 5.5.sp,
                    textAlign = TextAlign.Center,
                )
            }
        }
    }
}

@Composable
private fun RagaMetaPill(label: String, value: String, color: Color, modifier: Modifier = Modifier) {
    Column(
        modifier = modifier
            .background(color.copy(alpha = 0.12f), RoundedCornerShape(8.dp))
            .padding(horizontal = 6.dp, vertical = 5.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(label, color = color.copy(alpha = 0.7f), fontSize = 8.sp, fontWeight = FontWeight.SemiBold)
        Text(value, color = TextPrimary, fontSize = 9.sp, fontWeight = FontWeight.Medium)
    }
}
