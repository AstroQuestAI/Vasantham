# Media3 / ExoPlayer
-keep class com.google.android.exoplayer2.** { *; }
-keep class androidx.media3.** { *; }

# Hilt
-keep class dagger.hilt.** { *; }
-keep @dagger.hilt.android.HiltAndroidApp class *
-keep @dagger.hilt.android.lifecycle.HiltViewModel class *

# Coil
-keep class coil.** { *; }

# Kotlin serialization (if added later)
-keepattributes *Annotation*, InnerClasses
-dontnote kotlinx.serialization.AnnotationsKt

# Keep data classes
-keepclassmembers class com.vasantham.app.data.model.** { *; }
