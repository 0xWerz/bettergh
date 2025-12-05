import { $ } from "bun";
import * as c from "../utils/colors";

export async function login(args: string[]) {
  c.info("Starting GitHub authentication...");

  // Check if already logged in
  const status = await $`gh auth status`.quiet().nothrow();
  
  if (status.exitCode === 0) {
    c.success("Already authenticated with GitHub!");
    console.log(status.stdout.toString());
    console.log("");
    
    const response = prompt("Do you want to re-authenticate? [y/N] ");
    if (response?.toLowerCase() !== "y") {
      return;
    }
  }

  console.log("");
  c.line();
  console.log(`${c.bold("Browser will open automatically. Copy the code shown below!")}`);
  c.line();
  console.log("");

  // Spawn gh auth login and auto-press Enter
  const proc = Bun.spawn(["gh", "auth", "login", "--web", "--git-protocol", "ssh"], {
    stdin: "pipe",
    stdout: "pipe",
    stderr: "inherit",
  });

  // Read stdout and auto-send Enter when we see the prompt
  const reader = proc.stdout.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      // Highlight the code
      const codeMatch = line.match(/([A-Z0-9]{4}-[A-Z0-9]{4})/);
      if (codeMatch) {
        console.log(`${c.bold(c.green("Your code:"))} ${c.yellow(c.bold(codeMatch[1]))}`);
      } else if (line.includes("Press Enter")) {
        // Auto-press Enter!
        proc.stdin.write("\n");
      } else if (line.includes("Logged in") || line.includes("Authentication complete")) {
        console.log(c.green(line));
      } else if (line.trim()) {
        console.log(line);
      }
    }
  }

  await proc.exited;
  console.log("");
  c.success("Authentication complete!");
}
