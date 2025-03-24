import React, { useState } from 'react';
import { View, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface Message {
  id: string;
  sender: 'parent' | 'teacher';
  text: string;
  timestamp: Date;
}

export default function MessageTeacherScreen() {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'parent',
        text: newMessage,
        timestamp: new Date()
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={{
      alignSelf: item.sender === 'parent' ? 'flex-end' : 'flex-start',
      backgroundColor: item.sender === 'parent' ? currentColors.tint : currentColors.background,
      padding: 10,
      margin: 5,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: currentColors.border
    }}>
      <ThemedText>{item.text}</ThemedText>
    </View>
  );

  return (
    <ThemedView style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        inverted
      />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor={currentColors.textDim}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: currentColors.border,
            borderRadius: 20,
            padding: 10,
            marginRight: 10,
            backgroundColor: currentColors.inputBg,
            color: currentColors.text
          }}
        />
        <TouchableOpacity onPress={sendMessage}>
          <MaterialIcons name="send" size={24} color={currentColors.primary} />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}