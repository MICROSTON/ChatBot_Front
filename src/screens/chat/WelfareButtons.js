import React from 'react'; 
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';

// import 제거하고, 로컬 categories만 사용
const categories = [
  { benefitCategoryNum: 1, name: '경제', icon: require('../../../assets/images/economy.png') },
  { benefitCategoryNum: 2, name: '의료', icon: require('../../../assets/images/medical.png') },
  { benefitCategoryNum: 3, name: '교육', icon: require('../../../assets/images/education.png') },
  { benefitCategoryNum: 4, name: '문화 시설', icon: require('../../../assets/images/culture.png') },
  { benefitCategoryNum: 5, name: '기타', icon: require('../../../assets/images/etc.png') },
];

export default function WelfareButtons({ onSelect }) {
  return (
    <View style={styles.container}>
      {/* categoryData 대신 categories 사용 */}
      {categories.map((item, i) => (
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