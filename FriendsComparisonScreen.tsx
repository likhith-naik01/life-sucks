import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const friendsData = {
  labels: ['You 👤', 'Alex 🧠', 'Sam 🎯', 'Jamie 💪', 'Riley 🚀'],
  datasets: [
    {
      data: [75, 50, 90, 60, 80], // Percentages of task completion
    },
  ],
};

const chartConfig = {
  backgroundGradientFrom: '#e0f7fa', // pale blue
  backgroundGradientTo: '#e0f7fa',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 102, 204, ${opacity})`, // darker blue bars
  labelColor: (opacity = 1) => `rgba(0, 51, 102, ${opacity})`, // label color
  propsForBackgroundLines: {
    stroke: '#b3d9ff',
  },
  barPercentage: 0.6,
  useShadowColorFromDataset: false,
};

const FriendsComparisonScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📊 Friends Progress</Text>
      <BarChart
        data={friendsData}
        width={screenWidth - 30}
        height={260}
        chartConfig={chartConfig}
        verticalLabelRotation={0}
        style={styles.chart}
        showBarTops={true}
        withInnerLines={true}
      />
    </ScrollView>
  );
};

export default FriendsComparisonScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f7fa', // light blue background
    paddingTop: 60,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004d99',
    textAlign: 'center',
    marginBottom: 20,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 10,
  },
});
