import {
    Image,
    StyleSheet,
    Platform,
    Animated,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    RefreshControl,
    StatusBar,
    Modal,
    useColorScheme,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/authSlice";
import { RootState } from '@/types';
import { UnknownAction } from '@reduxjs/toolkit';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width } = Dimensions.get("window");

// Enhanced interfaces for autism-focused school app
interface ChildProgress {
    id: string;
    category: string;
    progress: number;
    lastActivity: string;
    mood?: string;
}

interface SchoolRoutine {
    id: string;
    timeStart: string;
    timeEnd: string;
    activity: string;
    icon: string;
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
}

// Same color palette for consistency
const COLORS = {
    primary: "#7C3AED",
    secondary: "#9333EA",
    calm: "#4F46E5",
    success: "#059669",
    warning: "#D97706",
    background: "#FAFAFA",
    surface: "#FFFFFF",
    surfaceHover: "#F9FAFB",
    text: "#1F2937",
    textLight: "#6B7280",
    textMuted: "#9CA3AF",
    border: "#E5E7EB",
    cardShadow: "rgba(0, 0, 0, 0.05)",
    accent1: "#F0FDFA",
    accent2: "#FDF2F8",
    accent3: "#EFF6FF",
};

const getLightColors = () => ({
    primary: "#7C3AED",
    secondary: "#9333EA",
    calm: "#4F46E5",
    success: "#059669",
    warning: "#D97706",
    background: "#FAFAFA",
    surface: "#FFFFFF",
    surfaceHover: "#F9FAFB",
    text: "#1F2937",
    textLight: "#6B7280",
    textMuted: "#9CA3AF",
    border: "#E5E7EB",
    cardShadow: "rgba(0, 0, 0, 0.05)",
    accent1: "#F0FDFA",
    accent2: "#FDF2F8",
    accent3: "#EFF6FF",
    modalOverlay: "rgba(0, 0, 0, 0.5)",
    iconBackground: "#F0FDFA",
});

const getDarkColors = () => ({
    primary: "#936AFF",
    secondary: "#A355FF",
    calm: "#6D64FF",
    success: "#10B981",
    warning: "#F59E0B",
    background: "#111827",
    surface: "#1F2937",
    surfaceHover: "#374151",
    text: "#F9FAFB",
    textLight: "#D1D5DB",
    textMuted: "#9CA3AF",
    border: "#374151",
    cardShadow: "rgba(0, 0, 0, 0.3)",
    accent1: "#042F2E",
    accent2: "#831843",
    accent3: "#172554",
    modalOverlay: "rgba(0, 0, 0, 0.7)",
    iconBackground: "#1F2937",
});

interface Profile {
    name: string;
    age: number;
    role: string;
    batch: string;
    phone: string;
    emergencyContact: string;
    address: string;
    username: string;
    email: string;
}

