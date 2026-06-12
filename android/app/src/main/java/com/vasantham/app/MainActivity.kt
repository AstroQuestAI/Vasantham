package com.vasantham.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.vasantham.app.ui.navigation.Screen
import com.vasantham.app.ui.navigation.VasanthamNavGraph
import com.vasantham.app.ui.navigation.bottomNavScreens
import com.vasantham.app.ui.components.MiniPlayer
import com.vasantham.app.ui.screens.NowPlayingScreen
import com.vasantham.app.ui.theme.*
import com.vasantham.app.viewmodel.PlayerViewModel
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    private val playerViewModel: PlayerViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            VasanthamTheme {
                VasanthamApp(playerViewModel)
            }
        }
    }
}

@Composable
private fun VasanthamApp(viewModel: PlayerViewModel) {
    val playerState by viewModel.state.collectAsState()
    val navController = rememberNavController()
    val currentBackStack by navController.currentBackStackEntryAsState()
    val currentRoute = currentBackStack?.destination?.route

    var showNowPlaying by remember { mutableStateOf(false) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDeep),
    ) {
        Scaffold(
            containerColor = BgDeep,
            contentColor = BgDeep,
            bottomBar = {
                Column {
                    // Mini player above bottom nav
                    AnimatedVisibility(
                        visible = playerState.currentTrack != null,
                        enter = slideInVertically(initialOffsetY = { it }) + fadeIn(),
                        exit = slideOutVertically(targetOffsetY = { it }) + fadeOut(),
                    ) {
                        playerState.currentTrack?.let { track ->
                            MiniPlayer(
                                track = track,
                                isPlaying = playerState.isPlaying,
                                positionMs = playerState.currentPositionMs,
                                durationMs = playerState.durationMs,
                                onPlayPause = viewModel::togglePlayPause,
                                onNext = viewModel::next,
                                onPrev = viewModel::previous,
                                onClick = { showNowPlaying = true },
                                modifier = Modifier.background(BgSurface),
                            )
                        }
                    }

                    NavigationBar(
                        containerColor = BgSurface,
                        contentColor = BgSurface,
                        tonalElevation = 0.dp,
                    ) {
                        bottomNavScreens.forEach { screen ->
                            val selected = currentRoute == screen.route
                            NavigationBarItem(
                                selected = selected,
                                onClick = {
                                    if (!selected) {
                                        navController.navigate(screen.route) {
                                            popUpTo(Screen.Home.route) { saveState = true }
                                            launchSingleTop = true
                                            restoreState = true
                                        }
                                    }
                                },
                                icon = {
                                    Icon(
                                        screen.icon,
                                        contentDescription = screen.label,
                                        modifier = androidx.compose.ui.Modifier.size(if (selected) 26.dp else 22.dp),
                                    )
                                },
                                label = {
                                    Text(
                                        screen.label,
                                        fontWeight = if (selected) androidx.compose.ui.text.font.FontWeight.Bold
                                                     else androidx.compose.ui.text.font.FontWeight.Normal,
                                    )
                                },
                                colors = NavigationBarItemDefaults.colors(
                                    selectedIconColor = VioletLight,
                                    selectedTextColor = VioletLight,
                                    unselectedIconColor = TextMuted,
                                    unselectedTextColor = TextMuted,
                                    indicatorColor = VioletPrimary.copy(alpha = 0.22f),
                                ),
                            )
                        }
                    }
                }
            },
        ) { innerPadding ->
            VasanthamNavGraph(
                navController = navController,
                playerState = playerState,
                onPlay = { track, queue -> viewModel.play(track, queue) },
                onAddToQueue = { track -> viewModel.addToQueue(track) },
                modifier = Modifier.padding(innerPadding),
            )
        }

        // Full-screen Now Playing overlay
        AnimatedVisibility(
            visible = showNowPlaying && playerState.currentTrack != null,
            enter = slideInVertically(initialOffsetY = { it }),
            exit = slideOutVertically(targetOffsetY = { it }),
        ) {
            Box(modifier = Modifier.fillMaxSize().background(BgDeep)) {
                playerState.currentTrack?.let {
                    NowPlayingScreen(
                        playerState = playerState,
                        onPlayPause = viewModel::togglePlayPause,
                        onNext = viewModel::next,
                        onPrev = viewModel::previous,
                        onSeek = viewModel::seekTo,
                        onToggleShuffle = viewModel::toggleShuffle,
                        onCycleRepeat = viewModel::cycleRepeat,
                        onBack = { showNowPlaying = false },
                    )
                }
            }
        }
    }
}
