use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::{AppHandle, Manager, State};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub description: String,
    pub progress: u8,
    pub status: String,
    pub category: String,
    pub started_at: String,
    pub members_count: u32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Task {
    pub id: String,
    pub title: String,
    pub description: String,
    pub status: String,
    pub priority: String,
    pub due_date: String,
    pub time: String,
    pub risk: u8,
    pub project_id: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct User {
    pub name: String,
    pub role: String,
    pub avatar_url: String,
    pub email: String,
    pub password: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct WhiteboardElement {
    pub id: String,
    pub x: f64,
    pub y: f64,
    pub text: String,
    pub element_type: String, // "sticky", "node"
}

#[derive(Debug, Serialize, Deserialize, Default, Clone)]
pub struct AppData {
    pub projects: Vec<Project>,
    pub tasks: Vec<Task>,
    pub users: Vec<User>,
    pub whiteboards: std::collections::HashMap<String, Vec<WhiteboardElement>>, // project_id -> elements
}

pub struct AppState(pub Mutex<AppData>);

impl AppState {
    pub fn new() -> Self {
        Self(Mutex::new(AppData::default()))
    }
}

fn get_data_path(app: &AppHandle) -> PathBuf {
    let path = app.path().app_data_dir().expect("failed to get app data dir");
    if !path.exists() {
        fs::create_dir_all(&path).expect("failed to create app data dir");
    }
    path.join("data.json")
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
                started_at: "2024-01-12".into(),
                members_count: 12,
            },
        ],
        tasks: vec![
            Task {
                id: "1".into(),
                title: "Analisi Requirement".into(),
                description: "Revisione specifica tecnica v2.4".into(),
                status: "Da fare".into(),
                priority: "Alta".into(),
                due_date: "2024-10-12".into(),
                time: "14:30 - 15:30".into(),
                risk: 25,
                project_id: Some("1".into()),
            },
        ],
        users: vec![User {
            name: "Alessandro Rossi".into(),
            role: "Project Lead".into(),
            email: "admin@protype.com".into(),
            password: Some("admin".into()),
            avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuARt6-hKbQvQiTAAEgwUN-wbhX02Vk2Zja2ODcln5vC6Iv_UtQrbUywbtGQQWm-u4wvfBfwPouq0wjD1lcOifPWZmtyT7DJ5ZDfj4AzfSWGHWlMuTcFXeQSEmh2TIbXs5W1am3sRBv5UsGT3RuSzxJyP7wZGvNzfkwZU3soVlHR979hl9W5aJC2gm1qFCfL_KcJvOBPlzGBkIK_YlSFOLZKXoGuIQwA6XgQW6Lb4kPZfqAJk0EWIoF31HcM65LpJv7pqTg8g7l5ZW-l".into(),
        }],
        whiteboards: std::collections::HashMap::new(),
    }
}

// Commands
#[tauri::command]
pub fn get_projects(state: State<AppState>) -> Vec<Project> {
    state.0.lock().unwrap().projects.clone()
}

#[tauri::command]
pub fn create_project(app: AppHandle, state: State<AppState>, mut project: Project) -> Project {
    let mut data = state.0.lock().unwrap();
    project.id = Uuid::new_v4().to_string();
    data.projects.push(project.clone());
    save_data(&app, &data);
    project
}

#[tauri::command]
pub fn update_project(app: AppHandle, state: State<AppState>, project: Project) {
    let mut data = state.0.lock().unwrap();
    if let Some(p) = data.projects.iter_mut().find(|p| p.id == project.id) {
        *p = project;
        save_data(&app, &data);
    }
}

#[tauri::command]
pub fn delete_project(app: AppHandle, state: State<AppState>, id: String) {
    let mut data = state.0.lock().unwrap();
    data.projects.retain(|p| p.id != id);
    data.tasks.retain(|t| t.project_id.as_ref() != Some(&id));
    data.whiteboards.remove(&id);
    save_data(&app, &data);
}

#[tauri::command]
pub fn get_tasks(state: State<AppState>) -> Vec<Task> {
    state.0.lock().unwrap().tasks.clone()
}

#[tauri::command]
pub fn create_task(app: AppHandle, state: State<AppState>, mut task: Task) -> Task {
    let mut data = state.0.lock().unwrap();
    task.id = Uuid::new_v4().to_string();
    data.tasks.push(task.clone());
    save_data(&app, &data);
    task
}

#[tauri::command]
pub fn update_task_status(app: AppHandle, state: State<AppState>, id: String, status: String) {
    let mut data = state.0.lock().unwrap();
    if let Some(task) = data.tasks.iter_mut().find(|t| t.id == id) {
        task.status = status;
        save_data(&app, &data);
    }
}

#[tauri::command]
pub fn login(state: State<AppState>, email: String, password: String) -> Result<User, String> {
    let data = state.0.lock().unwrap();
    data.users.iter()
        .find(|u| u.email == email && u.password.as_deref() == Some(&password))
        .cloned()
        .ok_or_else(|| "Invalid credentials".to_string())
}

#[tauri::command]
pub fn register(app: AppHandle, state: State<AppState>, user: User) -> Result<User, String> {
    let mut data = state.0.lock().unwrap();
    if data.users.iter().any(|u| u.email == user.email) {
        return Err("User already exists".to_string());
    }
    data.users.push(user.clone());
    save_data(&app, &data);
    Ok(user)
}

#[tauri::command]
pub fn get_whiteboard(state: State<AppState>, project_id: String) -> Vec<WhiteboardElement> {
    let data = state.0.lock().unwrap();
    data.whiteboards.get(&project_id).cloned().unwrap_or_default()
}

#[tauri::command]
pub fn save_whiteboard(app: AppHandle, state: State<AppState>, project_id: String, elements: Vec<WhiteboardElement>) {
    let mut data = state.0.lock().unwrap();
    data.whiteboards.insert(project_id, elements);
    save_data(&app, &data);
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
            update_project,
            delete_project,
            get_tasks,
            create_task,
            update_task_status,
            login,
            register,
            get_whiteboard,
            save_whiteboard
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
