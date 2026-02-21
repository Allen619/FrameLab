## ADDED Requirements

### Requirement: External links SHALL use a consistent annotation pattern

When linking to official API documentation or authoritative external resources from within tutorial content, the link SHALL use the following Markdown pattern:

```
[🔗 <link text>](<url>){target="_blank" rel="noopener"}
```

The `🔗` emoji prefix serves as a visual indicator that distinguishes reference links from regular navigation links.

#### Scenario: Core API concept gets external link
- **WHEN** a page first introduces a framework's core class (e.g., `StateGraph`, `ChatOpenAI`, `VectorStoreIndex`)
- **THEN** the mention SHALL include an annotated external link to the official API documentation for that class

#### Scenario: Deep-dive section references official docs
- **WHEN** a section provides detailed explanation of configuration options, parameters, or advanced behavior
- **THEN** a `🔗` annotated link to the corresponding official documentation page SHALL be placed at the end of that section or inline with the first mention

### Requirement: External links SHALL NOT be added indiscriminately

The annotation system SHALL be applied selectively to maintain readability. Links SHALL only be added at the following points:

1. First introduction of a core API class/method in a page
2. Sections that go deep into a concept where official docs provide essential reference
3. Configuration/parameter sections where the reader needs the full reference

#### Scenario: Basic Python syntax does not get external links
- **WHEN** a page covers basic Python syntax like `if/else`, `for` loops, or variable assignment
- **THEN** no `🔗` external links SHALL be added for these standard language constructs

#### Scenario: Common imports do not get external links
- **WHEN** a code example includes `import` statements for well-known packages
- **THEN** the import line itself SHALL NOT receive an external link annotation (the link belongs with the conceptual explanation, not the import)

### Requirement: External links SHALL target stable documentation URLs

All external links SHALL point to stable/versioned documentation URLs rather than ephemeral or latest-only URLs, where such stable URLs are available.

#### Scenario: Python stdlib links use stable URL pattern
- **WHEN** linking to Python standard library documentation
- **THEN** the URL SHALL follow the pattern `https://docs.python.org/3/library/<module>.html` (stable `/3/` path)

#### Scenario: LangChain links use versioned docs
- **WHEN** linking to LangChain/LangGraph documentation
- **THEN** the URL SHALL use `https://python.langchain.com/docs/` or the equivalent stable path

### Requirement: All annotated external links SHALL be verified as reachable

Every external link added with the `🔗` annotation SHALL be verified to return an HTTP 2xx response and load a valid page.

#### Scenario: Playwright verifies each external link
- **WHEN** an external link is added to a document
- **THEN** a Playwright navigation to that URL SHALL confirm the page loads without error (no 404, no timeout, no redirect to error page)
