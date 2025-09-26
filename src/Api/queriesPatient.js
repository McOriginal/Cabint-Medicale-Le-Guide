import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

// Créer un étudiant
export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/patients/newPatient', data),
    onSuccess: () => queryClient.invalidateQueries(['patients']),
  });
};

// Tous les étudiants
export const useAllPatients = () =>
  useQuery({
    queryKey: ['patients'],
    queryFn: () => api.get('/patients/allPatients').then((res) => res.data),
    staleTime: 1000 * 60 * 5, //chaque 5 minutes rafraichir les données
  });

// Un seul étudiant
export const useOnePatient = (id) =>
  useQuery({
    queryKey: ['patients', id],
    queryFn: () =>
      api.get(`/patients/getPatient/${id}`).then((res) => res.data),
    enabled: Boolean(id),

    staleTime: 1000 * 60 * 5, //chaque 5 minutes rafraichir les données
  });

// Mettre à jour un étudiant
export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      api.put(`/patients/updatePatient/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries(['patients']),
  });
};

// Supprimer un étudiant
export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/patients/deletePatient/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['patients']),
  });
};

// Supprimer tous les étudiants
export const useDeleteAllpatients = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.delete('/patients/deleteAllPatients'),
    onSuccess: () => queryClient.invalidateQueries(['patients']),
  });
};
