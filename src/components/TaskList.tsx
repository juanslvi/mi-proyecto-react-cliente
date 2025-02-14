import React, { useState } from 'react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'axios';

import styled from 'styled-components'; // Import styled-components
import TaskForm from './TaskForm';

import { toast, ToastContainer } from 'react-toastify'; // Importa toast y ToastContainer
import 'react-toastify/dist/ReactToastify.css';

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


            {/* Filtro por nombre */}
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
              <TaskItem key={task.id}> {/* Un solo TaskItem por tarea */}
                  <TaskName>Tarea: {task.nombre_tarea}</TaskName>
                  <TaskDescription>Descripcion: {task.descripcion}</TaskDescription>
                  <TaskStatus>Estado: {task.estado}</TaskStatus>
                  <TaskCreatedAt>Creada: {new Date(task.createdAt).toLocaleDateString()}</TaskCreatedAt>
                  <EditButton onClick={() => setEditingTask(task)}>Editar</EditButton>
                  <DeleteButton onClick={() => handleDelete(task)}>Eliminar</DeleteButton>
          
                  <TaskImageContainer>
                      <TaskImage src='./pdf.png' alt='imagen'/>
                  </TaskImageContainer>
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
    width: 50px; // Ajusta el tamaño según necesites
    height: 50px;
    margin-left: auto; // Empuja la imagen a la derecha
    display: flex;
    justify-content: center; // Centrar horizontalmente
    align-items: center; // Centrar verticalmente
    border-radius: 8px; // Bordes redondeados (opcional)
    overflow: hidden; // Ocultar contenido que se salga del contenedor
`;

const TaskImage = styled.img`
    width: 100%;
    height: 100%;
     background-image: url('/pdf.png');
    background-size: cover;
    background-position: center;
    object-fit: cover; // Ajustar la imagen al contenedor y mantener la relación de aspecto
`;