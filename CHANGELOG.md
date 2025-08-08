# Change Log - PLC Fundamentals v2

## Overview
This document summarizes all changes made to fix various issues in the PLC Fundamentals application during this development session.

## Issues Fixed (Chronological Order)
________________________________________________________________________________

### Issue 0016: MCQ Alignment and Distribution, Simulations Hidden
**Date**: 2025-08-08
**Problem**: Worksheet MCQs did not fully match the answers document; internal answer parsing was unreliable in places; correct options were clustered on letter A; interactive simulations needed to be hidden after Q&A for print/clarity.

**Files Affected**:
- `worksheet-3.html` through `worksheet-12.html` (varies per change)
- `docs/CP2388 – PLC Fundamentals for Maintenance Engineers - Answers.txt` (reference only)

**Solutions**:
- Aligned Questions & Answers content to the source answers document (worksheets 2–12; 1 unchanged).
- Fixed regex-based answer extraction across worksheets that read from the visible “Correct Answer:” line using pattern `^([A-D])\)`.
- Commented out interactive simulation sections after the Q&A so they remain in the file but are hidden.
- Began redistributing correct answers across A–D to avoid clustering; ensured the visible letter and any internal `correctAnswers` mappings match.

**Edits (highlights)**:
- `worksheet-3.html`: Q3 → B, Q4 → D, Q5 → B; simulation section commented (already).
- `worksheet-4.html`: Q3 → B, Q4 → D, Q5 → C; simulation section retained, diagnostic blocks present.
- `worksheet-5.html`: Q2 → A, Q4 → C, Q5 → B; simulation section commented.
- `worksheet-6.html`: Q2 → C, Q3 → B, Q4 → D; simulation section commented.
- `worksheet-7.html`: Q2 → D, Q4 → D, Q5 → B; simulation section commented.
- `worksheet-8.html`: Q2 → B, Q3 → C, Q4 → D, Q5 → B (visible letters updated accordingly).
- `worksheet-9.html`: Q2 → C, Q3 → B, Q4 → D, Q5 → C (visible letters updated accordingly).
- `worksheet-10.html`: mapping updated → Q4=A, Q5=A (internal `correctAnswers`).
- `worksheet-11.html`: Q2 → D, Q3 → C, Q4 → B, Q5 → D; mapping updated accordingly.
- `worksheet-12.html`: Q1 → D, Q2 → C, Q3 → D, Q4 → C, Q5 → B; mapping updated accordingly.

**Artifacts**:
- Added `docs/WORKSHEET_MCQ_UPDATE_LOG.md` to track MCQ redistribution progress and rules of engagement.

**Status**: ✅ **PARTIALLY FIXED** (redistribution continuing; content alignment and simulation hiding complete)


________________________________________________________________________________

### Issue 0001: JavaScript Regular Expression Syntax Errors
**Date**: First issue encountered
**Problem**: Multiple `Uncaught SyntaxError: Invalid regular expression: /^[A-D])/: Unmatched ')'` errors across worksheet files.

**Files Affected**: 
- `worksheet-2.html` through `worksheet-14.html` (13 files total)

**Root Cause**: Extra closing parenthesis in regular expression pattern `/^[A-D])/`

**Solution**: 
- Fixed regex pattern from `/^[A-D])/` to `/^[A-D]/`
- Applied fix to all affected files using search and replace

**Status**: ✅ **FIXED**

________________________________________________________________________________

### Issue 0002: Export Functionality Including Fault Scenarios
**Date**: Second issue encountered
**Problem**: Export was incorrectly including data from "fault scenarios" which are no longer present in the application.

**Files Affected**: 
- `worksheet-tracking.js`

**Solution**: Modified export functionality to only include maintenance worksheets (worksheets 1-12)

**Changes Made**:
- **Removed**: Fault scenario array from worksheets definition
- **Modified**: `getAllProgress()` function to only collect maintenance worksheet data
- **Updated**: `updateOverallProgress()` to only count maintenance worksheets
- **Simplified**: `generateSummary()` function to remove fault progress calculations
- **Enhanced**: `exportToCSV()` to exclude fault scenario data
- **Added**: `cleanupOldWorksheetData()` function to remove lingering fault scenario data
- **Removed**: All fault scenario tracking functions

**Status**: ✅ **FIXED**

________________________________________________________________________________

### Issue 0003: Tracking Dashboard Reset Function Error
**Date**: Third issue encountered
**Problem**: `Uncaught ReferenceError: hideResetConfirmation is not defined` when resetting all progress.

**Files Affected**: 
- `tracking-dashboard.html`

