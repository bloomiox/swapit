import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const RequestsScreen = () => {
  // Sample data for requests
  const requests = [
    { id: '1', item: 'Vintage Camera', from: 'John D.', status: 'Pending' },
    { id: '2', item: 'Leather Jacket', from: 'Sarah M.', status: 'Accepted' },
    { id: '3', item: 'Cookbook Collection', from: 'Mike R.', status: 'Declined' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted': return '#4CAF50';
      case 'Declined': return '#F44336';
      default: return '#FF9800';
    }
  };

  const renderRequest = ({ item }) => (
    <View style={styles.requestCard}>
      <View style={styles.requestInfo}>
        <Text style={styles.requestItem}>{item.item}</Text>
        <Text style={styles.requestFrom}>From: {item.from}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Requests</Text>
      <FlatList
        data={requests}
        renderItem={renderRequest}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listContainer: {
    padding: 15,
  },
  requestCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  requestInfo: {
    flex: 1,
  },
  requestItem: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  requestFrom: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default RequestsScreen;