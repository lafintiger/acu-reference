import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
import { 
  Meridian, Point, Indication, Modality, Technique, Herb, DietItem, 
  BodyRegion, PointCoordinate, Protocol, ProtocolStep,
  PointIndication, PointTechnique, IndicationTechnique, IndicationHerb, IndicationDiet
} from '../types';

class DatabaseManager {
  private SQL: SqlJsStatic | null = null;
  private db: Database | null = null;
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Load SQL.js WASM
      this.SQL = await initSqlJs({
        locateFile: (file: string) => {
          if (file.endsWith('.wasm')) {
            return `https://sql.js.org/dist/${file}`;
          }
          return file;
        }
      });

      // Try to load existing database from localStorage
      const savedDb = localStorage.getItem('acuref_database');
      if (savedDb) {
        const uint8Array = new Uint8Array(JSON.parse(savedDb));
        this.db = new this.SQL.Database(uint8Array);
      } else {
        // Create new database
        this.db = new this.SQL.Database();
        await this.createSchema();
        await this.seedInitialData();
      }

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private async createSchema(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const schema = `
      -- Meridians
      CREATE TABLE meridians (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        element TEXT,
        yin_yang TEXT
      );

      -- Points
      CREATE TABLE points (
        id TEXT PRIMARY KEY,
        meridian_id TEXT,
        name_en TEXT NOT NULL,
        name_pinyin TEXT,
        name_characters TEXT,
        category TEXT DEFAULT 'standard',
        location TEXT NOT NULL,
        indications TEXT, -- JSON array
        contraindications TEXT, -- JSON array
        acupressure_depth TEXT,
        notes TEXT,
        FOREIGN KEY (meridian_id) REFERENCES meridians(id)
      );

      -- Indications
      CREATE TABLE indications (
        id TEXT PRIMARY KEY,
        label TEXT NOT NULL,
        synonyms TEXT, -- JSON array
        category TEXT
      );

      -- Modalities
      CREATE TABLE modalities (
        id TEXT PRIMARY KEY,
        label TEXT NOT NULL,
        description TEXT
      );

      -- Techniques
      CREATE TABLE techniques (
        id TEXT PRIMARY KEY,
        modality_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        cautions TEXT,
        duration TEXT,
        equipment TEXT, -- JSON array
        FOREIGN KEY (modality_id) REFERENCES modalities(id)
      );

      -- Herbs
      CREATE TABLE herbs (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        name_chinese TEXT,
        properties TEXT,
        meridians TEXT, -- JSON array
        cautions TEXT,
        dosage TEXT
      );

      -- Diet Items
      CREATE TABLE diet_items (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        guidance TEXT,
        properties TEXT,
        category TEXT
      );

      -- Body Regions
      CREATE TABLE body_regions (
        id TEXT PRIMARY KEY,
        label TEXT NOT NULL
      );

      -- Point Coordinates
      CREATE TABLE point_coordinates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        point_id TEXT NOT NULL,
        view TEXT NOT NULL,
        x REAL NOT NULL,
        y REAL NOT NULL,
        region_id TEXT,
        FOREIGN KEY (point_id) REFERENCES points(id),
        FOREIGN KEY (region_id) REFERENCES body_regions(id)
      );

      -- Protocols
      CREATE TABLE protocols (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        tags TEXT, -- JSON array
        notes TEXT,
        created_at TEXT,
        updated_at TEXT
      );

      -- Protocol Steps
      CREATE TABLE protocol_steps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        protocol_id TEXT NOT NULL,
        step_index INTEGER NOT NULL,
        step_type TEXT NOT NULL,
        ref_id TEXT,
        details TEXT,
        duration_seconds INTEGER,
        FOREIGN KEY (protocol_id) REFERENCES protocols(id)
      );

      -- Cross-reference tables
      CREATE TABLE point_indications (
        point_id TEXT NOT NULL,
        indication_id TEXT NOT NULL,
        PRIMARY KEY (point_id, indication_id)
      );

      CREATE TABLE point_techniques (
        point_id TEXT NOT NULL,
        technique_id TEXT NOT NULL,
        PRIMARY KEY (point_id, technique_id)
      );

      CREATE TABLE indication_techniques (
        indication_id TEXT NOT NULL,
        technique_id TEXT NOT NULL,
        PRIMARY KEY (indication_id, technique_id)
      );

      CREATE TABLE indication_herbs (
        indication_id TEXT NOT NULL,
        herb_id TEXT NOT NULL,
        PRIMARY KEY (indication_id, herb_id)
      );

      CREATE TABLE indication_diet (
        indication_id TEXT NOT NULL,
        diet_id TEXT NOT NULL,
        PRIMARY KEY (indication_id, diet_id)
      );

      -- Settings
      CREATE TABLE settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );

      -- Schema version
      CREATE TABLE schema_version (
        version INTEGER PRIMARY KEY,
        applied_at TEXT
      );

      INSERT INTO schema_version (version, applied_at) VALUES (1, datetime('now'));
    `;

    this.db.exec(schema);
    this.saveDatabase();
  }

