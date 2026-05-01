use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::{AppHandle, Manager, State};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Project {
    id: String,
    name: String,
    description: String,
    progress: u8,
    status: String,
    category: String,
    started_at: String,
    members_count: u32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Task {
    id: String,
    title: String,
    description: String,
    status: String,
    priority: String,
    due_date: String,
    time: String,
    risk: u8,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct User {
    name: String,
    role: String,
    avatar_url: String,
}

#[derive(Debug, Serialize, Deserialize, Default, Clone)]
pub struct AppData {
    projects: Vec<Project>,
    tasks: Vec<Task>,
    user: Option<User>,
}

pub struct AppState(Mutex<AppData>);

impl AppState {
    pub fn new() -> Self {
        Self(Mutex::new(AppData::default()))
    }
}

fn get_data_path(app: &AppHandle) -> PathBuf {
    let mut path = app.path().app_data_dir().expect("failed to get app data dir");
    if !path.exists() {
        fs::create_dir_all(&path).expect("failed to create app data dir");
    }
    path.push("data.json");
    path
}

fn load_data(app: &AppHandle) -> AppData {
    let path = get_data_path(app);
    if path.exists() {
        let content = fs::read_to_string(path).unwrap_or_default();
        serde_json::from_str(&content).unwrap_or_else(|_| initial_data())
    } else {
        initial_data()
    }
}

fn save_data(app: &AppHandle, data: &AppData) {
    let path = get_data_path(app);
    let content = serde_json::to_string_pretty(data).expect("failed to serialize data");
    fs::write(path, content).expect("failed to write data to file");
}

fn initial_data() -> AppData {
    AppData {
        projects: vec![
            Project {
                id: "1".into(),
                name: "Brand Identity 2024".into(),
                description: "Ridefinizione completa dell'immagine coordinata per il lancio internazionale del Q3.".into(),
                progress: 65,
                status: "Attivo".into(),
                category: "Sviluppo Web".into(),
                started_at: "12 Gen 2024".into(),
                members_count: 12,
            },
            Project {
                id: "2".into(),
                name: "E-commerce Portal".into(),
                description: "Sviluppo piattaforma B2B con integrazione pagamenti e gestione logistica automatizzata.".into(),
                progress: 32,
                status: "Attivo".into(),
                category: "E-commerce".into(),
                started_at: "05 Mar 2024".into(),
                members_count: 5,
            },
        ],
        tasks: vec![
            Task {
                id: "1".into(),
                title: "Analisi Requirement".into(),
                description: "Revisione specifica tecnica v2.4".into(),
                status: "Da fare".into(),
                priority: "Alta".into(),
                due_date: "12 Ott, 2023".into(),
                time: "14:30 - 15:30".into(),
                risk: 25,
            },
        ],
        user: Some(User {
            name: "Alessandro Rossi".into(),
            role: "Project Lead".into(),
            avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuARt6-hKbQvQiTAAEgwUN-wbhX02Vk2Zja2ODcln5vC6Iv_UtQrbUywbtGQQWm-u4wvfBfwPouq0wjD1lcOifPWZmtyT7DJ5ZDfj4AzfSWGHWlMuTcFXeQSEmh2TIbXs5W1am3sRBv5UsGT3RuSzxJyP7wZGvNzfkwZU3soVlHR979hl9W5aJC2gm1qFCfL_KcJvOBPlzGBkIK_YlSFOLZKXoGuIQwA6XgQW6Lb4kPZfqAJk0EWIoF31HcM65LpJv7pqTg8g7l5ZW-l".into(),
        }),
    }
}

#[tauri::command]
fn get_projects(state: State<AppState>) -> Vec<Project> {
    state.0.lock().unwrap().projects.clone()
}

#[tauri::command]
fn create_project(app: AppHandle, state: State<AppState>, mut project: Project) -> Project {
    let mut data = state.0.lock().unwrap();
    project.id = Uuid::new_v4().to_string();
    data.projects.push(project.clone());
    save_data(&app, &data);
    project
}

#[tauri::command]
fn get_tasks(state: State<AppState>) -> Vec<Task> {
    state.0.lock().unwrap().tasks.clone()
}

#[tauri::command]
fn create_task(app: AppHandle, state: State<AppState>, mut task: Task) -> Task {
    let mut data = state.0.lock().unwrap();
    task.id = Uuid::new_v4().to_string();
    data.tasks.push(task.clone());
    save_data(&app, &data);
    task
}

#[tauri::command]
fn update_task_status(app: AppHandle, state: State<AppState>, id: String, status: String) {
    let mut data = state.0.lock().unwrap();
    if let Some(task) = data.tasks.iter_mut().find(|t| t.id == id) {
        task.status = status;
        save_data(&app, &data);
    }
}

#[tauri::command]
fn get_current_user(state: State<AppState>) -> User {
    state.0.lock().unwrap().user.clone().unwrap_or(User {
        name: "Anonymous".into(),
        role: "Guest".into(),
        avatar_url: "".into(),
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(AppState::new())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let data = load_data(&app.handle());
            let state = app.state::<AppState>();
            *state.0.lock().unwrap() = data;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_projects,
            create_project,
            get_tasks,
            create_task,
            update_task_status,
            get_current_user
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
