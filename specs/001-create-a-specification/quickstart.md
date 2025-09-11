# Quickstart Guide: Migration Validation

**Version**: 1.0.0
**Date**: September 11, 2025
**Estimated Time**: 30-45 minutes

## Overview
This quickstart guide validates the successful migration of the broken GitHub web application to the turborepo-shadcn-nextjs structure with integrated components from magic-template.

## Prerequisites

### System Requirements
- Node.js 18+ and npm/yarn/pnpm
- Git for repository access
- Turborepo CLI installed
- Access to https://github.com/jessenaiman/magic-template

### Test Baseline
- ✅ 5 existing tests currently passing
- ✅ Turborepo structure intact
- ✅ packages/ui package exists
- ✅ apps/web application functional

## Quickstart Steps

### Step 1: Verify Current State (2 minutes)
```bash
# Check current test status
npm test
# Expected: 5 tests passing

# Verify turborepo structure
ls -la packages/ui
ls -la apps/web

# Check existing functionality
npm run dev
# Expected: Application starts without errors
```

**Success Criteria**:
- [ ] All 5 tests pass
- [ ] Turborepo packages exist
- [ ] Application starts successfully

### Step 2: Component Migration Setup (5 minutes)
```bash
# Clone magic-template repository
git clone https://github.com/jessenaiman/magic-template temp-magic-template

# Analyze landing-page component
ls temp-magic-template/components/landing-page/
ls temp-magic-template/components/landings/
ls temp-magic-template/components/navigation/

# Install UI libraries
cd packages/ui
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install tailwindcss class-variance-authority clsx
# Add other required dependencies for shadcn, magicui, animate-ui, reacbits
```

**Success Criteria**:
- [ ] Repository cloned successfully
- [ ] Components identified and analyzed
- [ ] UI libraries installed in packages/ui

### Step 3: Landing Page Integration (10 minutes)
```bash
# Copy landing-page component
cp -r temp-magic-template/components/landing-page/ packages/ui/src/components/

# Update component imports to use proper aliases
# Example: @/components/ui/button → @/packages/ui/src/components/button

# Integrate with layout.tsx
# Add landing page component to apps/web/src/app/layout.tsx

# Integrate with page.tsx
# Update apps/web/src/app/page.tsx to use landing page
```

**Success Criteria**:
- [ ] Landing page component copied to packages/ui
- [ ] Import aliases updated correctly
- [ ] Layout.tsx updated with landing page
- [ ] Page.tsx renders landing page correctly

### Step 4: Navigation Components Integration (8 minutes)
```bash
# Copy navigation components
cp -r temp-magic-template/components/navigation/ packages/ui/src/components/

# Update navigation component imports
# Ensure proper alias usage: @/components/navigation/*

# Integrate navigation with layout
# Update apps/web/src/app/layout.tsx to include navigation

# Test navigation functionality
npm run dev
# Navigate through application routes
```

**Success Criteria**:
- [ ] Navigation components copied successfully
- [ ] Import aliases configured correctly
- [ ] Navigation integrated in layout
- [ ] Navigation routes functional

### Step 5: UI Library Integration (5 minutes)
```bash
# Verify shadcn components
ls packages/ui/src/components/ui/
# Expected: button.tsx, card.tsx, dialog.tsx, etc.

# Test component imports in web app
# Example: import { Button } from '@/packages/ui/src/components/ui/button'

# Verify magicui, animate-ui, reacbits availability
npm list | grep -E "(magicui|animate-ui|reacbits)"
```

**Success Criteria**:
- [ ] Shadcn components available in packages/ui
- [ ] MagicUI, Animate-UI, Reacbits installed
- [ ] Components importable with proper aliases
- [ ] No custom components created (refactor only)

### Step 6: Testing Validation (5 minutes)
```bash
# Run full test suite
npm test
# Expected: All 5 tests still passing

# Run component-specific tests
npm run test:components
# Expected: New component tests pass

# Validate migration integrity
npm run test:migration
# Expected: No breaking changes detected
```

**Success Criteria**:
- [ ] All 5 original tests pass
- [ ] Component integration tests pass
- [ ] Migration validation successful
- [ ] No test regressions

### Step 7: Final Validation (5 minutes)
```bash
# Start development server
npm run dev

# Test user scenarios:
# 1. Landing page loads correctly
# 2. Navigation works across pages
# 3. UI components render properly
# 4. No console errors
# 5. Performance acceptable

# Clean up temporary files
rm -rf temp-magic-template
```

**Success Criteria**:
- [ ] Application starts without errors
- [ ] Landing page displays correctly
- [ ] Navigation functional
- [ ] UI components styled properly
- [ ] Performance meets expectations

## Troubleshooting

### Common Issues

**Test Failures**:
```bash
# Check test output for specific failures
npm test -- --verbose

# Restore baseline if needed
git checkout HEAD~1
npm test
```

**Import Errors**:
```bash
# Verify alias configuration in tsconfig.json
cat apps/web/tsconfig.json | grep paths

# Check package.json exports
cat packages/ui/package.json | grep exports
```

**Component Rendering Issues**:
```bash
# Check browser console for errors
# Verify Tailwind CSS compilation
npm run build:css

# Validate component props
# Check Radix UI dependencies
```

### Rollback Procedure
```bash
# If migration fails, rollback changes
git checkout migration-start-branch
npm install
npm test
```

## Success Metrics

- ✅ **5/5 tests passing** (mandatory)
- ✅ **Landing page component** integrated
- ✅ **Navigation components** functional
- ✅ **UI libraries** properly installed
- ✅ **Turborepo structure** maintained
- ✅ **No configuration files** modified
- ✅ **Performance** meets baseline
- ✅ **User experience** improved

## Next Steps

1. **Deploy to staging** for further testing
2. **Gather user feedback** on new components
3. **Monitor performance metrics** post-migration
4. **Plan next iteration** based on test results

---

*Quickstart guide extracted from acceptance scenarios and user stories - Phase 1 execution*</content>
<parameter name="filePath">/home/dice-wizard/dev/web-design-workbench/specs/001-create-a-specification/quickstart.md
