## ADDED Requirements

### Requirement: Modified pages SHALL be verified for correct rendering

After editing any document, the page SHALL be loaded in a Playwright browser instance against a running VitePress dev server to confirm it renders correctly.

#### Scenario: Page loads without errors
- **WHEN** a modified page is opened in the Playwright browser
- **THEN** the page SHALL load with HTTP 200, display its title, and show no JavaScript console errors

#### Scenario: Sidebar navigation shows the page
- **WHEN** a page that was added to the sidebar is opened
- **THEN** the sidebar SHALL visually display the page's entry as active/highlighted

#### Scenario: Mermaid diagrams render
- **WHEN** a page contains Mermaid code blocks
- **THEN** the Playwright snapshot SHALL show rendered SVG diagrams (not raw Mermaid source text)

### Requirement: External links SHALL be validated for reachability

All newly added external links (identified by the `🔗` annotation pattern) SHALL be checked for reachability using Playwright navigation.

#### Scenario: Valid external link confirmed
- **WHEN** Playwright navigates to an annotated external link URL
- **THEN** the page SHALL load successfully (HTTP 2xx, page content visible)

#### Scenario: Broken external link detected
- **WHEN** Playwright navigates to an annotated external link URL and receives an error (404, timeout, DNS failure)
- **THEN** the link SHALL be flagged for correction and the URL SHALL be updated or removed before marking the task complete

### Requirement: All documents SHALL be UTF-8 encoded

Every `.md` file in the `docs/` directory SHALL be saved with UTF-8 encoding (without BOM). Chinese characters SHALL render correctly in the browser.

#### Scenario: Chinese content renders correctly
- **WHEN** a page containing Chinese text is loaded in Playwright
- **THEN** all Chinese characters SHALL display correctly without mojibake or encoding artifacts

### Requirement: VitePress build SHALL succeed without errors

After all changes, the full VitePress build (`npm run build`) SHALL complete without errors, warnings about broken links, or unresolved references.

#### Scenario: Clean build
- **WHEN** `npm run build` is executed after all changes
- **THEN** the build process SHALL exit with code 0 and produce no dead link warnings
