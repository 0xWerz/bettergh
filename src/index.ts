import { $ } from "bun";
import { login } from "./commands/login";
import { repo } from "./commands/repo";
import * as c from "./utils/colors";

const VERSION = "1.0.0";

function showHelp() {
  console.log(`${c.bold("bgh")} - Better GitHub CLI`);
  console.log("");
  console.log(`${c.dim("An opinionated wrapper around gh with better UX")}`);
  console.log("");
  console.log(`${c.bold("Usage:")}`);
  console.log("  bgh <command> [options]");
  console.log("");
  console.log(`${c.bold("Commands:")}`);
  console.log("  login       Authenticate with GitHub (auto-opens browser)");
  console.log("  repo        Create a new repo from current directory");
  console.log("  help        Show this help message");
  console.log("  version     Show version");
  console.log("");
  console.log(`${c.bold("Examples:")}`);
  console.log("  bgh login              # Login to GitHub");
  console.log("  bgh repo               # Create repo (interactive for visibility)");
  console.log("  bgh repo --private     # Create private repo");
  console.log("  bgh repo --public      # Create public repo");
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === "help" || command === "--help" || command === "-h") {
    showHelp();
    process.exit(0);
  }

  if (command === "version" || command === "--version" || command === "-v") {
    console.log(`bgh v${VERSION}`);
    process.exit(0);
  }

  switch (command) {
    case "login":
      await login(args.slice(1));
      break;
    case "repo":
    case "new":
      await repo(args.slice(1));
      break;
    default:
      console.log(`${c.red("✗")} Unknown command: ${command}`);
      console.log("");
      showHelp();
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(`${c.red("✗")} Error: ${err.message}`);
  process.exit(1);
});
