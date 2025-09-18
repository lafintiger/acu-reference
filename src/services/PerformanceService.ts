// Performance Service
// Advanced performance monitoring and optimization for large-scale deployment

export interface PerformanceMetrics {
  timestamp: string;
  componentRenderTime: Record<string, number>;
  databaseQueryTime: Record<string, number>;
  aiResponseTime: Record<string, number>;
  memoryUsage: number;
  storageUsage: number;
  networkRequests: number;
  errorRate: number;
}

export interface PerformanceAlert {
  id: string;
  type: 'warning' | 'critical';
  metric: string;
  value: number;
  threshold: number;
  timestamp: string;
  message: string;
}

export class PerformanceService {
  private metrics: PerformanceMetrics[] = [];
  private alerts: PerformanceAlert[] = [];
  private storage = localStorage;
  private metricsKey = 'acu_performance_metrics';
  
  // Performance thresholds
  private thresholds = {
    componentRender: 100, // ms
    databaseQuery: 500, // ms
    aiResponse: 10000, // ms
    memoryUsage: 100 * 1024 * 1024, // 100MB
    storageUsage: 8 * 1024 * 1024, // 8MB (localStorage limit)
    errorRate: 5 // 5%
  };

  /**
   * Start performance monitoring
   */
  startMonitoring(): void {
    console.log('📊 Performance monitoring started');
    
    // Collect metrics every 30 seconds
    setInterval(() => {
      this.collectMetrics();
    }, 30000);

    // Analyze performance every 5 minutes
    setInterval(() => {
      this.analyzePerformance();
    }, 300000);

    // Initial metrics collection
    this.collectMetrics();
  }

  /**
   * Measure component render time
   */
  measureComponentRender<T>(componentName: string, renderFunction: () => T): T {
    const startTime = performance.now();
    
    try {
      const result = renderFunction();
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      this.recordComponentRenderTime(componentName, renderTime);
      
      if (renderTime > this.thresholds.componentRender) {
        this.createAlert('warning', 'component_render', renderTime, this.thresholds.componentRender, 
          `Component ${componentName} render time exceeded threshold`);
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      this.recordComponentRenderTime(componentName, endTime - startTime);
      throw error;
    }
  }

  /**
   * Measure database query time
   */
  async measureDatabaseQuery<T>(queryName: string, queryFunction: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    
    try {
      const result = await queryFunction();
      const endTime = performance.now();
      const queryTime = endTime - startTime;
      
      this.recordDatabaseQueryTime(queryName, queryTime);
      
      if (queryTime > this.thresholds.databaseQuery) {
        this.createAlert('warning', 'database_query', queryTime, this.thresholds.databaseQuery,
          `Database query ${queryName} exceeded threshold`);
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      this.recordDatabaseQueryTime(queryName, endTime - startTime);
      throw error;
    }
  }

  /**
   * Measure AI response time
   */
  async measureAIResponse<T>(aiFunction: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    
    try {
      const result = await aiFunction();
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      this.recordAIResponseTime(responseTime);
      
      if (responseTime > this.thresholds.aiResponse) {
        this.createAlert('warning', 'ai_response', responseTime, this.thresholds.aiResponse,
          'AI response time exceeded threshold');
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      this.recordAIResponseTime(endTime - startTime);
      throw error;
    }
  }

  /**
   * Get current performance statistics
   */
  getPerformanceStats(): {
    averageRenderTime: number;
    averageQueryTime: number;
    averageAITime: number;
    memoryUsage: number;
    storageUsage: number;
    alertCount: number;
    uptime: number;
  } {
    const recentMetrics = this.metrics.slice(-10); // Last 10 measurements
    
    if (recentMetrics.length === 0) {
      return {
        averageRenderTime: 0,
        averageQueryTime: 0,
        averageAITime: 0,
        memoryUsage: 0,
        storageUsage: 0,
        alertCount: 0,
        uptime: 0
      };
    }

    const avgRenderTime = this.calculateAverageRenderTime(recentMetrics);
    const avgQueryTime = this.calculateAverageQueryTime(recentMetrics);
    const avgAITime = this.calculateAverageAITime(recentMetrics);
    const currentMemory = this.getCurrentMemoryUsage();
    const currentStorage = this.getCurrentStorageUsage();

    return {
      averageRenderTime: Math.round(avgRenderTime * 100) / 100,
      averageQueryTime: Math.round(avgQueryTime * 100) / 100,
      averageAITime: Math.round(avgAITime * 100) / 100,
      memoryUsage: currentMemory,
      storageUsage: currentStorage,
      alertCount: this.alerts.length,
      uptime: Date.now() - (this.metrics[0]?.timestamp ? new Date(this.metrics[0].timestamp).getTime() : Date.now())
    };
  }

  /**
   * Optimize application performance
   */
  optimizePerformance(): void {
    console.log('🔧 Optimizing application performance...');
    
    // Clear old metrics to free memory
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-50);
      console.log('📊 Cleaned old performance metrics');
    }

    // Clear old alerts
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    this.alerts = this.alerts.filter(alert => 
      new Date(alert.timestamp).getTime() > oneHourAgo
    );

    // Optimize localStorage
    this.optimizeLocalStorage();

    // Trigger garbage collection (if available)
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
      console.log('🗑️ Garbage collection triggered');
    }

    console.log('✅ Performance optimization complete');
  }

