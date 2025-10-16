import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

// Créer une nouvelle Ordonnance
export const useCreateExterneOrdonnance = () => {
  const queryClient = useQueryClient();
  const authUser = localStorage.getItem('authUser');

  return useMutation({
    mutationFn: (data) =>
      api.post('/externeOrdonnances/createExterneOrdonnance', data, {
        headers: {
          Authorization: `Bearer ${authUser?.token}`,
        },
      }),
    onSuccess: () => queryClient.invalidateQueries(['ordonnances']),
  });
};

// Mettre à jour une Ordonnance
export const useUpdateExterneOrdonnance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      api.put(`/externeOrdonnances/updateExterneOrdonnance/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries(['ordonnances']),
  });
};
// Lire toutes les ordonnances
export const useAllExterneOrdonnances = () =>
  useQuery({
    queryKey: ['ordonnances'],
    queryFn: () =>
      api
        .get('/externeOrdonnances/getAllExterneOrdonnances')
        .then((res) => res.data),
  });

// Obtenir une Ordonnance
export const useOneExterneOrdonnance = (id) =>
  useQuery({
    queryKey: ['ordonnances', id],
    queryFn: () =>
      api
        .get(`/externeOrdonnances/getExterneOrdonnance/${id}`)
        .then((res) => res.data),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5, //chaque 5 minutes rafraichir les données
  });

// Supprimer une Ordonnance
export const useDeleteExterneOrdonnance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      api.delete(`/externeOrdonnances/deleteExterneOrdonnance/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['ordonnances']),
  });
};
