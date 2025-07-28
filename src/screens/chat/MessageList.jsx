import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MessageList({ messages }) {
  return (
    <View style={styles.container}>
      {messages.map((msg, index) => (
        <View
          key={index}
          style={[
            styles.messageBubble,
            msg.sender === 'user' ? styles.userBubble : styles.botBubble,
          ]}
        >
          <Text style={styles.messageText}>{msg.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 10,
    paddingBottom: 10,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 12,
    marginVertical: 4,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#3AAFA9',
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#DEF2F1',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
});
