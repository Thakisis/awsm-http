# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.6.0] - 2025-12-04

### Added

- **Mock Server**: A complete visual database schema designer and mock server.
  - **Visual Graph Editor**: Design tables and relationships (Foreign Keys) using a node-based interface.
  - **Data Generation**: Integrated Faker.js to generate realistic mock data for columns.
  - **REST API**: Auto-generated endpoints for all tables with support for pagination (`page`, `pageSize`) and filtering.
  - **Data Editor**: Built-in spreadsheet-like editor to manage mock data directly.
  - **Smart Sync**: Non-destructive schema updates (preserves data when modifying tables).
- **QS Builder**: New visual query string builder in the Request Editor.
  - Supports complex nested objects and arrays using `qs` syntax.
  - Real-time synchronization with the URL.
- **Settings**:
  - New **Server** tab to configure the Mock Server port (default: 3000) and API default page size.
- **Documentation**:
  - Added comprehensive documentation for the Mock Server.
  - Updated "Getting Started" guide with a feature overview.

### Changed

- **Pagination**: The Mock Server API now returns a standardized response format:
  ```json
  {
    "data": [...],
    "meta": {
      "pagination": { "page": 1, "pageSize": 10, "total": 50, "pageCount": 5 }
    }
  }
  ```
- **Faker Picker**: Improved UI to show clean variable names (e.g., `person.fullName`) instead of raw template syntax.
- **Server Status**: The server running state is now persisted, so the "Stop Server" button remains visible after reopening the dialog.

### Fixed

- **Documentation**: Fixed layout issues where the ScrollArea would break when switching tabs.
- **Schema Sync**: Fixed issues with Foreign Key persistence in SQLite by implementing a robust table recreation strategy.

## [0.5.0-beta] - 2025-12-03

### Added

- **Virtualization**: Implemented `@tanstack/react-virtual` for the History sidebar to handle large lists efficiently.
- **Lazy Loading**: `RequestEditor` is now lazy-loaded to improve initial application startup time.
- **Drag & Drop Overlay**: Added a visual overlay for dragged items in the sidebar for a native-like feel.

### Changed

- **Architecture**: Complete refactor to **Screaming Architecture**. Codebase is now organized by features (`src/features/*`) instead of technical layers.
- **Performance**:
  - Extensive use of `React.memo` and `useCallback` across core components (`SidebarItem`, `RequestTabs`, `ResponseViewer`, etc.) to minimize unnecessary re-renders.
  - Optimized build configuration with manual chunking for better cacheability.
- **UX**: Improved Drag & Drop collision detection using `pointerWithin` for more precise item placement.
- **Cleanup**: Removed legacy `src/services` and `src/stores` directories.

## [0.1.0] - 2025-12-03

### Added

- **Socket.IO Support**: Full support for Socket.IO connections, including custom Event/Group handling.
- **WebSocket Improvements**: Enhanced WebSocket editor with persistent tabs and better state management.
- **Drag & Drop Organization**:
  - Reorder items in the Sidebar.
  - Move requests into Folders.
  - Reorder Environment Variables with drag handles.
- **UI Enhancements**:
  - **Method Badges**: Color-coded HTTP method badges (GET, POST, etc.) in the sidebar.
  - **Safety Dialogs**: Confirmation alerts when deleting environments.
  - **Context Menus**: Added "New Workspace" option to sidebar context menus.

### Changed

- **Hierarchy Refactor**: Renamed "Collections" to "Folders" for clarity.
- **Strict Nesting Rules**: Enforced structure where Workspaces cannot be nested inside other Workspaces.
- **Environment UX**: Moved the delete button to the edit form and fixed scrollbar issues for better usability.
- **Performance**: Optimized sidebar rendering and state updates.

## [0.0.3-alpha] - 2025-12-03

### Added

- **Faker.js Integration**: Generate dynamic test data using `{{faker.module.method()}}`.
- **Quick Insert Dialog**: Press `Ctrl+K` in JSON/Text editors to open the Faker generator.
- **Test Results Sidebar**: Visual feedback for tests in a dedicated sidebar tab.
- **Scripting API**: New `awsm.test(name, callback)` function for writing structured tests.
- **Documentation**: Built-in documentation dialog accessible from the navbar.
- **UI Improvements**: Added `ScrollArea` to Command Palette for better scrolling.

### Changed

- Updated `README.md` with comprehensive feature documentation.
- Improved test script execution to support dynamic descriptions in logs.
