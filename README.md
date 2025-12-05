# bgh

A better `gh` CLI wrapper. Infers context, asks less questions.

## Install

```bash
npm install -g better-gh          # npm/bun
brew install 0xWerz/bgh/bgh       # macOS
```

## Usage

### `bgh repo`

Create a GitHub repository. Infers everything from your local git directory:

```
~/my-project$ bgh repo

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Creating GitHub repository
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

→ Repository: my-project
→ Source: /home/user/my-project
→ Commits: 3

Visibility:
  1) Private (default)
  2) Public

Choose [1/2]: 1

→ Creating private repository...
✓ Repository created!
✓ Pushed to GitHub!
```

Skip the prompt with flags:

```bash
bgh repo --private          # or --public
bgh repo -d "Description"   # add description
bgh repo -r upstream        # custom remote name
```

### `bgh login`

Authenticate with GitHub. Opens browser immediately and gets you authenticated.

## License

MIT
