# Tasks: Migrate Broken GitHub Web Application to Turborepo-Shadcn-Nextjs Structure

**Input**: Design documents from `/specs/001-create-a-specification/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Web app structure**: `apps/web/`, `packages/ui/`
- **Turborepo packages**: `packages/ui/src/components/`
- **Tests**: `apps/web/tests/`, `packages/ui/tests/`

## Phase 3.1: Setup
- [x] T001 Clone magic-template repository for component analysis
- [x] T002 Verify current 5 tests pass as baseline
- [x] T003 Install UI libraries (shadcn, magicui, animate-ui, reacbits) in packages/ui
- [x] T004 [P] Configure component aliases in apps/web/tsconfig.json
- [x] T005 [P] Set up turborepo build pipeline for packages/ui

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T006 [P] Contract test for component migration API in apps/web/tests/contract/test-component-migration.test.ts
- [ ] T007 [P] Contract test for UI integration API in packages/ui/tests/contract/test-ui-integration.test.ts
- [ ] T008 [P] Contract test for testing validation API in apps/web/tests/contract/test-testing-validation.test.ts
- [ ] T009 [P] Integration test for landing page component rendering in apps/web/tests/integration/test-landing-page.test.tsx
- [ ] T010 [P] Integration test for navigation component functionality in apps/web/tests/integration/test-navigation.test.tsx
- [ ] T011 [P] Integration test for UI library compatibility in packages/ui/tests/integration/test-ui-libraries.test.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T012 [P] User entity model in apps/web/src/models/User.ts
- [ ] T013 [P] Application Data entity model in apps/web/src/models/ApplicationData.ts
- [ ] T014 [P] UI Components entity model in packages/ui/src/models/UIComponents.ts
- [ ] T015 [P] Landing Page Component migration in packages/ui/src/components/landing-page/
- [ ] T016 [P] Landing Components migration in packages/ui/src/components/landings/
- [ ] T017 [P] Navigation Components migration in packages/ui/src/components/navigation/
- [ ] T018 [P] Shadcn Components setup in packages/ui/src/components/ui/
- [ ] T019 [P] MagicUI Components integration in packages/ui/src/components/magic-ui/
- [ ] T020 [P] Animate-UI Components setup in packages/ui/src/components/animate-ui/
- [ ] T021 [P] Reacbits Components integration in packages/ui/src/components/reacbits/
- [ ] T022 Update layout.tsx to integrate landing page component
- [ ] T023 Update page.tsx to use migrated landing components
- [ ] T024 Configure component exports in packages/ui/package.json

## Phase 3.4: Integration
- [ ] T025 Connect UI components to web application via aliases
- [ ] T026 Integrate navigation components with layout.tsx
- [ ] T027 Set up component dependency resolution
- [ ] T028 Configure turborepo package dependencies
- [ ] T029 Validate component compatibility across libraries

## Phase 3.5: Polish
- [ ] T030 [P] Unit tests for component validation in packages/ui/tests/unit/test-component-validation.test.ts
- [ ] T031 [P] Unit tests for alias mapping in apps/web/tests/unit/test-alias-mapping.test.ts
- [ ] T032 Performance tests for component rendering (<100ms)
- [ ] T033 [P] Update component documentation in packages/ui/README.md
- [ ] T034 Run quickstart validation scenarios
- [ ] T035 Verify all 5 tests still pass after migration
- [ ] T036 Clean up temporary files and optimize bundle size

## Dependencies
- Setup (T001-T005) before Tests (T006-T011)
- Tests (T006-T011) before Core Implementation (T012-T024)
- Core Implementation (T012-T024) before Integration (T025-T029)
- Integration (T025-T029) before Polish (T030-T036)
- T015, T016, T017 depend on T001 (magic-template clone)
- T022, T023 depend on T015-T017 (component migration)
- T035 depends on all previous tasks (final validation)

## Parallel Execution Examples

### Setup Phase Parallel Tasks:
```
Task: "Configure component aliases in apps/web/tsconfig.json"
Task: "Set up turborepo build pipeline for packages/ui"
```

### Test Phase Parallel Tasks:
```
Task: "Contract test for component migration API in apps/web/tests/contract/test-component-migration.test.ts"
Task: "Contract test for UI integration API in packages/ui/tests/contract/test-ui-integration.test.ts"
Task: "Contract test for testing validation API in apps/web/tests/contract/test-testing-validation.test.ts"
Task: "Integration test for landing page component rendering in apps/web/tests/integration/test-landing-page.test.tsx"
```

### Core Implementation Parallel Tasks:
```
Task: "User entity model in apps/web/src/models/User.ts"
Task: "Application Data entity model in apps/web/src/models/ApplicationData.ts"
Task: "UI Components entity model in packages/ui/src/models/UIComponents.ts"
Task: "Landing Page Component migration in packages/ui/src/components/landing-page/"
```

### Polish Phase Parallel Tasks:
```
Task: "Unit tests for component validation in packages/ui/tests/unit/test-component-validation.test.ts"
Task: "Unit tests for alias mapping in apps/web/tests/unit/test-alias-mapping.test.ts"
Task: "Update component documentation in packages/ui/README.md"
```

## Task Generation Rules Applied

1. **From Contracts** (3 contract files):
   - component-migration-api.yaml → T006 contract test
   - ui-integration-api.yaml → T007 contract test
   - testing-validation-api.yaml → T008 contract test

2. **From Data Model** (9 entities):
   - User → T012 model task
   - Application Data → T013 model task
   - UI Components → T014 model task
   - Landing Page Component → T015 migration task
   - Landing Components → T016 migration task
   - Navigation Components → T017 migration task
   - Shadcn Components → T018 setup task
   - MagicUI Components → T019 integration task
   - Remaining entities handled in integration tasks

3. **From User Stories** (10 acceptance scenarios):
   - Landing page integration → T009 integration test
   - Navigation functionality → T010 integration test
   - UI library availability → T011 integration test
   - Additional scenarios covered in validation tasks

4. **Ordering Applied**:
   - Setup → Tests → Models → Services → Endpoints → Polish
   - Dependencies respected (clone before migration, migration before integration)

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All contracts have corresponding tests (T006-T008)
- [x] All entities have model/migration tasks (T012-T021)
- [x] All tests come before implementation (T006-T011 before T012-T024)
- [x] Parallel tasks are independent (different file paths)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] Critical 5-test requirement included (T002, T035)
- [x] UI library installation tasks included (T003, T018-T021)
- [x] Component migration tasks properly sequenced (T015-T017 before T022-T023)

---

*Tasks generated from design documents - Phase 2 execution*</content>
<parameter name="filePath">/home/dice-wizard/dev/web-design-workbench/specs/001-create-a-specification/tasks.md
