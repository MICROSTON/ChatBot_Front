import React from 'react'; 
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';

// 백엔드 API에서 받은 카테고리 데이터를 사용
const categories = [
  { benefitCategoryNum: 10, name: '경제', icon: require('../../../assets/images/economy.png') },
  { benefitCategoryNum: 20, name: '의료', icon: require('../../../assets/images/medical.png') },
  { benefitCategoryNum: 30, name: '문화시설', icon: require('../../../assets/images/culture.png') },
  { benefitCategoryNum: 40, name: '교육', icon: require('../../../assets/images/education.png') },
  { benefitCategoryNum: 50, name: '기타', icon: require('../../../assets/images/etc.png') },
];

export default function WelfareButtons({ onSelect, customCategories }) {
  // customCategories가 있으면 사용, 없으면 기본 카테고리 사용
  const displayCategories = customCategories || categories;
  
  return (
    <View style={styles.container}>
      {displayCategories.map((item, i) => (
        <TouchableOpacity
          key={i}
          style={styles.button}
          onPress={() => {
            if (typeof onSelect === 'function') {
              onSelect(item);
            }
          }}
        >
          <Image source={item.icon} style={styles.icon} />
          <Text style={styles.label}>{item.name}</Text>
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
    borderWidth: 1,
    borderColor: '#637D85',
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
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
});