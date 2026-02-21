## ADDED Requirements

### Requirement: Vector Database Selection Guide
The tutorial SHALL provide a comprehensive comparison of four major vector databases (Chroma, Pinecone, Milvus, Weaviate) with multi-dimensional analysis including developer experience, performance benchmarks, scalability, and cost considerations.

#### Scenario: Developer comparing vector databases for RAG application
- **WHEN** a zero-experience learner reads the vector database chapter
- **THEN** they can understand the trade-offs between different vector databases
- **AND** make an informed decision based on their use case and scale requirements

#### Scenario: Performance metrics understanding
- **WHEN** a learner reviews the performance comparison table
- **THEN** they can see query latency (P50/P99), insert throughput, and memory usage for each database
- **AND** understand which database fits their performance requirements

---

### Requirement: Chroma In-Depth Tutorial
The tutorial SHALL provide a complete guide for Chroma vector database, covering installation, basic usage, persistent storage, metadata filtering, batch operations, and migration strategies.

#### Scenario: Setting up Chroma with LlamaIndex
- **WHEN** a learner follows the Chroma tutorial
- **THEN** they can set up both in-memory and persistent Chroma instances
- **AND** integrate with LlamaIndex VectorStoreIndex successfully

#### Scenario: Chroma persistent storage
- **WHEN** a learner needs to persist vector data across sessions
- **THEN** they can configure PersistentClient with a local directory
- **AND** reload the index without re-embedding documents

#### Scenario: Metadata filtering in Chroma
- **WHEN** a learner needs to filter search results by metadata
- **THEN** they can use Chroma's metadata filter syntax
- **AND** combine vector similarity with metadata constraints

---

### Requirement: Multimodal RAG Tutorial
The tutorial SHALL provide guidance on processing documents containing images, charts, and tables, enabling learners to build multimodal RAG applications.

#### Scenario: PDF with charts extraction
- **WHEN** a learner has a PDF document containing charts and tables
- **THEN** they can use Unstructured or LlamaParse to extract both text and visual elements
- **AND** create multimodal nodes for indexing

#### Scenario: Image understanding with Vision LLM
- **WHEN** a learner needs to query about visual content in documents
- **THEN** they can configure a multimodal LLM (GPT-4V, Claude 3 Vision)
- **AND** retrieve and synthesize answers from both text and image nodes

#### Scenario: Multimodal index creation
- **WHEN** a learner wants to index documents with mixed content types
- **THEN** they can create a MultiModalVectorStoreIndex
- **AND** perform retrieval that considers both text and image embeddings

---

### Requirement: Mermaid Diagrams for Complex Flows
All complex architectural concepts and data flows in the new tutorials SHALL be illustrated with Mermaid diagrams to aid visual understanding.

#### Scenario: Vector database architecture visualization
- **WHEN** explaining the data flow from documents to vector storage
- **THEN** a Mermaid diagram SHALL show the complete pipeline
- **AND** help learners understand the index creation process visually

#### Scenario: Multimodal RAG pipeline visualization
- **WHEN** explaining how multimodal documents are processed
- **THEN** a Mermaid diagram SHALL illustrate the parsing, indexing, and retrieval stages
- **AND** show decision points for different document types

---

### Requirement: VitePress Navigation Update
The VitePress sidebar configuration SHALL be updated to include navigation entries for the new "Advanced Applications" section containing vector database and multimodal tutorials.

#### Scenario: Learner navigating to advanced topics
- **WHEN** a learner completes basic LlamaIndex tutorials
- **THEN** they can see an "进阶应用" (Advanced Applications) section in the sidebar
- **AND** access vector database and multimodal tutorials directly

---

### Requirement: Code Examples with Version Annotations
All code examples in the new tutorials SHALL include version compatibility annotations (e.g., "适用版本: LlamaIndex 0.10.x+") and be verified against the latest LlamaIndex API.

#### Scenario: Learner running code examples
- **WHEN** a learner copies and runs a code example from the tutorial
- **THEN** the code SHALL work with the annotated LlamaIndex version
- **AND** produce the expected output without errors

#### Scenario: API deprecation handling
- **WHEN** LlamaIndex releases a new version with API changes
- **THEN** the version annotation helps learners identify if their code needs updates
- **AND** guides them to the correct API usage
