import React from 'react'; 
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';

const categories = [
  { BenefitCategory_num: 1, label: '경제', icon: require('../../../assets/images/economy.png') },
  { BenefitCategory_num: 2, label: '의료', icon: require('../../../assets/images/medical.png') },
  { BenefitCategory_num: 3, label: '교육', icon: require('../../../assets/images/education.png') },
  { BenefitCategory_num: 4, label: '문화 시설', icon: require('../../../assets/images/culture.png') },
  { BenefitCategory_num: 5, label: '기타', icon: require('../../../assets/images/etc.png') },
];

export default function WelfareButtons({ onSelect }) {
  return (
    <View style={styles.container}>
      {categories.map((item, i) => (
        <TouchableOpacity
          key={i}
          style={styles.button}
          onPress={() => {
            if (typeof onSelect === 'function') {
              onSelect(item); // 객체 전체 전달
            } else {
              console.warn('WelfareButtons: onSelect 함수가 정의되지 않았습니다.');
            }
          }}
        >
          <Image source={item.icon} style={styles.icon} />
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    width: '48%',
    height: 80,
    backgroundColor: '#55B7B5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  icon: {
    width: 28,
    height: 28,
    marginBottom: 6,
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
