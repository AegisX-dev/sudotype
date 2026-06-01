export interface CommandItem {
  text: string;
  description: string;
}

export const BASIC_COMMANDS: CommandItem[] = [
  { text: "ls -la", description: "List all files including hidden ones in long format" },
  { text: "cd /var/log", description: "Change directory to the system log folder" },
  { text: "chmod +x script.sh", description: "Make a shell script executable" },
  { text: "git commit -m \"feat: initial commit\"", description: "Commit staged changes with a conventional message" },
  { text: "docker run -it --rm alpine sh", description: "Run a disposable interactive Alpine Linux container" },
  { text: "systemctl restart nginx.service", description: "Restart the Nginx web server service" },
  { text: "grep -ri \"error\" /var/log/syslog", description: "Search recursively for 'error' in syslog files" },
  { text: "find . -name \"*.ts\" -type f", description: "Find all TypeScript files in the current folder" },
  { text: "ssh -i ~/.ssh/id_rsa admin@10.0.0.5", description: "Connect to a remote server using a private key" },
  { text: "curl -fsSL https://get.docker.com -o get-docker.sh", description: "Download the Docker installation script securely" },
  { text: "cat /etc/passwd | cut -d: -f1", description: "List all user accounts configured on the system" },
  { text: "mkdir -p src/engine src/ui", description: "Create multiple nested source directories" },
  { text: "pnpm install -D typescript", description: "Install TypeScript as a development dependency" },
  { text: "tar -czvf backup.tar.gz ./data", description: "Create a compressed gzip archive of a data directory" },
  { text: "df -h && free -m", description: "Show disk space usage and free system memory" },
  { text: "ping -c 4 8.8.8.8", description: "Send 4 ICMP echo request packets to Google's DNS" },
  { text: "ps aux | grep node", description: "List all running system processes matching 'node'" },
  { text: "tail -n 100 -f /var/log/nginx/access.log", description: "Follow the last 100 lines of Nginx access logs" }
];

/**
 * Returns a random command from the library.
 */
export function getRandomCommand(): CommandItem {
  const index = Math.floor(Math.random() * BASIC_COMMANDS.length);
  const fallback: CommandItem = { text: "ls -la", description: "List directory contents" };
  return BASIC_COMMANDS[index] ?? fallback;
}
