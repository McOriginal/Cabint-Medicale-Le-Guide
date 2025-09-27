import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

// Créer une nouvelle Medicaments
export const useCreateMedicament = () => {
  const queryClient = useQueryClient();
  const authUser = localStorage.getItem('authUser');

  return useMutation({
    mutationFn: (data) =>
      api.post('/medicaments/addMedicament', data, {
        headers: {
          Authorization: `Bearer ${authUser?.token}`,
        },
      }),
    onSuccess: () => queryClient.invalidateQueries(['medicaments']),
  });
};

// Mettre à jour une Medicaments
export const useUpdateMedicament = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      api.put(`/medicaments/updateMedicament/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries(['medicaments']),
  });
};

// Mettre à jour une Medicaments avec Stock
export const useCancelDecrementMultipleStocks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ordonnanceId, items }) =>
      api.post(`/medicaments/cancelDecrementMultipleStocks/${ordonnanceId}`, {
        items,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries(['medicaments']);
      queryClient.invalidateQueries(['ordonnances']); // si tu veux la liste à jour
    },
  });
};

// Lire toutes les Medicaments
export const useAllMedicament = () =>
  useQuery({
    queryKey: ['medicaments'],
    queryFn: () =>
      api
        .get('/medicaments/getAllMedicamentsWithStock')
        .then((res) => res.data),
  });

// Lire toutes les Medicaments avec le Stock Finis
export const useAllMedicamentWithStockFinish = () =>
  useQuery({
    queryKey: ['medicaments'],
    queryFn: () =>
      api
        .get('/medicaments/getAllMedicamentsWithStockFinish')
        .then((res) => res.data),
  });

// Obtenir une Medicament
export const useOneMedicament = (id) =>
  useQuery({
    queryKey: ['getMedicament', id],
    queryFn: () =>
      api.get(`/medicaments/getOneMedicament/${id}`).then((res) => res.data),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5, //chaque 5 minutes rafraichir les données
  });

// Supprimer une Medicaments
export const useDeleteMedicament = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/medicaments/deleteMedicament/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['medicaments']),
  });
};
