# React_Famy — Project Context

## Framework: BMad Method v6

This project uses the **BMad (Build More architect Dreams)** framework for AI-driven development.

**User:** Leon  
**Language:** Spanish (comunicación y documentación)

## BMad Core Workflow

BMad organizes development into phases:

1. **Analysis** (opcional) — Research, brainstorming, domain discovery
2. **Planning** (requerido) — Product briefs, PRDs, UX design, epics & stories
3. **Solutioning** — Architecture, technical decisions, implementation readiness
4. **Implementation** — Sprint planning, coding, review, retrospective

## Key Skills

| Phase | Skill | Purpose |
|-------|-------|---------|
| Help | `bmad-help` | Guía inteligente — qué hacer primero, qué sigue |
| Analysis | `bmad-brainstorming` | Sesiones de ideación estructuradas |
| Planning | `bmad-create-prd` | Crear Product Requirements Document |
| Planning | `bmad-validate-prd` | Validar PRD existente |
| Planning | `bmad-create-ux-design` | Diseño UX |
| Solutioning | `bmad-create-architecture` | Arquitectura del sistema |
| Solutioning | `bmad-create-epics-and-stories` | Epics y stories de usuario |
| Implementation | `bmad-sprint-planning` | Planificar sprint |
| Implementation | `bmad-quick-dev` | Desarrollo rápido por historia |
| Implementation | `bmad-code-review` | Code review |
| Implementation | `bmad-retrospective` | Retrospectiva |

## Project Structure

```
.claude/skills/          — BMad skills (agents y workflows)
.bmad-output/
  planning-artifacts/    — PRD, UX, arquitectura
  implementation-artifacts/ — Sprint status, stories, reviews
```

## Usage

Ask `bmad-help` in your AI IDE:
```
bmad-help
bmad-help what should I do first?
```

## Development

```bash
# Sprint planning
bmad-quick-dev --story <story-id>

# Code review
bmad-code-review
```