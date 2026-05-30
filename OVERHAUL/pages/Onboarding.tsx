import { useNavigation } from "@react-navigation/native";
import { ArrowRight, BookOpen, Target, Zap } from "lucide-react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { JumpReadLogo } from "OVERHAUL/components/JumpReadLogo";
import * as SecureStore from 'expo-secure-store';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const { width, height } = Dimensions.get("window");
const minDim = Math.min(width, height);
const isTablet = minDim >= 600;

// Dynamic size calculations - responsive based on device type
const iconSize = minDim * (isTablet ? 0.25 : 0.35);
const titleFontSize = minDim * (isTablet ? 0.06 : 0.08);
const descriptionFontSize = minDim * (isTablet ? 0.03 : 0.04);
const brandFontSize = minDim * (isTablet ? 0.035 : 0.045);
const skipFontSize = minDim * (isTablet ? 0.028 : 0.035);
const buttonFontSize = minDim * (isTablet ? 0.028 : 0.035);
const buttonPaddingV = minDim * (isTablet ? 0.025 : 0.03);
const buttonPaddingH = minDim * (isTablet ? 0.07 : 0.09);
const dotHeight = minDim * (isTablet ? 0.015 : 0.02);
const dotActiveWidth = minDim * (isTablet ? 0.06 : 0.08);
const dotInactiveWidth = minDim * (isTablet ? 0.015 : 0.02);
const paddingH = minDim * (isTablet ? 0.05 : 0.06);
const contentPaddingH = minDim * (isTablet ? 0.07 : 0.08);
const gap = minDim * (isTablet ? 0.015 : 0.02);

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
        <Icon size={iconSize} color={color} strokeWidth={1.5} />
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
    paddingHorizontal: paddingH,
    paddingBottom: minDim * 0.02,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: gap },
  brandName: { color: '#ffffff', fontSize: brandFontSize, fontWeight: '700' },
  skipText: { color: 'rgba(255,255,255,0.7)', fontSize: skipFontSize },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: contentPaddingH,
    paddingBottom: minDim * 0.15,
    gap: 0,
  },
  title: {
    color: '#ffffff',
    fontSize: titleFontSize,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: minDim * 0.07,
    marginBottom: minDim * 0.03,
  },
  description: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: descriptionFontSize,
    textAlign: 'center',
    lineHeight: descriptionFontSize * 1.6,
    marginBottom: minDim * 0.09,
  },
  dots: { flexDirection: 'row', gap: gap, marginBottom: minDim * 0.09 },
  dot: { height: dotHeight, borderRadius: dotHeight / 2 },
  dotActive: { width: dotActiveWidth, backgroundColor: '#ffffff' },
  dotInactive: { width: dotInactiveWidth, backgroundColor: 'rgba(255,255,255,0.3)' },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: gap,
    backgroundColor: '#ffffff',
    paddingVertical: buttonPaddingV,
    paddingHorizontal: buttonPaddingH,
    borderRadius: buttonPaddingV * 3.5,
  },
  buttonText: { color: '#1e293b', fontSize: buttonFontSize, fontWeight: '600' },
})