**Solution**: Changed function call from `hideResetConfirmation()` to `hideResetOptions()`

**Status**: ✅ **FIXED**

________________________________________________________________________________

### Issue 0004: CSS Visual Update Issue in Worksheet 1
**Date**: Fourth issue encountered
**Problem**: "Over to you cards" were not visually updating (greyed out, checkbox checked) when clicked, only when checkbox itself was clicked.

**Files Affected**: 
- `worksheet-1.html`

**Solution**: Added inline style application and enhanced initialization

**Changes Made**:
- **Enhanced**: Change handler to force inline styles when checkbox state changes
- **Improved**: Card click handler to properly toggle checkbox and trigger visual updates
- **Updated**: Initialization logic to apply completed styles when loading saved states
- **Added**: Debug logging to track class and style changes

**Status**: ✅ **FIXED**

________________________________________________________________________________

### Issue 0005: Navigation Header Inconsistency
**Date**: Fifth issue encountered
**Problem**: Headers were "jumping around" between pages and "install app button" was disappearing on some pages.

**Files Affected**: 
- All `worksheet-X.html` files (worksheet-1.html through worksheet-14.html)
- `shared-navigation.js` (verified)
- `pwa-install.js` (verified)

**Root Cause**: Individual worksheet files were using hardcoded navigation instead of shared navigation component.

**Solution**: 
1. Removed hardcoded `<nav class="main-navigation">...</nav>` blocks from all worksheet files
2. Added shared navigation scripts to all worksheet files
3. Created and executed PowerShell script to automate the process

**Changes Made**:
- **Removed**: Hardcoded navigation sections from all worksheet files
- **Added**: Shared navigation scripts (`shared-navigation.js` and `pwa-install.js`) to all worksheet files
- **Created**: PowerShell automation script for bulk updates
- **Manual Fixes**: Required for `worksheet-3.html` and `worksheet-6.html` due to script limitations

**Status**: ✅ **FIXED**

________________________________________________________________________________

### Issue 0015 - Trigger New Deployment
**Date**: 2025-01-27
**Status**: ✅ Fixed

### Summary
- Triggered new deployment to test GitHub Actions permissions fix
- Updated repository settings to allow GitHub Actions write permissions

---

## Features Added/Removed Summary

### ✅ Features Added
- **Enhanced Visual Feedback**: Improved CSS visual updates for interactive elements in worksheet 1
- **Consistent Navigation**: Implemented shared navigation component across all pages
- **Data Cleanup**: Added automatic cleanup of old fault scenario data from localStorage
- **Debug Logging**: Enhanced console logging for troubleshooting interactive elements

### ❌ Features Removed
- **Fault Scenarios**: Completely removed all fault scenario functionality from the application
- **Fault Export Data**: Removed fault scenario data from all export formats (JSON, CSV, PDF)
- **Fault Progress Tracking**: Eliminated fault scenario progress calculations and storage
- **Hardcoded Navigation**: Removed individual navigation blocks from worksheet files

### 🐛 Bugs Fixed
1. **Regular Expression Syntax Errors**: Fixed invalid regex patterns across 13 worksheet files
2. **Export Data Accuracy**: Corrected export to only include maintenance worksheets (1-12)
3. **Reset Function Error**: Fixed undefined function call in tracking dashboard
4. **CSS Visual Updates**: Resolved card click visual feedback issues
5. **Navigation Consistency**: Fixed header jumping and missing install button issues

## Files Modified Summary

### JavaScript Files
- `worksheet-tracking.js` - Major refactoring to remove fault scenarios and fix export functionality
- `shared-navigation.js` - Verified (no changes needed)
- `pwa-install.js` - Verified (no changes needed)

### HTML Files
- `worksheet-1.html` - Fixed CSS visual update issue and navigation
- `worksheet-2.html` through `worksheet-14.html` - Fixed regex errors and navigation
- `tracking-dashboard.html` - Fixed reset function error

### Temporary Files
- `fix-navigation.ps1` - Created and executed, then deleted

## Testing Recommendations

1. **Regular Expression Fix**: Test all worksheet files to ensure no more regex errors
2. **Export Functionality**: Verify exports only include maintenance worksheets (1-12)
3. **Tracking Dashboard**: Test reset functionality
4. **Worksheet 1 Cards**: Test "over to you cards" visual updates
5. **Navigation**: Verify consistent headers across all pages with install button present

## Notes

- All fault scenario functionality has been completely removed from the application
- Local storage cleanup will remove any existing fault scenario data
- Navigation is now consistently shared across all pages
- Visual updates for interactive elements have been enhanced with inline styles

## Date
Changes made: December 2024 