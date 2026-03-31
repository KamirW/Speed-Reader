// TODO: Create a splash screen component

import { useEffect, useState } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

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
            ]).start(() => {
                onFinish();
            })
        }, 2000)

        return () => {
            // Cleanup animation
            clearTimeout(timer)
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
                <Text style={splashStyles.logo}>Speed Reader</Text>
                <Text style={splashStyles.tagline}>Grow your reading speed</Text>
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
        fontSize: 50,
        fontWeight: 'bold',
        color: '#776e65',
        marginBottom: 20,
        textShadowColor: 'rgba(119, 110, 101, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    tagline: {
        fontSize: 16,
        color: '#776e65',
        opacity: 0.8,
        textAlign: 'center',
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
