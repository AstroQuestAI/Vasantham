package com.vasantham.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary          = VioletPrimary,
    onPrimary        = TextPrimary,
    primaryContainer = VioletDark.copy(alpha = 0.3f),
    onPrimaryContainer = VioletLight,
    secondary        = PinkSecondary,
    onSecondary      = TextPrimary,
    secondaryContainer = PinkSecondary.copy(alpha = 0.2f),
    tertiary         = AmberGold,
    onTertiary       = BgDeep,
    tertiaryContainer = AmberAccent.copy(alpha = 0.2f),
    background       = BgDeep,
    onBackground     = TextPrimary,
    surface          = BgSurface,
    onSurface        = TextPrimary,
    surfaceVariant   = BgSurface2,
    onSurfaceVariant = TextSecondary,
    outline          = BorderVivid,
    outlineVariant   = BorderSubtle,
    error            = CoralRed,
    onError          = TextPrimary,
    inversePrimary   = VioletLight,
)

@Composable
fun VasanthamTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography  = VasanthamTypography,
        content     = content,
    )
}
