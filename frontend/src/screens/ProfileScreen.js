import React from "react";
import { View, Text, SafeAreaView } from "react-native";

export default function ProfileScreen(){
  return (
    <SafeAreaView style={{flex:1, backgroundColor:"#0b1220", padding:20}}>
      <Text style={{color:"#00e6a8", fontSize:24, fontWeight:"700"}}>Profile</Text>
      <View style={{marginTop:12, backgroundColor:"#071024", padding:20, borderRadius:12}}>
        <Text style={{color:"#fff", fontSize:18, fontWeight:"600"}}>User Name</Text>
        <Text style={{color:"#9aa4b2"}}>Goals: Build strength • Lose fat</Text>
      </View>
    </SafeAreaView>
  )
}
