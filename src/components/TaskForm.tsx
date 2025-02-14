import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';


interface Task {
  id: number;
  name: string;
  description: string;
  status: 'Pendiente' | 'En progreso' | 'Completado';
  createdAt: string;
}

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onClose }) => {
  const { register, handleSubmit, setValue } = useForm<Task>({
    defaultValues: task || {
      name: '',
      description: '',
      status: 'Pendiente',
      createdAt: new Date().toISOString().slice(0, 10),
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({ // Correcto: Objeto de opciones
    mutationFn: async (data: Task) => {
      const response = await axios.post('/api/tasks', data);
      return response.data; // Importante: Retornar los datos de la respuesta
    },
    onSuccess: () => {
      //queryClient.invalidateQueries('tasks');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onClose();
    },
    onError: (error) => {
      // Manejo de errores (opcional)
      console.error("Error creando tarea/task:", error);
      // Puedes mostrar un mensaje de error al usuario, etc.
    }
  });

  const onSubmit: SubmitHandler<Task> = async (data) => {  // Define onSubmit 
    try {
      await mutation.mutateAsync(data); // Use mutateAsync
    } catch (error) {
      // Manejo errors
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="name">Nombre:</label>
      <input type="text" id="name" {...register('name')} />

      <label htmlFor="description">Descripción:</label>
      <textarea id="description" {...register('description')} />

      <label htmlFor="status">Estado:</label>
      <select id="status" {...register('status')}>
        <option value="Pendiente">Pendiente</option>
        <option value="En progreso">En progreso</option>
        <option value="Completado">Completado</option>
      </select>

      <label htmlFor="createdAt">Fecha de creación:</label>
      <input type="date" id="createdAt" {...register('createdAt')} />

      <button type="submit">{task ? 'Actualizar' : 'Crear'}</button>
      <button type="button" onClick={onClose}>Cancelar</button>
    </form>
  );
};

export default TaskForm;