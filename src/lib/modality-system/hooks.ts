// React Hooks for Modality System
// Provides easy access to modality data throughout the application

import { useState, useEffect, useMemo } from 'react';
import { modalityRegistry } from './registry';
import { ModalityPlugin, ModalityProtocol, ModalityTechnique } from './types';

// Hook to get a specific modality plugin
export const useModality = (modalityId: string): ModalityPlugin | null => {
  const [plugin, setPlugin] = useState<ModalityPlugin | null>(null);
  
  useEffect(() => {
    const modalityPlugin = modalityRegistry.get(modalityId);
    setPlugin(modalityPlugin);
  }, [modalityId]);
  
  return plugin;
};

// Hook to get all modalities for a specific indication
export const useModalitiesForIndication = (indication: string): ModalityPlugin[] => {
  const [modalities, setModalities] = useState<ModalityPlugin[]>([]);
  
  useEffect(() => {
    const relevantModalities = modalityRegistry.getForIndication(indication);
    setModalities(relevantModalities);
  }, [indication]);
  
  return modalities;
};

// Hook to get protocols for a specific modality and indication
export const useModalityProtocols = (
  modalityId: string, 
  indication?: string
): ModalityProtocol[] => {
  const [protocols, setProtocols] = useState<ModalityProtocol[]>([]);
  
  useEffect(() => {
    const plugin = modalityRegistry.get(modalityId);
    if (plugin) {
      const modalityProtocols = indication 
        ? plugin.getProtocolsForIndication(indication)
        : plugin.protocols;
      setProtocols(modalityProtocols);
    }
  }, [modalityId, indication]);
  
  return protocols;
};

// Hook to get comparison data for multiple modalities
export const useModalityComparison = (indication: string) => {
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  
  useEffect(() => {
    const data = modalityRegistry.generateComparisonData(indication);
    setComparisonData(data);
  }, [indication]);
  
  return comparisonData;
};

// Hook to check safety for a specific modality and patient
export const useModalitySafety = (
  modalityId: string, 
  patientData?: any
): { safe: boolean; warnings: string[] } => {
  const [safety, setSafety] = useState<{ safe: boolean; warnings: string[] }>({
    safe: true,
    warnings: []
  });
  
  useEffect(() => {
    const plugin = modalityRegistry.get(modalityId);
    if (plugin && patientData) {
      const safetyCheck = plugin.validateSafetyForPatient(patientData);
      setSafety(safetyCheck);
    }
  }, [modalityId, patientData]);
  
  return safety;
};

// Hook to get all available modalities
export const useAllModalities = (): ModalityPlugin[] => {
  const [modalities, setModalities] = useState<ModalityPlugin[]>([]);
  
  useEffect(() => {
    const allModalities = modalityRegistry.getAll();
    setModalities(allModalities);
  }, []);
  
  return modalities;
};

// Hook to get modalities by category
export const useModalitiesByCategory = (category: string): ModalityPlugin[] => {
  const [modalities, setModalities] = useState<ModalityPlugin[]>([]);
  
  useEffect(() => {
    const categoryModalities = modalityRegistry.getByCategory(category);
    setModalities(categoryModalities);
  }, [category]);
  
  return modalities;
};

// Hook to get registry statistics
export const useModalityStats = () => {
  const [stats, setStats] = useState<any>({});
  
  useEffect(() => {
    const registryStats = modalityRegistry.getStats();
    setStats(registryStats);
  }, []);
  
  return stats;
};

// Hook to get dynamic routes for all modalities
export const useModalityRoutes = () => {
  const [routes, setRoutes] = useState<{ path: string; component: any }[]>([]);
  
  useEffect(() => {
    const dynamicRoutes = modalityRegistry.generateRoutes();
    setRoutes(dynamicRoutes);
  }, []);
  
  return routes;
};

// Hook to get navigation items for all modalities
export const useModalityNavigation = () => {
  const [navigation, setNavigation] = useState<{ name: string; path: string; icon: string }[]>([]);
  
  useEffect(() => {
    const navItems = modalityRegistry.generateNavigation();
    setNavigation(navItems);
  }, []);
  
  return navigation;
};

// Hook for search integration
export const useModalitySearchTerms = () => {
  const [searchTerms, setSearchTerms] = useState<{ modalityId: string; terms: string[] }[]>([]);
  
  useEffect(() => {
    const terms = modalityRegistry.getAllSearchTerms();
    setSearchTerms(terms);
  }, []);
  
  return searchTerms;
};

// Advanced hook for treatment recommendations
export const useTreatmentRecommendations = (
  indication: string,
  patientData?: any,
  preferences?: string[]
) => {
  const modalities = useModalitiesForIndication(indication);
  
  const recommendations = useMemo(() => {
    return modalities.map(modality => {
      const protocols = modality.getProtocolsForIndication(indication);
      const safety = modality.validateSafetyForPatient(patientData);
      const effectiveness = modality.getEffectivenessForIndication(indication);
      
      return {
        modality: modality.metadata,
        protocols,
        safety,
        effectiveness,
        recommended: safety.safe && (effectiveness?.effectivenessScore || 0) > 70
      };
    }).sort((a, b) => {
      // Sort by safety first, then effectiveness
      if (a.safety.safe !== b.safety.safe) {
        return a.safety.safe ? -1 : 1;
      }
      return (b.effectiveness?.effectivenessScore || 0) - (a.effectiveness?.effectivenessScore || 0);
    });
  }, [modalities, indication, patientData]);
  
  return recommendations;
};