export default function SchoolDashboard() {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const colorScheme = useColorScheme();
    const COLORS = colorScheme === "dark" ? getDarkColors() : getLightColors();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleMessageTeacher = () => {
        navigation.navigate('message-teacher' as never);
    };

    const handleViewHomework = () => {
        navigation.navigate('view-homework' as never);
    };

    const handleLogout = () => {
        dispatch(logoutUser() as unknown as UnknownAction);
    };

    const [isProfileVisible, setIsProfileVisible] = useState(false);
    const [profile, setProfile] = useState<Profile>({
        name: user?.name || "N/A",
        age: user?.age || 0,
        role: user?.role || "N/A",
        batch: user?.batch || "N/A",
        phone: user?.phone || "N/A",
        emergencyContact: user?.emergencyContact || "N/A",
        address: user?.address || "N/A",
        username: user?.username || "N/A",
        email: user?.email || "N/A"
    });

    const [currentTime, setCurrentTime] = useState(new Date());
    const [childProgress, setChildProgress] = useState<ChildProgress[]>([
        {
            id: "1",
            category: "Academic Progress",
            progress: 75,
            lastActivity: "Mathematics",
            mood: "focused",
        },
        {
            id: "2",
            category: "Social Interaction",
            progress: 60,
            lastActivity: "Group Prayer",
            mood: "calm",
        },
        {
            id: "3",
            category: "Daily Participation",
            progress: 85,
            lastActivity: "Exercise Session",
            mood: "happy",
        },
    ]);

    const [schoolRoutines] = useState<SchoolRoutine[]>([
        {
            id: "1",
            timeStart: "9:00 AM",
            timeEnd: "9:30 AM",
            activity: "Prayer & Exercise",
            icon: "self-improvement",
            startHour: 9,
            startMinute: 0,
            endHour: 9,
            endMinute: 30,
        },
        {
            id: "2",
            timeStart: "9:30 AM",
            timeEnd: "12:30 PM",
            activity: "Learning Session",
            icon: "school",
            startHour: 9,
            startMinute: 30,
            endHour: 12,
            endMinute: 30,
        },
        {
            id: "3",
            timeStart: "12:30 PM",
            timeEnd: "1:30 PM",
            activity: "Lunch Break",
            icon: "restaurant",
            startHour: 12,
            startMinute: 30,
            endHour: 13,
            endMinute: 30,
        },
        {
            id: "4",
            timeStart: "1:30 PM",
            timeEnd: "2:30 PM",
            activity: "Homework Session",
            icon: "edit",
            startHour: 13,
            startMinute: 30,
            endHour: 14,
            endMinute: 30,
        },
    ]);

    const ProfileModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isProfileVisible}
            onRequestClose={() => setIsProfileVisible(false)}
        >
            <ThemedView
                style={[
                    styles.modalOverlay,
                    { backgroundColor: COLORS.modalOverlay },
                ]}
            >
                <ThemedView
                    style={[
                        styles.modalContent,
                        {
                            backgroundColor: COLORS.surface,
                            shadowColor: COLORS.cardShadow,
                        },
                    ]}
                >
                    <ThemedView style={styles.modalHeader}>
                        <TouchableOpacity
                            style={[
                                styles.closeButton,
                                { backgroundColor: COLORS.surfaceHover },
                            ]}
                            onPress={() => setIsProfileVisible(false)}
                        >
                            <MaterialIcons
                                name="close"
                                size={24}
                                color={COLORS.textLight}
                            />
                        </TouchableOpacity>
                    </ThemedView>

                    <ThemedView style={styles.profileHeader}>
                        <Image
                            source={require("@/assets/images/profile.png")}
                            style={styles.profileImage}
                        />
                        <LinearGradient
                            colors={[COLORS.primary, COLORS.secondary]}
                            style={styles.editButton}
                        >
                            <MaterialIcons
                                name="edit"
                                size={20}
                                color={COLORS.surface}
                            />
                        </LinearGradient>
                    </ThemedView>

                    <ThemedText
                        style={[styles.profileName, { color: COLORS.text }]}
                    >
                        {profile.name}
                    </ThemedText>
                    <ThemedText
                        style={[
                            styles.profileGrade,
                            { color: COLORS.textLight },
                        ]}
                    >
                        {profile.role}
                    </ThemedText>

                    <ScrollView style={styles.profileDetails}>
                        <ProfileInfoItem
                            icon="badge"
                            label="Username"
                            value={profile.username}
                        />
                        <ProfileInfoItem
                            icon="calendar-today"
                            label="Batch"
                            value={profile.batch}
                        />
                        <ProfileInfoItem
                            icon="person"
                            label="Age"
                            value={`${profile.age} years`}
                        />
                        <ProfileInfoItem
                            icon="phone"
                            label="Contact"
                            value={profile.phone}
                        />
                        <ProfileInfoItem
                            icon="location-on"
                            label="Address"
                            value={profile.address}
                        />
                        <ProfileInfoItem
                            icon="emergency"
                            label="Emergency Contact"
                            value={profile.emergencyContact}
                        />
                        <ProfileInfoItem
                            icon="email"
                            label="Email"
                            value={profile.email}
                        />
                    </ScrollView>

                    <TouchableOpacity
                        style={[
                            styles.logoutButton,
                            {
                                backgroundColor:
                                    colorScheme === "dark"
                                        ? COLORS.accent2
                                        : COLORS.accent2,
                            },
                        ]}
                    >
                        <MaterialIcons
                            name="logout"
                            size={20}
                            color={COLORS.warning}
                        />
                        <ThemedText
                            onPress={handleLogout}
                            style={[
                                styles.logoutText,
                                { color: COLORS.warning },
                            ]}
                        >
                            Logout
                        </ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ThemedView>
        </Modal>
    );

    const ProfileInfoItem: React.FC<{
        icon: string;
        label: string;
        value: string;
    }> = ({ icon, label, value }) => (
        <ThemedView
            style={[styles.infoItem, { borderBottomColor: COLORS.border }]}
        >
            <ThemedView
                style={[
                    styles.infoIcon,
                    { backgroundColor: COLORS.iconBackground },
                ]}
            >
                <MaterialIcons
                    name={icon as any}
                    size={20}
                    color={COLORS.primary}
                />
            </ThemedView>
            <ThemedView style={styles.infoContent}>
                <ThemedText
                    style={[styles.infoLabel, { color: COLORS.textLight }]}
                >
                    {label}
                </ThemedText>
                <ThemedText style={[styles.infoValue, { color: COLORS.text }]}>
                    {value}
                </ThemedText>
            </ThemedView>
        </ThemedView>
    );

    // Update current time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, []);

    const getActivityStatus = (routine: SchoolRoutine) => {
        const now = currentTime;
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        const startTime = routine.startHour * 60 + routine.startMinute;
        const endTime = routine.endHour * 60 + routine.endMinute;
        const currentTimeInMinutes = currentHour * 60 + currentMinute;

        if (currentTimeInMinutes < startTime) {
            return "upcoming";
        } else if (
            currentTimeInMinutes >= startTime &&
            currentTimeInMinutes < endTime
        ) {
            return "inProgress";
        } else {
            return "completed";
        }
    };

    // Animation setup remains the same
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    useEffect(() => {
        startAnimations();
        StatusBar.setBarStyle("dark-content");
    }, []);

    const startAnimations = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 20,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const ProgressCard: React.FC<{ progress: ChildProgress }> = ({
        progress,
    }) => (
        <Animated.View
            style={[styles.progressCard, { transform: [{ scale: scaleAnim }] }]}
        >
            <LinearGradient
                colors={[COLORS.accent1, COLORS.accent3]}
                style={styles.progressGradient}
            >
                <ThemedView style={styles.progressHeader}>
                    <MaterialIcons
                        name={
                            progress.category === "Academic Progress"
                                ? "menu-book"
                                : progress.category === "Social Interaction"
                                ? "people"
                                : "stars"
                        }
                        size={24}
                        color={COLORS.primary}
                    />
                    <ThemedText style={styles.progressTitle}>
                        {progress.category}
                    </ThemedText>
                </ThemedView>
                <ThemedView style={styles.progressBar}>
                    <Animated.View
                        style={[
                            styles.progressFill,
                            { width: `${progress.progress}%` },
                        ]}
                    />
                </ThemedView>
                <ThemedText style={styles.progressText}>
                    Current: {progress.lastActivity}
                </ThemedText>
            </LinearGradient>
        </Animated.View>
    );

    const RoutineCard: React.FC<{ routine: SchoolRoutine }> = ({ routine }) => {
        const status = getActivityStatus(routine);
        return (
            <TouchableOpacity style={styles.routineCard} activeOpacity={0.7}>
                <ThemedView
                    style={[
                        styles.routineIcon,
                        {
                            backgroundColor:
                                status === "completed"
                                    ? COLORS.accent1
                                    : status === "inProgress"
                                    ? COLORS.accent2
                                    : COLORS.accent3,
                        },
                    ]}
                >
                    <MaterialIcons
                        name={routine.icon as any}
                        size={24}
                        color={COLORS.primary}
                    />
                </ThemedView>
                <ThemedView style={styles.routineInfo}>
                    <ThemedText style={styles.routineTime}>
                        {routine.timeStart} - {routine.timeEnd}
                    </ThemedText>
                    <ThemedText style={styles.routineActivity}>
                        {routine.activity}
                    </ThemedText>
                </ThemedView>
                <MaterialIcons
                    name={
                        status === "completed"
                            ? "check-circle"
                            : status === "inProgress"
                            ? "pending"
                            : "schedule"
                    }
                    size={24}
                    color={
                        status === "completed"
                            ? COLORS.success
                            : status === "inProgress"
                            ? COLORS.warning
                            : COLORS.textLight
                    }
                />
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: COLORS.background }]}
            showsVerticalScrollIndicator={false}
        >
            <ThemedView
                style={[
                    styles.header,
                    {
                        backgroundColor: COLORS.surface,
                        shadowColor: COLORS.cardShadow,
                    },
                ]}
            >
                <ThemedView style={styles.headerContent}>
                    <ThemedView style={styles.headerTop}>
                        <TouchableOpacity
                            onPress={() => setIsProfileVisible(true)}
                        >
                            <Image
                                source={require("@/assets/images/profile.png")}
                                style={styles.childAvatar}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.helpButton}>
                            <MaterialIcons
                                name="notifications"
                                size={24}
                                color={COLORS.primary}
                            />
                        </TouchableOpacity>
                    </ThemedView>
                    <ThemedText
                        style={[styles.welcomeText, { color: COLORS.text }]}
                    >
                        Hello, {profile.name}!
                    </ThemedText>
                    <ThemedText
                        style={[styles.subtitle, { color: COLORS.textLight }]}
                    >
                        Your School Day Overview
                    </ThemedText>
                </ThemedView>
            </ThemedView>

            <ProfileModal />

            <ThemedView style={styles.content}>
                {/* Progress Section */}
                <ThemedView style={styles.section}>
                    <ThemedText
                        style={[styles.sectionTitle, { color: COLORS.text }]}
                    >
                        Today's Progress
                    </ThemedText>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.progressContainer}
                    >
                        {childProgress.map((progress) => (
                            <ProgressCard
                                key={progress.id}
                                progress={progress}
                            />
                        ))}
                    </ScrollView>
                </ThemedView>

                {/* School Schedule */}
                <ThemedView style={styles.section}>
                    <ThemedView style={styles.sectionHeader}>
                        <ThemedText
                            style={[
                                styles.sectionTitle,
                                { color: COLORS.text },
                            ]}
                        >
                            School Schedule
                        </ThemedText>
                        <ThemedText
                            style={[
                                styles.currentTime,
                                { color: COLORS.primary },
                            ]}
                        >
                            {currentTime.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </ThemedText>
                    </ThemedView>
                    {schoolRoutines.map((routine) => (
                        <RoutineCard key={routine.id} routine={routine} />
                    ))}
                </ThemedView>

                {/* Quick Actions */}
                <ThemedView style={styles.quickActions}>
                    <TouchableOpacity 
                        style={styles.actionButton} 
                        onPress={handleMessageTeacher}
                    >
                        <LinearGradient
                            colors={[COLORS.accent1, COLORS.accent3]}
                            style={styles.actionGradient}
                        >
                            <MaterialIcons
                                name="message"
                                size={24}
                                color={COLORS.primary}
                            />
                            <ThemedText
                                style={[
                                    styles.actionText,
                                    { color: COLORS.text },
                                ]}
                            >
                                Message Teacher
                            </ThemedText>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.actionButton} 
                        onPress={handleViewHomework}
                    >
                        <LinearGradient
                            colors={[COLORS.accent2, COLORS.accent1]}
                            style={styles.actionGradient}
                        >
                            <MaterialIcons
                                name="assignment"
                                size={24}
                                color={COLORS.primary}
                            />
                            <ThemedText
                                style={[
                                    styles.actionText,
                                    { color: COLORS.text },
                                ]}
                            >
                                View Homework
                            </ThemedText>
                        </LinearGradient>
                    </TouchableOpacity>
                </ThemedView>

                {/* Support Section */}
                <TouchableOpacity style={styles.supportCard}>
                    <ThemedView style={styles.supportContent}>
                        <MaterialIcons
                            name="help"
                            size={32}
                            color={COLORS.primary}
                        />
                        <ThemedView style={styles.supportText}>
                            <ThemedText
                                style={[
                                    styles.supportTitle,
                                    { color: COLORS.text },
                                ]}
                            >
                                Need Help?
                            </ThemedText>
                            <ThemedText
                                style={[
                                    styles.supportSubtitle,
                                    { color: COLORS.textLight },
                                ]}
                            >
                                Contact school support
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>
                    <MaterialIcons
                        name="arrow-forward-ios"
                        size={20}
                        color={COLORS.textLight}
                    />
                </TouchableOpacity>
            </ThemedView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        backgroundColor: COLORS.surface,
        paddingTop: Platform.OS === "ios" ? 60 : 40,
        paddingBottom: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        ...Platform.select({
            ios: {
                shadowColor: COLORS.cardShadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    headerContent: {
        paddingHorizontal: 20,
    },
    headerTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    childAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    helpButton: {
        padding: 10,
        backgroundColor: COLORS.accent1,
        borderRadius: 12,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: "bold",
        color: COLORS.text,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textLight,
    },
    content: {
        padding: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.text,
    },
    viewAllButton: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: "600",
    },
    progressContainer: {
        paddingRight: 20,
    },
    progressCard: {
        width: width * 0.7,
        marginRight: 16,
        borderRadius: 16,
        overflow: "hidden",
    },
    progressGradient: {
        padding: 16,
    },
    progressHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    progressTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.text,
        marginLeft: 8,
    },
    progressBar: {
        height: 8,
        backgroundColor: COLORS.border,
        borderRadius: 4,
        marginVertical: 8,
    },
    progressFill: {
        height: "100%",
        backgroundColor: COLORS.primary,
        borderRadius: 4,
    },
    progressText: {
        fontSize: 14,
        color: COLORS.textLight,
        marginTop: 8,
    },
    routineCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        marginBottom: 12,
        ...Platform.select({
            ios: {
                shadowColor: COLORS.cardShadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    routineIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    routineInfo: {
        flex: 1,
        marginLeft: 12,
    },
    routineTime: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 4,
    },
    routineActivity: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.text,
    },
    quickActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 24,
    },
    actionButton: {
        flex: 1,
        marginHorizontal: 6,
    },
    actionGradient: {
        padding: 16,
        borderRadius: 16,
        alignItems: "center",
    },
    actionText: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.text,
        marginTop: 8,
    },
    supportCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        marginBottom: 24,
        ...Platform.select({
            ios: {
                shadowColor: COLORS.cardShadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    supportContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    supportText: {
        marginLeft: 12,
    },
    supportTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.text,
    },
    currentTime: {
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: "600",
    },
    supportSubtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        marginTop: 2,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: width * 0.9,
        maxHeight: "80%",
        borderRadius: 24,
        paddingVertical: 20,
        ...Platform.select({
            ios: {
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    modalHeader: {
        alignItems: "flex-end",
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    closeButton: {
        padding: 8,
        borderRadius: 20,
    },
    profileHeader: {
        alignItems: "center",
        marginBottom: 16,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
    },
    editButton: {
        position: "absolute",
        right: width * 0.25,
        bottom: 12,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        ...Platform.select({
            ios: {
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    profileName: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 4,
    },
    profileGrade: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },
    profileDetails: {
        paddingHorizontal: 20,
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    infoIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 14,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: "500",
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        paddingVertical: 12,
        marginHorizontal: 20,
        borderRadius: 12,
    },
    logoutText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: "600",
    },
});
