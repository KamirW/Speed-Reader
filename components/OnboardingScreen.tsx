import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface OnboardingScreenProps {
  onFinish: () => void;
}

export function OnboardingScreen({ onFinish }: OnboardingScreenProps) {
  const [currentScreen, setCurrentScreen] = useState(0);

  const screens = [
    {
      title: "Welcome to Jump Read",
      subtitle: "Transform your reading experience",
      description: "Read faster, comprehend better, and save time with our revolutionary speed reading technology.",
      icon: "🚀",
      color: ["#667eea", "#764ba2"] as const
    },
    {
      title: "Double Your Reading Speed",
      subtitle: "From 200 WPM to 400+ WPM",
      description: "Most people read at 200-250 WPM. With Jump Read, you can easily reach 400-600 WPM while maintaining comprehension.",
      icon: "⚡",
      color: ["#f093fb", "#f5576c"] as const
    },
    {
      title: "How It Works",
      subtitle: "The science of rapid serial visual presentation",
      description: "We display one word at a time at an optimal position, eliminating eye movement and increasing focus.",
      icon: "🧠",
      color: ["#4facfe", "#00f2fe"] as const
    },
    {
      title: "Track Your Progress",
      subtitle: "Watch your reading skills improve",
      description: "Monitor your reading speed, comprehension, and reading habits with detailed statistics and achievements.",
      icon: "📊",
      color: ["#43e97b", "#38f9d7"] as const
    },
    {
      title: "Ready to Begin?",
      subtitle: "Join thousands of speed readers",
      description: "Start with our free library or upload your own text files. Your reading journey starts now!",
      icon: "🎯",
      color: ["#fa709a", "#fee140"] as const
    }
  ];

  const handleNext = () => {
    console.log('Next button pressed, current screen:', currentScreen);
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      console.log('Calling onFinish from Next button');
      onFinish();
    }
  };

  const handleSkip = () => {
    console.log('Skip button pressed');
    console.log('Calling onFinish from Skip button');
    onFinish();
  };

  const handleDotPress = (index: number) => {
    setCurrentScreen(index);
  };

  const currentScreenData = screens[currentScreen];

  return (
    <LinearGradient colors={currentScreenData.color} style={styles.container}>
      <View style={styles.content}>
        {/* Skip Button */}
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip} activeOpacity={0.7}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.icon}>{currentScreenData.icon}</Text>
          <Text style={styles.title}>{currentScreenData.title}</Text>
          <Text style={styles.subtitle}>{currentScreenData.subtitle}</Text>
          <Text style={styles.description}>{currentScreenData.description}</Text>
        </View>

        {/* Progress Dots */}
        <View style={styles.dotsContainer}>
          {screens.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dot,
                index === currentScreen && styles.dotActive
              ]}
              onPress={() => handleDotPress(index)}
              activeOpacity={0.7}
            />
          ))}
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.8}>
          <Text style={styles.nextButtonText}>
            {currentScreen === screens.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 40,
  },
  skipButton: {
    alignSelf: 'flex-end',
    marginBottom: 40,
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 60,
    alignItems: 'center',
  },
  skipButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 80,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 6,
  },
  dotActive: {
    backgroundColor: '#ffffff',
    width: 24,
  },
  nextButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
