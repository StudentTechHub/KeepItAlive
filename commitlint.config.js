module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      1,
      "always",
      [
        "feat", // New features
        "fix", // Bug fixes
        "docs", // Documentation
        "style", // Code style
        "refactor", // Code refactoring
        "test", // Testing
        "chore", // Maintenance
        "revert", // Reverting changes
        "perf", // Performance improvements
        "ci", // CI/CD changes
        "build", // Build system changes
        "temp", // Temporary commits
        "wip" // Work in progress
      ]
    ],
    "scope-case": [1, "always", "kebab-case"]
  }
};