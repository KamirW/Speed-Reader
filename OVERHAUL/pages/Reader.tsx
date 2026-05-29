import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Settings2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { chapters } from '../data/books';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Reader'>;
type Route = RouteProp<RootStackParamList, 'Reader'>;

export function ReaderScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const insets = useSafeAreaInsets();
  const { chapterId } = route.params;

  const chapter = chapters.find(c => c.id === chapterId);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wpm, setWpm] = useState(250);
  const [showSettings, setShowSettings] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  if (!chapter) {
    return (
      <LinearGradient colors={['#0f172a', '#4a1d96', '#0f172a']} style={styles.centered}>
        <Text style={{ color: '#ffffff' }}>Chapter not found</Text>
      </LinearGradient>
    );
  }

  const words = chapter.content.split(/\s+/);
  const progressPercent = ((currentWordIndex + 1) / words.length) * 100;
  const prevWords = words.slice(Math.max(0, currentWordIndex - 5), currentWordIndex).join(' ');
  const nextWords = words.slice(currentWordIndex + 1, currentWordIndex + 6).join(' ');

  useEffect(() => {
    if (isPlaying) {
      const ms = 60000 / wpm;
      intervalRef.current = setInterval(() => {
        setCurrentWordIndex(prev => {
          if (prev >= words.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, ms);
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [isPlaying, wpm, words.length]);

  return (
    <LinearGradient colors={['#0f172a', '#4a1d96', '#0f172a']} style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft color="#ffffff" size={24} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.chapterLabel}>{chapter.title}</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` as any }]} />
            </View>
            <Text style={styles.progressCount}>{currentWordIndex + 1}/{words.length}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setShowSettings(s => !s)}>
          <Settings2 color="#ffffff" size={24} />
        </TouchableOpacity>
      </View>

      {/* Settings panel */}
      {showSettings && (
        <View style={styles.settingsPanel}>
          <Text style={styles.settingsTitle}>Reading Speed</Text>
          <View style={styles.speedRow}>
            <Text style={styles.speedHint}>Slower</Text>
            <Text style={styles.speedValue}>{wpm} WPM</Text>
            <Text style={styles.speedHint}>Faster</Text>
          </View>
          <Slider
            minimumValue={100}
            maximumValue={1000}
            step={50}
            value={wpm}
            onValueChange={setWpm}
            minimumTrackTintColor="#a855f7"
            maximumTrackTintColor="rgba(255,255,255,0.2)"
            thumbTintColor="#ffffff"
          />
          <View style={styles.speedMarkers}>
            {['100', '300', '500', '1000'].map(m => (
              <Text key={m} style={styles.speedMarker}>{m}</Text>
            ))}
          </View>
        </View>
      )}

      {/* Word display */}
      <View style={styles.wordArea}>
        {currentWordIndex > 0 && (
          <Text style={styles.contextText} numberOfLines={1}>...{prevWords}</Text>
        )}
        <View style={styles.wordBox}>
          <Text style={styles.word} adjustsFontSizeToFit numberOfLines={1}>
            {words[currentWordIndex]}
          </Text>
        </View>
        {currentWordIndex < words.length - 1 && (
          <Text style={styles.contextText} numberOfLines={1}>{nextWords}...</Text>
        )}
      </View>

      {/* Controls */}
      <View style={[styles.controls, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setCurrentWordIndex(p => Math.max(p - 10, 0))}
          >
            <SkipBack color="#ffffff" size={24} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => { setIsPlaying(false); setCurrentWordIndex(0); }}
          >
            <SkipBack color="#ffffff" size={24} fill="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.playBtn} onPress={() => setIsPlaying(p => !p)}>
            {isPlaying
              ? <Pause color="#1e293b" size={28} />
              : <Play color="#1e293b" size={28} fill="#1e293b" />
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setCurrentWordIndex(p => Math.min(p + 10, words.length - 1))}
          >
            <SkipForward color="#ffffff" size={24} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => { setIsPlaying(false); setCurrentWordIndex(words.length - 1); }}
          >
            <SkipForward color="#ffffff" size={24} fill="#ffffff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.statusText}>{isPlaying ? 'Reading...' : 'Paused'}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    gap: 8,
  },
  headerCenter: { flex: 1 },
  chapterLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#a855f7', borderRadius: 2 },
  progressCount: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  settingsPanel: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  settingsTitle: { color: '#ffffff', fontSize: 16, fontWeight: '600', marginBottom: 12 },
  speedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  speedHint: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  speedValue: { color: '#ffffff', fontSize: 20, fontWeight: '700' },
  speedMarkers: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  speedMarker: { color: 'rgba(255,255,255,0.4)', fontSize: 11 },
  wordArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 20,
  },
  contextText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 15,
    textAlign: 'center',
  },
  wordBox: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 48,
    paddingVertical: 36,
    minWidth: 240,
    alignItems: 'center',
  },
  word: {
    color: '#ffffff',
    fontSize: 56,
    fontWeight: '700',
    textAlign: 'center',
  },
  controls: { paddingHorizontal: 32, paddingTop: 20, alignItems: 'center' },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  statusText: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
});
