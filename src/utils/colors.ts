// ANSI color utilities
export const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
export const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
export const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
export const blue = (s: string) => `\x1b[34m${s}\x1b[0m`;
export const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;
export const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;
export const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;

// Prefixed log utilities
export const info = (s: string) => console.log(`${blue("→")} ${s}`);
export const success = (s: string) => console.log(`${green("✓")} ${s}`);
export const warn = (s: string) => console.log(`${yellow("!")} ${s}`);
export const error = (s: string) => console.log(`${red("✗")} ${s}`);

export const line = () => console.log(cyan("━".repeat(60)));
