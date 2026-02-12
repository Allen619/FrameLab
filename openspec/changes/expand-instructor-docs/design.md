## Context

The current Instructor documentation is limited to basic concepts. We need to expand it significantly to cover advanced topics (Streaming, Iterables, Hooks), integrations (Anthropic, Gemini, Local LLMs), and practical recipes (Cookbook). This requires restructuring the existing `docs/ai/instructor/` directory and updating the Vitepress configuration.

## Goals / Non-Goals

**Goals:**

- Restructure `docs/ai/instructor/` into a scalable hierarchy: Basics, Guides, Integrations, Cookbook.
- Add comprehensive documentation for advanced features: Streaming, Iterables, Hooks, Patching.
- Add clear integration guides for Anthropic, Gemini, and Local LLMs (Ollama).
- Add practical "Cookbook" recipes for Classification, Extraction, and RAG.
- visually distinguish core chapters with "⭐".

**Non-Goals:**

- rewriting the entire library's source code documentation.
- duplicating every single example from the official repo (focus on key patterns).

## Decisions

### 1. Directory Structure

We will adopt a nested structure:

```text
docs/ai/instructor/
├── index.md               (Basics)
├── quick-start.md         (Basics)
├── concepts.md            (Basics)
├── guides/                (Advanced Features)
│   ├── streaming.md
│   ├── iterable.md
│   ├── hooks.md
│   └── patching.md
├── integrations/          (Providers)
│   ├── providers.md       (Cloud: Anthropic, Gemini)
│   └── local-llm.md       (Local: Ollama)
└── cookbook/              (Recipes)
    ├── classification.md
    ├── extraction.md
    └── rag.md
```

**Rationale:** Segregating content by type (Concept vs Guide vs Recipe) helps users navigate based on their intent (Learning vs Doing vs Copying).

### 2. Visual Indicators

We will prefix "Core" chapters with `⭐` in the sidebar and page titles.
**Rationale:** Helps users quickly identify the most important/commonly used sections.

### 3. Integration Strategy

We will use `instructor.from_provider()` where applicable to show the unified API, but also show provider-specific `from_anthropic` etc. where it adds clarity.
**Rationale:** Balances abstraction with explicit configuration.

## Risks / Trade-offs

- **Risk:** URL breakage for existing pages.
  - **Mitigation:** We are keeping `index.md`, `quick-start.md`, and `concepts.md` in the root of `instructor/`, so existing links should largely work. New content is additive.
- **Risk:** Maintenance burden of many code examples.
  - **Mitigation:** Focus on stable, high-value patterns. Use `context7` to verify latest API usage during writing.
