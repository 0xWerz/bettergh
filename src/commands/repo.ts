import { $ } from "bun";
import * as c from "../utils/colors";

interface RepoOptions {
  visibility?: "private" | "public" | "internal";
  name?: string;
  description?: string;
  remote?: string;
}

function parseArgs(args: string[]): RepoOptions {
  const opts: RepoOptions = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "--private":
      case "-p":
        opts.visibility = "private";
        break;
      case "--public":
        opts.visibility = "public";
        break;
      case "--internal":
        opts.visibility = "internal";
        break;
      case "-n":
      case "--name":
        opts.name = args[++i];
        break;
      case "-d":
      case "--description":
        opts.description = args[++i];
        break;
      case "-r":
      case "--remote":
        opts.remote = args[++i];
        break;
      default:
        if (!arg.startsWith("-")) {
          opts.name = arg;
        }
    }
  }
  
  return opts;
}

async function isGitRepo(): Promise<boolean> {
  const result = await $`git rev-parse --is-inside-work-tree`.quiet().nothrow();
  return result.exitCode === 0;
}

async function hasRemote(name: string): Promise<boolean> {
  const result = await $`git remote get-url ${name}`.quiet().nothrow();
  return result.exitCode === 0;
}

async function getRemoteUrl(name: string): Promise<string> {
  const result = await $`git remote get-url ${name}`.quiet().nothrow();
  return result.stdout.toString().trim();
}

async function hasCommits(): Promise<boolean> {
  const result = await $`git rev-parse HEAD`.quiet().nothrow();
  return result.exitCode === 0;
}

async function getCommitCount(): Promise<number> {
  const result = await $`git rev-list --count HEAD`.quiet().nothrow();
  return parseInt(result.stdout.toString().trim()) || 0;
}

async function getCurrentDir(): Promise<string> {
  return process.cwd();
}

export async function repo(args: string[]) {
  const opts = parseArgs(args);
  const remoteName = opts.remote || "origin";

  // Check if we're in a git repo
  if (!(await isGitRepo())) {
    c.error("Not in a git repository!");
    console.log("");
    c.info(`Initialize a git repo first with: ${c.bold("git init")}`);
    process.exit(1);
  }

  // Check if remote already exists
  if (await hasRemote(remoteName)) {
    c.error(`Remote '${remoteName}' already exists!`);
    console.log("");
    c.info(`Current ${remoteName}: ${await getRemoteUrl(remoteName)}`);
    process.exit(1);
  }

  // Get repo name from directory if not provided
  const cwd = await getCurrentDir();
  const repoName = opts.name || cwd.split("/").pop() || "repo";

  // Check for commits
  const commits = await hasCommits();
  const commitCount = commits ? await getCommitCount() : 0;

  console.log("");
  c.line();
  console.log(`${c.bold("Creating GitHub repository")}`);
  c.line();
  console.log("");
  c.info(`Repository: ${c.bold(repoName)}`);
  c.info(`Source: ${c.bold(cwd)}`);
  c.info(`Remote: ${c.bold(remoteName)}`);
  
  if (opts.description) {
    c.info(`Description: ${c.bold(opts.description)}`);
  }
  
  if (commits) {
    c.info(`Commits: ${c.bold(String(commitCount))}`);
  }
  console.log("");

  // Only ask for visibility if not provided
  let visibility = opts.visibility;
  if (!visibility) {
    console.log(`${c.bold("Visibility:")}`);
    console.log(`  1) Private ${c.dim("(default)")}`);
    console.log(`  2) Public`);
    console.log("");
    
    const choice = prompt("Choose [1/2]: ");
    visibility = choice === "2" ? "public" : "private";
  }

  console.log("");
  c.info(`Creating ${visibility} repository...`);

  // Build and execute the command
  const ghArgs = [
    "repo", "create", repoName,
    `--${visibility}`,
    "--source=.",
    `--remote=${remoteName}`,
  ];

  if (opts.description) {
    ghArgs.push(`--description=${opts.description}`);
  }

  if (commits) {
    ghArgs.push("--push");
  }

  const result = await $`gh ${ghArgs}`.nothrow();

  if (result.exitCode === 0) {
    console.log("");
    c.success("Repository created!");
    console.log("");
    
    const newRemote = await getRemoteUrl(remoteName);
    c.info(`Remote: ${c.bold(newRemote)}`);

    if (commits) {
      c.success("Pushed to GitHub!");
    } else {
      console.log("");
      c.info("Create your first commit:");
      console.log(`    ${c.dim("git add .")}`);
      console.log(`    ${c.dim('git commit -m "Initial commit"')}`);
      console.log(`    ${c.dim(`git push -u ${remoteName} main`)}`);
    }
  } else {
    c.error("Failed to create repository");
    process.exit(1);
  }
}
