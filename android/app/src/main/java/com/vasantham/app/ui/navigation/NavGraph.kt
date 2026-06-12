package com.vasantham.app.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.LibraryMusic
import androidx.compose.material.icons.filled.Search
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.vasantham.app.data.model.Track
import com.vasantham.app.ui.screens.HomeScreen
import com.vasantham.app.ui.screens.LibraryScreen
import com.vasantham.app.ui.screens.SearchScreen
import com.vasantham.app.viewmodel.PlayerState

sealed class Screen(val route: String, val label: String, val icon: ImageVector) {
    object Home : Screen("home", "Home", Icons.Default.Home)
    object Library : Screen("library", "Library", Icons.Default.LibraryMusic)
    object Search : Screen("search", "Search", Icons.Default.Search)
}

val bottomNavScreens = listOf(Screen.Home, Screen.Library, Screen.Search)

@Composable
fun VasanthamNavGraph(
    navController: NavHostController,
    playerState: PlayerState,
    onPlay: (Track, List<Track>) -> Unit,
    onAddToQueue: (Track) -> Unit,
    modifier: androidx.compose.ui.Modifier = androidx.compose.ui.Modifier,
) {
    NavHost(navController = navController, startDestination = Screen.Home.route, modifier = modifier) {
        composable(Screen.Home.route) {
            HomeScreen(
                playerState = playerState,
                onPlay = onPlay,
                onAddToQueue = onAddToQueue,
            )
        }
        composable(Screen.Library.route) {
            LibraryScreen(
                playerState = playerState,
                onPlay = onPlay,
                onAddToQueue = onAddToQueue,
            )
        }
        composable(Screen.Search.route) {
            SearchScreen(
                playerState = playerState,
                onPlay = onPlay,
                onAddToQueue = onAddToQueue,
            )
        }
    }
}
