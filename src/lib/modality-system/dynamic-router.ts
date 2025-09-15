// Dynamic Router - Auto-generates routes from plugins
// This creates routes dynamically based on registered plugins

import React from 'react';
import { RouteObject } from 'react-router-dom';
import { modalityRegistry } from './registry';
import { ModalityPlugin } from './types';

export class DynamicRouter {
  // Generate all plugin routes dynamically
  static generatePluginRoutes(): RouteObject[] {
    const routes: RouteObject[] = [];
    const plugins = modalityRegistry.getAll();

    plugins.forEach(plugin => {
      // Main modality page route
      routes.push({
        path: `/${plugin.metadata.id}`,
        element: React.createElement(plugin.components.ProtocolPage)
      });

      // Modality with indication route
      routes.push({
        path: `/${plugin.metadata.id}/:indication`,
        element: React.createElement(plugin.components.ProtocolPage)
      });

      // Modality techniques route
      routes.push({
        path: `/${plugin.metadata.id}/techniques`,
        element: React.createElement(plugin.components.TechniquesList, {
          techniques: plugin.techniques
        })
      });

      // Modality safety route
      routes.push({
        path: `/${plugin.metadata.id}/safety`,
        element: React.createElement(plugin.components.SafetyWarnings, {
          contraindications: plugin.contraindications
        })
      });
    });

    console.log(`🛣️ Generated ${routes.length} dynamic routes from ${plugins.length} plugins`);
    return routes;
  }

  // Generate navigation items from plugins
  static generatePluginNavigation(): { name: string; path: string; icon: string; category: string }[] {
    const plugins = modalityRegistry.getAll();
    
    return plugins.map(plugin => ({
      name: plugin.metadata.displayName,
      path: `/${plugin.metadata.id}`,
      icon: plugin.metadata.icon,
      category: plugin.metadata.category
    }));
  }

  // Generate modality cards for indication pages
  static generateModalityCards(indication: string): any[] {
    const relevantPlugins = modalityRegistry.getForIndication(indication);
    
    return relevantPlugins.map(plugin => {
      const protocols = plugin.getProtocolsForIndication(indication);
      const effectiveness = plugin.getEffectivenessForIndication(indication);
      
      return {
        id: plugin.metadata.id,
        name: plugin.metadata.displayName,
        icon: plugin.metadata.icon,
        description: plugin.metadata.description,
        protocols: protocols.length,
        effectiveness: effectiveness?.effectivenessScore || 0,
        link: `/${plugin.metadata.id}`,
        component: plugin.components.ProtocolCard,
        skillLevel: plugin.metadata.skillLevel,
        equipmentRequired: plugin.metadata.equipmentRequired,
        selfAdministered: plugin.metadata.selfAdministered
      };
    });
  }

  // Generate comparison data for treatment comparison pages
  static generateComparisonData(indication: string): any[] {
    return modalityRegistry.generateComparisonData(indication);
  }

  // Check if plugin system is ready
  static isReady(): boolean {
    return modalityRegistry.getAll().length > 0;
  }
}

export default DynamicRouter;
