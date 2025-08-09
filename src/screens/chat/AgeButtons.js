import React from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';

const ageGroups = [
  { 
    ageGroupNum: 1, 
    label: '임산부/여성', //통합된 라벨
    icon: require('../../../assets/images/pregnant.png'),
    buttons: [
      { ageGroupNum: 1, label: '임산부/여성', desc: '임산부/여성 복지' } //하나로 통합
    ]
  },
  { 
    ageGroupNum: 2, 
    label: '영유아', //통합된 라벨 (아동 포함)
    icon: require('../../../assets/images/baby.png'),
    buttons: [
      { ageGroupNum: 2, label: '영유아', desc: '영유아 복지' } // 하나로 통합 (아동 포함)
    ]
  },
  { 
    ageGroupNum: 3, 
    label: '청소년', 
    icon: require('../../../assets/images/teen.png'),
    buttons: [
      { ageGroupNum: 3, label: '청소년', desc: '청소년 복지' }
    ]
  },
  { 
    ageGroupNum: 4, 
    label: '청년', 
    icon: require('../../../assets/images/youth.png'),
    buttons: [
      { ageGroupNum: 4, label: '청년', desc: '청년 복지' }
    ]
  },
  { 
    ageGroupNum: 5, 
    label: '중장년', 
    icon: require('../../../assets/images/middle.png'),
    buttons: [
      { ageGroupNum: 5, label: '중장년', desc: '중장년 복지' }
    ]
  },
  { 
    ageGroupNum: 6, 
    label: '어르신', 
    icon: require('../../../assets/images/old.png'),
    buttons: [
      { ageGroupNum: 6, label: '어르신', desc: '어르신 복지' }
    ]
  },
  { 
    ageGroupNum: 7, 
    label: '장애인', 
    icon: require('../../../assets/images/disability.png'),
    buttons: [
      { ageGroupNum: 7, label: '장애인', desc: '장애인 복지' }
    ]
  },
];

export default function AgeButtons({ onSelect }) {
  return (
    <View style={styles.container}>
      {ageGroups.map((item, i) => (
        <View key={i} style={styles.card}>
          {/* 아이콘과 라벨 */}
          <View style={styles.iconContainer}>
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.label}>{item.label}</Text>
          </View>
          
          {/* 버튼들 컨테이너 */}
          <View style={styles.buttonsContainer}>
            {item.buttons.map((button, index) => (
              <TouchableOpacity 
                key={index}
                style={[
                  styles.whiteButton,
                  styles.singleButton // 이제 모든 버튼이 singleButton 스타일
                ]} 
                onPress={() => onSelect(button)}
              >
                <Text style={styles.buttonText}>{button.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    marginTop: 12 
  },
  
  // 카드 배경 - 터키즈 색상 (높이 줄임)
  card: { 
    width: '48%', 
    backgroundColor: '#55B7B5', 
    borderRadius: 12, 
    borderColor: '#637D85', 
    borderWidth: 1, 
    padding: 16, 
    marginBottom: 12, 
    alignItems: 'center',
    minHeight: 120, // 높이 감소 (버튼 1개만 있으므로)
    justifyContent: 'space-between',
  },
  
  // 아이콘 컨테이너
  iconContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  
  // 아이콘 스타일
  icon: { 
    width: 42, 
    height: 42, 
    marginBottom: 6, 
    resizeMode: 'contain' 
  },
  
  // 라벨 (임산부/여성, 영유아 등)
  label: { 
    fontSize: 17, 
    fontWeight: 'bold', 
    color: '#000',
    textAlign: 'center',
    marginBottom: 5,
    marginTop: 6,
  },
  
  // 버튼들 컨테이너
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },

  // 하얀색 버튼
  whiteButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: '110%',
    alignItems: 'center',
    marginTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  
  // 모든 버튼이 single 스타일 적용
  singleButton: {
    marginBottom: 0,
    paddingVertical: 8,
  },
  
  // 버튼 텍스트
  buttonText: { 
    fontSize: 15, 
    color: '#333', 
    fontWeight: '600' 
  },
});