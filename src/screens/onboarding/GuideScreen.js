import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Dimensions, 
  FlatList, 
  Image, 
  SafeAreaView 
} from 'react-native';

const { width } = Dimensions.get('window');

const guides = [
  {
    id: '1',
    type: 'double',
    title: '신한 챗봇 이용 가이드',
    features: [
      {
        title: '대화하기 기능',
        description: '궁금한 복지를 질문하세요.',
        image: require('../../../assets/images/guide_chat.png')
      },
      {
        title: '좋아요 기능',
        description: '결과로 나온 복지를 저장하고 모아보세요.',
        image: require('../../../assets/images/guide_like.png')
      }
    ]
  },
  {
    id: '2',
    type: 'single',
    title: '신한 챗봇 이용 가이드',
    feature: {
      title: '채팅 중 검색기능',
      description: '키워드를 입력하면 자동완성된 질문을 확인할 수 있습니다.',
      image: require('../../../assets/images/guide_search.png')
    }
  },
  {
    id: '3',
    type: 'single',
    title: '신한 챗봇 이용 가이드',
    feature: {
      title: '즐겨찾기 기능',
      description: '알림 받고 싶은 복지 카테고리를 선택하고 새로운 복지가 추가될 때마다 알림을 받아보세요.',
      image: require('../../../assets/images/guide_filter.png')
    }
  }
];

const GuideScreen = ({ visible, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef(null);

  // 가이드가 열릴 때마다 첫 페이지로 초기화
  useEffect(() => {
    if (visible) setCurrentPage(0);
  }, [visible]);

  // 다음 페이지로 이동
  const goToNextPage = () => {
    if (currentPage < guides.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      flatListRef.current?.scrollToIndex({
        index: nextPage,
        animated: true
      });
    } else {
      onClose();
    }
  };

  // 가이드 항목 렌더링
  const renderGuideItem = ({ item, index }) => {
    const isLastPage = index === guides.length - 1;

    if (item.type === 'double') {
      return (
        <View style={styles.pageContainer}>
          <View style={styles.contentContainer}>
            <Text style={styles.pageTitle}>{item.title}</Text>
            <View style={styles.guideContentArea}>
              {/* 첫 번째 기능 */}
              <View style={styles.featureSection}>
                <Text style={styles.featureTitle}>{item.features[0].title}</Text>
                <Text style={styles.featureDescription}>{item.features[0].description}</Text>
                <View style={styles.featureImageContainer}>
                  <Image 
                    source={item.features[0].image} 
                    style={styles.featureImage} 
                    resizeMode="contain" 
                  />
                </View>
              </View>
              {/* 두 번째 기능 */}
              <View style={styles.featureSection}>
                <Text style={styles.featureTitle}>{item.features[1].title}</Text>
                <Text style={styles.featureDescription}>{item.features[1].description}</Text>
                <View style={styles.featureImageContainer}>
                  <Image 
                    source={item.features[1].image} 
                    style={styles.featureImage} 
                    resizeMode="contain" 
                  />
                </View>
              </View>
            </View>
            {/* 인디케이터 */}
            <View style={styles.containerDots}>
              {guides.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    { backgroundColor: i === currentPage ? '#55B7B5' : '#FFFFFF' }
                  ]}
                />
              ))}
            </View>
            {/* 다음 버튼 */}
            <TouchableOpacity 
              style={styles.nextButton} 
              onPress={goToNextPage}
            >
              <Image 
                source={require('../../../assets/icons/arrow_right.png')}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // 단일 기능 페이지
    return (
      <View style={styles.pageContainer}>
        <View style={styles.contentContainer}>
          {/* 마지막 페이지에만 닫기 버튼 표시 */}
          {isLastPage && (
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={onClose}
            >
              <Image 
                source={require('../../../assets/icons/close.png')}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          )}
          <Text style={styles.pageTitle}>{item.title}</Text>
          <View style={styles.guideContentArea}>
            <View style={styles.singleFeatureSection}>
              <Text style={styles.featureTitle}>{item.feature.title}</Text>
              <Text style={styles.featureDescription}>{item.feature.description}</Text>
              <View style={styles.singleFeatureImageContainer}>
                <Image 
                  source={item.feature.image} 
                  style={styles.singleFeatureImage} 
                  resizeMode="contain" 
                />
              </View>
            </View>
          </View>
          {/* 인디케이터 */}
          <View style={styles.containerDots}>
            {guides.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  { backgroundColor: i === currentPage ? '#55B7B5' : '#FFFFFF' }
                ]}
              />
            ))}
          </View>
          {/* 마지막 페이지가 아닌 경우에만 다음 버튼 표시 */}
          {!isLastPage && (
            <TouchableOpacity 
              style={styles.nextButton} 
              onPress={goToNextPage}
            >
              <Image 
                source={require('../../../assets/icons/arrow_right.png')}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // 스크롤 이벤트 핸들러
  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / width);
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <FlatList
          ref={flatListRef}
          data={guides}
          renderItem={renderGuideItem}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  pageContainer: {
    width,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  contentContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    height: 520,
    alignItems: 'center', 
    position: 'relative',
  },
  guideContentArea: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    alignSelf: 'center',
  },
  featureSection: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'flex-start',
    paddingRight: 15,
    paddingLeft: 15,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#55B7B5',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 6,
  },
  subDescription: {
    fontSize: 12,
    color: '#e0e0e0',
    marginBottom: 10,
  },
  featureImageContainer: {
    width: '100%',
    height: 130,
    alignItems: 'center',
    marginVertical: 5,
  },
  featureImage: {
    width: '100%',
    height: '100%',
  },
  singleFeatureSection: {
    width: '100%',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingRight: 15,
    paddingLeft: 15,
    marginBottom: 20,
  },
  singleFeatureImageContainer: {
    width: '85%',
    height: 180,
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
  },
  singleFeatureImage: {
    width: '100%',
    height: '100%',
  },
  containerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 'auto',
    paddingBottom: 10,
  },
  nextButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    right: 5,
    top: '50%',
    transform: [{ translateY: -20 }],
  },
  arrowIcon: {
    width: 24,
    height: 24,
    tintColor: '#ffffff',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  placeholderContainer: {
    width: '90%',
    height: '100%',
    backgroundColor: 'rgba(55, 119, 119, 0.5)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF50',
  },
  placeholderText: {
    color: '#FFFFFF',
    fontSize: 14,
  }
});

export default GuideScreen;