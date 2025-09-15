// Modality System - Main Export
// Central export point for the entire modality plugin system

// Core types and interfaces
export * from './types';

// Registry and management
export { modalityRegistry, useModalityRegistry } from './registry';

// Base plugin class
export { BaseModalityPlugin } from './base-plugin';

// React hooks
export * from './hooks';

// Plugin loader
export { default as PluginLoader } from './plugin-loader';

// Utility functions
export const initializeModalitySystem = async (): Promise<void> => {
  const { default: PluginLoader } = await import('./plugin-loader');
  await PluginLoader.loadAllPlugins();
};

export const getModalitySystemStatus = () => {
  const { default: PluginLoader } = require('./plugin-loader');
  return PluginLoader.getLoadingStatus();
};
