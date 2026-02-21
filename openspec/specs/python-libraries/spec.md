# Python Libraries Tutorial Spec Delta

## ADDED Requirements

### Requirement: Standard Library Documentation Structure
The tutorial system SHALL organize Python standard library documentation into categorized subdirectories under `docs/backend/python/libraries/stdlib/`.

#### Scenario: User navigates to standard library section
- **WHEN** a user accesses the standard library documentation
- **THEN** they see categorized groups: file-system, text-data, math-random, datetime, collections, dev-tools, concurrency, networking, storage, utilities
- **AND** each category has an index page with overview and navigation

#### Scenario: User reads individual standard library documentation
- **WHEN** a user opens a standard library module documentation (e.g., `json.md`)
- **THEN** they see learning objectives, core API reference, JS/TS comparison code, practical examples, and common pitfalls
- **AND** the document follows the established template format

### Requirement: Third-Party Library Documentation Structure
The tutorial system SHALL organize third-party library documentation into categorized subdirectories under `docs/backend/python/libraries/third-party/`.

#### Scenario: User navigates to third-party library section
- **WHEN** a user accesses the third-party library documentation
- **THEN** they see categorized groups: web, http, data, database, testing, cli, config
- **AND** each category has an index page with installation instructions and library comparisons

#### Scenario: User reads individual third-party library documentation
- **WHEN** a user opens a third-party library documentation (e.g., `fastapi.md`)
- **THEN** they see installation instructions, core API reference, JS/TS framework comparison, practical examples, and deployment considerations
- **AND** the document follows the established template format

### Requirement: File System Libraries Coverage
The tutorial system SHALL provide documentation for file and system operation libraries including os, sys, pathlib, shutil, and subprocess modules.

#### Scenario: User learns file path operations
- **WHEN** a user reads the pathlib documentation
- **THEN** they understand Path object creation, path manipulation, file operations, and directory traversal
- **AND** they see equivalent Node.js path/fs code for comparison

#### Scenario: User learns subprocess management
- **WHEN** a user reads the subprocess documentation
- **THEN** they understand how to run external commands, capture output, and handle errors
- **AND** they see equivalent Node.js child_process code for comparison

### Requirement: Text and Data Processing Libraries Coverage
The tutorial system SHALL provide documentation for text and data processing libraries including re, json, csv, string, and pickle modules.

#### Scenario: User learns JSON handling
- **WHEN** a user reads the json documentation
- **THEN** they understand json.dumps(), json.loads(), file I/O, and custom encoders/decoders
- **AND** they see equivalent JavaScript JSON API comparison

#### Scenario: User learns regular expressions
- **WHEN** a user reads the re documentation
- **THEN** they understand pattern matching, search/match/findall operations, and substitution
- **AND** they see equivalent JavaScript RegExp comparison with syntax differences highlighted

### Requirement: DateTime Libraries Coverage
The tutorial system SHALL provide documentation for date and time libraries including datetime, time, and calendar modules.

#### Scenario: User learns datetime operations
- **WHEN** a user reads the datetime documentation
- **THEN** they understand date/time creation, formatting, parsing, timedelta calculations, and timezone handling
- **AND** they see equivalent JavaScript Date and recommended libraries (dayjs/date-fns) comparison

### Requirement: Collections and Functional Libraries Coverage
The tutorial system SHALL provide documentation for advanced data structures and functional programming libraries including collections, itertools, functools, and enum modules.

#### Scenario: User learns special collections
- **WHEN** a user reads the collections documentation
- **THEN** they understand Counter, defaultdict, OrderedDict, deque, and namedtuple
- **AND** they see equivalent JavaScript patterns or library alternatives

#### Scenario: User learns iterator tools
- **WHEN** a user reads the itertools documentation
- **THEN** they understand chain, cycle, islice, groupby, combinations, and permutations
- **AND** they see equivalent JavaScript array methods and lodash functions

### Requirement: Concurrency Libraries Coverage
The tutorial system SHALL provide documentation for concurrency libraries including threading, multiprocessing, asyncio, and concurrent.futures modules.

