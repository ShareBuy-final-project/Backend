# Backend

## Running the Docker Compose

To run the Docker Compose within the server, use the following command:

```sh
sudo docker compose up -d --build
```

This command will build and start the services defined in the `docker-compose.yml` file.

## Viewing Service Logs

To view the logs of the services after running Docker Compose, use the following commands:

### View Logs of All Services

```sh
sudo docker-compose logs
```

### View Logs of a Specific Service

Replace `<service_name>` with the name of the service (e.g., `user-service` or `db`).

```sh
sudo docker-compose logs <service_name>
```

### Follow Logs of a Specific Service in Real-Time

Replace `<service_name>` with the name of the service (e.g., `user-service` or `db`).

```sh
sudo docker-compose logs -f <service_name>
```

## Database

### Accessing the Database Shell

To open a shell of the PostgreSQL database in the server, use the following command:

```sh
sudo docker exec -it <db_container_id> psql -U adminDB -d ShareBuyDB
```

Replace `<db_container_id>` with the actual container ID of the PostgreSQL service. You can find the container ID by running:

```sh
sudo docker ps
```

### Example Commands

Once inside the PostgreSQL shell, you can execute SQL commands. Here are some examples:

#### List All Tables

```sql
\dt
```

#### Create a Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL
);
```

#### Insert Data into a Table

```sql
INSERT INTO users (username, email, password) VALUES ('john_doe', 'john@example.com', 'password123');
```

#### Select Data from a Table

```sql
SELECT * FROM users;
```

#### Delete Data from a Table

```sql
DELETE FROM users WHERE username = 'john_doe';
```

#### Drop a Table

```sql
DROP TABLE users;
```

### Setting Up Connection to the Database via pgAdmin Using SSH Tunnel

To set up a connection to the database via pgAdmin using the SSH tunnel feature, follow these steps:

1. **Open pgAdmin and create a new server:**

   - Right-click on "Servers" and select "Create" -> "Server..."

2. **General Tab:**

   - Name: `ShareBuyDB`

3. **Connection Tab:**

   - Host name/address: `localhost`
   - Port: `5432`
   - Maintenance database: `ShareBuyDB`
   - Username: `adminDB`
   - Password: `adminDB`

4. **SSH Tunnel Tab:**

   - Use SSH tunneling: `Yes`
   - Host name/address: `<your_server_ip>`
   - Port: `22`
   - Username: `<your_ssh_username>`
   - Authentication: `Password` or `Identity file`
   - Password: `<your_ssh_password>` (if using password authentication)
   - Identity file: `<path_to_your_private_key>` (if using identity file authentication)

5. **Save the server configuration.**

### Viewing Tables and Data in pgAdmin

Once connected to the database in pgAdmin, you can view the tables and data by expanding the server tree:

1. Expand `Servers` -> `ShareBuyDB` -> `Databases` -> `ShareBuyDB` -> `Schemas` -> `public` -> `Tables`.
2. Right-click on a table and select `View/Edit Data` -> `All Rows` to view the data in the table.

### Commands to Avoid on the Server

To ensure that the persistent data in the database is not deleted, avoid executing the following commands:

1. **Removing Docker Volumes:**

   ```sh
   sudo docker volume rm <volume_name>
   ```

2. **Pruning Docker System:**

   ```sh
   sudo docker system prune -a --volumes
   ```

3. **Stopping and Removing Containers Without Backing Up Data:**
   ```sh
   sudo docker-compose down -v
   ```

## Generating API Documentation

To generate a new updated `index.html` of the API documentation, use the following command:

```sh
apidoc -c apidoc/apidoc.json
```

This command will generate the API documentation based on the configuration specified in `apidoc/apidoc.json`.

## Viewing API Documentation

To view the API documentation, open the following link in your browser:

[API Documentation](https://html-preview.github.io/?url=https://github.com/ShareBuy-final-project/Backend/blob/60-add-api-call-for-fetche-deals-page/doc/index.html)

By following these instructions, you can manage the Docker services, access the database, generate API documentation, and use pgAdmin effectively while ensuring the persistence of your data.
