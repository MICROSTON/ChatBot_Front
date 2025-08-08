// src/screens/chat/ChatScreen.js

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
  ImageBackground,
  Linking,
  KeyboardAvoidingView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useLike } from '../../context/LikeContext';

import AgeButtons from './AgeButtons';
import WelfareButtons from './WelfareButtons';
import WelfareCard from './WelfareCard';
import { welfareData } from '../../config/dummyData';
import { searchBenefits } from '../../services/chatService';

const BG = require('../../../assets/images/background.png');
const MASCOT = require('../../../assets/images/mascot.png');
const PHONE_ICON = require('../../../assets/images/phone.png');
const SEND_ICON = require('../../../assets/images/click.png');

const HEADER_TOP = Platform.OS === 'ios' ? 60 : 40;
const HEADER_HEIGHT = HEADER_TOP + 8 + 40;

export default function ChatScreen() {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(null);
  const [selectedBenefitCategory, setSelectedBenefitCategory] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedBenefits, setSelectedBenefits] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [showCallPopup, setShowCallPopup] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const scrollRef = useRef();

  const { likedBenefits, toggleLike } = useLike();

  const intro = [
    '연령대나 상황에 따라 받을 수 있는 맞춤형 복지 혜택을 알려드릴게요.',
    '먼저, 어떤 대상에 해당하시는지 선택해주세요.',
  ];

  const onSelectAgeGroup = ageObj => {
    setSelectedAgeGroup(ageObj);
    setSelectedBenefitCategory(null);
    setSelectedBenefits([]);
    setChatMessages(prev => [...prev, { from: 'user', text: ageObj.label }]);
  };

  const onSelectCategory = categoryObj => {
    setSelectedBenefitCategory(categoryObj);
    setSelectedBenefits([]);
    setChatMessages(prev => [...prev, { from: 'user', text: categoryObj.label }]);
  };

  const onSelectBenefit = benefit => {
    setSelectedBenefits(prev => [...prev, benefit]);
    setSearchResults([]); // 항목 클릭 시 검색 결과 숨김
  };

  const filteredList =
    selectedAgeGroup && selectedBenefitCategory
      ? welfareData.filter(
          x =>
            x.AgeGroup_num === selectedAgeGroup.AgeGroup_num &&
            x.BenefitCategory_num === selectedBenefitCategory.BenefitCategory_num
        )
      : [];

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (textInput.trim().length > 0) {
        handleSearch(textInput.trim());
      } else {
        setSearchResults([]);
      }
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [textInput]);

  const handleSearch = async (keyword) => {
    try {
      const results = await searchBenefits(keyword);
      setSearchResults(results);
    } catch (err) {
      console.error('검색 실패:', err);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [chatMessages, selectedBenefits]);

  const makeCall = number => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ImageBackground source={BG} style={styles.bg} imageStyle={styles.bgImg}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>신한봇</Text>
          <View style={styles.separator} />
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Image source={MASCOT} style={styles.headerMascot} />
              <Text style={styles.headerName}>신한봇</Text>
            </View>
            <TouchableOpacity onPress={() => setShowCallPopup(true)}>
              <View style={styles.phoneCircle}>
                <Image source={PHONE_ICON} style={styles.phoneIcon} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Image source={MASCOT} style={styles.mascot} />

          {intro.map((t, i) => (
            <View key={i} style={[styles.bubble, styles.bot]}>
              <Text style={styles.botText}>{t}</Text>
            </View>
          ))}

          <AgeButtons onSelect={onSelectAgeGroup} />
          {selectedAgeGroup && <WelfareButtons onSelect={onSelectCategory} />}

          {chatMessages.map((m, i) => (
            <View
              key={i}
              style={[styles.bubble, m.from === 'user' ? styles.user : styles.bot]}
            >
              <Text style={m.from === 'user' ? styles.userText : styles.botText}>
                {m.text}
              </Text>
            </View>
          ))}

          {filteredList.map(benefit => (
            <WelfareCard
              key={benefit.Benefit_Code}
              item={benefit}
              onPress={() => onSelectBenefit(benefit)}
            />
          ))}

          {selectedBenefits.map((benefit, i) => {
            const isLiked = likedBenefits.some(x => x.Benefit_Code === benefit.Benefit_Code);
            return (
              <View key={i} style={styles.detailOuter}>
                <View style={styles.detailHeader}>
                  <Text style={styles.detailTitle}>{benefit.Benefit_name}</Text>
                  <TouchableOpacity onPress={() => toggleLike(benefit)}>
                    <FontAwesome
                      name={isLiked ? 'heart' : 'heart-o'}
                      size={24}
                      color={isLiked ? '#FF3366' : '#fff'}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.detailBubble}>
                  <Text style={styles.detailText}>{benefit.Benefit_content}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {searchResults.length > 0 && (
          <View style={styles.searchOverlay}>
            <ScrollView
              style={styles.searchScroll}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              {searchResults.slice(0, 20).map(item => (
                <TouchableOpacity
                  key={item.Benefit_Code}
                  style={styles.searchItem}
                  onPress={() => onSelectBenefit(item)}
                >
                  <Text style={styles.searchTitle}>{item.Benefit_name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {showCallPopup && (
          <View style={styles.callPopup}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowCallPopup(false)}
            >
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.callBtn}
              onPress={() => makeCall('031120')}
            >
              <Text style={styles.callText}>경기도 031-120</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.callBtn}
              onPress={() => makeCall('0318282114')}
            >
              <Text style={styles.callText}>의정부시 031-828-2114</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="메시지 입력"
            placeholderTextColor="#aaa"
            value={textInput}
            onChangeText={setTextInput}
          />
          <TouchableOpacity style={styles.sendBtn}>
            <Image source={SEND_ICON} style={styles.sendIcon} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#C9EAEC' },
  bgImg: { resizeMode: 'contain', alignSelf: 'center' },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: HEADER_TOP,
    paddingHorizontal: 20,
    paddingBottom: 8,
    backgroundColor: '#C9EAEC',
    zIndex: 100,
  },
  headerTitle: { textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: '#000' },
  separator: { height: 1, backgroundColor: '#000', marginVertical: 8 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerMascot: { width: 30, height: 30, marginRight: 8, resizeMode: 'contain' },
  headerName: { fontSize: 16, fontWeight: '600', color: '#000' },
  phoneCircle: {
    backgroundColor: '#447473',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  phoneIcon: { width: 18, height: 18, tintColor: '#fff', resizeMode: 'contain' },
  scroll: { paddingTop: HEADER_HEIGHT + 10, paddingBottom: 20, paddingHorizontal: 20 },
  mascot: { width: 100, height: 100, alignSelf: 'center', marginBottom: 16 },
  bubble: { padding: 10, borderRadius: 16, marginVertical: 6, maxWidth: '80%' },
  user: { alignSelf: 'flex-end', backgroundColor: '#EBF6FA' },
  bot: { alignSelf: 'flex-start', backgroundColor: '#55B7B5' },
  userText: { fontSize: 14, color: '#000' },
  botText: { fontSize: 14, color: '#000' },
  detailOuter: { backgroundColor: '#55B7B5', borderRadius: 16, padding: 12, marginTop: 20 },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  detailBubble: { backgroundColor: '#C9EAEC', borderRadius: 12, padding: 12, marginTop: 12 },
  detailText: { fontSize: 14, color: '#000', lineHeight: 20 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#6C889F',
    borderTopWidth: 1,
    borderColor: '#ccc'
  },
  input: {
    flex: 1,
    backgroundColor: '#C7DCE4',
    color: '#333',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 10
  },
  sendBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  sendIcon: { width: 24, height: 24, resizeMode: 'contain' },
  searchOverlay: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 64,
    backgroundColor: '#B4CBCD',
    borderRadius: 12,
    maxHeight: 200,
    paddingVertical: 4,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
    zIndex: 1000,
  },
  searchScroll: {
    flexGrow: 0,
  },
  searchItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  searchTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  callPopup: {
    position: 'absolute',
    bottom: 70,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 999,
  },
  closeBtn: { alignSelf: 'flex-end', padding: 4, marginBottom: 8 },
  closeText: { fontSize: 20, color: '#555' },
  callBtn: { backgroundColor: '#D9D9D9', padding: 14, borderRadius: 10, marginBottom: 8 },
  callText: { fontSize: 15, color: '#222', fontWeight: '500' },
});