  /**
   * Get performance recommendations
   */
  getPerformanceRecommendations(): string[] {
    const recommendations: string[] = [];
    const stats = this.getPerformanceStats();

    if (stats.averageRenderTime > 50) {
      recommendations.push('Consider memoizing expensive component calculations');
    }

    if (stats.averageQueryTime > 200) {
      recommendations.push('Optimize database queries or add indexing');
    }

    if (stats.averageAITime > 8000) {
      recommendations.push('Consider using faster AI models or optimizing prompts');
    }

    if (stats.storageUsage > 6 * 1024 * 1024) { // 6MB
      recommendations.push('Storage usage high - consider data cleanup or compression');
    }

    if (stats.alertCount > 10) {
      recommendations.push('Multiple performance alerts - review system health');
    }

    return recommendations;
  }

  /**
   * Private helper methods
   */
  private collectMetrics(): void {
    const metrics: PerformanceMetrics = {
      timestamp: new Date().toISOString(),
      componentRenderTime: this.getComponentRenderTimes(),
      databaseQueryTime: this.getDatabaseQueryTimes(),
      aiResponseTime: this.getAIResponseTimes(),
      memoryUsage: this.getCurrentMemoryUsage(),
      storageUsage: this.getCurrentStorageUsage(),
      networkRequests: this.getNetworkRequestCount(),
      errorRate: this.getErrorRate()
    };

    this.metrics.push(metrics);
    
    // Keep only last 100 metrics to prevent memory bloat
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  private analyzePerformance(): void {
    const stats = this.getPerformanceStats();
    
    // Check for performance issues
    if (stats.averageRenderTime > this.thresholds.componentRender) {
      this.createAlert('warning', 'render_time', stats.averageRenderTime, this.thresholds.componentRender,
        'Average component render time is high');
    }

    if (stats.storageUsage > this.thresholds.storageUsage) {
      this.createAlert('critical', 'storage_usage', stats.storageUsage, this.thresholds.storageUsage,
        'Storage usage approaching localStorage limit');
    }

    if (stats.alertCount > 20) {
      this.createAlert('critical', 'alert_count', stats.alertCount, 20,
        'High number of performance alerts - system health check needed');
    }
  }

  private createAlert(
    type: PerformanceAlert['type'],
    metric: string,
    value: number,
    threshold: number,
    message: string
  ): void {
    const alert: PerformanceAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      type,
      metric,
      value,
      threshold,
      timestamp: new Date().toISOString(),
      message
    };

    this.alerts.push(alert);
    
    if (type === 'critical') {
      console.warn(`🚨 Performance Alert: ${message}`);
    } else {
      console.log(`⚠️ Performance Warning: ${message}`);
    }
  }

  private recordComponentRenderTime(componentName: string, time: number): void {
    // Store in current metrics if available
    if (this.metrics.length > 0) {
      const currentMetrics = this.metrics[this.metrics.length - 1];
      currentMetrics.componentRenderTime[componentName] = time;
    }
  }

  private recordDatabaseQueryTime(queryName: string, time: number): void {
    if (this.metrics.length > 0) {
      const currentMetrics = this.metrics[this.metrics.length - 1];
      currentMetrics.databaseQueryTime[queryName] = time;
    }
  }

  private recordAIResponseTime(time: number): void {
    if (this.metrics.length > 0) {
      const currentMetrics = this.metrics[this.metrics.length - 1];
      currentMetrics.aiResponseTime['latest'] = time;
    }
  }

  private getComponentRenderTimes(): Record<string, number> {
    // This would be populated by measureComponentRender calls
    return {};
  }

  private getDatabaseQueryTimes(): Record<string, number> {
    // This would be populated by measureDatabaseQuery calls
    return {};
  }

  private getAIResponseTimes(): Record<string, number> {
    // This would be populated by measureAIResponse calls
    return {};
  }

