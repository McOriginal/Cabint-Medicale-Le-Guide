import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

// Créer une nouvelle Filière
export const useCreateDoctor = () => {
  const queryClient = useQueryClient();
  const authUser = localStorage.getItem('authUser');

  return useMutation({
    mutationFn: (data) =>
      api.post('/doctors/createDoctor', data, {
        headers: {
          Authorization: `Bearer ${authUser?.token}`,
        },
      }),
    onSuccess: () => queryClient.invalidateQueries(['Doctor']),
  });
};

// Mettre à jour une Filière
export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.put(`/doctors/updateDoctor/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries(['doctors']),
  });
};

// Lire toutes les années
export const useAllDoctors = () =>
  useQuery({
    queryKey: ['doctors'],
    queryFn: () => api.get('/doctors/allDoctors').then((res) => res.data),
    staleTime: 1000 * 60 * 5, //chaque 5 minutes rafraichir les données
  });

// Obtenir une Doctor
export const useOneDoctor = (id) =>
  useQuery({
    queryKey: ['getOneDoctor', id],
    queryFn: () =>
      api.get(`/doctors/getOneDoctor/${id}`).then((res) => res.data),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5, //chaque 5 minutes rafraichir les données
  });

// Supprimer une Filière
export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/doctors/deleteDoctor/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['doctors']),
  });
};
