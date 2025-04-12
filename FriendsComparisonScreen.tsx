import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const FriendsComparisonScreen = () => {
  const [friendsProgress, setFriendsProgress] = useState([
    { name: 'Alice', progress: 80 },
    { name: 'Bob', progress: 50 },
    { name: 'Charlie', progress: 75 },
    { name: 'David', progress: 60 },
  ]);

  const data = {
    labels: friendsProgress.map((friend) => friend.name),
    datasets: [
      {
        data: friendsProgress.map((friend) => friend.progress),
        color: (opacity = 1) => `rgba(3, 155, 229, ${opacity})`, // Blue
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#e0f7fa',
    backgroundGradientFrom: '#e0f7fa',
    backgroundGradientTo: '#e0f7fa',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends' Task Completion</Text>
      <BarChart
        data={data}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        verticalLabelRotation={30}
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: '#e0f7fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#039be5',
    textAlign: 'center',
  },
  chart: {
    marginTop: 20,
    borderRadius: 16,
  },
});

export default FriendsComparisonScreen;
