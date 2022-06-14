# tfmodblock vscode extension

Terraform module block snippeter.

![Demo](https://user-images.githubusercontent.com/7788821/173629183-e82c433a-6030-4434-a8f7-5979e35a394b.gif)

# Usage

1. Move your cursor to `source` attribute.
2. Open command palette and select "Insert Module Block Snippet from Current Cursor".

# Requirements

- [tfmodblock binary](https://github.com/tsubasaogawa/tfmodblock) v0.0.4 or newer

# Settings

| Key                | Description               | Default                   |
| ------------------ | ------------------------- | ------------------------- |
| tfmodblock.binPath | Path to tfmodblock binary | /usr/local/bin/tfmodblock |

# Limitation

- Remote source (e.g. git@github.com:foo/bar.git) unsupported
