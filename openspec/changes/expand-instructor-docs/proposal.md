## Why

The current `instructor` documentation is too basic (only 4 pages), failing to cover advanced production use cases like streaming, multi-provider integration, and complex data extraction. This expansion aims to make the documentation a comprehensive resource for production-grade implementation.

## What Changes

- **Structure**: Reorganize `docs/ai/instructor/` into four main sections: Basics, Guides, Integrations, and Cookbook.
- **New Content**: Add ~8 new pages covering Streaming, Iterables, Hooks, Patching, Providers (Anthropic/Gemini), Local LLMs, Classification, and RAG.
- **Visuals**: Add "⭐" indicators to core/important chapters in the sidebar.
- **Integrations**: Explicitly document support for Anthropic, Gemini, and Local LLMs (Ollama).

## Capabilities

### New Capabilities

- `instructor-guides`: Advanced usage patterns including Streaming, Iterables, Hooks, and Patching.
- `instructor-integrations`: Multi-provider support documentation for Anthropic, Gemini, and Local LLMs.
- `instructor-cookbook`: Production-ready code recipes for Classification, Extraction, and RAG.

### Modified Capabilities

- `instructor-docs`: Update existing basic pages (Quick Start, Concepts) to align with the new structure and visual indicators.

## Impact

- **File System**: Significant expansion of `docs/ai/instructor/` with new subdirectories (`guides/`, `integrations/`, `cookbook/`).
- **Configuration**: `docs/.vitepress/config.mts` sidebar structure will be heavily modified.
- **Existing Content**: Minor updates to existing pages to cross-link to new advanced topics.
