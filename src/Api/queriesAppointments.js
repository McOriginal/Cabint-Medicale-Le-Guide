import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

// Créer une nouvelle appointments
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  const authUser = localStorage.getItem('authUser');
  return useMutation({
    mutationFn: (data) =>
      api.post('/appointments/createAppointment', data, {
        headers: {
          Authorization: `Bearer ${authUser?.token}`,
        },
      }),
    onSuccess: () => queryClient.invalidateQueries(['appointments']),
  });
};

// Mettre à jour une Chambre
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      api.put(`/appointments/updateAppointment/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries(['appointments']),
  });
};

// Lire toutes les appointments
export const useAllAppointment = () =>
  useQuery({
    queryKey: ['appointments'],
    queryFn: () =>
      api.get('/appointments/getAllAppointments').then((res) => res.data),
  });

// Supprimer une appointments
export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/appointments/deleteAppointment/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['appointments']),
  });
};