  private saveDatabase(): void {
    if (!this.db) return;
    
    const data = this.db.export();
    const jsonString = JSON.stringify(Array.from(data));
    localStorage.setItem('acuref_database', jsonString);
  }

  // CRUD operations
  async getMeridians(): Promise<Meridian[]> {
    if (!this.db) await this.initialize();
    
    const stmt = this.db!.prepare('SELECT * FROM meridians ORDER BY name');
    const meridians: Meridian[] = [];
    
    while (stmt.step()) {
      const row = stmt.getAsObject();
      meridians.push({
        id: row.id as string,
        name: row.name as string,
        description: row.description as string || undefined,
        element: row.element as string || undefined,
        yinYang: row.yin_yang as 'yin' | 'yang' || undefined,
      });
    }
    
    stmt.free();
    return meridians;
  }

  async getPoints(meridianId?: string): Promise<Point[]> {
    if (!this.db) await this.initialize();
    
    let query = 'SELECT * FROM points';
    const params: any[] = [];
    
    if (meridianId) {
      query += ' WHERE meridian_id = ?';
      params.push(meridianId);
    }
    
    query += ' ORDER BY id';
    
    const stmt = this.db!.prepare(query);
    const points: Point[] = [];
    
    while (stmt.step()) {
      const row = stmt.getAsObject();
      points.push({
        id: row.id as string,
        meridianId: row.meridian_id as string || undefined,
        nameEn: row.name_en as string,
        namePinyin: row.name_pinyin as string || undefined,
        nameCharacters: row.name_characters as string || undefined,
        category: row.category as any || 'standard',
        location: row.location as string,
        indications: row.indications ? JSON.parse(row.indications as string) : [],
        contraindications: row.contraindications ? JSON.parse(row.contraindications as string) : undefined,
        acupressureDepth: row.acupressure_depth as string || undefined,
        notes: row.notes as string || undefined,
      });
    }
    
    stmt.free();
    return points;
  }

  async getPoint(id: string): Promise<Point | null> {
    if (!this.db) await this.initialize();
    
    const stmt = this.db!.prepare('SELECT * FROM points WHERE id = ?');
    stmt.bind([id]);
    
    if (stmt.step()) {
      const row = stmt.getAsObject();
      const point: Point = {
        id: row.id as string,
        meridianId: row.meridian_id as string || undefined,
        nameEn: row.name_en as string,
        namePinyin: row.name_pinyin as string || undefined,
        nameCharacters: row.name_characters as string || undefined,
        category: row.category as any || 'standard',
        location: row.location as string,
        indications: row.indications ? JSON.parse(row.indications as string) : [],
        contraindications: row.contraindications ? JSON.parse(row.contraindications as string) : undefined,
        acupressureDepth: row.acupressure_depth as string || undefined,
        notes: row.notes as string || undefined,
      };
      stmt.free();
      return point;
    }
    
    stmt.free();
    return null;
  }

  async getIndications(): Promise<Indication[]> {
    if (!this.db) await this.initialize();
    
    const stmt = this.db!.prepare('SELECT * FROM indications ORDER BY label');
    const indications: Indication[] = [];
    
    while (stmt.step()) {
      const row = stmt.getAsObject();
      indications.push({
        id: row.id as string,
        label: row.label as string,
        synonyms: row.synonyms ? JSON.parse(row.synonyms as string) : undefined,
        category: row.category as string || undefined,
      });
    }
    
    stmt.free();
    return indications;
  }

  async getTechniques(modalityId?: string): Promise<Technique[]> {
    if (!this.db) await this.initialize();
    
    let query = 'SELECT * FROM techniques';
    const params: any[] = [];
    
    if (modalityId) {
      query += ' WHERE modality_id = ?';
      params.push(modalityId);
    }
    
    query += ' ORDER BY name';
    
    const stmt = this.db!.prepare(query);
    const techniques: Technique[] = [];
    
    while (stmt.step()) {
      const row = stmt.getAsObject();
      techniques.push({
        id: row.id as string,
        modalityId: row.modality_id as any,
        name: row.name as string,
        description: row.description as string || undefined,
        cautions: row.cautions as string || undefined,
        duration: row.duration as string || undefined,
        equipment: row.equipment ? JSON.parse(row.equipment as string) : undefined,
      });
    }
    
    stmt.free();
    return techniques;
  }

  // Export database as JSON
  async exportData(): Promise<string> {
    if (!this.db) await this.initialize();

    const data: any = {};
    
    // Export all tables
    data.meridians = await this.getMeridians();
    data.points = await this.getPoints();
    data.indications = await this.getIndications();
    data.techniques = await this.getTechniques();
    
    return JSON.stringify(data, null, 2);
  }

