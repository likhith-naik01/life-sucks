import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get("window").width;

const Stack = createStackNavigator();

type Task = { id: string; title: string; completed: boolean };

const YourMainScreen = ({ navigation }) => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [streak, setStreak] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState('');
  const [lastCompletedDate, setLastCompletedDate] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isRewardDelayed, setIsRewardDelayed] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    saveData();
  }, [tasks, streak, lastActiveDate]);

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

  const renderItem = ({ item }: { item: Task }) => (
    <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)} style={styles.taskItem}>
      <Text style={[styles.taskText, item.completed && styles.taskDone]}>{item.title}</Text>
    </TouchableOpacity>
  );

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

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ marginTop: 20 }}
      />

      <TouchableOpacity
        style={styles.friendsButton}
        onPress={() => navigation.navigate('FriendsComparison')}
      >
        <Text style={styles.buttonText}>See How Friends Are Doing</Text>
      </TouchableOpacity>
    </View>
  );
};

const FriendsComparisonScreen = () => {
  const friendsData = [
    { name: 'Friend 1', completion: 80 },
    { name: 'Friend 2', completion: 55 },
    { name: 'Friend 3', completion: 90 },
    { name: 'Friend 4', completion: 60 },
  ];

  const barData = {
    labels: friendsData.map(friend => friend.name),
    datasets: [
      {
        data: friendsData.map(friend => friend.completion),
      },
    ],
  };

  return (
    <View style={styles.friendsContainer}>
      <Text style={styles.friendsTitle}>Friends' Task Completion</Text>
      <BarChart
        data={barData}
        width={screenWidth - 40}
        height={220}
        yAxisLabel="%"
        yAxisSuffix=" %"
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#ff9800',
          backgroundGradientTo: '#ff5722',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="YourMainScreen">
        <Stack.Screen name="YourMainScreen" component={YourMainScreen} />
        <Stack.Screen name="FriendsComparison" component={FriendsComparisonScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: '#E3F2FD',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2196F3',
    textAlign: 'center',
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  streak: {
    fontSize: 18,
    color: '#E91E63',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#B3E5FC',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  taskItem: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  taskText: {
    fontSize: 18,
    color: '#333',
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  friendsButton: {
    backgroundColor: '#FF4081',
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  friendsContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E3F2FD',
  },
  friendsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2196F3',
    marginBottom: 20,
  },
});

export default App;
