import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useData } from "../hooks/useData";
import { View, TouchableOpacity, Text } from "react-native";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function FileUpload() {
    const navigation = useNavigation<Nav>();
    const insets = useSafeAreaInsets();
    const data = useData();

    const pickDocument = async () => {
        try {
          const result = await DocumentPicker.getDocumentAsync({
            type: ['text/plain', 'text/*'],
            copyToCacheDirectory: true,
          });
    
          if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            const response = await fetch(asset.uri);
            const textContent = await response.text();
            data.setContent(textContent);
            console.log('Content set:', textContent);
          }
        } catch (error) {
          console.error('Error picking document:', error);
        }
      };
  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={pickDocument}>
            <Text>Pick Document</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Reader', { from: 'Upload' })}>
            <Text>Read</Text>
        </TouchableOpacity>
    </View>
  )
}