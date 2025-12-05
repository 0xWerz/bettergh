# bgh

A better `gh` CLI wrapper with sensible defaults.

## Install

```bash
# npm/bun
npm install -g better-gh

# Homebrew
brew tap 0xWerz/bgh && brew install bgh
```

## Commands

### `bgh login`

Authenticate with GitHub. Opens browser automatically without waiting for confirmation.

### `bgh repo`

Create a GitHub repository from the current directory.

```bash
bgh repo                    # Interactive (asks visibility only)
bgh repo --private          # Private repo
bgh repo --public           # Public repo
bgh repo -d "Description"   # With description  
bgh repo -r upstream        # Custom remote name (default: origin)
bgh repo my-repo --public   # Custom repo name
```

**Flags:**
- `--private`, `-p` - Make repo private (default)
- `--public` - Make repo public
- `-d, --description` - Repository description
- `-r, --remote` - Remote name (default: `origin`)
- `-n, --name` - Repository name (default: current directory name)

## License

MIT
