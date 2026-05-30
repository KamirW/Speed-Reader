import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Alert, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useData } from "../hooks/useData";
import { Upload, PenLine, FileText, X, BookOpen, ChevronRight } from "lucide-react-native";

type InputMode = "upload" | "type";

const { width, height } = Dimensions.get("window");
const minDim = Math.min(width, height);
const isTablet = minDim >= 600;

// Dynamic size calculations - responsive based on device type
const headerTitleFontSize = minDim * (isTablet ? 0.045 : 0.055);
const headerSubtitleFontSize = minDim * (isTablet ? 0.026 : 0.032);
const headerPaddingB = minDim * (isTablet ? 0.077 : 0.09);
const contentPaddingH = minDim * (isTablet ? 0.046 : 0.055);
const contentPaddingT = minDim * (isTablet ? 0.03 : 0.04);
const modeTogglePadding = minDim * (isTablet ? 0.012 : 0.015);
const modeButtonPaddingV = minDim * (isTablet ? 0.019 : 0.023);
const modeButtonTextFontSize = minDim * (isTablet ? 0.026 : 0.032);
const modeIconSize = minDim * (isTablet ? 0.03 : 0.038);
const sectionMarginB = minDim * (isTablet ? 0.046 : 0.055);
const uploadBoxPadding = minDim * (isTablet ? 0.09 : 0.11);
const uploadIconSize = minDim * (isTablet ? 0.11 : 0.14);
const uploadIconBorderRadius = minDim * (isTablet ? 0.053 : 0.065);
const uploadIconMarginB = minDim * (isTablet ? 0.03 : 0.04);
const uploadTitleFontSize = minDim * (isTablet ? 0.03 : 0.038);
const uploadSubtitleFontSize = minDim * (isTablet ? 0.026 : 0.032);
const fileCardPadding = minDim * (isTablet ? 0.03 : 0.04);
const fileCardGap = minDim * (isTablet ? 0.023 : 0.03);
const fileIconSize = minDim * (isTablet ? 0.077 : 0.095);
const fileIconBorderRadius = minDim * (isTablet ? 0.023 : 0.03);
const fileNameFontSize = minDim * (isTablet ? 0.026 : 0.032);
const fileWordCountFontSize = minDim * (isTablet ? 0.023 : 0.028);
const clearButtonSize = minDim * (isTablet ? 0.06 : 0.075);
const clearButtonBorderRadius = minDim * (isTablet ? 0.03 : 0.038);
const textInputHeight = minDim * (isTablet ? 0.37 : 0.42);
const textInputPadding = minDim * (isTablet ? 0.03 : 0.04);
const textInputFontSize = minDim * (isTablet ? 0.026 : 0.032);
const textInputFooterPaddingV = minDim * (isTablet ? 0.015 : 0.02);
const textInputFooterPaddingH = minDim * (isTablet ? 0.03 : 0.04);
const wordCountFontSize = minDim * (isTablet ? 0.023 : 0.028);
const clearTextButtonFontSize = minDim * (isTablet ? 0.023 : 0.028);
const clearTextButtonGap = minDim * (isTablet ? 0.008 : 0.01);
const clearTextIconSize = minDim * (isTablet ? 0.023 : 0.028);
const previewTitleFontSize = minDim * (isTablet ? 0.026 : 0.032);
const previewTitleMarginB = minDim * (isTablet ? 0.015 : 0.02);
const previewContainerPadding = minDim * (isTablet ? 0.038 : 0.045);
const previewContainerMaxHeight = minDim * (isTablet ? 0.37 : 0.42);
const previewTextFontSize = minDim * (isTablet ? 0.026 : 0.032);
const previewTextLineHeight = minDim * (isTablet ? 0.038 : 0.045);
const readButtonPaddingV = minDim * (isTablet ? 0.03 : 0.04);
const readButtonGap = minDim * (isTablet ? 0.023 : 0.03);
const readButtonFontSize = minDim * (isTablet ? 0.03 : 0.038);
const readIconSize = minDim * (isTablet ? 0.038 : 0.045);
const readChevronSize = minDim * (isTablet ? 0.034 : 0.04);

