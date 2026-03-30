# SharpDotNUT / ServerLite

## Project Overview

**SharpDotNUT ServerLite** is a lightweight key-value storage server built with Bun and Elysia.js, providing simple API interfaces for managing key-value data across multiple projects.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Web Framework**: [Elysia.js](https://elysia.dev/)
- **Database**: SQLite
- **API Documentation**: OpenAPI support

## Features

- 🗂️ **Multi-Project Support**: Create multiple independent project spaces
- 🔐 **Authentication**: Secure access control based on authentication tokens
- 💾 **Key-Value Storage**: Simple key-value data operations
- 🚀 **High Performance**: Leverages Bun's performance advantages and in-memory caching mechanisms

## Installation and Startup

### Requirements

- [Bun](https://bun.sh/) runtime

### Quick Start

```bash
# Clone and navigate to project directory
cd your-project-directory/packages/app/dist
# or
cd path-to-binary-file

# Set environment variables
echo "DATABASE=your_database_path.db" > .env

# Start the service
bun run serverlite.ts
# or
./serverlite
```

The service runs by default at `http://localhost:52112`

## API Endpoints

### 1. List Projects

```
GET /api/list
```

Returns a list of all current project names.

### 2. Create Project

```
POST /api/project/:project?auth=:auth
```

- `:project`: Project name
- `:auth`: Authentication token

### 3. Delete Project

```
DELETE /api/project/:project?auth=:auth
```

- `:project`: Project name to delete
- `:auth`: Authentication token

### 4. Get Key Value

```
GET /:project/:key?auth=:auth
```

- `:project`: Project name
- `:key`: Key name
- `:auth`: Authentication token

### 5. Set Key Value

```
POST /:project/:key?auth=:auth&value=:value
```

- `:project`: Project name
- `:key`: Key name
- `:auth`: Authentication token
- `:value`: JSON formatted value

### 6. Delete Key Value

```
DELETE /:project/:key?auth=:auth
```

- `:project`: Project name
- `:key`: Key name to delete
- `:auth`: Authentication token

## Security Features

- **Table Name Validation**: Uses regular expressions to validate project name format (`^[a-zA-Z_][a-zA-Z0-9_]*$`)
- **Password Hashing**: All authentication tokens are stored after being hashed
- **Access Control**: Each operation requires proper authentication token verification

## Database Structure

- `__projects__` table: Stores project information (ID, name, authentication hash)
- Dynamic project tables: Each project corresponds to an independent table storing key-value pairs

## Environment Variables

- `DATABASE`: SQLite database file path

## Notes

1. Project names can only contain letters, numbers, and underscores, and must start with a letter or underscore
2. All authentication tokens are hashed to ensure security
3. Data for each project is stored in independent tables to achieve data isolation
