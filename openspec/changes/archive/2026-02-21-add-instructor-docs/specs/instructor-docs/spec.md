## ADDED Requirements

### Requirement: Documentation Structure

The documentation site SHALL include a dedicated section for "Instructor" under the AI category, containing Introduction, Quick Start, Core Concepts, and Advanced topics.

#### Scenario: Navigation Structure

- **WHEN** a user navigates to the AI section
- **THEN** they see an "Instructor" entry in the sidebar
- **AND** the entry expands to show sub-pages: Introduction, Quick Start, Core Concepts, Advanced

### Requirement: Content Localization and Encoding

All documentation content SHALL be written in simplified Chinese and stored in UTF-8 encoding to ensure accessibility for the target audience.

#### Scenario: Viewing Content

- **WHEN** a user opens any Instructor documentation page
- **THEN** the text is displayed in simplified Chinese
- **AND** the file encoding is verified as UTF-8

### Requirement: Frontend-Oriented Analogies

The documentation SHALL utilize analogies familiar to frontend developers (specifically Zod and TypeScript) to explain Pydantic and structured output concepts.

#### Scenario: Explaining Pydantic

- **WHEN** the documentation introduces Pydantic models
- **THEN** it explicitly compares them to TypeScript interfaces or Zod schemas
- **AND** provides code examples contrasting the two approaches

### Requirement: Visual Diagrams

Complex concepts and data flows SHALL be visualized using Mermaid diagrams embedded within the markdown files.

#### Scenario: Visualizing Validation Flow

- **WHEN** the documentation describes the validation and retry loop
- **THEN** a Mermaid sequence or flowchart diagram is displayed
- **AND** it illustrates the interaction between the LLM, the validation layer, and the user code

### Requirement: Vitepress Integration

The new documentation pages SHALL be registered in the Vitepress configuration to ensure proper routing and navigation.

#### Scenario: Sidebar Configuration

- **WHEN** the site is built
- **THEN** the sidebar configuration includes the new Instructor routes
- **AND** navigation between pages functions correctly