export function FileUpload() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const data = useData();

  const [mode, setMode] = useState<InputMode>("upload");
  const [typedText, setTypedText] = useState("");
  const [uploadedText, setUploadedText] = useState("");
  const [fileName, setFileName] = useState("");

  const activeText = mode === "upload" ? uploadedText : typedText;
  const wordCount = activeText.trim() ? activeText.trim().split(/\s+/).length : 0;

  const handleFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/plain', 'text/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const response = await fetch(asset.uri);
        const textContent = await response.text();
        setUploadedText(textContent);
        setFileName(asset.name || "Uploaded File");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const clearUpload = () => {
    setUploadedText("");
    setFileName("");
  };

  const handleStartReading = () => {
    data.setContent(activeText);
    navigation.navigate('Reader', { from: 'Upload' });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#9333ea', '#2563eb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.header, { paddingTop: insets.top + (isTablet ? 16 : 8) }]}
      >
        <Text style={styles.headerTitle}>My Text</Text>
        <Text style={styles.headerSubtitle}>Upload a file or type your own text to speed-read</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Mode toggle */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            onPress={() => setMode("upload")}
            style={styles.modeButton}
          >
            {mode === "upload" ? (
              <LinearGradient
                colors={['#9333ea', '#2563eb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.modeButtonGradient}
              >
                <Upload size={modeIconSize} color="#ffffff" />
                <Text style={styles.modeButtonTextActive}>Upload File</Text>
              </LinearGradient>
            ) : (
              <View style={styles.modeButtonPlain}>
                <Upload size={modeIconSize} color="#64748b" />
                <Text style={styles.modeButtonText}>Upload File</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMode("type")}
            style={styles.modeButton}
          >
            {mode === "type" ? (
              <LinearGradient
                colors={['#9333ea', '#2563eb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.modeButtonGradient}
              >
                <PenLine size={modeIconSize} color="#ffffff" />
                <Text style={styles.modeButtonTextActive}>Type Text</Text>
              </LinearGradient>
            ) : (
              <View style={styles.modeButtonPlain}>
                <PenLine size={modeIconSize} color="#64748b" />
                <Text style={styles.modeButtonText}>Type Text</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Upload mode */}
        {mode === "upload" && (
          <View style={styles.section}>
            {!uploadedText ? (
              <TouchableOpacity onPress={handleFile} style={styles.uploadBox}>
                <View style={styles.uploadIcon}>
                  <Upload size={uploadIconSize} color="#9333ea" />
                </View>
                <Text style={styles.uploadTitle}>Tap to browse for a .txt file</Text>
                <Text style={styles.uploadSubtitle}>Select a text file to upload</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.fileCard}>
                <View style={styles.fileIcon}>
                  <FileText size={fileIconSize} color="#9333ea" />
                </View>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName} numberOfLines={1}>{fileName}</Text>
                  <Text style={styles.fileWordCount}>{wordCount.toLocaleString()} words</Text>
                </View>
                <TouchableOpacity onPress={clearUpload} style={styles.clearButton}>
                  <X size={clearTextIconSize} color="#94a3b8" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Type mode */}
        {mode === "type" && (
          <View style={styles.section}>
            <View style={styles.textInputContainer}>
              <TextInput
                value={typedText}
                onChangeText={setTypedText}
                placeholder="Paste or type your text here (3 words minimum)..."
                placeholderTextColor="#94a3b8"
                multiline
                style={styles.textInput}
              />
              <View style={styles.textInputFooter}>
                <Text style={styles.wordCountText}>{wordCount.toLocaleString()} words</Text>
                {typedText && (
                  <TouchableOpacity onPress={() => setTypedText("")} style={styles.clearTextButton}>
                    <X size={clearTextIconSize} color="#94a3b8" />
                    <Text style={styles.clearTextButtonText}>Clear</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Preview */}
        {activeText && (
          <View style={styles.section}>
            <Text style={styles.previewTitle}>Preview</Text>
            <ScrollView style={styles.previewContainer}>
              <Text style={styles.previewText}>
                {activeText.length > 600 ? activeText.slice(0, 600) + "…" : activeText}
              </Text>
            </ScrollView>
          </View>
        )}

        {/* Start Reading button */}
        {activeText.trim() && wordCount >= 3 && (
          <TouchableOpacity
            onPress={handleStartReading}
            style={{ marginBottom: insets.bottom + 20 }}
          >
            <LinearGradient
              colors={['#9333ea', '#2563eb']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.readButton}
            >
              <BookOpen size={readIconSize} color="#ffffff" />
              <Text style={styles.readButtonText}>Start Reading · {wordCount.toLocaleString()} words</Text>
              <ChevronRight size={readChevronSize} color="#ffffff" opacity={0.7} />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: contentPaddingH,
    paddingBottom: headerPaddingB,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: headerTitleFontSize,
    fontWeight: '700',
    marginBottom: minDim * 0.008,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: headerSubtitleFontSize,
  },
  content: {
    paddingHorizontal: contentPaddingH,
    paddingTop: contentPaddingT,
    paddingBottom: minDim * 0.15,
    flex: 1,
  },
  modeToggle: {
    backgroundColor: '#ffffff',
    borderRadius: minDim * 0.03,
    padding: modeTogglePadding,
    flexDirection: 'row',
    marginBottom: minDim * 0.046,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  modeButton: {
    flex: 1,
  },
  modeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: minDim * 0.015,
    paddingVertical: modeButtonPaddingV,
    borderRadius: minDim * 0.023,
  },
  modeButtonPlain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: minDim * 0.015,
    paddingVertical: modeButtonPaddingV,
    borderRadius: minDim * 0.023,
  },
  modeButtonText: {
    fontSize: modeButtonTextFontSize,
    color: '#64748b',
    fontWeight: '400',
  },
  modeButtonTextActive: {
    fontSize: modeButtonTextFontSize,
    color: '#ffffff',
    fontWeight: '600',
  },
  section: {
    marginBottom: sectionMarginB,
  },
  uploadBox: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderRadius: minDim * 0.03,
    padding: uploadBoxPadding,
    alignItems: 'center',
  },
  uploadIcon: {
    width: uploadIconSize * 2.3,
    height: uploadIconSize * 2.3,
    borderRadius: uploadIconBorderRadius,
    backgroundColor: '#f3e8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: uploadIconMarginB,
  },
  uploadTitle: {
    fontSize: uploadTitleFontSize,
    fontWeight: '500',
    color: '#334155',
    marginBottom: minDim * 0.008,
  },
  uploadSubtitle: {
    fontSize: uploadSubtitleFontSize,
    color: '#94a3b8',
  },
  fileCard: {
    backgroundColor: '#ffffff',
    borderRadius: minDim * 0.03,
    padding: fileCardPadding,
    flexDirection: 'row',
    alignItems: 'center',
    gap: fileCardGap,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  fileIcon: {
    width: fileIconSize * 2.1,
    height: fileIconSize * 2.1,
    borderRadius: fileIconBorderRadius,
    backgroundColor: '#f3e8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: fileNameFontSize,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: minDim * 0.004,
  },
  fileWordCount: {
    fontSize: fileWordCountFontSize,
    color: '#94a3b8',
  },
  clearButton: {
    width: clearButtonSize,
    height: clearButtonSize,
    borderRadius: clearButtonBorderRadius,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputContainer: {
    backgroundColor: '#ffffff',
    borderRadius: minDim * 0.03,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
  },
  textInput: {
    height: textInputHeight,
    padding: textInputPadding,
    fontSize: textInputFontSize,
    color: '#334155',
    textAlignVertical: 'top',
  },
  textInputFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: textInputFooterPaddingH,
    paddingVertical: textInputFooterPaddingV,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  wordCountText: {
    fontSize: wordCountFontSize,
    color: '#94a3b8',
  },
  clearTextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: clearTextButtonGap,
  },
  clearTextButtonText: {
    fontSize: clearTextButtonFontSize,
    color: '#94a3b8',
  },
  previewTitle: {
    fontSize: previewTitleFontSize,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: previewTitleMarginB,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  previewContainer: {
    backgroundColor: '#ffffff',
    borderRadius: minDim * 0.03,
    padding: previewContainerPadding,
    maxHeight: previewContainerMaxHeight,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  previewText: {
    fontSize: previewTextFontSize,
    color: '#475569',
    lineHeight: previewTextLineHeight,
  },
  readButton: {
    backgroundColor: 'linear-gradient(90deg, #9333ea 0%, #2563eb 100%)',
    borderRadius: minDim * 0.03,
    paddingVertical: readButtonPaddingV,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: readButtonGap,
    shadowColor: '#9333ea',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  readButtonText: {
    fontSize: readButtonFontSize,
    fontWeight: '600',
    color: '#ffffff',
  },
});
