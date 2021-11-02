# vscode-extension-weekly-journal

A simple VS Code extension for keeping weekly logs in Markdown format.

It fills repetitive placeholders (week numbers and dates) in a weekly log template and displays rudimentary text readability stats.

<img width="512" src="https://user-images.githubusercontent.com/2470363/139927501-3c979c5e-a9d3-4948-910b-eb28aa769126.gif" />

## Local dev setup

```bash
$ npm ci
$ code . # followed by F5 to launch "Extension Development Host"
```

## Usage

1. Open any folder in VS Code.
1. Run commands from the Command Palette (`⇧⌘P`):
    * "Weekly Journal: Create" to pre-fill a journal template and store it under `journal/` folder of current workspace.
    * "Weekly Journal: Show readability score" to display a consensus score calculated by the [`text-readability` lib](https://github.com/clearnote01/readability).

## Known issues

* Text stats are shown on demand in a simple info message box, extension doesn't annotate the Tree View or the Status Bar.
* Readability score is calculated based on file content as is, without any preliminary filtering. There are no links and no additional explanation helping users to understand the score.
* Extension is not bundled.
* No unit tests.
