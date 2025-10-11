import React from "react";
import { View, Text, SafeAreaView } from "react-native";

export default function ProgressScreen(){
  return (
    <SafeAreaView style={{flex:1, backgroundColor:"#0b1220", padding:20}}>
      <Text style={{color:"#00e6a8", fontSize:24, fontWeight:"700"}}>Progress</Text>
      <View style={{marginTop:12, backgroundColor:"#071024", padding:20, borderRadius:12}}>
        <Text style={{color:"#9aa4b2"}}>Weekly Calories</Text>
        <Text style={{color:"#fff", fontSize:20, fontWeight:"700"}}>3,420</Text>
      </View>
    </SafeAreaView>
  )
}
