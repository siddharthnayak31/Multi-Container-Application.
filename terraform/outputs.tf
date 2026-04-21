output "server_ip" {
  description = "The public IP address of the todo app server"
  value       = digitalocean_droplet.todo_server.ipv4_address
}

output "server_status" {
  description = "Status of the droplet"
  value       = digitalocean_droplet.todo_server.status
}
