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
  Keyboard,
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLike } from '../../context/LikeContext';
import { useWelfare } from '../../context/WelfareContext';

import AgeButtons from './AgeButtons';
import WelfareButtons from './WelfareButtons';
import WelfareCard from './WelfareCard';

const BG = require('../../../assets/images/background.png');
const MASCOT = require('../../../assets/images/mascot.png');
const BOT_PROFILE = require('../../../assets/images/mascot.png');
const PHONE_ICON = require('../../../assets/images/phone.png');
const SEND_ICON = require('../../../assets/images/click.png');

const HEADER_TOP = Platform.OS === 'ios' ? 60 : 40;
const HEADER_HEIGHT = HEADER_TOP + 8 + 40;

export default function ChatScreen({ route }) {
  const navigation = useNavigation();
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(null);
  const [selectedBenefitCategory, setSelectedBenefitCategory] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedBenefits, setSelectedBenefits] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [showCallPopup, setShowCallPopup] = useState(false);

  const [showAgeButtons, setShowAgeButtons] = useState(true);
  const [showCategoryButtons, setShowCategoryButtons] = useState(false);
  const [hasUserMadeFirstSelection, setHasUserMadeFirstSelection] = useState(false);
  
  // 더보기 기능을 위한 상태 (메시지별로 관리)
  const [visibleCounts, setVisibleCounts] = useState({});

  // 검색 관련 상태
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const scrollRef = useRef();

  const { likedBenefits, toggleLike, loading: likeLoading, error: likeError } = useLike();
  const { 
    filteredList, 
    loading, 
    error,
    hasMore,
    searchWelfareList,
    searchWelfareByAge,
    loadMoreWelfare
  } = useWelfare();

  // 푸시 알림으로 인한 자동 연령대 선택 처리
  useEffect(() => {
    if (route.params?.selectedAgeGroup) {
      const ageGroupNum = route.params.selectedAgeGroup;
      console.log('푸시 알림으로 인한 자동 연령대 선택:', ageGroupNum);
      
      // 연령대 정보 찾기
      const ageGroups = [
        { ageGroupNum: 1, label: '임산부/여자' },
        { ageGroupNum: 2, label: '영유아' },
        { ageGroupNum: 3, label: '청소년' },
        { ageGroupNum: 4, label: '청년' },
        { ageGroupNum: 5, label: '중장년' },
        { ageGroupNum: 6, label: '어르신' },
        { ageGroupNum: 7, label: '장애인' },
      ];
      
      const selectedAge = ageGroups.find(age => age.ageGroupNum === ageGroupNum);
      if (selectedAge) {
        setSelectedAgeGroup(selectedAge);
        setShowAgeButtons(false);
        setShowCategoryButtons(true);
        setHasUserMadeFirstSelection(true);
        
        // 봇 메시지 추가
        setChatMessages([{
          from: 'bot',
          text: `${selectedAge.label} 연령대를 선택하셨습니다. 어떤 분야의 복지 정보를 찾고 계신가요?`
        }]);
      }
    }
  }, [route.params?.selectedAgeGroup]);

  // 카테고리 선택 후 복지 목록이 로드되면 메시지 추가
  useEffect(() => {
    if (selectedBenefitCategory && !loading) {
      // 이미 메시지가 추가되었는지 확인
      const hasWelfareMessage = chatMessages.some(msg => 
        msg.type === 'welfare_list' && 
        msg.ageGroupNum === selectedAgeGroup?.ageGroupNum &&
        msg.benefitCategoryNum === selectedBenefitCategory.benefitCategoryNum
      );
      
      const hasNoWelfareMessage = chatMessages.some(msg => 
        msg.text && msg.text.includes('현재 지원되는 복지 혜택이 없습니다') &&
        msg.from === 'bot'
      );
      
      if (!hasWelfareMessage && !hasNoWelfareMessage) {
        if (filteredList && filteredList.length > 0) {
          setChatMessages(prev => [...prev, { 
            from: 'bot', 
            text: `${selectedAgeGroup?.label}의 ${selectedBenefitCategory.name || '선택한'} 분야의 복지 혜택을 찾았습니다!` 
          }]);
          
          setTimeout(() => {
            setChatMessages(prev => [...prev, {
              from: 'bot',
              type: 'welfare_list',
              data: filteredList,
              ageGroupNum: selectedAgeGroup?.ageGroupNum,
              benefitCategoryNum: selectedBenefitCategory.benefitCategoryNum
            }]);
          }, 500);
        } else {
          setChatMessages(prev => [...prev, { 
            from: 'bot', 
            text: `${selectedAgeGroup?.label}의 ${selectedBenefitCategory.name || '선택한'} 분야에는 현재 지원되는 복지 혜택이 없습니다.` 
          }]);
        }
      }
    }
  }, [filteredList, selectedBenefitCategory, selectedAgeGroup, loading]);

  const intro = [
    '연령대나 개인별 필요한 맞춤형 복지 혜택을 알려드릴게요',
    '필요한 복지 종류를 선택해주세요',
  ];

  // 연령대 버트 텍스트 목록 (DB 스키마에 맞게 수정)
  const ageButtonTexts = [
  { text: '임산부/여성 복지', ageGroupNum: 1, label: '임산부/여성' },  // 🔥 임산부+여성 합침
  { text: '영유아 복지', ageGroupNum: 2, label: '영유아' },           // 🔥 영유아+아동 합침
  { text: '청소년 복지', ageGroupNum: 3, label: '청소년' },
  { text: '청년 복지', ageGroupNum: 4, label: '청년' },
  { text: '중장년 복지', ageGroupNum: 5, label: '중장년' },
  { text: '어르신 복지', ageGroupNum: 6, label: '어르신' },
  { text: '장애인 복지', ageGroupNum: 7, label: '장애인' },
  
  // 검색용 별칭들 추가 (기존 세분화된 이름들도 검색 가능하게)
  { text: '임산부 복지', ageGroupNum: 1, label: '임산부/여성' },
  { text: '여성', ageGroupNum: 1, label: '임산부/여성' },
  { text: '임산부', ageGroupNum: 1, label: '임산부/여성' },
  { text: '여성', ageGroupNum: 1, label: '임산부/여성' },
  { text: '아동 복지', ageGroupNum: 2, label: '영유아' },
];


  // 홈으로 돌아가기
  const goHome = () => {
    navigation.navigate('Home'); 
  };

  // 전화걸기 함수
  const makeCall = (phoneNumber) => {
    setShowCallPopup(false);
    Linking.openURL(`tel:${phoneNumber}`);
  };

  // 연령대 선택 핸들러 (백엔드 구조 적용)
  const onSelectAgeGroup = async (ageObj) => {
    setHasUserMadeFirstSelection(true);

    setSelectedAgeGroup(ageObj);
    setSelectedBenefitCategory(null);
    setSelectedBenefits([]);
    setShowCategoryButtons(true);

    const isFromHistory = chatMessages.some(msg => msg.type === 'age_buttons');

    if (!isFromHistory) {
      setChatMessages(prev => [...prev, {
        from: 'bot',
        type: 'age_buttons',
        text: '연령대를 선택해주세요:'
      }]);
    }

    // 사용자 메시지 추가
    setChatMessages(prev => [...prev, { from: 'user', text: ageObj.label }]);

    // 봇 응답 메시지 추가
    setTimeout(() => {
     setChatMessages(prev => [...prev, { 
        from: 'bot', 
        text: '좋습니다! 이제 어떤 분야의 복지 혜택을 알아보고 싶으신지 선택해주세요.' 
      }]);

      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          from: 'bot',
          type: 'category_buttons',
          text: '카테고리를 선택해주세요:'
        }]);
      }, 200);
    }, 500);

    // API 호출 (백엔드 구조에 맞게 수정)
    try {
      const result = await searchWelfareByAge(ageObj.ageGroupNum);
      console.log('연령대별 검색 결과:', result);
      
      // 백엔드에서 카테고리 목록을 반환하므로 이를 저장
      if (result && result.success && result.data) {
        // 카테고리 정보를 저장하여 나중에 사용
        setSelectedAgeGroup(prev => ({
          ...prev,
          categories: result.data
        }));
      }
    } catch (error) {
      console.error('연령대별 복지 검색 실패:', error);
      // 오류 발생 시 기본 카테고리 사용
      setSelectedAgeGroup(prev => ({
        ...prev,
        categories: [
          { benefitCategoryNum: 10, categoryName: '경제' },
          { benefitCategoryNum: 20, categoryName: '의료' },
          { benefitCategoryNum: 30, categoryName: '문화시설' },
          { benefitCategoryNum: 40, categoryName: '교육' },
          { benefitCategoryNum: 50, categoryName: '기타' }
        ]
      }));
    }
  };

  // 카테고리 선택 핸들러 (백엔드 구조 적용)
  const onSelectCategory = async (categoryObj) => {
    setSelectedBenefitCategory(categoryObj);
    setSelectedBenefits([]);

    // 사용자 메시지 추가
    setChatMessages(prev => [...prev, { from: 'user', text: categoryObj.name || '카테고리' }]);
    
    // 복지 목록 검색
    try {
      await searchWelfareList({
        ageGroupNum: selectedAgeGroup?.ageGroupNum,
        benefitCategoryNum: categoryObj.benefitCategoryNum
      });
    } catch (error) {
      console.error('복지 목록 검색 실패:', error);
    }
  };

  // 복지 선택 핸들러 (DB 스키마 적용)
  const onSelectBenefit = benefit => {
    setChatMessages(prev => [...prev, { 
      from: 'user', 
      text: benefit.benefitName || '복지 혜택' 
    }]);

    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        from: 'bot', 
        text: `${benefit.benefitName || '선택한 복지'}에 대한 상세 정보를 알려드릴게요!` 
      }]);
      
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          from: 'bot',
          type: 'benefit_detail',
          data: benefit
        }]);
      }, 500);
    }, 600);
  };

  // 더보기 버튼 클릭 핸들러 (페이지네이션 적용)
  const handleShowMore = async (messageKey) => {
    if (!hasMore || loading) return;
    
    try {
      // 현재 메시지에서 검색 파라미터 추출
      const messageIndex = parseInt(messageKey.split('-').pop());
      const message = chatMessages[messageIndex];
      
      if (message && message.type === 'welfare_list') {
        await loadMoreWelfare({
          ageGroupNum: message.ageGroupNum,
          benefitCategoryNum: message.benefitCategoryNum
        });
        
        // 메시지의 데이터를 업데이트
        setChatMessages(prev => prev.map((msg, idx) => 
          idx === messageIndex 
            ? { ...msg, data: filteredList }
            : msg
        ));
      }
    } catch (error) {
      console.error('더보기 로드 실패:', error);
    }
  };

  // 검색어 입력 시 연관검색어 생성 (DB 스키마 적용)
  const handleTextChange = (text) => {
    setTextInput(text);
    
    if (text.length === 0) {
      setShowSuggestions(false);
      setSearchSuggestions([]);
      return;
    }

    const suggestions = [];
    
    // 1. 연령대 버튼 텍스트 검색 (우선순위)
    const matchingAgeButtons = ageButtonTexts.filter(item => 
    item.text.includes(text) || item.label.includes(text)
  );
  
  // 중복된 ageGroupNum 제거
  const uniqueAgeButtons = matchingAgeButtons.filter((item, index, self) => 
    index === self.findIndex(t => t.ageGroupNum === item.ageGroupNum)
  );

  // 2. 연령대 버튼 추가 (최대 4개, 중복 제거됨)
  uniqueAgeButtons.slice(0, 4).forEach(ageButton => {
    suggestions.push({
      type: 'age_group',
      text: ageButton.text,
      data: ageButton
    });
  });

    // 3. 최대 4개까지만 표시
    setSearchSuggestions(suggestions.slice(0, 4));
  setShowSuggestions(suggestions.length > 0);
};

