import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

// Créer une nouvelle Chambre
export const useCreateChambre = () => {
  const queryClient = useQueryClient();
  const authUser = localStorage.getItem('authUser');

  return useMutation({
    mutationFn: (data) =>
      api.post('/chambres/createChambre', data, {
        headers: {
          Authorization: `Bearer ${authUser?.token}`,
        },
      }),
    onSuccess: () => queryClient.invalidateQueries(['chambres']),
  });
};

// Mettre à jour une Chambre
export const useUpdateChambre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      api.put(`/chambres/updateChambre/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries(['chambres']),
  });
};
// Lire toutes les Chambres
export const useAllChambres = () =>
  useQuery({
    queryKey: ['chambres'],
    queryFn: () => api.get('/chambres/getChambres').then((res) => res.data),
  });

// Obtenir une Chambre
export const useOneChambre = (id) =>
  useQuery({
    queryKey: ['getOneChambre', id],
    queryFn: () =>
      api.get(`/chambres/getOneChambre/${id}`).then((res) => res.data),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5, // chaque 5 minutes rafraichir les données
  });

// Supprimer une Chambre
export const useDeleteChambre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/chambres/deleteChambre/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['chambres']),
  });
};
