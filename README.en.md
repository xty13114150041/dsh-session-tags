# DSH Session Tags

[简体中文](./README.md)

Custom session tags for DeepSeek Harness Desktop. Bring conversations from different workspaces together under labels such as “Research” or “Personal,” with dedicated sections in the sidebar.

## Features

- **Tag sections**: Tags appear above workspaces. Each session can belong to one tag.
- **A compact session menu**: Open a session’s `⋯` menu and choose **Move to tag**. Assigned sessions appear under their tag.
- **Collapsible groups**: Collapse tags independently and keep using Harness’s native workspace folding.
- **Anchored popovers**: Create, move, rename, and delete near the button or click position. Click outside or press `Escape` to dismiss.
- **Native session actions**: Keep pinning, renaming, forking, and archiving through the session menu inside a tag.
- **Local persistence**: Tags and assignments survive restarts. Expansion preferences are saved in the current desktop client.

## Installation

### From the desktop app

1. Open **Plugins → Add plugin**.
2. Install the following URL:

   ```text
   https://github.com/xty13114150041/dsh-session-tags/archive/refs/tags/v1.0.0.tar.gz
   ```

3. Fully quit and reopen DeepSeek Harness.

### From the command line

```bash
dsh plugin --profile desktop add https://github.com/xty13114150041/dsh-session-tags/archive/refs/tags/v1.0.0.tar.gz
```

Fully quit and reopen the desktop app after installation.

## Usage

| Action | How |
| --- | --- |
| Create a tag | Click `+` beside **Tags**, enter a name, and save |
| Assign a session | Open its `⋯` menu, choose **Move to tag**, and select a tag |
| Return to a workspace | Choose **Move to tag → Return to workspace** from the same menu |
| Collapse or expand | Click the arrow beside a tag name |
| Rename a tag | Open the tag’s `⋯` menu and choose **Rename tag** |
| Delete a tag | Choose **Delete tag** from its `⋯` menu; its sessions return to their original workspaces with their conversation history intact |
| Filter sessions | Search by session title or working directory in the tag section |
| Refresh tags | Click the refresh button beside **Tags** |

Assigning a tag preserves the session’s working directory, files, tools, and conversation history.

## Compatibility

- **Supported release**: DeepSeek Harness Desktop `0.2.1-rc.5`.
- **Tested platform**: macOS. Windows and Linux desktop builds have not been tested.
- **Appearance**: Uses Harness theme colors and native session menus. The light theme has been verified.

The plugin uses the sidebar component interface in this Harness release. Adapting it to another version requires checking the sidebar and menus again.

## Agent tools

Manage tags through the `session_tags` tool or the `/session-tags <JSON>` command:

```json
{"action":"list"}
{"action":"create","name":"Research"}
{"action":"rename","tagId":"TAG_ID","name":"Project notes"}
{"action":"assign","tagId":"TAG_ID","sessionIds":["SESSION_ID"]}
{"action":"unassign","sessionIds":["SESSION_ID"]}
{"action":"delete","tagId":"TAG_ID"}
```

The desktop UI, tool, and command share the same tag data. UI actions use a local authenticated endpoint.

## Development

Requires Node.js 24 and pnpm.

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm run check
```

The 17 tests cover state operations, client setup and cleanup, and the desktop data endpoint. Desktop checks cover startup, tag creation and editing, assignment and return, folding, native menus, and popovers.

| File | Purpose |
| --- | --- |
| `client.js` | Sidebar tags, session menus, and popovers |
| `host.js` | Persistence, authenticated endpoint, tool, and command |
| `model.js` | Tag and assignment state operations |
| `cordis.patch.yml` | Harness plugin entry |
| `locale/` | Chinese and English plugin descriptions |

## License

[MIT License](./LICENSE)
