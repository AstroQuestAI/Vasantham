package com.vasantham.app.viewmodel

import android.app.Application
import android.content.ComponentName
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import androidx.media3.common.MediaItem
import androidx.media3.common.MediaMetadata
import androidx.media3.common.Player
import androidx.media3.session.MediaController
import androidx.media3.session.SessionToken
import com.google.common.util.concurrent.MoreExecutors
import com.vasantham.app.audio.AudioMode
import com.vasantham.app.audio.StemSeparationProcessor
import com.vasantham.app.data.model.Track
import com.vasantham.app.data.repository.MediaRepository
import com.vasantham.app.data.sampleTracks
import com.vasantham.app.service.MusicService
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class PlayerState(
    val currentTrack: Track? = null,
    val isPlaying: Boolean = false,
    val currentPositionMs: Long = 0L,
    val durationMs: Long = 0L,
    val queue: List<Track> = emptyList(),
    val queueIndex: Int = 0,
    val isShuffled: Boolean = false,
    val repeatMode: Int = Player.REPEAT_MODE_OFF,
    val isConnected: Boolean = false,
    val audioMode: AudioMode = AudioMode.NORMAL,
)

@HiltViewModel
class PlayerViewModel @Inject constructor(
    application: Application,
    private val repository: MediaRepository,
    private val stemProcessor: StemSeparationProcessor,
) : AndroidViewModel(application) {

    private val _state = MutableStateFlow(PlayerState())
    val state: StateFlow<PlayerState> = _state.asStateFlow()

    private var controller: MediaController? = null

    private val positionJob = viewModelScope.launch {
        while (true) {
            controller?.let { c ->
                _state.update { it.copy(currentPositionMs = c.currentPosition) }
            }
            kotlinx.coroutines.delay(500)
        }
    }

    init {
        connectToService()
    }

    private fun connectToService() {
        val ctx = getApplication<Application>()
        val sessionToken = SessionToken(ctx, ComponentName(ctx, MusicService::class.java))
        val future = MediaController.Builder(ctx, sessionToken).buildAsync()
        future.addListener({
            controller = future.get().also { c ->
                _state.update { it.copy(isConnected = true) }
                c.addListener(playerListener)
            }
        }, MoreExecutors.directExecutor())
    }

    private val playerListener = object : Player.Listener {
        override fun onPlaybackStateChanged(playbackState: Int) = syncState()
        override fun onIsPlayingChanged(isPlaying: Boolean) = syncState()
        override fun onMediaItemTransition(mediaItem: MediaItem?, reason: Int) = syncState()
        override fun onShuffleModeEnabledChanged(shuffleModeEnabled: Boolean) = syncState()
        override fun onRepeatModeChanged(repeatMode: Int) = syncState()
    }

    private fun syncState() {
        val c = controller ?: return
        val trackId = c.currentMediaItem?.mediaId
        val track = sampleTracks.firstOrNull { it.id == trackId } ?: _state.value.currentTrack
        _state.update {
            it.copy(
                currentTrack = track,
                isPlaying = c.isPlaying,
                durationMs = if (c.duration == androidx.media3.common.C.TIME_UNSET) 0L else c.duration,
                isShuffled = c.shuffleModeEnabled,
                repeatMode = c.repeatMode,
            )
        }
    }

    fun play(track: Track, queue: List<Track> = listOf(track)) {
        val c = controller ?: return
        val items = queue.map { t ->
            MediaItem.Builder()
                .setMediaId(t.id)
                .setUri(t.audioUrl ?: t.videoUrl ?: "")
                .setMediaMetadata(
                    MediaMetadata.Builder()
                        .setTitle(t.title)
                        .setArtist(t.artist)
                        .setAlbumTitle(t.album)
                        .setArtworkUri(t.coverUrl.toUri())
                        .build()
                )
                .build()
        }
        val startIndex = queue.indexOfFirst { it.id == track.id }.coerceAtLeast(0)
        c.setMediaItems(items, startIndex, 0L)
        c.prepare()
        c.play()
        _state.update { it.copy(currentTrack = track, queue = queue, queueIndex = startIndex) }
    }

    fun togglePlayPause() {
        val c = controller ?: return
        if (c.isPlaying) c.pause() else c.play()
    }

    fun next() = controller?.seekToNextMediaItem()

    fun previous() {
        val c = controller ?: return
        if (c.currentPosition > 3_000L) c.seekTo(0L) else c.seekToPreviousMediaItem()
    }

    fun seekTo(posMs: Long) = controller?.seekTo(posMs)

    fun toggleShuffle() {
        val c = controller ?: return
        c.shuffleModeEnabled = !c.shuffleModeEnabled
    }

    fun cycleRepeat() {
        val c = controller ?: return
        c.repeatMode = when (c.repeatMode) {
            Player.REPEAT_MODE_OFF -> Player.REPEAT_MODE_ALL
            Player.REPEAT_MODE_ALL -> Player.REPEAT_MODE_ONE
            else -> Player.REPEAT_MODE_OFF
        }
    }

    fun addToQueue(track: Track) {
        val c = controller ?: return
        val item = MediaItem.Builder()
            .setMediaId(track.id)
            .setUri(track.audioUrl ?: "")
            .setMediaMetadata(
                MediaMetadata.Builder()
                    .setTitle(track.title)
                    .setArtist(track.artist)
                    .build()
            )
            .build()
        c.addMediaItem(item)
        _state.update { it.copy(queue = it.queue + track) }
    }

    fun setAudioMode(mode: AudioMode) {
        stemProcessor.mode = mode
        _state.update { it.copy(audioMode = mode) }
    }

    override fun onCleared() {
        positionJob.cancel()
        controller?.release()
        super.onCleared()
    }
}

private fun String.toUri(): android.net.Uri = android.net.Uri.parse(this)
