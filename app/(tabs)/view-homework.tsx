import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

interface Homework {
  id: string;
  subject: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'completed';
}

export default function ViewHomeworkScreen() {
  const colorScheme = useColorScheme();
  const currentColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const [homeworks, setHomeworks] = useState<Homework[]>([
    {
      id: '1',
      subject: 'Mathematics',
      description: 'Complete exercises 5.2 and 5.3 from textbook',
      dueDate: new Date('2024-02-10'),
      status: 'pending'
    },
    {
      id: '2',
      subject: 'Science',
      description: 'Create a model of the solar system',
      dueDate: new Date('2024-02-15'),
      status: 'pending'
    }
  ]);

  const renderHomeworkItem = ({ item }: { item: Homework }) => (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 15,
      backgroundColor: currentColors.background,
      borderRadius: 10,
      marginVertical: 5,
      borderWidth: 1,
      borderColor: currentColors.border
    }}>
      <View>
        <ThemedText style={{ fontWeight: 'bold' }}>{item.subject}</ThemedText>
        <ThemedText>{item.description}</ThemedText>
        <ThemedText>Due: {item.dueDate.toLocaleDateString()}</ThemedText>
      </View>
      <MaterialIcons 
        name={item.status === 'completed' ? 'check-circle' : 'pending'}
        size={24} 
        color={item.status === 'completed' ? currentColors.success : currentColors.primary} 
      />
    </View>
  );

  return (
    <ThemedView style={{ flex: 1, padding: 10 }}>
      <ThemedText style={{ fontSize: 20, marginBottom: 10 }}>Homework</ThemedText>
      <FlatList
        data={homeworks}
        renderItem={renderHomeworkItem}
        keyExtractor={(item) => item.id}
      />
    </ThemedView>
  );
}