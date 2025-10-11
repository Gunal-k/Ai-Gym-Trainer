import React, {useRef, useState, useEffect} from "react";
import { View, Text, SafeAreaView, TouchableOpacity, Image, Alert } from "react-native";
import { Camera } from "expo-camera";
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import axios from "axios";

export default function TrackerScreen(){
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [recording, setRecording] = useState(null);
  const [feedback, setFeedback] = useState("No feedback yet");

  useEffect(()=>{ (async ()=>{
    const cam = await Camera.requestCameraPermissionsAsync();
    const mic = await Audio.requestPermissionsAsync();
    setHasPermission(cam.status === "granted" && mic.status === "granted");
  })(); },[]);

  const snapAndAnalyze = async () => {
    if(!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({base64:false, quality:0.6});
    try{
      const fileUri = photo.uri;
      const form = new FormData();
      form.append('file', { uri: fileUri, name: 'frame.jpg', type: 'image/jpeg' });
      const res = await fetch('http://10.0.2.2:8000/analyze_frame', { method: 'POST', body: form });
      const data = await res.json();
      if(data.ok){
        setFeedback(data.tips.join(" | "));
      } else {
        setFeedback(data.error || (data.tips && data.tips.join(" | ")));
      }
    }catch(e){
      console.log(e);
      setFeedback("Error analyzing frame");
    }
  };

  const startRecording = async () => {
    try{
      await Audio.setAudioModeAsync({ allowsRecordingIOS:true, playsInSilentModeIOS:true });
      const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      setRecording(recording);
    }catch(e){
      console.log(e);
    }
  };
  const stopRecordingAndAnalyze = async () => {
    try{
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const form = new FormData();
      form.append('file', { uri: uri, name: 'audio.wav', type: 'audio/wav' });
      const res = await fetch('http://10.0.2.2:8000/analyze_audio', { method: 'POST', body: form });
      const data = await res.json();
      if(data.ok){
        setFeedback(prev => prev + "\nAudio-> RMS:" + (data.rms || data.tempo));
      } else {
        setFeedback(prev => prev + "\nAudio-> " + (data.error || (data.tips && data.tips.join(" | "))));
      }
      setRecording(null);
    }catch(e){
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={{flex:1, backgroundColor:"#0b1220"}}>
      <View style={{flex:1, padding:12}}>
        {hasPermission ? (
          <>
            <Camera style={{flex:1, borderRadius:16, overflow:"hidden"}} ref={cameraRef} ratio="16:9" />
            <View style={{flexDirection:"row", justifyContent:"space-around", marginTop:12}}>
              <TouchableOpacity onPress={snapAndAnalyze} style={{backgroundColor:"#00e6a8", padding:12, borderRadius:12}}>
                <Text style={{fontWeight:"700"}}>Analyze Frame</Text>
              </TouchableOpacity>
              {!recording ? (
                <TouchableOpacity onPress={startRecording} style={{backgroundColor:"#ff6b6b", padding:12, borderRadius:12}}>
                  <Text style={{fontWeight:"700"}}>Start Audio</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={stopRecordingAndAnalyze} style={{backgroundColor:"#ffb86b", padding:12, borderRadius:12}}>
                  <Text style={{fontWeight:"700"}}>Stop & Analyze</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={{marginTop:12, backgroundColor:"#071024", padding:12, borderRadius:12}}>
              <Text style={{color:"#00e6a8", fontWeight:"700"}}>Live Feedback</Text>
              <Text style={{color:"#fff", marginTop:6}}>{feedback}</Text>
            </View>
          </>
        ) : (
          <View><Text style={{color:"#fff"}}>Camera/Microphone permissions required</Text></View>
        )}
      </View>
    </SafeAreaView>
  )
}
