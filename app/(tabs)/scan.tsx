import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
  StatusBar,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  RotateCcw, 
  Sparkles, 
  Zap,
  ScanLine,
  Image as ImageIcon,
  X,
  FlipHorizontal,
  Camera,
  Brain,
  ChevronLeft,
  Share2,
  Download,
  ArrowRight
} from 'lucide-react-native';
import AnimatedButton from '@/components/AnimatedButton';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useImageAnalysis } from '@/hooks/useImageAnalysis';
import { useAnalysisHistory } from '@/hooks/useAnalysisHistory';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ScanScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [showCamera, setShowCamera] = useState(false);
  const [flashMode, setFlashMode] = useState<'off' | 'on'>('off');
  const cameraRef = useRef<CameraView>(null);
  
  const { analyze, isAnalyzing, error } = useImageAnalysis();
  const { saveAnalysis } = useAnalysisHistory();

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        
        if (photo?.uri) {
          setCapturedImage(photo.uri);
          setAnalysisResult('');
          setShowCamera(false);
          
          // Analyze the image
          const result = await analyze(photo.uri);
          if (result) {
            setAnalysisResult(result.analysis);
            await saveAnalysis(result);
          }
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert(
        'Permission Required',
        'Please grant gallery access to select images'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      setCapturedImage(imageUri);
      setAnalysisResult('');
      
      // Analyze the selected image
      const analysisData = await analyze(imageUri);
      if (analysisData) {
        setAnalysisResult(analysisData.analysis);
        await saveAnalysis(analysisData);
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const startNewScan = () => {
    setCapturedImage(null);
    setAnalysisResult('');
    setShowCamera(false);
  };

  const openCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }
    setShowCamera(true);
  };

  // Camera View
  if (showCamera) {
    return (
      <View style={styles.cameraFullContainer}>
        <StatusBar barStyle="dark-content" />
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        />
        
        <View style={styles.cameraHeader}>
          <Pressable 
            style={styles.cameraHeaderButton}
            onPress={() => setShowCamera(false)}
          >
            <X size={20} color="#333333" />
          </Pressable>
          <Pressable 
            style={styles.cameraHeaderButton}
            onPress={toggleCameraFacing}
          >
            <FlipHorizontal size={20} color="#333333" />
          </Pressable>
        </View>
        
        <View style={styles.scanFrameContainer}>
          <View style={styles.scanFrame}>
            <View style={styles.scanCorner} />
            <View style={[styles.scanCorner, styles.scanCornerTopRight]} />
            <View style={[styles.scanCorner, styles.scanCornerBottomLeft]} />
            <View style={[styles.scanCorner, styles.scanCornerBottomRight]} />
          </View>
        </View>

        <View style={styles.cameraControls}>
          <Pressable style={styles.captureButtonContainer} onPress={takePicture}>
            <View style={styles.captureButton}>
              <View style={styles.captureInner} />
            </View>
          </Pressable>
        </View>
      </View>
    );
  }

  // Results View
  if (capturedImage) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.resultHeader}>
            <Pressable style={styles.backButton} onPress={startNewScan}>
              <ChevronLeft size={24} color="#333333" />
            </Pressable>
            <View style={styles.actionButtons}>
              <Pressable style={styles.actionButton}>
                <Share2 size={18} color="#333333" />
              </Pressable>
              <Pressable style={styles.actionButton}>
                <Download size={18} color="#333333" />
              </Pressable>
            </View>
          </View>
          
          <View style={styles.imageCardContainer}>
            <View style={styles.imageCard}>
              <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
              <View style={styles.imageCardContent}>
                <View style={styles.aiTagContainer}>
                  <Sparkles size={14} color="#5B67CA" />
                  <Text style={styles.aiTagText}>AI Analyzed</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.resultContainer}>
            {isAnalyzing ? (
              <View style={styles.loadingCard}>
                <View style={styles.loadingAnimation}>
                  <LoadingSpinner size={40} color="#5B67CA" />
                </View>
                <Text style={styles.loadingText}>Analyzing...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorCard}>
                <View style={styles.errorIconContainer}>
                  <Zap size={28} color="#E76F51" />
                </View>
                <Text style={styles.errorText}>Analysis failed</Text>
                <Pressable style={styles.retryButton} onPress={startNewScan}>
                  <Text style={styles.retryText}>Try Again</Text>
                </Pressable>
              </View>
            ) : analysisResult ? (
              <View style={styles.analysisCard}>
                <View style={styles.analysisCardHeader}>
                  <Text style={styles.analysisTitle}>Analysis Result</Text>
                </View>
                <Text style={styles.analysisText}>{analysisResult}</Text>
                <Pressable style={styles.newScanButton} onPress={startNewScan}>
                  <Text style={styles.newScanText}>New Scan</Text>
                  <ArrowRight size={16} color="#ffffff" style={styles.buttonIcon} />
                </Pressable>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Main Scan Options View
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.titleText}>AI Scanner</Text>
          <Text style={styles.subtitleText}>How do you want to analyze?</Text>
        </View>
        
        <View style={styles.decorationBlob1} />
        <View style={styles.decorationBlob2} />
        <View style={styles.decorationBlob3} />
        
        <View style={styles.optionsContainer}>
          <Pressable style={styles.optionCard} onPress={openCamera}>
            <View style={styles.optionIconContainer}>
              <Camera size={24} color="#5B67CA" strokeWidth={2} />
            </View>
            <Text style={styles.optionTitle}>Take Photo</Text>
            <Text style={styles.optionSubtitle}>Use camera to capture</Text>
            <View style={styles.optionArrow}>
              <ArrowRight size={16} color="#5B67CA" />
            </View>
          </Pressable>

          <Pressable style={styles.optionCard} onPress={pickImage}>
            <View style={[styles.optionIconContainer, {backgroundColor: '#FFF2DD'}]}>
              <ImageIcon size={24} color="#F8A978" strokeWidth={2} />
            </View>
            <Text style={styles.optionTitle}>Upload Image</Text>
            <Text style={styles.optionSubtitle}>Select from gallery</Text>
            <View style={styles.optionArrow}>
              <ArrowRight size={16} color="#F8A978" />
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0EA',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  mainContainer: {
    flex: 1,
    padding: 24,
    position: 'relative',
  },
  headerContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  titleText: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  decorationBlob1: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(91, 103, 202, 0.15)',
    top: '15%',
    right: '10%',
    zIndex: -1,
  },
  decorationBlob2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(248, 169, 120, 0.15)',
    bottom: '25%',
    left: '5%',
    zIndex: -1,
  },
  decorationBlob3: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(130, 200, 190, 0.15)',
    top: '40%',
    left: '15%',
    zIndex: -1,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  optionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EEF0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333333',
    marginBottom: 6,
  },
  optionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 10,
  },
  optionArrow: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  // Camera styles
  cameraFullContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  camera: {
    flex: 1,
  },
  cameraHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    paddingTop: 40,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  cameraHeaderButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  scanFrameContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
    position: 'relative',
  },
  scanCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#5B67CA',
    top: 0,
    left: 0,
  },
  scanCornerTopRight: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 0,
    top: 0,
    right: 0,
    left: 'auto',
  },
  scanCornerBottomLeft: {
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderTopWidth: 0,
    bottom: 0,
    top: 'auto',
    left: 0,
  },
  scanCornerBottomRight: {
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    bottom: 0,
    right: 0,
    top: 'auto',
    left: 'auto',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  captureButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  captureInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#5B67CA',
  },
  // Results styles
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  imageCardContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  imageCard: {
    borderRadius: 24,
    overflow: 'hidden',
    height: 250,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  capturedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageCardContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  aiTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  aiTagText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#333333',
    marginLeft: 6,
  },
  resultContainer: {
    paddingHorizontal: 20,
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  loadingAnimation: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#333333',
  },
  errorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  errorIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(231, 111, 81, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#333333',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#F5F0EA',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
  },
  retryText: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#333333',
  },
  analysisCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  analysisCardHeader: {
    marginBottom: 16,
  },
  analysisTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#333333',
  },
  analysisText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    lineHeight: 24,
    marginBottom: 24,
  },
  newScanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5B67CA',
    paddingVertical: 14,
    borderRadius: 30,
  },
  newScanText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  buttonIcon: {
    marginLeft: 8,
  },
});