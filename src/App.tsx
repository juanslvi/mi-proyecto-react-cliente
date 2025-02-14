import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TaskList from './components/TaskList';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TaskList />
    </QueryClientProvider>
  );
};

export default App;