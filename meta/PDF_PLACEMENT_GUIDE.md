# 📁 PDF File Placement Guide

## 📍 Where to Put Your PDFs

### **Primary Location**: `docs/` folder
All PDF files should be placed in the `docs/` folder in your project root:

```
PLC Fundamentals Trainer PC Companion/
├── docs/                          # 👈 PUT YOUR PDFs HERE
│   ├── sample-manual.pdf         # (Replace with real manual)
│   ├── troubleshooting.pdf       # Equipment troubleshooting guide
│   ├── wiring-diagram.pdf        # Electrical wiring diagrams
│   ├── safety-procedures.pdf     # Safety protocols and procedures
│   ├── maintenance-log.pdf       # Maintenance checklist/log forms
│   └── specifications.pdf        # Technical specifications
└── (other project files...)
```

## 📋 Recommended PDF Files

### **Left Column - Documentation** 📋
1. **📖 Equipment Manual** (`sample-manual.pdf`)
   - PLC user manual
   - HMI operation guide
   - System overview documentation

2. **🔧 Troubleshooting** (`troubleshooting.pdf`)
   - Common fault diagnosis
   - Error code explanations
   - Step-by-step repair procedures

3. **⚡ Wiring Diagram** (`wiring-diagram.pdf`)
   - Electrical schematics
   - I/O connection diagrams
   - Power distribution layouts

### **Right Column - Reports** 📊
1. **🛡️ Safety Procedures** (`safety-procedures.pdf`)
   - Lockout/tagout procedures
   - Emergency shutdown protocols
   - Personal protective equipment requirements

2. **📝 Maintenance Log** (`maintenance-log.pdf`)
   - Preventive maintenance checklists
   - Inspection forms
   - Service record templates

3. **📋 Specifications** (`specifications.pdf`)
   - Technical datasheets
   - Performance specifications
   - Compliance certificates

## 🔄 How to Replace Sample Files

### **Step 1**: Prepare Your PDFs
- Name them exactly as shown above
- Ensure files are not password protected
- Keep file sizes reasonable (< 50MB each)

### **Step 2**: Replace in `docs/` folder
```bash
# Navigate to your project folder
cd "PLC Fundamentals Trainer PC Companion"

# Copy your PDFs to the docs folder
copy "C:\path\to\your\manual.pdf" "docs\sample-manual.pdf"
copy "C:\path\to\your\troubleshooting.pdf" "docs\troubleshooting.pdf"
# ... etc for each file
```

### **Step 3**: Test the Integration
1. Start the app: `npm start`
2. Click each PDF button to verify they open correctly
3. Check that all PDFs display properly in the viewer

## ⚙️ Advanced Customization

### **Adding New PDF Buttons**
To add more PDF files, edit `index.html` and add new buttons:

```html
<button class="pdf-button" onclick="openPDF('docs/your-new-file.pdf')" style="...">
  🆕 Your New Document
</button>
```

### **Changing Button Names**
Edit the button text in `index.html`:
```html
📖 Equipment Manual  →  📖 S7-1200 Manual
🔧 Troubleshooting   →  🔧 Fault Diagnosis
```

### **Organizing by Categories**
You can create subfolders in `docs/`:
```
docs/
├── manuals/
├── procedures/
├── diagrams/
└── forms/
```

Then update button paths: `onclick="openPDF('docs/manuals/plc-manual.pdf')"`

## 🎯 Best Practices

✅ **Use descriptive filenames** (no spaces, use hyphens)
✅ **Keep PDFs under 50MB** for fast loading
✅ **Use standard PDF format** (not scanned images)
✅ **Test all PDFs** after adding them
✅ **Keep backups** of your original files

❌ **Don't use special characters** in filenames
❌ **Don't password protect** PDFs (won't open in viewer)
❌ **Don't use extremely large files** (slow loading)

---

**Ready to add your PDFs?** Just drop them in the `docs/` folder with the correct names and they'll work immediately! 🚀 