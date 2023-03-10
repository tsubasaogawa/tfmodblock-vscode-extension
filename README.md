# tfmodblock vscode extension

Terraform module block snippeter.

![Demo](https://user-images.githubusercontent.com/7788821/224325538-a212e5fa-9138-4539-863d-4ed39bd446ed.gif)

# Usage

1. Move your cursor to `source` attribute.
2. Open command palette and select "Insert Module Block Snippet from Current Cursor".

# Requirements

- [tfmodblock binary](https://github.com/tsubasaogawa/tfmodblock) v0.0.4 or newer

# Settings

| Key                   | Description                                                   | Default                   |
| --------------------- | ------------------------------------------------------------- | ------------------------- |
| tfmodblock.binPath    | Path to tfmodblock binary                                     | /usr/local/bin/tfmodblock |
| tfmodblock.sort       | Sort the result (tfmodblock v0.0.9+)                          | true                      |
| tfmodblock.useDefault | Use default value in the variable block (tfmodblock v0.0.13+) | true                      |

# Limitation

- Remote source (e.g. git@github.com:foo/bar.git) unsupported
