import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

// Créer une nouvelle Materiel
export const useCreateMateriel = () => {
  const queryClient = useQueryClient();
  const authUser = localStorage.getItem('authUser');

  return useMutation({
    mutationFn: (data) =>
      api.post('/materiels/createMateriel', data, {
        headers: {
          Authorization: `Bearer ${authUser?.token}`,
        },
      }),
    onSuccess: () => queryClient.invalidateQueries(['materiels']),
  });
};

// Mettre à jour une Materiel
export const useUpdateMateriel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      api.put(`/materiels/updateMateriel/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries(['materiels']),
  });
};

// Lire toutes les Materiels
export const useAllMateriels = () =>
  useQuery({
    queryKey: ['materiels'],
    queryFn: () => api.get('/materiels/getMateriels').then((res) => res.data),
  });

// Obtenir un seul Materiel
export const useOneMateriel = (id) =>
  useQuery({
    queryKey: ['getOneMateriel', id],
    queryFn: () =>
      api.get(`/materiels/getOneMateriel/${id}`).then((res) => res.data),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5, //chaque 5 minutes rafraichir les données
  });

// Supprimer une Materiel
export const useDeleteMateriel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/materiels/deleteMateriel/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['materiels']),
  });
};
