# Implementation Plan: Migrate Broken GitHub Web Application to Turborepo-Shadcn-Nextjs Structure

**Branch**: `001-create-a-specification` | **Date**: September 11, 2025 | **Spec**: /specs/001-create-a-specification/spec.md
**Input**: **Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved (tasks accommodate unknowns)
- [x] Complexity deviations documentedre specification from `/specs/001-create-a-specification/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
4. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
5. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, or `GEMINI.md` for Gemini CLI).
6. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
7. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
8. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Migrate a broken GitHub web application to modern turborepo-shadcn-nextjs structure by integrating components from https://github.com/jessenaiman/magic-template. Focus on preserving existing data, fixing critical bugs, restructuring architecture, and ensuring 5 tests continue to pass. Use shadcn, magicui, animate-ui, and reacbits components instead of custom implementations, with all UI components hosted in packages/ui turborepo package.

## Technical Context
**Language/Version**: TypeScript/JavaScript (Next.js, React)  
**Primary Dependencies**: Next.js, Turborepo, Shadcn, MagicUI, Animate-UI, Reacbits, Radix UI  
**Storage**: Existing database schema preservation required  
**Testing**: Must maintain 5 currently passing tests  
**Target Platform**: Web application (modern browsers)  
**Project Type**: Web application (frontend with potential backend integration)  
**Performance Goals**: Improved user experience, better architecture maintainability  
**Constraints**: Preserve existing data, don't modify configuration files, use existing components without creating new ones  
**Scale/Scope**: Migration of broken application with specific component integration from magic-template repository

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Simplicity**:
- Projects: 3 (web app, packages/ui, tests) - within max 3 limit
- Using framework directly? Yes (Next.js, Turborepo used directly)
- Single data model? Yes (existing database schema preserved)
- Avoiding patterns? Yes (no unnecessary Repository/UoW patterns)

**Architecture**:
- EVERY feature as library? Yes (components in packages/ui, web app as separate package)
- Libraries listed: packages/ui (shared components), apps/web (main application), apps/docs (documentation)
- CLI per library: Not applicable (web application, not CLI tools)
- Library docs: llms.txt format can be added if needed

**Testing (NON-NEGOTIABLE)**:
- RED-GREEN-Refactor cycle enforced? Yes (tests must exist and pass before changes)
- Git commits show tests before implementation? Yes (5 tests currently passing)
- Order: Contract→Integration→E2E→Unit will be followed
- Real dependencies used? Yes (actual UI libraries, not mocks)
- Integration tests for: new libraries, contract changes, shared schemas? Yes (component integration tests required)
- FORBIDDEN practices avoided: No implementation before test validation

**Observability**:
- Structured logging included? Can be added if needed
- Frontend logs → backend? Not applicable (frontend-only migration)
- Error context sufficient? Yes (error handling requirements in spec)

**Versioning**:
- Version number assigned? Yes (turborepo manages versioning)
- BUILD increments on every change? Yes (package versioning)
- Breaking changes handled? Yes (migration plan preserves existing functionality)

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure]
```

**Structure Decision**: Option 2: Web application (frontend with backend potential, turborepo structure already exists)

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `/scripts/update-agent-context.sh [claude|gemini|copilot]` for your AI assistant
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P] 
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:
- TDD order: Tests before implementation 
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Migration-Specific Tasks**:
- Component migration tasks (landing-page, navigation)
- UI library installation tasks (shadcn, magicui, animate-ui, reacbits)
- Turborepo configuration tasks
- Testing validation tasks (ensure 5 tests pass)
- Integration and optimization tasks

**Estimated Output**: 20-25 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [x] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [ ] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*