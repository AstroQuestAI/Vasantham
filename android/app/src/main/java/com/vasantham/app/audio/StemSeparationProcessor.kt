package com.vasantham.app.audio

import androidx.media3.common.C
import androidx.media3.common.audio.AudioProcessor
import java.nio.ByteBuffer
import java.nio.ByteOrder
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Real-time audio DSP processor using mid-side (M/S) technique.
 *
 * In a typical stereo mix, centre-panned content (lead vocals, kick drum) is equal in L and R.
 * Mid  = (L + R) / 2  →  centre channel (mostly vocals)
 * Side = (L − R) / 2  →  stereo sides  (mostly instruments, reverb, backing)
 *
 * Modes:
 *   KARAOKE / INSTRUMENTAL  →  output the Side signal (vocal reduction)
 *   VOCAL                   →  output the Mid signal (instrument reduction)
 *   others                  →  pass-through
 */
@Singleton
class StemSeparationProcessor @Inject constructor() : AudioProcessor {

    @Volatile
    var mode: AudioMode = AudioMode.NORMAL

    private var currentFormat = AudioProcessor.AudioFormat.NOT_SET
    private var pendingOutput: ByteBuffer = AudioProcessor.EMPTY_BUFFER
    private var inputEnded = false

    override fun configure(inputAudioFormat: AudioProcessor.AudioFormat): AudioProcessor.AudioFormat {
        return if (inputAudioFormat.channelCount == 2 &&
            inputAudioFormat.encoding == C.ENCODING_PCM_16BIT
        ) {
            currentFormat = inputAudioFormat
            inputAudioFormat
        } else {
            currentFormat = AudioProcessor.AudioFormat.NOT_SET
            AudioProcessor.AudioFormat.NOT_SET
        }
    }

    override fun isActive(): Boolean = currentFormat != AudioProcessor.AudioFormat.NOT_SET

    override fun queueInput(inputBuffer: ByteBuffer) {
        val remaining = inputBuffer.remaining()
        if (remaining == 0) return

        val currentMode = mode  // snapshot to avoid race mid-buffer
        val frameCount = remaining / 4  // stereo 16-bit: 2 ch × 2 bytes = 4 bytes/frame

        val outBuf = ByteBuffer.allocateDirect(frameCount * 4)
            .order(ByteOrder.nativeOrder())

        val inView = inputBuffer.duplicate().order(ByteOrder.nativeOrder())

        repeat(frameCount) {
            val l = inView.short.toInt()   // signed 16-bit, little-endian on ARM
            val r = inView.short.toInt()

            val (outL, outR) = when (currentMode) {
                AudioMode.KARAOKE, AudioMode.INSTRUMENTAL -> {
                    // Side channel — removes centre content (mostly vocals)
                    val side = ((l - r) shr 1).coerceIn(-32768, 32767)
                    side to side
                }
                AudioMode.VOCAL -> {
                    // Mid channel — keeps only centre content (mostly vocals)
                    val mid = ((l + r) shr 1).coerceIn(-32768, 32767)
                    mid to mid
                }
                else -> l to r  // NORMAL / PIANO / SWARA → pass through
            }

            outBuf.putShort(outL.toShort())
            outBuf.putShort(outR.toShort())
        }

        inputBuffer.position(inputBuffer.limit())   // mark all input consumed
        outBuf.flip()
        pendingOutput = outBuf
    }

    override fun queueEndOfStream() {
        inputEnded = true
    }

    override fun getOutput(): ByteBuffer {
        val out = pendingOutput
        pendingOutput = AudioProcessor.EMPTY_BUFFER
        return out
    }

    override fun isEnded(): Boolean = inputEnded && pendingOutput === AudioProcessor.EMPTY_BUFFER

    override fun flush() {
        pendingOutput = AudioProcessor.EMPTY_BUFFER
        inputEnded = false
    }

    override fun reset() {
        currentFormat = AudioProcessor.AudioFormat.NOT_SET
        flush()
    }
}
