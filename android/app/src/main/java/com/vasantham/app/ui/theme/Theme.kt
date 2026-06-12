package com.vasantham.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary          = VioletPrimary,
    onPrimary        = TextPrimary,
    primaryContainer = BgSurface2,
    secondary        = PinkSecondary,
    onSecondary      = TextPrimary,
    tertiary         = AmberAccent,
    background       = BgDeep,
    onBackground     = TextPrimary,
    surface          = BgSurface,
    onSurface        = TextPrimary,
    surfaceVariant   = BgSurface2,
    onSurfaceVariant = TextSecondary,
    outline          = BorderSubtle,
)

@Composable
fun VasanthamTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography  = VasanthamTypography,
        content     = content,
    )
}
