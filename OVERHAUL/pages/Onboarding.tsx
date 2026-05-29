import { useNavigation } from "@react-navigation/native";
import { ArrowRight, BookOpen, Target, Zap } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { JumpReadLogo } from "OVERHAUL/components/JumpReadLogo";
import * as SecureStore from 'expo-secure-store';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const slides = [
  {
    Icon: BookOpen,
    title: 'Read Faster',
    description: 'Train your brain to read at lightning speed with our unique word-by-word reading method.',
    color: '#60a5fa',
  },
  {
    Icon: Zap,
    title: 'Stay Focused',
    description: 'Eliminate distractions and improve comprehension by focusing on one word at a time.',
    color: '#facc15',
  },
  {
    Icon: Target,
    title: 'Track Progress',
    description: 'Monitor your reading speed and track your progress across all your favorite books.',
    color: '#4ade80',
  },
];

export function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { Icon, title, description, color } = slides[currentSlide];

  const goHome = async () => {
    try {
      await SecureStore.setItemAsync('onboarding_complete', 'true');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
    navigation.replace('MainTabs');
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      goHome();
    }
  };

  return (
    <LinearGradient colors={['#0f172a', '#4a1d96', '#0f172a']} style={ styles.container }>
      <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
        <View style={styles.brand}>
          <JumpReadLogo />
          <Text style={styles.brandName}>Jump Read</Text>
        </View>

        {/* Skip Button */}
        <TouchableOpacity onPress={goHome}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Icon size={120} color={color} strokeWidth={1.5} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i === currentSlide ? styles.dotActive : styles.dotInactive]} />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <ArrowRight size={20} color="#1e293b" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandName: { color: '#ffffff', fontSize: 20, fontWeight: '700' },
  skipText: { color: 'rgba(255,255,255,0.7)', fontSize: 16 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 80,
    gap: 0,
  },
  title: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 16,
  },
  description: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 48,
  },
  dots: { flexDirection: 'row', gap: 8, marginBottom: 48 },
  dot: { height: 8, borderRadius: 4 },
  dotActive: { width: 32, backgroundColor: '#ffffff' },
  dotInactive: { width: 8, backgroundColor: 'rgba(255,255,255,0.3)' },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 50,
  },
  buttonText: { color: '#1e293b', fontSize: 16, fontWeight: '600' },
})
