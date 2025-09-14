# Contributing to AcuReference

Thank you for your interest in contributing to AcuReference! This project serves Traditional Chinese Medicine practitioners worldwide, so contributions must maintain the highest standards of clinical accuracy and professional quality.

## 🎯 **Core Principles**

### **Clinical Accuracy First**
- All point locations must follow WHO Standard Acupuncture Point Locations
- Treatment protocols must be evidence-based
- Safety information (contraindications) is critical
- Sources must be cited for all clinical claims

### **Professional Quality**
- Code must meet production standards
- UI/UX should be clinical and professional
- Performance must support real-world clinical use
- Accessibility is required (WCAG compliance)

### **International Standards**
- Use WHO standardized nomenclature
- Support multiple measurement systems (B-cun, anatomical landmarks)
- Consider cultural sensitivity in terminology
- Maintain consistency with international TCM standards

## 🚀 **Getting Started**

### **Development Setup**
```bash
# Fork and clone the repository
git clone https://github.com/your-username/acu-reference.git
cd acu-reference

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Check linting
npm run lint
```

### **Project Structure Understanding**
- `src/data/` - Clinical reference data (WHO validated)
- `src/components/` - Reusable UI components
- `src/pages/` - Application pages and routes
- `src/lib/` - Utility functions and services
- `src/types/` - TypeScript type definitions

## 📋 **Contribution Types**

### **Data Contributions** (High Priority)
- **Point Location Corrections** - Must include WHO source reference
- **Protocol Enhancements** - Evidence-based treatment sequences
- **Translation Improvements** - Pinyin, characters, English names
- **Safety Updates** - Contraindications and cautions

### **Feature Contributions**
- **Search Improvements** - Better filtering and discovery
- **UI/UX Enhancements** - Professional, clinical interface
- **Performance Optimizations** - Faster load times, offline capability
- **Accessibility Features** - Screen reader support, keyboard navigation

### **Technical Contributions**
- **Bug Fixes** - Resolve issues affecting clinical use
- **Code Quality** - Refactoring, optimization, testing
- **Documentation** - Code comments, API documentation
- **Build Process** - Development workflow improvements

## 🔬 **Quality Standards**

### **Code Quality**
- **TypeScript** - Strict typing required
- **ESLint/Prettier** - Follow configured rules
- **Testing** - Unit tests for critical functions
- **Performance** - Consider clinical use scenarios

### **Clinical Accuracy**
- **Source Verification** - Cite authoritative sources
- **Peer Review** - Clinical claims need validation
- **Safety Priority** - Contraindications must be prominent
- **Professional Standards** - Follow TCM best practices

### **Documentation**
- **Clear Descriptions** - Explain clinical relevance
- **Code Comments** - Document complex logic
- **User Guides** - Help practitioners use features
- **API Documentation** - For data structures

## 📝 **Submission Process**

### **Before You Start**
1. **Check Issues** - Look for existing work or discussions
2. **Create Issue** - Describe your proposed contribution
3. **Get Feedback** - Discuss approach with maintainers
4. **Fork Repository** - Create your development branch

### **Development Workflow**
1. **Feature Branch** - `git checkout -b feature/your-feature-name`
2. **Small Commits** - Logical, focused changes
3. **Test Thoroughly** - Verify clinical accuracy
4. **Update Documentation** - Include relevant changes

### **Pull Request Requirements**
- **Clear Title** - Describe the change
- **Detailed Description** - Explain clinical relevance
- **Testing Notes** - How you verified the change
- **Screenshots** - For UI changes
- **Source Citations** - For clinical data

### **Review Process**
1. **Automated Checks** - Linting, tests, build
2. **Clinical Review** - Accuracy verification
3. **Code Review** - Quality and standards
4. **Final Testing** - Integration verification

## 🏥 **Clinical Data Guidelines**

### **Point Location Data**
```typescript
// Required fields for point contributions
{
  id: "LI4",                    // Standard point code
  nameEn: "Hegu",              // English name
  namePinyin: "Hé Gǔ",         // Proper pinyin with tones
  nameCharacters: "合谷",       // Simplified Chinese
  location: "WHO standard description...",
  indications: ["headache", "toothache"],
  contraindications: ["pregnancy"],
  notes: "WHO Standard location. Clinical notes."
}
```

### **Protocol Data**
```typescript
// Required fields for treatment protocols
{
  indication: "headache",
  primaryPoints: ["LI4", "GB20"],
  technique: "moderate pressure",
  duration: "2-3 minutes",
  clinicalNotes: "Evidence-based notes...",
  contraindications: ["pregnancy", "acute_trauma"],
  source: "Clinical reference or study"
}
```

### **Source Requirements**
- **WHO Standards** - Primary source for point locations
- **Peer-Reviewed Research** - For treatment protocols
- **Classical Texts** - For traditional applications
- **Clinical Guidelines** - For safety information

## ⚠️ **Safety & Legal Considerations**

### **Medical Disclaimer Compliance**
- All contributions must support educational use only
- No diagnostic or treatment claims
- Emphasize professional consultation requirements
- Include appropriate safety warnings

### **Liability Considerations**
- Contributors are not liable for clinical use
- Users must verify all information independently
- Professional responsibility lies with practitioners
- Application provides reference data only

### **Intellectual Property**
- Contributions must be original or properly licensed
- Respect copyright on clinical references
- WHO standards are used under fair use
- Classical texts are public domain

## 🤝 **Community Guidelines**

### **Professional Conduct**
- Respectful communication
- Constructive feedback
- Clinical focus in discussions
- Evidence-based arguments

### **Collaboration**
- Share knowledge openly
- Support learning and education
- Respect diverse perspectives
- Maintain professional standards

### **Issue Reporting**
- Clear problem descriptions
- Steps to reproduce
- Clinical context if relevant
- Proposed solutions

## 🎓 **Learning Resources**

### **TCM References**
- WHO Standard Acupuncture Point Locations
- Classical TCM texts and translations
- Modern research and clinical studies
- Professional association guidelines

### **Technical Resources**
- React/TypeScript documentation
- Vite build system guides
- Tailwind CSS framework
- PWA development best practices

## 📞 **Getting Help**

### **For Clinical Questions**
- Consult authoritative TCM sources
- Verify with qualified practitioners
- Reference peer-reviewed research
- Follow professional guidelines

### **For Technical Questions**
- Check existing issues and discussions
- Review project documentation
- Ask in development channels
- Consult framework documentation

## 🙏 **Recognition**

Contributors who maintain clinical accuracy and professional standards will be:
- Listed in project acknowledgments
- Credited in relevant documentation
- Invited to participate in project governance
- Recognized for their professional expertise

---

**Thank you for helping build a world-class TCM reference tool that serves practitioners and ultimately benefits patients worldwide!**
