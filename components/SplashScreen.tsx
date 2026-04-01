// TODO: Create a splash screen component

import { useEffect, useState } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

interface SplashScreenProps {
    onFinish: () => void;
}

export const SplashScreen = ({ onFinish }: SplashScreenProps) => {
    const [fadeAnim] = useState(new Animated.Value(0));
    const [scaleAnim] = useState(new Animated.Value(0.8));

    useEffect(() => {
        // Beginning of splash screen animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
            })
        ]).start()

        // End of splash screen animation (hold for 2 seconds, then fade out)
        const timer = setTimeout(() => {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1.2,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start((finished) => {
                onFinish();
            })
        }, 2000)

        // Fallback timer to ensure onFinish is always called
        const fallbackTimer = setTimeout(() => {
            onFinish();
        }, 3000);

        return () => {
            // Cleanup animation
            clearTimeout(timer);
            clearTimeout(fallbackTimer);
        }
    }, [fadeAnim, scaleAnim, onFinish]);

    return (
        <LinearGradient
            colors={['#1a1a2e', '#0f0f1e', '#16213e']}
            style={splashStyles.gradient}
        >
            <Animated.View style={[
                splashStyles.logoContainer,
                {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                }
            ]}>
                <Text style={splashStyles.logo}>
                    Jump
                    <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
                        <Path
                            d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                            fill="#FCD34D"
                            stroke="#FCD34D"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </Svg>
                    Read
                </Text>
                <Text style={splashStyles.tagline}>Read faster. Comprehend better.</Text>
            </Animated.View>
        </LinearGradient>
    );
};

const splashStyles = StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 20,
        textShadowColor: 'rgba(255, 255, 255, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    tagline: {
        fontSize: 16,
        color: '#ffffff',
        opacity: 0.8,
        textAlign: 'center',
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
