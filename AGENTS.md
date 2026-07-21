# frontend-common Agent Instructions (Neutral)

This document is the source of truth for any coding agent (GitHub Copilot, Codex, Cursor, Claude Code, etc.) working on `frontend-common`.

## 1) Purpose

These instructions have two goals:

- Guide safe changes inside this package (`frontend-common`).
- Guide creation or modification of a `frontend-custom` package that uses this package as its base.

## 2) Scope and Responsibilities

`frontend-common` is shared frontend infrastructure. It should provide reusable UI components, services, utilities, and domain-agnostic abstractions.

Primary responsibilities:

- `src/lib/models/`: base abstractions for entity services, decorators, and class resolution infrastructure.
- `src/lib/services/`: cross-cutting frontend utilities (background tasks, file download, etc.).
- `src/lib/`: reusable UI components, pipes, directives, and common features.
- `src/app/`: shared application configuration and routing infrastructure.
- `src/lib/environments/`: environment configuration exposure.

Non-goals:

- App-specific domain logic or entity definitions.
- Project-specific routes or feature modules.
- Hardcoded environment/project assumptions.

## 3) Rules for Changes in frontend-common

When modifying this package, follow these rules:

1. Keep APIs stable
- Treat exported members from `public-api.ts` as public contracts.
- Avoid breaking signatures for `DataService` and other base classes.
- If a breaking change is unavoidable, document migration impact in the PR/change summary.

2. Preserve abstraction patterns
- Keep `DataService` and its extension model backward compatible.
- Do not bypass decorator patterns (`@withDiscriminator`, `@withClassId`, etc.) unless explicitly updating the infrastructure.
- Preserve `ClassResolverService` and `ComponentResolverService` flows.

3. Preserve security/auth defaults
- Do not remove or weaken HTTP interceptor middleware unless explicitly requested.
- Keep JWT handling intact in HTTP interceptors.

4. Keep core generic
- Do not add project-specific entities, feature modules, or terminology in `frontend-common`.
- Put domain-specific logic in consuming `frontend-custom` packages.

5. Keep styling and UI concerns separated
- Shared UI components belong in `src/lib/`.
- Custom UI or business-specific styling belongs in consuming packages.
- Use `_settings.scss` for common style variables only.

6. Keep changes minimal
- Prefer small, focused edits.
- Avoid unrelated refactors while touching shared infrastructure.

## 4) How frontend-custom Should Use frontend-common

Use this package as a base layer, following this structure pattern (as seen in this repository):

- `src/lib/models/*.ts`: define domain-specific entity classes that extend or use `DataService` patterns.
  - Entity classes should be decorated with infrastructure decorators from `frontend-common` (e.g., `@withDiscriminator`, `@withClassId`).
  - Services extending `DataService` belong here or in `src/lib/services/`.
- `src/lib/app/`: domain-specific feature modules and components.
- `src/lib/`: additional domain-specific components, pipes, directives, and utilities.
- `src/styles.scss`: import `@martinferra/frontend-common` styles and add domain-specific customizations.
- `public-api.ts`: export stable API surface for consuming applications.

Expected integration flow:

1. Domain entity classes import decorators and base services from `frontend-common`.
2. Domain services extend `DataService` and implement required abstract methods.
3. Feature modules use base components and services from `frontend-common`.
4. App routing and configuration leverage `frontend-common` infrastructure.

## 5) DataService Extension Pattern

When `frontend-custom` needs entity services:

- Extend `DataService` for each major domain entity.
- Implement required abstract methods:
  - `getModel()`: return the backend model name.
  - `getMainEntityClass()`: return the domain entity class.
- Optionally override:
  - `getDiscriminatorFieldName()`: if the entity uses discriminators.
  - `getNestedEntityClasses()`: for related entity classes.
  - `customPreTranslateToServerData()` / `customTranslateToServerData()`: for custom serialization.
- Use `AsyncTasksService` for long-running operations.

## 6) Decorator Usage

Domain entity classes should use infrastructure decorators from `frontend-common`:

- `@withClassId(id)`: registers class for mapping and resolution.
- `@withDiscriminator(field, value)`: marks entity as using a discriminator field.
- `@registeredForGui()`: marks entity as available in component resolution.
- `@availableForMapping()`: marks entity as available for class mapping.
- `@registeredAsChildClass()`: registers nested child classes.

See `src/lib/models/decorators/` for details.

## 7) Component Reusability

Frontend components in `frontend-common` should:

- Be framework-agnostic where possible (use Angular abstractions consistently).
- Accept inputs for customization and avoid hardcoding domain logic.
- Emit outputs/events for parent composition.
- Use `ComponentResolverService` or `ClassResolverService` only for infrastructure resolution, not business logic.

Custom components should be defined in `frontend-custom`, not in `frontend-common`.

## 8) Configuration and Secrets

- Never hardcode secrets.
- Do not read environment variables directly in components or services.
- Use environment configuration modules with validation.
- Leverage `src/lib/environments/environment` for shared environment setup.

## 9) Validation Expectations for Agents

After changes:

- Run the relevant build/test/lint checks available in the workspace or package.
- If full validation is not possible, clearly report what was not executed and why.

## 10) Reference Contract for Consumer Packages

Custom packages should include their own `AGENTS.md` and explicitly reference this file as their base contract for frontend-common usage.

Reference target:

- `frontend-common/AGENTS.md`

Suggested snippet for a consumer package `AGENTS.md`:

- "For frontend infrastructure conventions, use `frontend-common/AGENTS.md` as the base contract. This package adds only domain-specific UI rules on top."

## 11) Change Scope Rules

- Do not revert unrelated local changes.
- Do not run destructive git operations unless explicitly requested.
- Keep style and formatting consistent with existing files.