  private getCurrentMemoryUsage(): number {
    // Estimate memory usage from performance API
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize || 0;
    }
    return 0;
  }

  private getCurrentStorageUsage(): number {
    let totalSize = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += key.length + value.length;
        }
      }
    }
    
    return totalSize;
  }

  private getNetworkRequestCount(): number {
    // This would track network requests
    return 0;
  }

  private getErrorRate(): number {
    // This would calculate error rate from recent activity
    return 0;
  }

  private calculateAverageRenderTime(metrics: PerformanceMetrics[]): number {
    const allRenderTimes = metrics.flatMap(m => Object.values(m.componentRenderTime));
    return allRenderTimes.length > 0 ? allRenderTimes.reduce((a, b) => a + b, 0) / allRenderTimes.length : 0;
  }

  private calculateAverageQueryTime(metrics: PerformanceMetrics[]): number {
    const allQueryTimes = metrics.flatMap(m => Object.values(m.databaseQueryTime));
    return allQueryTimes.length > 0 ? allQueryTimes.reduce((a, b) => a + b, 0) / allQueryTimes.length : 0;
  }

  private calculateAverageAITime(metrics: PerformanceMetrics[]): number {
    const allAITimes = metrics.flatMap(m => Object.values(m.aiResponseTime));
    return allAITimes.length > 0 ? allAITimes.reduce((a, b) => a + b, 0) / allAITimes.length : 0;
  }

  private optimizeLocalStorage(): void {
    const usage = this.getCurrentStorageUsage();
    const limit = 8 * 1024 * 1024; // 8MB typical localStorage limit
    
    if (usage > limit * 0.8) { // 80% of limit
      console.log('🧹 Optimizing localStorage usage...');
      
      // Remove old performance metrics
      localStorage.removeItem('old_performance_data');
      
      // Compress large data items
      this.compressLargeStorageItems();
      
      console.log('✅ localStorage optimization complete');
    }
  }

  private compressLargeStorageItems(): void {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('rag_')) {
        const value = localStorage.getItem(key);
        if (value && value.length > 100000) { // 100KB
          try {
            const parsed = JSON.parse(value);
            // Compress embeddings if present
            if (parsed.embedding && Array.isArray(parsed.embedding)) {
              parsed.embedding = parsed.embedding.map((val: number) => 
                Math.round(val * 1000) / 1000
              );
              localStorage.setItem(key, JSON.stringify(parsed));
            }
          } catch (error) {
            // Skip if not JSON
          }
        }
      }
    }
  }
}

// React performance hooks
export const usePerformanceMonitoring = (componentName: string) => {
  const performanceService = new PerformanceService();

  return {
    measureRender: <T>(renderFn: () => T): T => 
      performanceService.measureComponentRender(componentName, renderFn),
    
    measureQuery: <T>(queryName: string, queryFn: () => Promise<T>): Promise<T> =>
      performanceService.measureDatabaseQuery(queryName, queryFn),
    
    measureAI: <T>(aiFn: () => Promise<T>): Promise<T> =>
      performanceService.measureAIResponse(aiFn)
  };
};

// Data virtualization for large lists
export const useVirtualization = (
  items: any[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    }
  };
};

// Lazy loading service for components
export class LazyLoadingService {
  private loadedComponents = new Set<string>();
  private loadingPromises = new Map<string, Promise<any>>();

  /**
   * Lazy load component with caching
   */
  async loadComponent(componentName: string, importFunction: () => Promise<any>): Promise<any> {
    if (this.loadedComponents.has(componentName)) {
      return Promise.resolve();
    }

    if (this.loadingPromises.has(componentName)) {
      return this.loadingPromises.get(componentName);
    }

    console.log(`🔄 Lazy loading component: ${componentName}`);
    
    const loadingPromise = importFunction().then(component => {
      this.loadedComponents.add(componentName);
      this.loadingPromises.delete(componentName);
      console.log(`✅ Component loaded: ${componentName}`);
      return component;
    }).catch(error => {
      this.loadingPromises.delete(componentName);
      console.error(`❌ Failed to load component ${componentName}:`, error);
      throw error;
    });

    this.loadingPromises.set(componentName, loadingPromise);
    return loadingPromise;
  }

  /**
   * Preload components for better UX
   */
  preloadComponents(componentImports: Record<string, () => Promise<any>>): void {
    console.log('🚀 Preloading components...');
    
    Object.entries(componentImports).forEach(([name, importFn]) => {
      // Preload after a small delay to not block initial render
      setTimeout(() => {
        this.loadComponent(name, importFn);
      }, 100);
    });
  }
}

// Singleton instances
export const performanceService = new PerformanceService();
export const lazyLoadingService = new LazyLoadingService();

// Auto-start performance monitoring
performanceService.startMonitoring();
