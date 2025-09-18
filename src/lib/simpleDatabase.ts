import { 
  Meridian, Point, Indication, Technique 
} from '../types';
import { meridians, points, indications, techniques } from '../data/seedData';
import { validatePointAgainstWHO } from '../data/whoStandardPoints';

class SimpleDatabase {
  private initialized = false;
  private data = {
    meridians: [] as Meridian[],
    points: [] as Point[],
    indications: [] as Indication[],
    techniques: [] as Technique[]
  };

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Always reload from seed data for now to get updates
      // TODO: In production, check version and only reload if seed data is newer
      
      // Use fresh seed data with WHO Standard validation
      this.data.meridians = [...meridians];
      this.data.points = points.map(point => validatePointAgainstWHO(point));
      this.data.indications = [...indications];
      this.data.techniques = [...techniques];
      this.saveData();
      
      console.log('Database reloaded with fresh seed data');
      
      this.initialized = true;
      console.log('Simple database initialized with:', {
        meridians: this.data.meridians.length,
        points: this.data.points.length,
        indications: this.data.indications.length,
        techniques: this.data.techniques.length
      });
    } catch (error) {
      console.error('Failed to initialize simple database:', error);
      throw error;
    }
  }

  private saveData(): void {
    try {
      localStorage.setItem('acuref_simple_data', JSON.stringify(this.data));
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  }

  async getMeridians(): Promise<Meridian[]> {
    if (!this.initialized) await this.initialize();
    return [...this.data.meridians];
  }

  async getPoints(meridianId?: string): Promise<Point[]> {
    if (!this.initialized) await this.initialize();
    
    let result = [...this.data.points];
    if (meridianId) {
      result = result.filter(point => point.meridianId === meridianId);
    }
    return result;
  }

  async getPoint(id: string): Promise<Point | null> {
    if (!this.initialized) await this.initialize();
    return this.data.points.find(point => point.id === id) || null;
  }

  async getIndications(): Promise<Indication[]> {
    if (!this.initialized) await this.initialize();
    return [...this.data.indications];
  }

  async getIndicationById(id: string): Promise<Indication | null> {
    if (!this.initialized) await this.initialize();
    return this.data.indications.find(indication => indication.id === id) || null;
  }

  async getTechniques(modalityId?: string): Promise<Technique[]> {
    if (!this.initialized) await this.initialize();
    
    let result = [...this.data.techniques];
    if (modalityId) {
      result = result.filter(technique => technique.modalityId === modalityId);
    }
    return result;
  }

  async exportData(): Promise<string> {
    if (!this.initialized) await this.initialize();
    return JSON.stringify(this.data, null, 2);
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const imported = JSON.parse(jsonData);
      
      // Validate the structure
      if (imported.meridians && imported.points && imported.indications) {
        this.data = {
          meridians: imported.meridians || [],
          points: imported.points || [],
          indications: imported.indications || [],
          techniques: imported.techniques || []
        };
        this.saveData();
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.error('Import failed:', error);
      throw error;
    }
  }
}

export const simpleDb = new SimpleDatabase();
