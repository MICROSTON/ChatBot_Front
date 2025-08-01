import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { colors } from '../../styles/colors';

const FindResultScreen = ({ navigation, route }) => {
  const { type, result, message } = route.params || {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.resultContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {type === 'id' ? '아이디 찾기' : '비밀번호 찾기'}
            </Text>
            <View style={styles.underline} />
          </View>
          <View style={styles.resultContent}>
            <Text style={styles.labelText}>
              {type === 'id' ? '아이디' : '비밀번호'}
            </Text>
            {result && (
              <View style={styles.resultBox}>
                <Text style={styles.resultText}>{result}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>로그인하러 가기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor:  colors.background, // 연한 민트색 배경
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  resultContainer: {
    width: '90%',
    backgroundColor: '#E9F9FF',
    borderRadius: 20,
    padding: 30,
    borderWidth: 3,
    borderColor: '#637D85',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#447473',
  },
  underline: {
    width: '100%',
    height: 3,
    backgroundColor: '#447473',
    marginTop: 10,
  },
  resultContent: {
    marginBottom: 40,
  },
  labelText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  resultBox: {
    width: '100%',
    padding: 10,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
  },
  resultText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#55B7B5',
    borderRadius: 7,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#637D85',
  },
  buttonText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default FindResultScreen;