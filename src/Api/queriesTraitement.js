import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

// Créer un étudiant
export const useCreateTraitement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/traitements/addTraitement', data),
    onSuccess: () => queryClient.invalidateQueries(['traitement']),
  });
};

// Tous les étudiants
export const useAllTraitement = () =>
  useQuery({
    queryKey: ['traitements'],
    queryFn: () =>
      api.get('/traitements/getAllTraitements').then((res) => res.data),
    staleTime: 1000 * 60 * 5, //chaque 5 minutes rafraichir les données
  });

// Un seul étudiant
export const useOneTraitement = (id) =>
  useQuery({
    queryKey: ['traitements', id],
    queryFn: () =>
      api.get(`/traitements/getOneTraitement/${id}`).then((res) => res.data),
    enabled: Boolean(id),

    staleTime: 1000 * 60 * 5, //chaque 5 minutes rafraichir les données
  });

// Mettre à jour un étudiant
export const useUpdateTraitement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      api.put(`/traitements/updateTraitement/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries(['traitements']),
  });
};

// Supprimer un étudiant
export const useDeleteTraitement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/traitements/deleteTraitement/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['traitements']),
  });
};

// Supprimer tous les étudiants
export const useDeleteAlltraitements = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.delete('/traitements/deleteAllTraitement'),
    onSuccess: () => queryClient.invalidateQueries(['traitements']),
  });
};