// 연관검색어 선택 핸들러 (DB 스키마 적용)
const handleSuggestionSelect = (suggestion) => {
  if (suggestion.type === 'age_group') {
    setTextInput('');
    setShowSuggestions(false);
      onSelectAgeGroup({
        ageGroupNum: suggestion.data.ageGroupNum,
        label: suggestion.data.label
      });
    }
  };

  // 전송 버튼 핸들러 (DB 스키마 적용)
  const handleSendMessage = () => {
    if (textInput.trim() === '') return;

    const matchingAgeButton = ageButtonTexts.find(item => 
      item.text === textInput || item.label === textInput
    );

    if (matchingAgeButton) {
      setTextInput('');
      setShowSuggestions(false);
      onSelectAgeGroup({
        ageGroupNum: matchingAgeButton.ageGroupNum,
        label: matchingAgeButton.label
      });
    } else {
      setChatMessages(prev => [...prev, { from: 'user', text: textInput }]);
      setTextInput('');
      setShowSuggestions(false);
      
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          from: 'bot', 
          text: '죄송합니다. 정확한 키워드를 입력해주세요. 연령대를 선택해서 시작해보세요!' 
        }]);
      }, 500);
    }
  };

  // 봇 메시지 렌더링
  const renderBotMessage = (message, index) => (
    <View key={index} style={styles.botMessageContainer}>
      <View style={styles.botProfile}>
        <Image source={BOT_PROFILE} style={styles.botAvatar} />
      </View>
      <View style={styles.botMessageWrapper}>
        <Text style={styles.botName}>신한봇</Text>
        <View style={styles.botBubble}>
          <Text style={styles.botText}>{message}</Text>
        </View>
      </View>
    </View>
  );

  // 사용자 메시지 렌더링
  const renderUserMessage = (message, index) => (
    <View key={index} style={styles.userMessageContainer}>
      <View style={styles.userBubble}>
        <Text style={styles.userText}>{message}</Text>
      </View>
    </View>
  );

  // 연령대 버튼 렌더링
  const renderAgeButtons = (message, index) => (
    <View key={index} style={styles.buttonsContainer}>
      <AgeButtons onSelect={onSelectAgeGroup} />
    </View>
  );

  // 카테고리 버튼 렌더링
  const renderCategoryButtons = (message, index) => (
    <View key={index} style={styles.buttonsContainer}>
      <WelfareButtons 
        onSelect={onSelectCategory} 
        customCategories={selectedAgeGroup?.categories}
      />
    </View>
  );

  // 복지 리스트 렌더링 (페이지네이션 적용)
  const renderWelfareListMessage = (message, index) => {
    const messageKey = `welfare-list-${index}`;
    const welfareData = message.data || filteredList;

    // 데이터가 없거나 빈 배열인 경우 처리
    if (!welfareData || welfareData.length === 0) {
      return (
        <View key={index} style={styles.welfareListContainer}>
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>
              해당 조건에 맞는 복지 혜택이 없습니다.
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View key={index} style={styles.welfareListContainer}>
        {welfareData.map((benefit, benefitIndex) => (
          <WelfareCard
            key={benefit.benefitCode || `benefit-${index}-${benefitIndex}`}
            item={benefit}
            onPress={() => onSelectBenefit(benefit)}
          />
        ))}
        
        {hasMore && (
          <TouchableOpacity 
            style={styles.showMoreButton}
            onPress={() => handleShowMore(messageKey)}
            disabled={loading}
          >
            <View style={styles.showMoreContent}>
              <Text style={styles.showMoreText}>
                {loading ? '로딩 중...' : '더보기'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // 복지 상세정보 렌더링 (DB 스키마 적용)
  const renderBenefitDetailMessage = (message, index) => {
    const benefit = message.data;
    const isLiked = likedBenefits.some(x => x.benefitCode === benefit.benefitCode);
    
    return (
      <View key={index} style={styles.detailOuter}>
        <View style={styles.detailHeader}>
          <Text style={styles.detailTitle}>{benefit.benefitName || '복지 혜택'}</Text>
          <TouchableOpacity 
            onPress={() => toggleLike(benefit)}
            disabled={likeLoading}
          >
            <FontAwesome
              name={isLiked ? 'heart' : 'heart-o'}
              size={24}
              color={isLiked ? '#FF3366' : '#fff'}
              style={{ opacity: likeLoading ? 0.5 : 1 }}
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.detailBubble}>
          <Text style={styles.detailText}>{benefit.benefitContext || '상세 정보가 없습니다.'}</Text>
          
                      {benefit.benefitCondition && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>신청 조건</Text>
                <Text style={styles.detailSectionText}>{benefit.benefitCondition || '조건 정보가 없습니다.'}</Text>
              </View>
            )}
          
          {benefit.benefitStartDate && benefit.benefitEndDate && (
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>지원 기간</Text>
              <Text style={styles.detailSectionText}>
                {benefit.benefitStartDate} ~ {benefit.benefitEndDate}
              </Text>
            </View>
          )}
          
          {benefit.benefitUrl && (
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>자세한 정보</Text>
              <TouchableOpacity 
                style={styles.linkButton}
                onPress={async () => {
                  try {
                    const supported = await Linking.canOpenURL(benefit.benefitUrl);
                    if (supported) {
                      await Linking.openURL(benefit.benefitUrl);
                    } else {
                      console.log('링크를 열 수 없습니다:', benefit.benefitUrl);
                      // 사용자에게 알림을 주거나 대체 동작 수행
                    }
                  } catch (error) {
                    console.error('링크 열기 실패:', error);
                  }
                }}
              >
                <Text style={styles.linkText}>공식 사이트 방문하기</Text>
                <Ionicons name="open-outline" size={16} color="#55B7B5" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {likeError && (
          <View style={styles.likeErrorContainer}>
            <Text style={styles.likeErrorText}>{likeError}</Text>
          </View>
        )}
      </View>
    );
  };

  // 메시지 타입에 따른 렌더링
  const renderMessage = (m, i) => {
    switch (m.type) {
      case 'age_buttons':
        return renderAgeButtons(m, `age-${i}`);
      case 'category_buttons':
        return renderCategoryButtons(m, `category-${i}`);
      case 'welfare_list':
        return renderWelfareListMessage(m, `welfare-list-${i}`);
      case 'benefit_detail':
        return renderBenefitDetailMessage(m, `benefit-detail-${i}`);
      default:
        return m.from === 'user' 
          ? renderUserMessage(m.text, `chat-${i}`)
          : renderBotMessage(m.text, `chat-${i}`);
    }
  };

  // 연관검색어 렌더링
  const renderSuggestions = () => (
    <View style={styles.suggestionsContainer}>
      {searchSuggestions.map((suggestion, index) => (
        <TouchableOpacity
          key={index}
          style={styles.suggestionItem}
          onPress={() => handleSuggestionSelect(suggestion)}
        >
          <Text style={styles.suggestionText}>{suggestion.text}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // 키보드 이벤트 감지
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setTimeout(() => {
          scrollRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
    };
  }, []);

  // 스크롤 처리
  useEffect(() => {
    if (!hasUserMadeFirstSelection) {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    } else {
      scrollRef.current?.scrollToEnd({ animated: true });
    }
  }, [chatMessages, hasUserMadeFirstSelection]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={0}
    >
      <ImageBackground source={BG} style={styles.bg} imageStyle={styles.bgImg}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={goHome} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>신한봇</Text>
            <View style={styles.headerPlaceholder} />
          </View>
          <View style={styles.headerSeparatorInner} />
        </View>
        
        {/* 전화 버튼 */}
        <TouchableOpacity 
          style={styles.phoneButton} 
          onPress={() => setShowCallPopup(true)}
        >
          <View style={styles.phoneCircle}>
            <Image source={PHONE_ICON} style={styles.phoneIcon} />
          </View>
        </TouchableOpacity>

        {/*  스크롤뷰 */}
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          onContentSizeChange={() => {
            if (chatMessages.length === 0) {
              scrollRef.current?.scrollTo({ y: 0, animated: false });
            }
          }}
        >
          <Image source={MASCOT} style={styles.mascotLarge} />
          <Text style={styles.greetingText}>안녕하세요. 신한봇입니다!</Text>

          {intro.map((message, i) => renderBotMessage(message, `intro-${i}`))}

          {showAgeButtons && chatMessages.length === 0 && (
            <View style={styles.buttonsContainer}>
              <AgeButtons onSelect={onSelectAgeGroup} />
            </View>
          )}

          {chatMessages.map((m, i) => renderMessage(m, i))}

          {loading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>복지 혜택을 찾고 있습니다...</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>오류: {error}</Text>
            </View>
          )}
        </ScrollView>

        {/* 전화 팝업 */}
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
              <Text style={styles.callText}>경기도</Text>
              <Text style={styles.callNumber}>031-120</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.callBtn}
              onPress={() => makeCall('0318282114')}
            >
              <Text style={styles.callText}>의정부시</Text>
              <Text style={styles.callNumber}>031-828-2114</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 연관검색어 */}
        {showSuggestions && renderSuggestions()}

        {/* 입력창 */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="메시지 입력"
            placeholderTextColor="#aaa"
            value={textInput}
            onChangeText={handleTextChange}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
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
    backgroundColor: '#C9EAEC',
    zIndex: 100,
  },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  headerPlaceholder: {
    width: 32,
  },
  headerSeparatorInner: {
    height: 1,
    backgroundColor: '#000',
    marginTop: 8,
    marginHorizontal: -40,
  },

  phoneButton: {
    position: 'absolute',
    top: HEADER_HEIGHT + 10,
    right: 20,
    zIndex: 99,
  },
  phoneCircle: { 
    backgroundColor: '#447473', 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  phoneIcon: { 
    width: 20, 
    height: 20, 
    tintColor: '#fff', 
    resizeMode: 'contain' 
  },

  scroll: { 
    paddingTop: HEADER_HEIGHT + 60,
    paddingBottom: 20, 
    paddingHorizontal: 20, 
    flexGrow: 1,
  },

  mascotLarge: { 
    width: 150, 
    height: 150, 
    alignSelf: 'center', 
    marginBottom: 16 
  },

  greetingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },

  botMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  botProfile: {
    marginRight: 8,
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  botMessageWrapper: {
    flex: 1,
    maxWidth: '75%',
  },
  botName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    marginLeft: 4,
  },
  botBubble: {
    backgroundColor: '#55B7B5',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  botText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 20,
  },

  userMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  userBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderTopRightRadius: 4,
    padding: 12,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  userText: {
    color: '#333333',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '500',
  },

  buttonsContainer: {
    marginBottom: 12,
    marginLeft: 25,
    marginRight: 20,
  },

  welfareListContainer: {
    marginBottom: 12,
    marginLeft: 40,
    maxWidth: '75%',
    marginTop: 8,
  },
  noDataContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  noDataText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },

  showMoreButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  showMoreContent: {
    backgroundColor: '#55B7B5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#447473',
    width: '100%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  
  showMoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#666',
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
  },

  detailOuter: { 
    backgroundColor: '#55B7B5', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 12,
    marginLeft: 40,
    width: '87%',
  },
  detailHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 8,
  },
  detailTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#fff',
    flex: 1,
    marginRight: 12,
  },
  detailBubble: { 
    backgroundColor: '#C9EAEC', 
    borderRadius: 12, 
    padding: 16, 
    marginTop: 8,
  },
  detailText: { 
    fontSize: 15, 
    color: '#000', 
    lineHeight: 22,
    marginBottom: 16,
  },
  detailSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#B8D8D6',
  },
  detailSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#447473',
    marginBottom: 6,
  },
  detailSectionText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#55B7B5',
  },
  linkText: {
    fontSize: 13,
    color: '#55B7B5',
    fontWeight: '600',
    marginRight: 6,
  },

  inputBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 12, 
    paddingVertical: 12, 
    backgroundColor: '#6C889F', 
    borderTopWidth: 1, 
    borderColor: '#ccc',
  },
  input: { 
    flex: 1, 
    backgroundColor: '#C7DCE4', 
    color: '#333', 
    borderRadius: 20, 
    paddingHorizontal: 14, 
    paddingVertical: 10, 
    marginRight: 10, 
  },
  sendBtn: { 
    width: 36, 
    height: 36, 
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  sendIcon: { width: 24, height: 24, resizeMode: 'contain' },

  callPopup: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 25,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    zIndex: 999,
  },
  
  closeBtn: { 
    position: 'absolute',
    top: 15,
    right: 20,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  
  closeText: { 
    fontSize: 20, 
    color: '#666',
    fontWeight: 'bold',
    lineHeight: 20,
  },
  
  callBtn: { 
    backgroundColor: '#D9D9D9', 
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 15, 
    marginBottom: 15,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  
  callText: { 
    fontSize: 16, 
    color: '#222', 
    fontWeight: '600',
  },

  callNumber: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },

  suggestionsContainer: {
    position: 'absolute',
    bottom: 60,
    left: 12,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: -2 },
    maxHeight: 200,
  },

  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
  likeErrorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  likeErrorText: {
    color: '#C62828',
    fontSize: 12,
    textAlign: 'center',
  },
});