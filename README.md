# 🌿 AcuReference - Comprehensive TCM Reference Application

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-teal.svg)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-green.svg)](https://web.dev/progressive-web-apps/)

> **Professional-grade Traditional Chinese Medicine (TCM) reference application for acupressurists, applied kinesiologists, cupping therapists, and Gua Sha practitioners.**

## ✨ **Key Features**

### 🎯 **WHO Standard Integration**
- **Authoritative Point Locations** - Based on WHO Standard Acupuncture Point Locations
- **Precise Anatomical Descriptions** - B-cun measurements and landmark references
- **International Consistency** - Globally recognized point classifications
- **Professional Accuracy** - Research-validated location data

### 🔍 **Advanced Search & Discovery**
- **Global Search** - Instant fuzzy search across all content
- **Advanced Filters** - Five Element theory, point classifications, safety
- **Cross-Modal Integration** - Find treatments across all modalities
- **Intelligent Suggestions** - Related points and conditions

### 🏥 **Comprehensive Modalities**
- **Acupressure Protocols** - Detailed pressure techniques and sequences
- **Cupping Therapy** - Cup sizes, suction levels, and treatment areas
- **Gua Sha Techniques** - Scraping directions, tools, and pressure guidance
- **Applied Kinesiology** - Muscle testing and correction protocols

### 📊 **Interactive Body Map**
- **High-Resolution Anatomical Images** - Medical-grade visualization
- **Precise Point Mapping** - Percentage-based coordinate system
- **Gender-Specific Views** - Male/female anterior/posterior options
- **Interactive Point Selection** - Click-to-explore functionality

### 🎨 **Treatment Planning**
- **Multi-Modal Protocols** - Integrated treatment sequences (27+ protocols)
- **Protocol Builder** - Create custom treatment plans
- **Clinical Notes** - Personal observations and modifications
- **Treatment Comparison** - Side-by-side modality analysis

### 📱 **Offline-First PWA**
- **Works Offline** - Full functionality without internet
- **Cross-Platform** - Windows, macOS, iOS, Android
- **Installable** - Add to home screen capability
- **Fast Performance** - Optimized for clinical use

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation
```bash
# Clone the repository
git clone https://github.com/lafintiger/acu-reference.git
cd acu-reference

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### 🖼️ **Setting Up Body Map Images**
1. Download high-resolution anatomical images (see `src/components/ImageInstructions.tsx`)
2. Place images in `public/` folder:
   - `male-anterior.jpg` - Male front view
   - `male-posterior.jpg` - Male back view
   - `female-anterior.jpg` - Female front view
   - `female-posterior.jpg` - Female back view

## 📚 **Project Structure**

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main application layout
│   ├── ImageUploadBodyMap.tsx  # Interactive body map
│   ├── AdvancedSearch.tsx      # Advanced filtering
│   └── WHOPointsImporter.tsx   # Data validation
├── pages/              # Application pages
│   ├── Home.tsx        # Dashboard overview
│   ├── Points.tsx      # Point reference
│   ├── Indications.tsx # Condition listings
│   ├── Protocols.tsx   # Treatment protocols
│   └── Settings.tsx    # Configuration
├── data/               # Application data
│   ├── seedData.ts     # Core reference data
│   ├── whoStandardPoints.ts    # WHO validation
│   ├── acupressureProtocols.ts # Treatment protocols
│   └── pointCoordinates.ts     # Body map coordinates
├── lib/                # Utility libraries
│   ├── simpleDatabase.ts       # Local data management
│   ├── searchService.ts        # Search functionality
│   └── csvService.ts           # Data import/export
└── types/              # TypeScript definitions
    └── index.ts        # Core type definitions
```

## 🎯 **Core Data Model**

### Points (160+ WHO-Validated)
```typescript
interface Point {
  id: string;              // Point code (e.g., "LI4")
  meridianId: string;      // Meridian association
  nameEn: string;          // English name
  namePinyin: string;      // Pinyin romanization
  nameCharacters: string;  // Chinese characters
  location: string;        // WHO standard description
  indications: string[];   // Clinical applications
  category: 'standard' | 'extra' | 'extraordinary';
  acupressureDepth: string; // Pressure guidance
}
```

### Treatment Protocols (120+ Comprehensive)
```typescript
interface AcupressureProtocol {
  indication: string;
  primaryPoints: string[];
  pressure: 'light' | 'moderate' | 'firm';
  duration: string;
  sequence: string[];
  clinicalNotes: string;
}
```

## 🏥 **Clinical Applications**

### **For Acupressurists**
- Precise point locations with WHO validation
- Pressure depth and duration guidance
- Treatment sequences for 120+ conditions
- Safety contraindications and cautions

### **For Applied Kinesiologists**
- Muscle-meridian associations
- Assessment protocols
- Correction techniques
- Weakness indication patterns

### **For Cupping Therapists**
- Cup size recommendations
- Suction level guidance
- Treatment area mapping
- Technique variations

### **For Gua Sha Practitioners**
- Scraping direction protocols
- Tool selection guidance
- Pressure application techniques
- Area-specific treatments

## 🔬 **Technical Features**

### **Performance Optimized**
- **Lazy Loading** - Components load on demand
- **Code Splitting** - Reduced bundle sizes
- **Caching Strategy** - Efficient data storage
- **Search Indexing** - Fast query responses

### **Data Management**
- **LocalStorage Persistence** - Offline data retention
- **CSV Import/Export** - Flexible data management
- **Version Control** - Data update tracking
- **Backup/Restore** - Data protection

### **Professional UI/UX**
- **Responsive Design** - Works on all devices
- **Accessibility** - WCAG compliant
- **Professional Styling** - Clean, clinical interface
- **Error Boundaries** - Graceful error handling

## 📈 **Development Roadmap**

### **Phase 1: Core Foundation** ✅
- [x] WHO Standard point integration
- [x] Multi-modal protocol system
- [x] Interactive body mapping
- [x] Advanced search capabilities

### **Phase 2: Enhanced Features** 🚧
- [ ] Clinical notes and customization
- [ ] Complete meridian point coverage
- [ ] Educational features and quizzes
- [ ] User preference system

### **Phase 3: Advanced Capabilities** 📋
- [ ] Treatment outcome tracking
- [ ] Patient management system
- [ ] Advanced analytics
- [ ] Multi-language support

## 🤝 **Contributing**

This is a professional clinical tool. Contributions should maintain:
- **Clinical Accuracy** - All data must be evidence-based
- **WHO Standards** - Point locations must follow international standards
- **Professional Quality** - Code should meet production standards
- **Safety First** - Contraindications and safety warnings are critical

### **Development Setup**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ **Medical Disclaimer**

This application is for educational and reference purposes only. It is not intended to diagnose, treat, cure, or prevent any disease. Always consult with qualified healthcare professionals for medical advice and treatment.

## 🙏 **Acknowledgments**

- **WHO** - World Health Organization Standard Acupuncture Point Locations
- **TCM Community** - Traditional Chinese Medicine practitioners and researchers
- **Open Source** - React, TypeScript, Vite, and Tailwind CSS communities

## 📞 **Support & Contact**

For questions, suggestions, or professional inquiries:
- **GitHub Issues** - Technical problems and feature requests
- **Professional Use** - Clinical applications and feedback

---

**Built with ❤️ for Traditional Chinese Medicine practitioners worldwide**

*Combining ancient wisdom with modern technology for better healthcare outcomes.*