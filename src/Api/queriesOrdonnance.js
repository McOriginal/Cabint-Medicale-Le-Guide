import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

// Créer une nouvelle Ordonnance
export const useCreateOrdonnance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/ordonnances/createOrdonnance', data),
    onSuccess: () => queryClient.invalidateQueries(['ordonnances']),
  });
};

// Mettre à jour une Ordonnance
export const useUpdateOrdonnance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      api.put(`/ordonnances/updateOrdonnance/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries(['ordonnances']),
  });
};
// Lire toutes les ordonnances
export const useAllOrdonnances = () =>
  useQuery({
    queryKey: ['ordonnances'],
    queryFn: () =>
      api.get('/ordonnances/getAllOrdonnances').then((res) => res.data),
  });

// Obtenir une Ordonnance
export const useOneOrdonnance = (id) =>
  useQuery({
    queryKey: ['ordonnances', id],
    queryFn: () =>
      api.get(`/ordonnances/getOneOrdonnance/${id}`).then((res) => res.data),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5, //chaque 5 minutes rafraichir les données
  });

// Obtenir une Ordonnance
export const useTraitementOrdonnance = (traitementID) =>
  useQuery({
    queryKey: ['getTraitementOrdonnance', traitementID],
    queryFn: () =>
      api
        .get(`/ordonnances/getTraitementOrdonnance/${traitementID}`)
        .then((res) => res.data),
    staleTime: 1000 * 60 * 5, //chaque 5 minutes rafraichir les données
  });

// Obtenir une Ordonnance
export const useGetTraitementOrdonnance = () =>
  useQuery({
    queryKey: ['getTraitementOrdonnance'],
    queryFn: () =>
      api.get('/ordonnances/getTraitementOrdonnance/').then((res) => res.data),
  });

// Supprimer une Ordonnance
export const useDeleteOrdonnance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => api.post(`/ordonnances/deleteOrdonnance/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['ordonnances']),
  });
};
