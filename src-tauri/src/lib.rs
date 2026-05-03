use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::{AppHandle, Manager, State};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "snake_case")]
pub struct UserPreferences {
    pub theme: String,
    pub notifications_enabled: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "snake_case")]
pub struct Project {
    pub id: String,
    pub name: String,
    pub description: String,
    pub progress: u8,
    pub status: String,
    pub category: String,
    pub started_at: String,
    pub members_count: u32,
    pub date: Option<String>,
    pub time: Option<String>,
    pub created_at: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "snake_case")]
pub struct Task {
    pub id: String,
    pub title: String,
    pub description: String,
    pub status: String,
    pub priority: String,
    pub start_date: Option<String>,
    pub due_date: String,
    pub time: String,
    pub risk: u8,
    pub project_id: Option<String>,
    pub created_at: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "snake_case")]
pub struct User {
    pub name: String,
    pub role: String,
    pub avatar_url: String,
    pub username: String,
    pub password: Option<String>,
    pub preferences: Option<UserPreferences>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "snake_case")]
pub struct WhiteboardElement {
    pub id: String,
    pub x: f64,
    pub y: f64,
    pub text: String,
    pub element_type: String,
}

#[derive(Debug, Serialize, Deserialize, Default, Clone)]
#[serde(rename_all = "snake_case")]
pub struct AppData {
    pub projects: Vec<Project>,
    pub tasks: Vec<Task>,
    pub users: Vec<User>,
    pub whiteboards: std::collections::HashMap<String, Vec<WhiteboardElement>>,
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
                description: "Ridefinizione completa dell'immagine coordinata.".into(),
                progress: 65,
                status: "In corso".into(),
                category: "Sviluppo Web".into(),
                started_at: "2024-01-12".into(),
                members_count: 12,
                date: Some("2024-01-12".into()),
                time: Some("10:00".into()),
                created_at: Some("2024-01-12T10:00:00Z".into()),
            },
        ],
        tasks: vec![],
        users: vec![User {
            name: "Alessandro Rossi".into(),
            role: "Project Lead".into(),
            username: "admin".into(),
            password: Some("admin".into()),
            avatar_url: "".into(),
            preferences: Some(UserPreferences { theme: "light".into(), notifications_enabled: true }),
        }],
        whiteboards: std::collections::HashMap::new(),
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
    if project.created_at.is_none() {
        project.created_at = Some(chrono::Utc::now().to_rfc3339());
    }
    data.projects.push(project.clone());
    save_data(&app, &data);
    project
}

#[tauri::command]
fn update_project(app: AppHandle, state: State<AppState>, project: Project) {
    let mut data = state.0.lock().unwrap();
    if let Some(p) = data.projects.iter_mut().find(|p| p.id == project.id) {
        *p = project;
        save_data(&app, &data);
    }
}

#[tauri::command]
fn delete_project(app: AppHandle, state: State<AppState>, id: String) {
    let mut data = state.0.lock().unwrap();
    data.projects.retain(|p| p.id != id);
    data.tasks.retain(|t| t.project_id.as_deref() != Some(&id));
    save_data(&app, &data);
}

#[tauri::command]
fn get_tasks(state: State<AppState>) -> Vec<Task> {
    state.0.lock().unwrap().tasks.clone()
}

#[tauri::command]
fn create_task(app: AppHandle, state: State<AppState>, mut task: Task) -> Task {
    let mut data = state.0.lock().unwrap();
    task.id = Uuid::new_v4().to_string();
    if task.created_at.is_none() {
        task.created_at = Some(chrono::Utc::now().to_rfc3339());
    }
    data.tasks.push(task.clone());
    save_data(&app, &data);
    task
}

#[tauri::command]
fn update_task(app: AppHandle, state: State<AppState>, task: Task) {
    let mut data = state.0.lock().unwrap();
    if let Some(t) = data.tasks.iter_mut().find(|t| t.id == task.id) {
        *t = task;
        save_data(&app, &data);
    }
}

#[tauri::command]
fn delete_task(app: AppHandle, state: State<AppState>, id: String) {
    let mut data = state.0.lock().unwrap();
    data.tasks.retain(|t| t.id != id);
    save_data(&app, &data);
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
fn login(state: State<AppState>, username: String, password: String) -> Result<User, String> {
    let data = state.0.lock().unwrap();
    data.users.iter()
        .find(|u| u.username == username && u.password.as_deref() == Some(&password))
        .cloned()
        .ok_or_else(|| "Invalid credentials".to_string())
}

#[tauri::command]
fn register(app: AppHandle, state: State<AppState>, user: User) -> Result<User, String> {
    let mut data = state.0.lock().unwrap();
    data.users.push(user.clone());
    save_data(&app, &data);
    Ok(user)
}

#[tauri::command]
fn update_user(app: AppHandle, state: State<AppState>, user: User) {
    let mut data = state.0.lock().unwrap();
    if let Some(u) = data.users.iter_mut().find(|u| u.username == user.username) {
        *u = user;
        save_data(&app, &data);
    }
}

#[tauri::command]
fn get_whiteboard(state: State<AppState>, project_id: String) -> Vec<WhiteboardElement> {
    let data = state.0.lock().unwrap();
    data.whiteboards.get(&project_id).cloned().unwrap_or_default()
}

#[tauri::command]
fn save_whiteboard(app: AppHandle, state: State<AppState>, project_id: String, elements: Vec<WhiteboardElement>) {
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
            get_projects, create_project, update_project, delete_project,
            get_tasks, create_task, update_task, delete_task, update_task_status,
            login, register, update_user, get_whiteboard, save_whiteboard
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
