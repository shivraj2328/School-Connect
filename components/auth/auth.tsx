import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { loginUser, registerUser, clearError } from '@/redux/authSlice';
import { Colors } from '@/constants/Colors';
import { RegisterFormData } from '@/types/auth';

const windowHeight = Dimensions.get('window').height;

function Auth() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    role: 'Student',
    batch: 'morning',
    phone: '',
    emergencyContact: '',
    address: '',
    username: '',
  });

  useEffect(() => {
    if (error) {
      Alert.alert(
        isRegister ? 'Registration Error' : 'Login Error',
        error,
        [
          {
            text: 'OK',
            onPress: () => dispatch(clearError())
          }
        ]
      );
    }
  }, [error]);

  const validateForm = () => {
    if (isRegister) {
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Validation Error', 'Passwords do not match. Please check and try again.');
        return false;
      }
      if (!formData.name || !formData.email || !formData.password || !formData.age || 
          !formData.phone || !formData.address || !formData.username) {
        Alert.alert('Validation Error', 'Please fill in all required fields to continue.');
        return false;
      }
      if (formData.role === 'Student' && !formData.batch) {
        Alert.alert('Validation Error', 'Please select your preferred batch timing.');
        return false;
      }
    } else {
      if (!formData.email || !formData.password) {
        Alert.alert('Validation Error', 'Please enter both email and password to login.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (isRegister) {
        // Prepare registration data with type conversion
        const registerData: RegisterFormData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          age: parseInt(formData.age), // Convert age to number
          role: formData.role,
          batch: formData.batch,
          emergencyContact: formData.emergencyContact,
          address: formData.address,
          username: formData.username
        };

        const result = await dispatch(registerUser(registerData));
        if (registerUser.fulfilled.match(result)) {
          Alert.alert('Success', 'Your account has been created successfully!');
        }
      } else {
        const result = await dispatch(loginUser({
          email: formData.email,
          password: formData.password,
        }));
        if (loginUser.fulfilled.match(result)) {
          console.log('Login successful');
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
    }
  };

  const handleChange = (name: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            !isRegister && styles.centerLoginForm
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.header}>
              <Text style={styles.title}>
                {isRegister ? 'Create Account' : 'Welcome Back'}
              </Text>
              <Text style={styles.subtitle}>
                {isRegister ? 'Sign up to get started!' : 'Sign in to continue'}
              </Text>
            </View>

            {isRegister && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={formData.name}
                  onChangeText={(text) => handleChange('name', text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  value={formData.username}
                  onChangeText={(text) => handleChange('username', text)}
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Age"
                  value={formData.age}
                  onChangeText={(text) => handleChange('age', text)}
                  keyboardType="numeric"
                />
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.role}
                    onValueChange={(value) => handleChange('role', value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Student" value="Student" />
                    <Picker.Item label="Teacher" value="Teacher" />
                    <Picker.Item label="Intern" value="Intern" />
                  </Picker>
                </View>
                
                {formData.role === 'Student' && (
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={formData.batch}
                      onValueChange={(value) => handleChange('batch', value)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Morning" value="morning" />
                      <Picker.Item label="Afternoon" value="afternoon" />
                      <Picker.Item label="Both" value="Both" />
                    </Picker>
                  </View>
                )}
                
                <TextInput
                  style={styles.input}
                  placeholder="Phone"
                  value={formData.phone}
                  onChangeText={(text) => handleChange('phone', text)}
                  keyboardType="phone-pad"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Emergency Contact"
                  value={formData.emergencyContact}
                  onChangeText={(text) => handleChange('emergencyContact', text)}
                  keyboardType="phone-pad"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  value={formData.address}
                  onChangeText={(text) => handleChange('address', text)}
                  multiline
                  numberOfLines={3}
                />
              </>
            )}

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Password"
                value={formData.password}
                onChangeText={(text) => handleChange('password', text)}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>

            {isRegister && (
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(text) => handleChange('confirmPassword', text)}
                secureTextEntry={!showPassword}
              />
            )}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {isRegister ? 'Register' : 'Login'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsRegister(!isRegister)}
              style={styles.toggleButton}
            >
              <Text style={styles.toggleText}>
                {isRegister
                  ? 'Already have an account? Login'
                  : "Don't have an account? Register"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  centerLoginForm: {
    justifyContent: 'center',
    minHeight: windowHeight,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: Platform.OS === 'ios' ? 20 : 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textDim,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.light.inputBg,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  pickerContainer: {
    backgroundColor: Colors.light.inputBg,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.light.border,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 15,
  },
  passwordInput: {
    marginBottom: 0,
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 12,
    padding: 5,
  },
  button: {
    backgroundColor: Colors.light.primary,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleText: {
    color: Colors.light.primary,
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FF3B30',
    marginTop: 10,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Auth;