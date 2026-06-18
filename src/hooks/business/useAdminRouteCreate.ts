import { useState, useEffect } from 'react';
import { paraderoService } from '../../services/business/paraderoService';
import { rutaService } from '../../services/business/rutaService';
import type { Paradero } from '../../models';

export interface RouteNode {
  paraderoId: number;
  orden: number;
  tiempoEstimado: number; // in minutes
  distanciaDesdeAnterior: string; // usually a string representing distance
  paraderoData?: Paradero;
}

export const useAdminRouteCreate = () => {
  const [allParaderos, setAllParaderos] = useState<Paradero[]>([]);
  const [loadingParaderos, setLoadingParaderos] = useState(true);
  
  const [nodes, setNodes] = useState<RouteNode[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchParaderos();
  }, []);

  const fetchParaderos = async () => {
    try {
      setLoadingParaderos(true);
      const res = await paraderoService.getAll();
      setAllParaderos(res);
    } catch (err: any) {
      console.error(err);
      setError('Error al cargar la lista de paraderos disponibles.');
    } finally {
      setLoadingParaderos(false);
    }
  };

  const addNode = (paradero: Paradero) => {
    // Avoid duplicates
    if (nodes.some(n => n.paraderoId === paradero.paradero_id)) {
      return;
    }
    
    setNodes(prev => [
      ...prev,
      {
        paraderoId: paradero.paradero_id as number,
        orden: prev.length + 1,
        tiempoEstimado: 5, // Default 5 mins
        distanciaDesdeAnterior: prev.length === 0 ? '0' : '1.5', // Default values
        paraderoData: paradero
      }
    ]);
  };

  const removeNode = (paraderoId: number) => {
    setNodes(prev => {
      const filtered = prev.filter(n => n.paraderoId !== paraderoId);
      // Re-calculate orders
      return filtered.map((n, index) => ({
        ...n,
        orden: index + 1,
        distanciaDesdeAnterior: index === 0 ? '0' : n.distanciaDesdeAnterior
      }));
    });
  };

  const updateNodeTime = (paraderoId: number, mins: number) => {
    setNodes(prev => prev.map(n => n.paraderoId === paraderoId ? { ...n, tiempoEstimado: mins } : n));
  };
  
  const updateNodeDistance = (paraderoId: number, dist: string) => {
    setNodes(prev => prev.map(n => n.paraderoId === paraderoId ? { ...n, distanciaDesdeAnterior: dist } : n));
  };

  const saveRoute = async (routeData: { nombre: string; descripcion: string; tarifa: string }) => {
    if (nodes.length < 3) {
      throw new Error('La ruta debe tener al menos 3 paraderos para ser válida.');
    }

    try {
      setIsSaving(true);
      setError(null);
      
      // 1. Create Ruta
      const resRoute = await rutaService.create({
        nombre: routeData.nombre,
        descripcion: routeData.descripcion,
        tarifa: routeData.tarifa as any
      });
      
      const newRutaId = resRoute.ruta_id as number;

      // 2. Assign Paraderos
      await rutaService.asignarParaderos(newRutaId, {
        paraderos: nodes.map(n => ({
          paraderoId: n.paraderoId,
          orden: n.orden,
          tiempoEstimado: n.tiempoEstimado,
          distanciaDesdeAnterior: n.distanciaDesdeAnterior
        }))
      });
      
      return newRutaId;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al guardar la ruta';
      setError(msg);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    allParaderos,
    loadingParaderos,
    nodes,
    addNode,
    removeNode,
    updateNodeTime,
    updateNodeDistance,
    saveRoute,
    isSaving,
    error,
    clearError: () => setError(null)
  };
};
