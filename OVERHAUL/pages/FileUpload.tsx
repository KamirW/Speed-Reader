import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useData } from "../hooks/useData";
import { Upload, PenLine, FileText, X, BookOpen, ChevronRight } from "lucide-react-native";

type InputMode = "upload" | "type";

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
        style={[styles.header, { paddingTop: insets.top + 16 }]}
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
                <Upload size={16} color="#ffffff" />
                <Text style={styles.modeButtonTextActive}>Upload File</Text>
              </LinearGradient>
            ) : (
              <View style={styles.modeButtonPlain}>
                <Upload size={16} color="#64748b" />
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
                <PenLine size={16} color="#ffffff" />
                <Text style={styles.modeButtonTextActive}>Type Text</Text>
              </LinearGradient>
            ) : (
              <View style={styles.modeButtonPlain}>
                <PenLine size={16} color="#64748b" />
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
                  <Upload size={24} color="#9333ea" />
                </View>
                <Text style={styles.uploadTitle}>Tap to browse for a .txt file</Text>
                <Text style={styles.uploadSubtitle}>Select a text file to upload</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.fileCard}>
                <View style={styles.fileIcon}>
                  <FileText size={18} color="#9333ea" />
                </View>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName} numberOfLines={1}>{fileName}</Text>
                  <Text style={styles.fileWordCount}>{wordCount.toLocaleString()} words</Text>
                </View>
                <TouchableOpacity onPress={clearUpload} style={styles.clearButton}>
                  <X size={16} color="#94a3b8" />
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
                    <X size={12} color="#94a3b8" />
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
              <BookOpen size={20} color="#ffffff" />
              <Text style={styles.readButtonText}>Start Reading · {wordCount.toLocaleString()} words</Text>
              <ChevronRight size={18} color="#ffffff" opacity={0.7} />
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
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    flex: 1,
  },
  modeToggle: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 6,
    flexDirection: 'row',
    marginBottom: 24,
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
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
  },
  modeButtonPlain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
  },
  modeButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '400',
  },
  modeButtonTextActive: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  uploadBox: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
  },
  uploadIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f3e8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  fileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f3e8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 2,
  },
  fileWordCount: {
    fontSize: 12,
    color: '#94a3b8',
  },
  clearButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
  },
  textInput: {
    height: 192,
    padding: 16,
    fontSize: 14,
    color: '#334155',
    textAlignVertical: 'top',
  },
  textInputFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  wordCountText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  clearTextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearTextButtonText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  previewContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    maxHeight: 192,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  previewText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  readButton: {
    backgroundColor: 'linear-gradient(90deg, #9333ea 0%, #2563eb 100%)',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#9333ea',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  readButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
