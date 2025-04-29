# ManageMate Architecture

## Core Modules

### Authentication Flow
```mermaid
graph TD
    A[Login/Register UI] --> B[API Service]
    B --> C[Auth Controller]
    C --> D[Database]
    C --> E[JWT Generation]
    E --> A
```

### Data Flow
```mermaid
graph LR
    UI --> API --> Controller --> DB
    DB --> Controller --> API --> UI
```

## Key Decisions
- JWT for stateless auth
- Zod for runtime validation
- Modular feature organization
- Error boundaries for UI resilience
