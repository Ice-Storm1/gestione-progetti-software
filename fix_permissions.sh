#!/bin/bash
mkdir -p src-tauri/permissions
cat > src-tauri/permissions/commands.json <<INNEREOF
{
  "identifier": "allow-app-commands",
  "description": "Allow app commands",
  "commands": [
    "get_projects",
    "create_project",
    "update_project",
    "delete_project",
    "get_tasks",
    "create_task",
    "update_task_status",
    "login",
    "register",
    "get_whiteboard",
    "save_whiteboard"
  ]
}
INNEREOF

mkdir -p src-tauri/capabilities
cat > src-tauri/capabilities/default.json <<INNEREOF
{
  "identifier": "main-capability",
  "description": "Main window capability",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "opener:default",
    "protype:allow-app-commands"
  ]
}
INNEREOF
