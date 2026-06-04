import { StyleSheet } from 'react-native';

export const shared = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#fff' },
  topButton:     { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  list:          { padding: 24, gap: 12 },
  bottomButtons: { flexDirection: 'row', paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 },
  gap:           { width: 12 },
  empty:         { textAlign: 'center', color: '#999', marginTop: 40 },
  card: {
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
});
