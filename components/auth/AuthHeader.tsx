// components/auth/AuthHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface AuthHeaderProps {
  isRegister: boolean;
  onToggle: () => void;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ isRegister, onToggle }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>
        {isRegister ? 'Create Account' : 'Welcome Back'}
      </Text>
      <Text style={styles.subtitle}>
        {isRegister 
          ? 'Sign up to get started with all our features!' 
          : 'Sign in to continue with your account'}
      </Text>
      <TouchableOpacity onPress={onToggle} style={styles.toggleContainer}>
        <Text style={styles.toggleText}>
          {isRegister 
            ? 'Already have an account? ' 
            : "Don't have an account? "}
          <Text style={styles.toggleAction}>
            {isRegister ? 'Sign In' : 'Sign Up'}
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textDim,
    marginBottom: 16,
  },
  toggleContainer: {
    marginTop: 8,
  },
  toggleText: {
    fontSize: 14,
    color: Colors.light.textDim,
  },
  toggleAction: {
    color: Colors.light.tint,
    fontWeight: '600',
  },
});