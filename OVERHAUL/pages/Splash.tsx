import { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { JumpReadLogo } from "../components/JumpReadLogo";
import * as SecureStore from "expo-secure-store";

const DURATION = 2800;
const ONBOARDING_COMPLETE_KEY = 'onboarding_complete';
const { width, height } = Dimensions.get("window");
const minDim = Math.min(width, height);
const isTablet = minDim >= 600;

// Dynamic size calculations - responsive based on device type
const logoSize = minDim * (isTablet ? 0.20 : 0.28);
const glowRingSize = logoSize * 1.33;
const glowOffset = -(glowRingSize - logoSize) / 2;
const titleFontSize = minDim * (isTablet ? 0.07 : 0.09);
const taglineFontSize = minDim * (isTablet ? 0.025 : 0.035);
const badgeFontSize = minDim * (isTablet ? 0.02 : 0.028);
const orb1Size = minDim * (isTablet ? 0.6 : 0.7);
const orb2Size = minDim * (isTablet ? 0.5 : 0.6);
const progressBarWidth = minDim * (isTablet ? 0.4 : 0.5);
const particleBaseSize = minDim * (isTablet ? 0.01 : 0.015);

export function Splash() {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [nextRoute, setNextRoute] = useState<string>("Onboarding");

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        // ******* DEV SETTING - COMMENT OUT FOR PRODUCTION *******
        await SecureStore.setItemAsync(ONBOARDING_COMPLETE_KEY, 'false');
        // ********************************************************

        const value = await SecureStore.getItemAsync(ONBOARDING_COMPLETE_KEY);
        setNextRoute(value === 'true' ? "MainTabs" : "Onboarding");
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setNextRoute("Onboarding");
      }
    };
    checkOnboardingStatus();
  }, []);

  // Animated values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0.4)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoY = useRef(new Animated.Value(20)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(16)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineY = useRef(new Animated.Value(10)).current;
  const progressOpacity = useRef(new Animated.Value(0)).current;
  const badgeOpacity = useRef(new Animated.Value(0)).current;

  // Orb animations
  const orb1Scale = useRef(new Animated.Value(1)).current;
  const orb1Opacity = useRef(new Animated.Value(0.6)).current;
  const orb2Scale = useRef(new Animated.Value(1)).current;
  const orb2Opacity = useRef(new Animated.Value(0.5)).current;

  // Glow animation
  const glowScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.6)).current;

  // Particle animations
  const particles = [
    { x: width * 0.15, y: height * 0.2, size: particleBaseSize * 1.2, delay: 0 },
    { x: width * 0.8, y: height * 0.15, size: particleBaseSize * 0.9, delay: 0.6 },
    { x: width * 0.25, y: height * 0.75, size: particleBaseSize * 1.5, delay: 1.1 },
    { x: width * 0.75, y: height * 0.7, size: particleBaseSize * 0.9, delay: 0.3 },
    { x: width * 0.55, y: height * 0.85, size: particleBaseSize * 1.2, delay: 0.9 },
    { x: width * 0.1, y: height * 0.55, size: particleBaseSize * 0.9, delay: 1.4 },
  ];

  const particleAnims = particles.map(() => ({
    opacity: useRef(new Animated.Value(0.1)).current,
    y: useRef(new Animated.Value(0)).current,
  }));

  useEffect(() => {
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(elapsed / DURATION, 1);
      setProgress(pct);
      if (pct < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setDone(true);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 200,
        friction: 18,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 500,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(logoY, {
        toValue: 0,
        duration: 500,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 700,
        delay: 550,
        useNativeDriver: true,
      }),
      Animated.timing(titleY, {
        toValue: 0,
        duration: 700,
        delay: 550,
        useNativeDriver: true,
      }),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 600,
        delay: 850,
        useNativeDriver: true,
      }),
      Animated.timing(taglineY, {
        toValue: 0,
        duration: 600,
        delay: 850,
        useNativeDriver: true,
      }),
      Animated.timing(progressOpacity, {
        toValue: 1,
        duration: 500,
        delay: 600,
        useNativeDriver: true,
      }),
      Animated.timing(badgeOpacity, {
        toValue: 1,
        duration: 500,
        delay: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Orb animations
    const animateOrbs = () => {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(orb1Scale, { toValue: 1.15, duration: 2000, useNativeDriver: true }),
          Animated.timing(orb1Scale, { toValue: 1, duration: 2000, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(orb1Opacity, { toValue: 1, duration: 2000, useNativeDriver: true }),
          Animated.timing(orb1Opacity, { toValue: 0.6, duration: 2000, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(orb2Scale, { toValue: 1.2, duration: 2250, useNativeDriver: true }),
          Animated.timing(orb2Scale, { toValue: 1, duration: 2250, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(orb2Opacity, { toValue: 0.9, duration: 2250, useNativeDriver: true }),
          Animated.timing(orb2Opacity, { toValue: 0.5, duration: 2250, useNativeDriver: true }),
        ]),
      ]).start(() => animateOrbs());
    };
    animateOrbs();

    // Glow animation
    const animateGlow = () => {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(glowScale, { toValue: 1.08, duration: 1250, useNativeDriver: true }),
          Animated.timing(glowScale, { toValue: 1, duration: 1250, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(glowOpacity, { toValue: 1, duration: 1250, useNativeDriver: true }),
          Animated.timing(glowOpacity, { toValue: 0.6, duration: 1250, useNativeDriver: true }),
        ]),
      ]).start(() => animateGlow());
    };
    animateGlow();

    // Particle animations
    particleAnims.forEach((anim, i) => {
      const animateParticle = () => {
        Animated.parallel([
          Animated.sequence([
            Animated.timing(anim.opacity, { toValue: 0.5, duration: 1500 + i * 200, useNativeDriver: true }),
            Animated.timing(anim.opacity, { toValue: 0.1, duration: 1500 + i * 200, useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(anim.y, { toValue: -12, duration: 1500 + i * 200, useNativeDriver: true }),
            Animated.timing(anim.y, { toValue: 0, duration: 1500 + i * 200, useNativeDriver: true }),
          ]),
        ]).start(() => animateParticle());
      };
      setTimeout(animateParticle, particles[i].delay * 1000);
    });
  }, []);

  useEffect(() => {
    if (done) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        navigation.navigate(nextRoute as never);
      });
    }
  }, [done, navigation, fadeAnim, nextRoute]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Background gradient */}
      <LinearGradient
        colors={['#0f172a', '#1e1040', '#0c1445']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Animated background orbs */}
      <Animated.View
        style={[
          styles.orb,
          {
            width: orb1Size,
            height: orb1Size,
            top: -orb1Size * 0.24,
            left: -orb1Size * 0.24,
            opacity: orb1Opacity,
            transform: [{ scale: orb1Scale }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.orb,
          {
            width: orb2Size,
            height: orb2Size,
            bottom: -orb2Size * 0.2,
            right: -orb2Size * 0.2,
            opacity: orb2Opacity,
            transform: [{ scale: orb2Scale }],
          },
        ]}
      />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <Animated.View
          key={i}
          style={[
            styles.particle,
            {
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              opacity: particleAnims[i].opacity,
              transform: [{ translateY: particleAnims[i].y }],
            },
          ]}
        />
      ))}

      {/* Main content */}
      <View style={styles.content}>
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }, { translateY: logoY }],
            },
          ]}
        >
          {/* Glow ring behind logo */}
          <Animated.View
            style={[
              styles.glowRing,
              {
                opacity: glowOpacity,
                transform: [{ scale: glowScale }],
              },
            ]}
          />
          <JumpReadLogo size={logoSize} />
        </Animated.View>

        {/* App name */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: titleOpacity,
              transform: [{ translateY: titleY }],
            },
          ]}
        >
          <Text style={styles.title}>
            Jump
            <Text style={styles.titleGradient}>Read</Text>
          </Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.View
          style={[
            styles.taglineContainer,
            {
              opacity: taglineOpacity,
              transform: [{ translateY: taglineY }],
            },
          ]}
        >
          <Text style={styles.tagline}>SPEED READ ANYTHING</Text>
        </Animated.View>

        {/* Progress bar */}
        <Animated.View style={[styles.progressContainer, { opacity: progressOpacity }]}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </Animated.View>
      </View>

      {/* Bottom badge */}
      <Animated.View style={[styles.badge, { opacity: badgeOpacity }]}>
        <Text style={styles.badgeText}>READ FASTER · THINK DEEPER</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  orb: {
    position: 'absolute',
    borderRadius: 250,
    backgroundColor: 'rgba(124,58,237,0.18)',
  },
  particle: {
    position: 'absolute',
    borderRadius: 2.5,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logoContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: glowRingSize,
    height: glowRingSize,
    borderRadius: glowRingSize * 0.19,
    backgroundColor: 'rgba(167,139,250,0.4)',
    top: glowOffset,
    left: glowOffset,
  },
  titleContainer: {
    marginBottom: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: titleFontSize,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  titleGradient: {
    marginLeft: 8,
    color: '#a78bfa',
  },
  taglineContainer: {
    marginBottom: 64,
  },
  tagline: {
    fontSize: taglineFontSize,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1.5,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: progressBarWidth,
    height: minDim * 0.01,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#a78bfa',
  },
  badge: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  badgeText: {
    fontSize: badgeFontSize,
    color: 'rgba(255,255,255,0.2)',
    letterSpacing: 3,
  },
});
