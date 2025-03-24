// Notices.tsx (client side)
import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Modal,
    TextInput,
    TouchableOpacity,
    Button,
    AppState,
    AppStateStatus,
} from "react-native";
import axios from "axios";
import DatePicker from "react-native-date-picker";
import Icon from '@expo/vector-icons/Ionicons';
import * as Notifications from "expo-notifications";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { useRouter } from "expo-router";

const API_URL = "https://school-connect-server.up.railway.app";
const socket = io(API_URL);

interface Notice {
    _id: string;
    title: string;
    notice: string;
    date: string;
    time: string;
    user: string;
}

const Notices: React.FC = () => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newNotice, setNewNotice] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [currentNoticeId, setCurrentNoticeId] = useState<string | null>(null);
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [appState, setAppState] = useState(AppState.currentState);

    const role = useSelector((state: any) => state.auth.user?.role);

    const router = useRouter();

    // Function to handle app state changes
    const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
        if (appState.match(/inactive|background/) && nextAppState === 'active') {
            // App has come to the foreground
            socket.emit("fetch_notices");
        }
        setAppState(nextAppState);
    }, [appState]);

    useEffect(() => {
        // Set up app state change listener
        const subscription = AppState.addEventListener('change', handleAppStateChange);

        // Set up notification listeners
        const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                const noticeId = response.notification.request.content.data?.noticeId;
                if (noticeId) {
                    // Handle navigation to specific notice if needed
                    router.push("/Notices"); 
                }
            }
        );

        const foregroundSubscription = Notifications.addNotificationReceivedListener(
            async (notification) => {
                // console.log('Foreground notification received:', notification);
                // Optionally refresh notices when notification is received
                socket.emit("fetch_notices");
            }
        );

        return () => {
            subscription.remove();
            backgroundSubscription.remove();
            foregroundSubscription.remove();
        };
    }, [handleAppStateChange]);

    useEffect(() => {
        // console.log("User role:", role);
    }, [role]);

    useEffect(() => {
        socket.emit("fetch_notices");
        
        socket.on("notices", (data: Notice[]) => {
            setNotices(data);
        });

        socket.on("notice_added", async (newNotice: Notice) => {
            setNotices((prevNotices) => [...prevNotices, newNotice]);
            await sendPushNotification(newNotice);
        });

        socket.on("notice_updated", (updatedNotice: Notice) => {
            setNotices((prevNotices) =>
                prevNotices.map((notice) =>
                    notice._id === updatedNotice._id ? updatedNotice : notice
                )
            );
        });

        socket.on("notice_deleted", (deletedNoticeId: string) => {
            setNotices((prevNotices) =>
                prevNotices.filter((notice) => notice._id !== deletedNoticeId)
            );
        });

        return () => {
            socket.off("notices");
            socket.off("notice_added");
            socket.off("notice_updated");
            socket.off("notice_deleted");
        };
    }, []);

    // Enhanced push notification function
    const sendPushNotification = async (notice: Notice) => {
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: notice.title,
                    body: notice.notice,
                    data: { noticeId: notice._id },
                    sound: 'default',
                    priority: 'high',
                },
                trigger: null, // Send immediately
            });
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    };

    const handleDelete = (noticeId: string) => {
        socket.emit("delete_notice", noticeId);
    };

    const handleEditClick = (notice: Notice) => {
        setNewTitle(notice.title);
        setNewNotice(notice.notice);
        setDate(new Date(notice.date));
        setCurrentNoticeId(notice._id);
        setEditMode(true);
        setModalVisible(true);
    };

    const handleEdit = () => {
        if (newTitle && newNotice && currentNoticeId) {
            const updatedNotice = {
                id: currentNoticeId,
                title: newTitle,
                notice: newNotice,
                date: date.toISOString(),
                time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                user: "66de790a1f34eeb2296addaa",
            };
            socket.emit("edit_notice", updatedNotice);
            setNewTitle("");
            setNewNotice("");
            setModalVisible(false);
            setEditMode(false);
        } else {
            alert("Please fill in both the title and content.");
        }
    };

    const handleAddNotice = async () => {
        if (newTitle && newNotice) {
            const newNoticeItem = {
                title: newTitle,
                notice: newNotice,
                date: date.toISOString(),
                time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                user: "66de790a1f34eeb2296addaa",
            };

            socket.emit("add_notice", newNoticeItem);
            setNewTitle("");
            setNewNotice("");
            setModalVisible(false);
        } else {
            alert("Please fill in both the title and content.");
        }
    };

    const renderNoticeItem = ({ item }: { item: Notice }) => (
        <View style={styles.noticeItem}>
            <View style={styles.noticeContentContainer}>
                <Text style={styles.noticeTitle}>{item.title}</Text>
                <Text style={styles.noticeContent}>{item.notice}</Text>
                <Text style={styles.eventDateTime}>
                    {`Date: ${new Date(item.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                    })}\nTime: ${item.time}`}
                </Text>
            </View>
            {role === "Teacher" && (
                <View style={styles.noticeButtonContainer}>
                    <TouchableOpacity onPress={() => handleEditClick(item)}>
                        <Icon name="create-outline" size={16} color="#007BFF" style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item._id)}>
                        <Icon name="trash-outline" size={16} color="#F44336" style={styles.icon} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Notice Board</Text>
            <FlatList
                data={notices}
                keyExtractor={(item) => item._id}
                renderItem={renderNoticeItem}
            />
            {role === "Teacher" && (
                <View style={styles.addButtonContainer}>
                    <Button
                        title="Add Notice"
                        onPress={() => setModalVisible(true)}
                        color="#007BFF"
                    />
                </View>
            )}

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {editMode ? "Edit Notice" : "Add New Notice"}
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Title"
                            placeholderTextColor="#aaa"
                            value={newTitle}
                            onChangeText={setNewTitle}
                        />
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Content"
                            placeholderTextColor="#aaa"
                            value={newNotice}
                            onChangeText={setNewNotice}
                            multiline={true}
                            numberOfLines={4}
                        />
                        <Button
                            title="Select date-time"
                            onPress={() => setOpen(true)}
                        />
                        <DatePicker
                            modal
                            open={open}
                            date={date}
                            onConfirm={(selectedDate) => {
                                setOpen(false);
                                setDate(selectedDate);
                            }}
                            onCancel={() => {
                                setOpen(false);
                            }}
                        />
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.submitButton]}
                                onPress={editMode ? handleEdit : handleAddNotice}
                            >
                                <Text style={styles.buttonText}>
                                    {editMode ? "Update" : "Submit"}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => {
                                    setModalVisible(false);
                                    setEditMode(false);
                                }}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#FFFFFF",
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#333333",
        textAlign: "center",
    },
    noticeItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: 16,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 12,
        backgroundColor: "#F8F8F8",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 1,
    },
    noticeContentContainer: {
        flex: 1,
        marginRight: 10,
    },
    noticeTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333333",
    },
    noticeContent: {
        fontSize: 16,
        color: "#555555",
        marginTop: 4,
    },
    noticeButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        marginHorizontal: 4, // Space between icons
    },
    addButtonContainer: {
        marginTop: 16,
        backgroundColor: "#007BFF",
        borderRadius: 8,
        overflow: "hidden",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
    modalContent: {
        width: "85%",
        backgroundColor: "#FFFFFF",
        padding: 30,
        borderRadius: 12,
        elevation: 4,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333333",
        marginBottom: 15,
        textAlign: "center",
    },
    input: {
        width: "100%",
        padding: 12,
        borderWidth: 1,
        borderColor: "#CCCCCC",
        borderRadius: 8,
        backgroundColor: "#F5F5F5",
        color: "#333333",
        marginBottom: 12,
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    modalButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 15,
    },
    modalButton: {
        flex: 1,
        padding: 12,
        marginHorizontal: 5,
        borderRadius: 8,
        alignItems: "center",
    },
    submitButton: {
        backgroundColor: "#28A745",
    },
    cancelButton: {
        backgroundColor: "#DC3545",
    },
    buttonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 16,
    },
    eventDateTime: {
        paddingTop: 8,
        color: "#777777",
    },
});

export default Notices;