#### Scenario: User learns threading
- **WHEN** a user reads the threading documentation
- **THEN** they understand Thread creation, synchronization primitives, and GIL implications
- **AND** they see comparison with JavaScript Web Workers concept

#### Scenario: User learns concurrent futures
- **WHEN** a user reads the concurrent.futures documentation
- **THEN** they understand ThreadPoolExecutor, ProcessPoolExecutor, and Future objects
- **AND** they see comparison with JavaScript Promise.all patterns

### Requirement: Networking Libraries Coverage
The tutorial system SHALL provide documentation for networking libraries including urllib, socket, and http modules.

#### Scenario: User learns URL handling
- **WHEN** a user reads the urllib documentation
- **THEN** they understand URL parsing, encoding, and basic HTTP requests
- **AND** they see comparison with JavaScript URL API and fetch

### Requirement: Database and Storage Libraries Coverage
The tutorial system SHALL provide documentation for database libraries including sqlite3 (standard) and SQLAlchemy, pymongo, redis-py (third-party).

#### Scenario: User learns SQLite operations
- **WHEN** a user reads the sqlite3 documentation
- **THEN** they understand connection management, cursor operations, parameterized queries, and transactions
- **AND** they see comparison with JavaScript better-sqlite3 or similar libraries

### Requirement: Utility Libraries Coverage
The tutorial system SHALL provide documentation for utility libraries including hashlib, base64, copy, and contextlib modules.

#### Scenario: User learns hashing
- **WHEN** a user reads the hashlib documentation
- **THEN** they understand MD5, SHA family hashing, and HMAC operations
- **AND** they see comparison with JavaScript crypto module

### Requirement: Third-Party Web Framework Coverage
The tutorial system SHALL provide documentation for web frameworks including FastAPI, Flask, and Django overview.

#### Scenario: User learns FastAPI
- **WHEN** a user reads the FastAPI documentation
- **THEN** they understand route definition, request/response handling, dependency injection, and OpenAPI generation
- **AND** they see comparison with Express.js/Koa patterns

### Requirement: Third-Party HTTP Client Coverage
The tutorial system SHALL provide documentation for HTTP clients including requests, httpx, and aiohttp.

#### Scenario: User learns async HTTP requests
- **WHEN** a user reads the httpx documentation
- **THEN** they understand async client usage, streaming, and connection pooling
- **AND** they see comparison with JavaScript fetch API

### Requirement: Third-Party Data Processing Coverage
The tutorial system SHALL provide documentation for data processing libraries including pandas, numpy, and polars.

#### Scenario: User learns pandas basics
- **WHEN** a user reads the pandas documentation
- **THEN** they understand DataFrame creation, selection, filtering, and basic aggregations
- **AND** they see comparison with JavaScript array operations and lodash

### Requirement: Third-Party CLI Tools Coverage
The tutorial system SHALL provide documentation for CLI tools including click, typer, and rich.

#### Scenario: User learns CLI creation
- **WHEN** a user reads the typer documentation
- **THEN** they understand command definition, argument parsing, and help generation
- **AND** they see comparison with JavaScript commander/yargs

### Requirement: Third-Party Configuration Coverage
The tutorial system SHALL provide documentation for configuration libraries including python-dotenv, pyyaml, and toml.

#### Scenario: User learns environment configuration
- **WHEN** a user reads the python-dotenv documentation
- **THEN** they understand .env file loading and environment variable management
- **AND** they see comparison with JavaScript dotenv package

### Requirement: VitePress Sidebar Configuration
The tutorial system SHALL update VitePress sidebar configuration to support the new nested library structure with collapsible groups.

#### Scenario: User navigates sidebar
- **WHEN** a user views the sidebar in the libraries section
- **THEN** they see collapsible groups for "标准库" and "第三方库"
- **AND** each group contains categorized sub-groups that can be expanded/collapsed
- **AND** navigation remains performant with 40+ items

### Requirement: Cross-Reference System
The tutorial system SHALL maintain cross-references between related library documentation and existing advanced feature documentation.

#### Scenario: User follows related content links
- **WHEN** a user reads a library documentation that relates to existing content (e.g., asyncio relates to async.md)
- **THEN** they see clear links to prerequisite and related documentation
- **AND** the links use consistent formatting (tip/info containers)
