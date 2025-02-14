import React, { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import axios from 'axios';

import styled from 'styled-components'; // Import styled-components
import TaskForm from './TaskForm';

interface Task {
  id: number;
  nombre_tarea: string;
  descripcion: string;
  estado: 'Pendiente' | 'En progreso' | 'Completado';
  createdAt: string;
}

const TaskList: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { isLoading, error, data: tasks, refetch } = useQuery({
    queryKey: ['tasks'], // Use an array for more complex keys
    queryFn: async () => {
      const response = await axios.get('/api/tasks');
      return response.data;
    },
    
    staleTime: 60 * 1000, // Data is considered fresh for 1 minute
    gcTime : 300 * 1000, // Data is kept in cache for 5 minutes
    retry: 3, // Retry the query 3 times if it fails    
  });

  if (isLoading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Container>
        <Banner>
        <BannerLink href="/">Inicio</BannerLink>
        <BannerLink href="/tasks">Tareas</BannerLink>
      </Banner>

      <Title>Lista de Tareas</Title>
      <CreateButton onClick={() => setIsCreating(true)}>Crear Tarea</CreateButton>

      {isCreating && <TaskForm onClose={() => setIsCreating(false)} />}
      {editingTask && <TaskForm task={editingTask} onClose={() => setEditingTask(null)} />}

      <TaskListUl>        
        {(tasks ?? []).map((task: Task) => ( // Tipado explícito aquí
          <TaskItem key={task.id}>
            <TaskName>Tarea: {task.nombre_tarea}</TaskName>
            <TaskDescription>Descripcion: {task.descripcion}</TaskDescription>
            <TaskStatus>Estado: {task.estado}</TaskStatus>
            <TaskCreatedAt>Creada: {new Date(task.createdAt).toLocaleDateString()}</TaskCreatedAt>
            <EditButton onClick={() => setEditingTask(task)}>Editar</EditButton>
          </TaskItem>
        ))}
      </TaskListUl>
    </Container>
  );
};

export default TaskList;

// Estilos con styled-components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: sans-serif;
  background-color: #f4f4f4; // Color de fondo
`;

const Banner = styled.div`
   background: linear-gradient(to right, #F3B07C, #FFD8A8); /* Degradado de izquierda a derecha */
  padding: 10px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const BannerLink = styled.a`
  text-decoration: none;
  color: #333;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 4px;

  &:hover {
    background-color: #ddd;
  }
`;

const Title = styled.h2`
  color: #F07C1E; // Color del título
  margin-bottom: 20px;
`;

const CreateButton = styled.button`
  padding: 10px 20px;
  background-color: #EB7E28; // Color del botón crear
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    background-color: #F07C1E; // Color al pasar el cursor
  }
`;

const TaskListUl = styled.ul`
  list-style: none;
  padding: 0;
  width: 80%;
`;

const TaskItem = styled.li`
  border: none; // Sin borde
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 8px; // Bordes redondeados
  background-color: #FBE5CC; // Color de fondo de la tarea
  box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
  transition: transform 0.2s ease-in-out; // Transición para el hover

  &:hover {
    transform: scale(1.02); // Ligero aumento al pasar el cursor
    background-color: #FFF9E1; // Color de fondo al pasar el cursor
  }
`;

const TaskName = styled.h3`
  margin-top: 0;
  color: #F07C1E; // Color del nombre de la tarea
`;

const TaskDescription = styled.p`
  margin-bottom: 5px;
  color: #333; // Color de la descripción
`;

const TaskStatus = styled.p`
  font-style: italic;
  color: #777;
`;

const TaskCreatedAt = styled.p`
  font-size: smaller;
  color: gray;
`;

const EditButton = styled.button`
  padding: 5px 10px;
  background-color: #EB7E28; // Color del botón editar
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #F07C1E; // Color al pasar el cursor
  }
`;