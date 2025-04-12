// YourMainScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';

type Task = { id: string; title: string; completed: boolean };

export default function YourMainScreen() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [streak, setStreak] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState('');
  const [lastCompletedDate, setLastCompletedDate] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isRewardDelayed, setIsRewardDelayed] = useState(false);

  const navigation = useNavigation(); // ✅ Now you can navigate

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [tasks, streak, lastActiveDate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFocused && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFocused, timer]);

  const saveData = async () => {
    try {
      await AsyncStorage.multiSet([
        ['tasks', JSON.stringify(tasks)],
        ['streak', streak.toString()],
        ['lastActiveDate', lastActiveDate],
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save data');
    }
  };

  const loadData = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const storedStreak = await AsyncStorage.getItem('streak');
      const storedDate = await AsyncStorage.getItem('lastActiveDate');

      if (storedTasks) setTasks(JSON.parse(storedTasks));
      if (storedStreak) setStreak(parseInt(storedStreak));
      if (storedDate) setLastActiveDate(storedDate);
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    }
  };

  const getToday = () => new Date().toISOString().slice(0, 10);

  const updateStreak = () => {
    const today = getToday();
    if (lastActiveDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    if (lastActiveDate === yesterdayStr) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(1);
    }

    setLastActiveDate(today);
  };

  const addTask = () => {
    const currentDate = new Date().toLocaleDateString();

    if (task.trim() === '') return;

    const newTask = { id: uuid.v4(), title: task.trim(), completed: false };

    if (lastCompletedDate === currentDate) {
      setStreak(streak + 1);
    } else {
      setStreak(1);
    }

    setLastCompletedDate(currentDate);
    setTasks([newTask, ...tasks]);
    setTask('');
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const startFocusMode = () => {
    setTimer(25 * 60);
    setIsFocused(true);
  };

  const delayReward = () => {
    setIsRewardDelayed(true);
    setTimeout(() => {
      setIsRewardDelayed(false);
    }, 2000);
  };

  const renderItem = ({ item }: { item: Task }) => (
    <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)} style={styles.taskItem}>
      <Text style={[styles.taskText, item.completed && styles.taskDone]}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Life Sucks 🧠</Text>
      <Text style={styles.streak}>🔥 Streak: {streak} {streak === 1 ? 'day' : 'days'}</Text>
      <Text>{`${Math.floor(timer / 60)}:${timer % 60}`}</Text>

      <TextInput
        value={task}
        onChangeText={setTask}
        placeholder="Type a task..."
        style={styles.input}
        onSubmitEditing={addTask}
        returnKeyType="done"
      />

      <TouchableOpacity onPress={addTask} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('FriendsComparison')} style={styles.compareButton}>
        <Text style={{ color: '#fff' }}>👀 See how friends are working</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 80, paddingHorizontal: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, color: '#222', textAlign: 'center' },
  streak: { fontSize: 18, color: '#e91e63', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 12, padding: 12, fontSize: 16, backgroundColor: '#f9f9f9' },
  addButton: { marginTop: 10, backgroundColor: '#222', padding: 12, borderRadius: 12, alignItems: 'center' },
  addButtonText: { color: '#fff', fontSize: 16 },
  compareButton: { marginTop: 10, backgroundColor: '#4caf50', padding: 12, borderRadius: 12, alignItems: 'center' },
  taskItem: { padding: 12, marginVertical: 6, borderRadius: 10, backgroundColor: '#f0f0f0' },
  taskText: { fontSize: 18, color: '#333' },
  taskDone: { textDecorationLine: 'line-through', color: '#888' },
});
