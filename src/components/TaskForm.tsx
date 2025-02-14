import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify'; // Importa toast y ToastContainer
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.baseURL = 'http://localhost:5000';

// Definición de la interfaz Task
interface Task {
  id: number;
  nombre_tarea: string;
  descripcion: string;
  estado: 'Pendiente' | 'En progreso' | 'Completado';
  createdAt: string;
}

// Definición de la interfaz TaskFormProps
interface TaskFormProps {
  task?: Task;
  onClose: () => void;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
  }

const TaskForm: React.FC<TaskFormProps> = ({ task, onClose }) => {
  // Uso de useForm con valores por defecto y validación
  const { register, handleSubmit, formState: { errors } } = useForm<Task>({
    defaultValues: task || {
      nombre_tarea: '',
      descripcion: '',
      estado: 'Pendiente',
      createdAt: new Date().toISOString().slice(0, 10),
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: Task) => {
      const response = await axios.post('/api/tasks', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Tarea creada con éxito!");
      onClose();
    },
    onError: (error) => {
      console.error("Error creando tarea:", error);
      //toast.error("Error al crear la tarea. Inténtalo de nuevo.");      
       // Manejo de errores más específico
       if (axios.isAxiosError(error)) {
        toast.error(`Error al crear la tarea: ${error.response?.data?.message || error.message}`); // Mensaje de error del backend o mensaje genérico
      } else {
        toast.error("Error al crear la tarea. Inténtalo de nuevo."); // Mensaje genérico para otros errores
      }
    }
  });

  const onSubmit = async (data: Task) => {
    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      //toast.error("Error al enviar el formulario.");   
      console.error("Error al enviar el formulario:", error);
    }
  };

  /*
  const onSubmit = (data: Task) => {
    console.log("Datos enviados:", data); // Imprime los datos antes de enviarlos
    mutation.mutate(data);
  };*/



  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Label htmlFor="name">Nombre:</Label>
        <Input
          type="text"
          id="name"
          {...register('nombre_tarea', { required: 'Este campo es obligatorio' })}
          error={!!errors.nombre_tarea}
        />
        {errors.nombre_tarea?.message && <ErrorMessage>{errors.nombre_tarea.message}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="description">Descripción:</Label>
        <TextArea id="description" {...register('descripcion')} />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="status">Estado:</Label>
        <Select id="status" {...register('estado')}>
          <option value="Pendiente">Pendiente</option>
          <option value="En progreso">En progreso</option>
          <option value="Completado">Completado</option>
        </Select>
      </FormGroup>      

      <ButtonContainer>
        <SubmitButton type="submit">{task ? 'Actualizar' : 'Crear'}</SubmitButton>
        <CancelButton type="button" onClick={onClose}>Cancelar</CancelButton>
      </ButtonContainer>
            
    </Form>
  );
};

export default TaskForm;

// Estilos con styled-components
const Form = styled.form`
   display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 20px;
  border-radius: 5px;
  background-color: #FBE5CC;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  width: 90%; // Make the form take up most of the container's width
  max-width: 600px; // Set a maximum width so it doesn't get too wide
  margin: 0 auto; // Center the form horizontally
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
  color: #F07C1E; // #F07C1E
`;

const Input = styled.input<InputProps>`
  padding: 8px;
  border: 1px solid ${props => props.error ? 'red' : '#ccc'};
  border-radius: 3px;
  font-size: 16px;
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.2);
  }
`;

const TextArea = styled.textarea`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 16px;
  resize: vertical;
  min-height: 100px;
  background-color: #FEFEFE; // #FEFEFE
  &:focus {
    outline: none;
    border-color: #F3B07C; // #F3B07C
    box-shadow: 0 0 5px rgba(240, 124, 30, 0.2); // Sombra con color #F07C1E
  }
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 16px;
  background-color: #FEFEFE; // #FEFEFE
  &:focus {
    outline: none;
    border-color: #F3B07C; // #F3B07C
    box-shadow: 0 0 5px rgba(240, 124, 30, 0.2); // Sombra con color #F07C1E
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
`;

const SubmitButton = styled.button`
  background-color: #F07C1E; // #F07C1E
  color: #FEFEFE; // #FEFEFE
  padding: 10px 15px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  &:hover {
    background-color: #F3B07C; // #F3B07C
  }
`;

const CancelButton = styled.button`
  background-color: #F3B07C; // #F3B07C
  color: #FEFEFE; // #FEFEFE
  padding: 10px 15px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  &:hover {
    background-color: #F07C1E; // #F07C1E
  }
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;