  // Import data from JSON
  async importData(jsonData: string): Promise<void> {
    if (!this.db) await this.initialize();

    try {
      const data = JSON.parse(jsonData);
      
      // Clear existing data
      this.db.exec('DELETE FROM point_indications');
      this.db.exec('DELETE FROM points');
      this.db.exec('DELETE FROM indications');
      this.db.exec('DELETE FROM techniques');
      this.db.exec('DELETE FROM meridians');
      
      // Import meridians
      if (data.meridians) {
        const stmt = this.db.prepare('INSERT INTO meridians (id, name, description, element, yin_yang) VALUES (?, ?, ?, ?, ?)');
        for (const meridian of data.meridians) {
          stmt.run([meridian.id, meridian.name, meridian.description || null, meridian.element || null, meridian.yinYang || null]);
        }
        stmt.free();
      }
      
      // Import points
      if (data.points) {
        const stmt = this.db.prepare('INSERT INTO points (id, meridian_id, name_en, name_pinyin, name_characters, category, location, indications, contraindications, acupressure_depth, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        for (const point of data.points) {
          stmt.run([
            point.id, 
            point.meridianId || null, 
            point.nameEn, 
            point.namePinyin || null,
            point.nameCharacters || null,
            point.category || 'standard',
            point.location, 
            JSON.stringify(point.indications || []), 
            point.contraindications ? JSON.stringify(point.contraindications) : null,
            point.acupressureDepth || null,
            point.notes || null
          ]);
        }
        stmt.free();
      }
      
      this.saveDatabase();
    } catch (error) {
      console.error('Failed to import data:', error);
      throw error;
    }
  }

  private async seedInitialData(): Promise<void> {
    console.log('Seeding initial data...');
    
    const { meridians, points, indications, modalities, techniques, herbs, dietItems } = await import('../data/seedData');
    
    // Insert meridians
    const meridianStmt = this.db!.prepare('INSERT INTO meridians (id, name, description, element, yin_yang) VALUES (?, ?, ?, ?, ?)');
    for (const meridian of meridians) {
      meridianStmt.run([meridian.id, meridian.name, meridian.description || null, meridian.element || null, meridian.yinYang || null]);
    }
    meridianStmt.free();

    // Insert points
    const pointStmt = this.db!.prepare('INSERT INTO points (id, meridian_id, name_en, name_pinyin, name_characters, category, location, indications, contraindications, acupressure_depth, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    for (const point of points) {
      pointStmt.run([
        point.id, 
        point.meridianId || null, 
        point.nameEn, 
        point.namePinyin || null,
        point.nameCharacters || null,
        point.category || 'standard',
        point.location, 
        JSON.stringify(point.indications || []), 
        point.contraindications ? JSON.stringify(point.contraindications) : null,
        point.acupressureDepth || null,
        point.notes || null
      ]);
    }
    pointStmt.free();

    // Insert indications
    const indicationStmt = this.db!.prepare('INSERT INTO indications (id, label, synonyms, category) VALUES (?, ?, ?, ?)');
    for (const indication of indications) {
      indicationStmt.run([
        indication.id,
        indication.label,
        indication.synonyms ? JSON.stringify(indication.synonyms) : null,
        indication.category || null
      ]);
    }
    indicationStmt.free();

    // Insert modalities
    const modalityStmt = this.db!.prepare('INSERT INTO modalities (id, label, description) VALUES (?, ?, ?)');
    for (const modality of modalities) {
      modalityStmt.run([modality.id, modality.label, modality.description || null]);
    }
    modalityStmt.free();

    // Insert techniques
    const techniqueStmt = this.db!.prepare('INSERT INTO techniques (id, modality_id, name, description, cautions, duration, equipment) VALUES (?, ?, ?, ?, ?, ?, ?)');
    for (const technique of techniques) {
      techniqueStmt.run([
        technique.id,
        technique.modalityId,
        technique.name,
        technique.description || null,
        technique.cautions || null,
        technique.duration || null,
        technique.equipment ? JSON.stringify(technique.equipment) : null
      ]);
    }
    techniqueStmt.free();

    // Insert herbs
    const herbStmt = this.db!.prepare('INSERT INTO herbs (id, name, name_chinese, properties, meridians, cautions, dosage) VALUES (?, ?, ?, ?, ?, ?, ?)');
    for (const herb of herbs) {
      herbStmt.run([
        herb.id,
        herb.name,
        herb.nameChinese || null,
        herb.properties || null,
        herb.meridians ? JSON.stringify(herb.meridians) : null,
        herb.cautions || null,
        herb.dosage || null
      ]);
    }
    herbStmt.free();

    // Insert diet items
    const dietStmt = this.db!.prepare('INSERT INTO diet_items (id, name, guidance, properties, category) VALUES (?, ?, ?, ?, ?)');
    for (const dietItem of dietItems) {
      dietStmt.run([
        dietItem.id,
        dietItem.name,
        dietItem.guidance || null,
        dietItem.properties || null,
        dietItem.category || null
      ]);
    }
    dietStmt.free();

    console.log(`Seeded: ${meridians.length} meridians, ${points.length} points, ${indications.length} indications, ${techniques.length} techniques, ${herbs.length} herbs, ${dietItems.length} diet items`);
    this.saveDatabase();
  }
}

export const db = new DatabaseManager();
