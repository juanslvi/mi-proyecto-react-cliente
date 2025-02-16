import React, { useState } from 'react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'axios';

import styled from 'styled-components'; // Import styled-components
import TaskForm from './TaskForm';

import { toast, ToastContainer } from 'react-toastify'; // Importa toast y ToastContainer
import 'react-toastify/dist/ReactToastify.css';

//Se que esto no va aqui
axios.defaults.baseURL = 'http://localhost:5000';

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

  const [filterName, setFilterName] = useState(''); // Estado para el filtro

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

  const queryClient = useQueryClient();

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/api/tasks/${id}`);
    },
    onSuccess: () => {
      toast.success('¡Tarea eliminada correctamente!');
      queryClient.invalidateQueries({ queryKey: ['tasks'] }); // Refresca la lista de tareas
    },
    onError: (error) => {
      console.error("Error al eliminar la tarea:", error);
      toast.error('La tarea no se pudo eliminar correctamente!');
      // Aquí puedes mostrar un mensaje de error al usuario
    },
  });

  const handleDelete = (task: Task) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la tarea "${task.nombre_tarea}"?`)) {
      deleteTaskMutation.mutate(task.id);
    }
  };

  // Filtrar tareas
  // Filtrar tareas
  const filteredTasks = (tasks ?? []).filter((task: Task) =>  // Tipado explícito aquí
      task.nombre_tarea.toLowerCase().includes(filterName.toLowerCase())
  );

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

      <FilterContainer>
        <FilterLabel htmlFor="filterName">Filtrar por nombre:</FilterLabel>
        <FilterInput
          type="text"
          id="filterName"
          value={filterName}
          onChange={e => setFilterName(e.target.value)}
          placeholder="Escribe un nombre..."
        />
      </FilterContainer>

      {isCreating && <TaskForm onClose={() => setIsCreating(false)} />}
      {editingTask && <TaskForm task={editingTask} onClose={() => setEditingTask(null)} />}

      <TaskListUl>
        {filteredTasks.map((task: Task) => (
          <TaskItem key={task.id}>
            <TaskContent> 
              <TaskName>Tarea: {task.nombre_tarea}</TaskName>
              <TaskCreatedAt>Creada: {new Date(task.createdAt).toLocaleDateString()}</TaskCreatedAt>
              <TaskDescription>Descripcion: {task.descripcion}</TaskDescription>
              <TaskStatus>Estado: {task.estado}</TaskStatus>
            </TaskContent>
            <TaskActions> 
                <TaskImageContainer>
                    <TaskImage src='./pdf.png' alt='imagen' title='Consultar PDF'/>
                </TaskImageContainer>
                <ButtonContainer>
                    <EditButton onClick={() => setEditingTask(task)}>Editar</EditButton>
                    <DeleteButton onClick={() => handleDelete(task)}>Eliminar</DeleteButton>
                </ButtonContainer>
            </TaskActions>
          </TaskItem>
        ))}
      </TaskListUl>
      <ToastContainer />
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
  background-color: #f4f4f4;
  min-height: 100vh; // Ensure container takes full viewport height
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

const TaskContent = styled.div`
  flex: 1; /* Allow content to grow and take available space */
  margin-bottom: 10px; // Add some margin for smaller screens
  @media (min-width: 768px) {
    margin-bottom: 0; // Remove margin on larger screens
  }
`;

const TaskActions = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
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
  width: 90%; // Occupy most of the container width
  max-width: 900px; // Set a maximum width for larger screens
`;

const TaskItem = styled.li`
  border: none;
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 8px;
  background-color: #FBE5CC;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  display: flex;       // Use flexbox for layout
  flex-direction: column; // Stack elements vertically by default
  align-items: flex-start; // Align items to the start (left on larger screens)

  @media (min-width: 768px) { // Adjust breakpoint as needed
    flex-direction: row;   // Switch to row layout on larger screens
    align-items: center;  // Vertically align items in the row
    justify-content: space-between; // Distribute space between content and actions
  }

  &:hover {
    transform: scale(1.02);
    background-color: #FFF9E1;
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

const DeleteButton = styled.button`
  padding: 5px 10px;
  background-color: #dc3545; // Rojo para eliminar
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 5px; // Espacio entre botones

  &:hover {
    background-color: #c12a36; // Rojo más oscuro al pasar el cursor
  }
`;

const FilterContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    width: 80%; // Ajusta el ancho según necesites
`;

const FilterLabel = styled.label`
    margin-right: 10px;
    font-weight: bold;
    color: #F07C1E;
`;

const FilterInput = styled.input`
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 3px;
    font-size: 16px;
    flex-grow: 1; // Para que el input se expanda
    &:focus {
        outline: none;
        border-color: #F3B07C;
        box-shadow: 0 0 5px rgba(240, 124, 30, 0.2);
    }
`;

const TaskImageContainer = styled.div`
    width: 50px;
    height: 50px;
    margin-right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    overflow: hidden;
    
`;

const TaskImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    vertical-align: top;
`;

const ButtonContainer = styled.div` // Nuevo contenedor para los botones
  display: flex;
  white-space: nowrap; // Prevent buttons from wrapping
`;