// src/screens/chat/AgeButtons.js
import React from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';

const ageGroups = [
  { AgeGroup_num: 1, label: '임산부 복지', desc: '여성 복지', icon: require('../../../assets/images/pregnant.png') },
  { AgeGroup_num: 2, label: '영유아 복지', desc: '아동 복지', icon: require('../../../assets/images/baby.png') },
  { AgeGroup_num: 3, label: '청소년 복지', desc: '청소년 복지', icon: require('../../../assets/images/teen.png') },
  { AgeGroup_num: 4, label: '청년 복지', desc: '청년 복지', icon: require('../../../assets/images/youth.png') },
  { AgeGroup_num: 5, label: '중장년 복지', desc: '중장년 복지', icon: require('../../../assets/images/middle.png') },
  { AgeGroup_num: 6, label: '어르신 복지', desc: '어르신 복지', icon: require('../../../assets/images/old.png') },
  { AgeGroup_num: 7, label: '장애인 복지', desc: '장애인 복지', icon: require('../../../assets/images/disability.png') },
];


export default function AgeButtons({ onSelect }) {
  return (
    <View style={styles.container}>
      {ageGroups.map((item, i) => (
        <TouchableOpacity key={i} style={styles.card} onPress={() => onSelect(item)}>
          <Image source={item.icon} style={styles.icon} />
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.desc}>{item.desc}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between', marginTop:12 },
  card:{ width:'48%', backgroundColor:'#55B7B5', borderRadius:12, padding:12, marginBottom:12, alignItems:'center' },
  icon:{ width:38, height:38, marginBottom:6, resizeMode:'contain' },
  label:{ fontSize:14, fontWeight:'bold', color:'#fff' },
  desc:{ fontSize:12, color:'#fff' },
});
