# Purpose

Define requirements for advanced Instructor guides focused on streaming, iterable DSL, debugging hooks, and patching mechanics.

## ADDED Requirements

### Requirement: Advanced Streaming Guide

The documentation SHALL include a detailed guide on using `instructor.Partial[T]` for streaming partial structured outputs.

#### Scenario: Explaining Partial Streaming

- **WHEN** a user navigates to the "Advanced Guides > Streaming" section
- **THEN** they see an explanation of `Partial[T]` and `stream=True`
- **AND** a code example demonstrating how to iterate over partial chunks

### Requirement: Iterable DSL Guide

The documentation SHALL include a guide on using the `iterable()` DSL for efficiently processing lists of structured objects.

#### Scenario: Explaining Iterables

- **WHEN** a user navigates to "Advanced Guides > Iterables"
- **THEN** they see an explanation of the `iterable()` function
- **AND** a code example showing how to extract a list of items without waiting for the full response

### Requirement: Hooks and Debugging Guide

The documentation SHALL include a guide on using Instructor's hooks system for logging and debugging.

#### Scenario: Debugging Setup

- **WHEN** a user navigates to "Advanced Guides > Hooks"
- **THEN** they see examples of registering hooks for `completion:kwargs`, `completion:response`, and `completion:error`
- **AND** an example of how to log raw request/response payloads

### Requirement: Patching Mechanics Guide

The documentation SHALL explain how `instructor.patch()` works and the differences between patching modes (`TOOLS`, `JSON`, `MD_JSON`).

#### Scenario: Understanding Patching

- **WHEN** a user navigates to "Advanced Guides > Patching"
- **THEN** they see a breakdown of the patching process (Schema generation -> Tool definition -> Validation)
- **AND** guidance on when to use each patching mode
