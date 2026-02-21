## Context

The current documentation site uses Vitepress and includes sections for Frontend, Backend, and AI. The AI section needs to be expanded to include "Instructor", a library for structured LLM outputs. The target audience is frontend developers, so the content must bridge the gap between Python/Pydantic concepts and Frontend/TypeScript/Zod concepts.

## Goals / Non-Goals

**Goals:**

- Create a comprehensive, Chinese-language documentation section for Instructor.
- Integrate seamlessly with the existing Vitepress structure.
- Use Mermaid diagrams to visualize complex flows (validation, retries).
- Provide clear, verify-able code examples.
- Use frontend-friendly analogies (Zod, TS) to explain Pydantic.

**Non-Goals:**

- duplicating the entire official documentation.
- Covering every single edge case of the library.
- Teaching Python basics (assume basic Python knowledge).

## Decisions

### 1. Directory Structure

We will create a dedicated directory `docs/ai/instructor/` with the following structure:

- `index.md`: Introduction & Why Instructor
- `quick-start.md`: Installation & First Example
- `concepts.md`: Core concepts (Pydantic, Validation)
- `advanced.md`: Advanced features (Streaming, Partial)

**Rationale:** This maps directly to the sidebar navigation and keeps the content organized logically for a learner.

### 2. Frontend Analogies

We will explicitly use "Tabs" or "Comparison Blocks" to show Pydantic models alongside equivalent TypeScript interfaces or Zod schemas.

**Rationale:** This lowers the cognitive load for frontend developers learning Python data structures.

### 3. Verification Strategy

We will use Playwright to verify the _rendered_ documentation to ensure:

- Diagrams render correctly.
- Code blocks are legible.
- Links are valid.
- Content is properly localized (UTF-8).

**Rationale:** Ensures the "product" (the docs site) is high quality.

## Risks / Trade-offs

- **Risk:** Library API changes.
  - **Mitigation:** Rely on `context7` for the latest documentation and version pinning in examples.
- **Risk:** Mermaid diagram complexity.
  - **Mitigation:** Keep diagrams focused on high-level data flow, not implementation details.
