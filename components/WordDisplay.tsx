import { useRef, useEffect } from "react";
import { Animated, View, StyleSheet, Text } from "react-native";

interface WordDisplayProps {
  word: string;
  isAnimating: boolean;
}

export const WordDisplay: React.FC<WordDisplayProps> = ({ word, isAnimating }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (isAnimating && word) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (!word) {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [word, isAnimating]);

  // Get the index of the center character
  const getCenterCharIndex = () => {
    return Math.floor(word.length / 2);
  };

  // Render the word with the center character highlighted
  const renderWordWithHighlight = () => {
    const centerIndex = getCenterCharIndex();
    const beforeCenter = word.slice(0, centerIndex);
    const centerChar = word[centerIndex];
    const afterCenter = word.slice(centerIndex + 1);

    return (
      <Animated.Text style={[styles.wordText, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.wordNormal}>{beforeCenter}</Text>
        <Text style={styles.wordCenter}>{centerChar}</Text>
        <Text style={styles.wordNormal}>{afterCenter}</Text>
      </Animated.Text>
    );
  };

  // Render the word display
  return (
    <View style={styles.wordContainer}>
      {renderWordWithHighlight()}
    </View>
  );
};

const styles = StyleSheet.create({
    wordContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordText: {
    fontSize: 42,
    fontWeight: '300',
    color: '#ffffff',
    letterSpacing: 1,
  },
  wordNormal: {
    color: '#ffffff',
  },
  wordCenter: {
    color: '#ff4757',
    fontWeight: '600',
  },
})