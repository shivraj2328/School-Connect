// components/common/InputField.tsx
import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onIconPress?: () => void;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  icon,
  onIconPress,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputContainer,
        error ? styles.inputError : null,
      ]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.light.textDim}
          {...props}
        />
        {icon && (
          <TouchableOpacity onPress={onIconPress} style={styles.icon}>
            <Ionicons name={icon} size={20} color={Colors.light.textDim} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: Colors.light.text,
  },
  inputError: {
    borderColor: Colors.light.error,
  },
  errorText: {
    fontSize: 12,
    color: Colors.light.error,
    marginTop: 4,
  },
  icon: {
    padding: 8,
  },
});