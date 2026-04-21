# Multi-Container Todo Application

A production-ready multi-container application built with **Node.js**, **Express**, **MongoDB**, **Docker Compose**, and **Nginx**. Includes infrastructure-as-code (Terraform + Ansible) and CI/CD (GitHub Actions).

## Architecture

```
┌─────────────────────────────────────────────────┐
│                    Docker Network                │
│                                                  │
│  ┌──────────┐    ┌──────────┐    ┌───────────┐  │
│  │  Nginx   │───▶│  API     │───▶│  MongoDB  │  │
│  │  :80     │    │  :3000   │    │  :27017   │  │
│  └──────────┘    └──────────┘    └───────────┘  │
│       ▲                              │          │
└───────│──────────────────────────────│──────────┘
        │                              │
   Client Request              mongo-data volume
                             (persistent storage)
```

## Quick Start

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) & Docker Compose installed

### Run Locally

```bash
# Clone the repository
git clone <your-repo-url>
cd multi-container-todo

# Start all containers
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

The API is accessible at:
- **Via Nginx (port 80)**: `http://localhost`
- **Direct API (port 3000)**: `http://localhost:3000`

### Stop & Cleanup

```bash
# Stop containers (data persists)
docker-compose down

# Stop and remove volumes (deletes data)
docker-compose down -v
```

## API Endpoints

| Method   | Endpoint       | Description          | Body                                          |
|----------|---------------|----------------------|-----------------------------------------------|
| `GET`    | `/`           | API info             | —                                             |
| `GET`    | `/todos`      | Get all todos        | —                                             |
| `POST`   | `/todos`      | Create a todo        | `{ "title": "...", "description": "..." }`    |
| `GET`    | `/todos/:id`  | Get a single todo    | —                                             |
| `PUT`    | `/todos/:id`  | Update a todo        | `{ "title": "...", "completed": true }`       |
| `DELETE` | `/todos/:id`  | Delete a todo        | —                                             |

### Example Usage (curl)

```bash
# Create a todo
curl -X POST http://localhost/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Docker", "description": "Practice Docker Compose"}'

# Get all todos
curl http://localhost/todos

# Update a todo
curl -X PUT http://localhost/todos/<id> \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Delete a todo
curl -X DELETE http://localhost/todos/<id>
```

## Project Structure

```
multi-container-todo/
├── api/                      # Node.js API
│   ├── src/
│   │   ├── index.js          # Entry point
│   │   ├── models/Todo.js    # Mongoose model
│   │   └── routes/todos.js   # CRUD routes
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
├── nginx/                    # Reverse proxy
│   ├── nginx.conf
│   └── Dockerfile
├── terraform/                # Infrastructure as Code
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
├── ansible/                  # Server configuration
│   ├── playbook.yml
│   └── inventory.ini
├── .github/workflows/        # CI/CD
│   └── deploy.yml
├── docker-compose.yml        # Local development
├── docker-compose.prod.yml   # Production
├── .env.example
├── .gitignore
└── README.md
```

## Infrastructure Setup (Optional)

### 1. Provision Server with Terraform

```bash
cd terraform

# Initialize
terraform init

# Preview changes
terraform plan -var "do_token=YOUR_TOKEN" -var "ssh_key_name=YOUR_KEY"

# Create server
terraform apply -var "do_token=YOUR_TOKEN" -var "ssh_key_name=YOUR_KEY"

# Get server IP
terraform output server_ip
```

### 2. Configure Server with Ansible

```bash
cd ansible

# Update inventory.ini with server IP from Terraform output
# Then run:
ansible-playbook -i inventory.ini playbook.yml
```

### 3. CI/CD with GitHub Actions

Add these secrets to your GitHub repository:

| Secret             | Description                    |
|-------------------|--------------------------------|
| `DOCKER_USERNAME` | Docker Hub username            |
| `DOCKER_PASSWORD` | Docker Hub password/token      |
| `SERVER_IP`       | Server IP from Terraform       |
| `SSH_PRIVATE_KEY` | SSH private key for server     |

The pipeline automatically builds, pushes, and deploys on every push to `main`.

## Data Persistence

MongoDB data is stored in a Docker named volume (`mongo-data`). Data survives container restarts and `docker-compose down`. To delete data, use `docker-compose down -v`.

## License

MIT
