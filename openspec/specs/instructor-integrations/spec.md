# Purpose

Define requirements for Instructor integrations with Anthropic, Gemini, and local LLM runtimes.

## ADDED Requirements

### Requirement: Anthropic Integration

The documentation SHALL include a dedicated section for integrating Instructor with Anthropic's Claude models.

#### Scenario: Anthropic Setup

- **WHEN** a user navigates to "Integrations > Anthropic"
- **THEN** they see copy-pasteable configuration code for `instructor.from_anthropic()`
- **AND** an example of using `claude-3-opus` or `claude-3-sonnet` for structured extraction

### Requirement: Google Gemini Integration

The documentation SHALL include a dedicated section for integrating Instructor with Google's Gemini models via Vertex AI or Google AI Studio.

#### Scenario: Gemini Setup

- **WHEN** a user navigates to "Integrations > Gemini"
- **THEN** they see copy-pasteable configuration code for `instructor.from_gemini()`
- **AND** an explanation of necessary permissions or API keys

### Requirement: Local LLM Support (Ollama/LlamaCpp)

The documentation SHALL include a dedicated section for running Instructor with local LLMs using Ollama or LlamaCpp.

#### Scenario: Ollama Setup

- **WHEN** a user navigates to "Integrations > Local LLMs"
- **THEN** they see instructions for installing and running Ollama
- **AND** a Python code snippet showing how to point Instructor to `http://localhost:11434/v1`
- **AND** an example using `llama3` or `mistral` for structured output
