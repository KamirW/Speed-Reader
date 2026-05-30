import { ScrollView, View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, Clock, TrendingUp, Zap, Sparkles } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JumpReadLogo } from '../components/JumpReadLogo';
import { books } from '../data/books';
import type { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get("window");
const minDim = Math.min(width, height);
const isTablet = minDim >= 600;

// Dynamic size calculations - responsive based on device type
const brandFontSize = minDim * (isTablet ? 0.045 : 0.06);
const subtitleFontSize = minDim * (isTablet ? 0.028 : 0.035);
const headerPaddingB = minDim * (isTablet ? 0.12 : 0.15);
const statsGap = minDim * (isTablet ? 0.023 : 0.03);
const statsMarginH = minDim * (isTablet ? 0.04 : 0.05);
const statsMarginT = -minDim * (isTablet ? 0.085 : 0.09);
const statsMarginB = minDim * (isTablet ? 0.053 : 0.06);
const statCardPadding = minDim * (isTablet ? 0.027 : 0.035);
const statCardGap = minDim * (isTablet ? 0.012 : 0.015);
const statNumberFontSize = minDim * (isTablet ? 0.042 : 0.05);
const statLabelFontSize = minDim * (isTablet ? 0.021 : 0.025);
const sectionMarginB = minDim * (isTablet ? 0.053 : 0.06);
const sectionHeaderGap = minDim * (isTablet ? 0.015 : 0.02);
const sectionHeaderMarginB = minDim * (isTablet ? 0.027 : 0.035);
const sectionHeaderPaddingH = minDim * (isTablet ? 0.04 : 0.05);
const sectionTitleFontSize = minDim * (isTablet ? 0.034 : 0.04);
const continueCardGap = minDim * (isTablet ? 0.03 : 0.04);
const continueCardPadding = minDim * (isTablet ? 0.03 : 0.04);
const continueCardMarginH = minDim * (isTablet ? 0.04 : 0.05);
const continueCardMarginB = minDim * (isTablet ? 0.023 : 0.03);
const continueImageW = minDim * (isTablet ? 0.14 : 0.18);
const continueImageH = minDim * (isTablet ? 0.20 : 0.25);
const bookTitleFontSize = minDim * (isTablet ? 0.028 : 0.035);
const bookAuthorFontSize = minDim * (isTablet ? 0.025 : 0.03);
const progressTrackHeight = minDim * (isTablet ? 0.012 : 0.015);
const progressTextFontSize = minDim * (isTablet ? 0.021 : 0.025);
const recListGap = minDim * (isTablet ? 0.027 : 0.035);
const recCardW = minDim * (isTablet ? 0.27 : 0.32);
const recImageW = minDim * (isTablet ? 0.27 : 0.32);
const recImageH = minDim * (isTablet ? 0.40 : 0.45);
const genrePillPaddingH = minDim * (isTablet ? 0.015 : 0.02);
const genrePillPaddingV = minDim * (isTablet ? 0.006 : 0.008);
const genreTextFontSize = minDim * (isTablet ? 0.019 : 0.023);
const recTitleFontSize = minDim * (isTablet ? 0.025 : 0.03);
const recAuthorFontSize = minDim * (isTablet ? 0.023 : 0.028);
const brandGap = minDim * (isTablet ? 0.019 : 0.025);

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
                    style={[styles.header, { paddingTop: insets.top + (isTablet ? 16 : 8) }]}
                >
                    <View style={styles.brandRow}>
                        <JumpReadLogo size={minDim * 0.077} />
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
                            <Icon color={color} size={minDim * 0.042} />
                            <Text style={styles.statNumber}>{value}</Text>
                            <Text style={styles.statLabel}>{label}</Text>
                        </View>
                    ))}
                </View>

                {/* Continue Reading */}
                {recentBooks.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Zap color="#eab308" size={minDim * 0.038} />
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
                            <Sparkles color="#a855f7" size={minDim * 0.038} />
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
    header: { paddingHorizontal: minDim * 0.046, paddingBottom: headerPaddingB },
    brandRow: { flexDirection: 'row', alignItems: 'center', gap: brandGap, marginBottom: minDim * 0.012 },
    brandName: { color: '#ffffff', fontSize: brandFontSize, fontWeight: '700' },
    subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: subtitleFontSize },
    scroll: { paddingBottom: minDim * 0.15 },
    statsRow: {
        flexDirection: 'row',
        gap: statsGap,
        marginHorizontal: statsMarginH,
        marginTop: statsMarginT,
        marginBottom: statsMarginB,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: minDim * 0.027,
        padding: statCardPadding,
        alignItems: 'center',
        gap: statCardGap,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    statNumber: { fontSize: statNumberFontSize, fontWeight: '700', color: '#0f172a' },
    statLabel: { fontSize: statLabelFontSize, color: '#64748b' },
    section: { marginBottom: sectionMarginB },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: sectionHeaderGap,
        marginBottom: sectionHeaderMarginB,
        paddingHorizontal: sectionHeaderPaddingH,
    },
    sectionTitle: { fontSize: sectionTitleFontSize, fontWeight: '600', color: '#0f172a' },
    continueCard: {
        flexDirection: 'row',
        gap: continueCardGap,
        backgroundColor: '#ffffff',
        borderRadius: minDim * 0.027,
        padding: continueCardPadding,
        marginHorizontal: continueCardMarginH,
        marginBottom: continueCardMarginB,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    continueImage: { width: continueImageW, height: continueImageH, borderRadius: minDim * 0.015 },
    continueInfo: { flex: 1 },
    bookTitle: { fontSize: bookTitleFontSize, fontWeight: '600', color: '#0f172a', marginBottom: minDim * 0.008 },
    bookAuthor: { fontSize: bookAuthorFontSize, color: '#64748b', marginBottom: minDim * 0.023 },
    progressTrack: {
        height: progressTrackHeight,
        backgroundColor: '#e2e8f0',
        borderRadius: progressTrackHeight / 2,
        overflow: 'hidden',
        marginBottom: minDim * 0.012,
    },
    progressFill: { height: '100%', backgroundColor: '#9333ea', borderRadius: progressTrackHeight / 2 },
    progressText: { fontSize: progressTextFontSize, color: '#94a3b8' },
    recList: { paddingHorizontal: minDim * 0.04, gap: recListGap },
    recCard: { width: recCardW },
    recImage: { width: recImageW, height: recImageH, borderRadius: minDim * 0.023, marginBottom: minDim * 0.019 },
    genrePill: {
        position: 'absolute',
        top: minDim * 0.015,
        left: minDim * 0.015,
        backgroundColor: '#9333ea',
        paddingHorizontal: genrePillPaddingH,
        paddingVertical: genrePillPaddingV,
        borderRadius: minDim * 0.038,
    },
    genreText: { color: '#ffffff', fontSize: genreTextFontSize, fontWeight: '600' },
    recTitle: { fontSize: recTitleFontSize, fontWeight: '600', color: '#0f172a', marginBottom: minDim * 0.006 },
    recAuthor: { fontSize: recAuthorFontSize, color: '#64748b' },
});
