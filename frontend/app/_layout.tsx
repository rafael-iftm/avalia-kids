import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      initialRouteName="(tabs)/index"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1B3C87',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* O Stack gerenciará automaticamente as rotas */}
    </Stack>
  );
}
