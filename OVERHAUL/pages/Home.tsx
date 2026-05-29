import { ScrollView, View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, Clock, TrendingUp, Zap, Sparkles } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JumpReadLogo } from '../components/JumpReadLogo';
import { books } from '../data/books';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
    const navigation = useNavigation<Nav>();
    const insets = useSafeAreaInsets();

    const recentBooks = books.filter(b => b.progress > 0 && b.progress < 100).slice(0, 2);
    const unreadBooks = books.filter(b => b.progress === 0).slice(0, 4);
    const totalBooksRead = books.filter(b => b.progress === 100).length;
    const currentlyReading = books.filter(b => b.progress > 0 && b.progress < 100).length;

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <LinearGradient
                    colors={['#9333ea', '#2563eb']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.header, { paddingTop: insets.top + 16 }]}
                >
                    <View style={styles.brandRow}>
                        <JumpReadLogo size={40} />
                        <Text style={styles.brandName}>Jump Read</Text>
                    </View>
                    <Text style={styles.subtitle}>Ready to accelerate your reading?</Text>
                </LinearGradient>
                {/* Stats */}
                <View style={styles.statsRow}>
                    {[
                        { Icon: BookOpen, value: totalBooksRead, label: 'Completed', color: '#9333ea' },
                        { Icon: Clock, value: currentlyReading, label: 'Reading', color: '#2563eb' },
                        { Icon: TrendingUp, value: 320, label: 'WPM', color: '#16a34a' },
                    ].map(({ Icon, value, label, color }) => (
                        <View key={label} style={styles.statCard}>
                            <Icon color={color} size={22} />
                            <Text style={styles.statNumber}>{value}</Text>
                            <Text style={styles.statLabel}>{label}</Text>
                        </View>
                    ))}
                </View>

                {/* Continue Reading */}
                {recentBooks.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Zap color="#eab308" size={20} />
                            <Text style={styles.sectionTitle}>Continue Reading</Text>
                        </View>
                        {recentBooks.map(book => (
                            <TouchableOpacity
                                key={book.id}
                                style={styles.continueCard}
                                onPress={() => navigation.navigate('ChapterList', { bookId: book.id })}
                                activeOpacity={0.8}
                            >
                                <Image source={{ uri: book.cover }} style={styles.continueImage} />
                                <View style={styles.continueInfo}>
                                    <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
                                    <Text style={styles.bookAuthor}>{book.author}</Text>
                                    <View style={styles.progressTrack}>
                                        <View style={[styles.progressFill, { width: `${book.progress}%` as any }]} />
                                    </View>
                                    <Text style={styles.progressText}>{book.progress}% complete</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Recommended */}
                {unreadBooks.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Sparkles color="#a855f7" size={20} />
                            <Text style={styles.sectionTitle}>Recommended for You</Text>
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.recList}
                        >
                            {unreadBooks.map(book => (
                                <TouchableOpacity
                                    key={book.id}
                                    style={styles.recCard}
                                    onPress={() => navigation.navigate('ChapterList', { bookId: book.id })}
                                    activeOpacity={0.85}
                                >
                                    <View>
                                        <Image source={{ uri: book.cover }} style={styles.recImage} />
                                        <View style={styles.genrePill}>
                                            <Text style={styles.genreText}>{book.genre}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.recTitle} numberOfLines={2}>{book.title}</Text>
                                    <Text style={styles.recAuthor} numberOfLines={1}>{book.author}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { paddingHorizontal: 24, paddingBottom: 64 },
    brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
    brandName: { color: '#ffffff', fontSize: 24, fontWeight: '700' },
    subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 15 },
    scroll: { paddingBottom: 24 },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginHorizontal: 20,
        marginTop: -44,
        marginBottom: 28,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 14,
        padding: 14,
        alignItems: 'center',
        gap: 6,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    statNumber: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
    statLabel: { fontSize: 11, color: '#64748b' },
    section: { marginBottom: 28 },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 14,
        paddingHorizontal: 20,
    },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#0f172a' },
    continueCard: {
        flexDirection: 'row',
        gap: 16,
        backgroundColor: '#ffffff',
        borderRadius: 14,
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    continueImage: { width: 72, height: 104, borderRadius: 8 },
    continueInfo: { flex: 1 },
    bookTitle: { fontSize: 15, fontWeight: '600', color: '#0f172a', marginBottom: 4 },
    bookAuthor: { fontSize: 13, color: '#64748b', marginBottom: 12 },
    progressTrack: {
        height: 6,
        backgroundColor: '#e2e8f0',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 6,
    },
    progressFill: { height: '100%', backgroundColor: '#9333ea', borderRadius: 3 },
    progressText: { fontSize: 11, color: '#94a3b8' },
    recList: { paddingHorizontal: 20, gap: 14 },
    recCard: { width: 140 },
    recImage: { width: 140, height: 206, borderRadius: 12, marginBottom: 10 },
    genrePill: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#9333ea',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 20,
    },
    genreText: { color: '#ffffff', fontSize: 10, fontWeight: '600' },
    recTitle: { fontSize: 13, fontWeight: '600', color: '#0f172a', marginBottom: 3 },
    recAuthor: { fontSize: 12, color: '#64748b' },
});
