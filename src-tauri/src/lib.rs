use serde::{Deserialize, Serialize};

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

#[tauri::command]
fn get_projects() -> Vec<Project> {
    vec![
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
        Project {
            id: "3".into(),
            name: "Audit Sicurezza".into(),
            description: "Revisione completa dei protocolli di accesso e crittografia dati per compliance GDPR.".into(),
            progress: 100,
            status: "Completato".into(),
            category: "Cybersecurity".into(),
            started_at: "10 Dic 2023".into(),
            members_count: 2,
        },
    ]
}

#[tauri::command]
fn get_tasks() -> Vec<Task> {
    vec![
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
        Task {
            id: "2".into(),
            title: "Sync Creative".into(),
            description: "Discussione moodboard nuovo brand".into(),
            status: "In corso".into(),
            priority: "Media".into(),
            due_date: "Oggi".into(),
            time: "16:00 - 17:00".into(),
            risk: 10,
        },
        Task {
            id: "3".into(),
            title: "Daily Standup".into(),
            description: "Aggiornamento team sviluppo".into(),
            status: "Completato".into(),
            priority: "Bassa".into(),
            due_date: "08 Ott, 2023".into(),
            time: "09:30 - 10:00".into(),
            risk: 0,
        },
    ]
}

#[tauri::command]
fn get_current_user() -> User {
    User {
        name: "Alessandro Rossi".into(),
        role: "Project Lead".into(),
        avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuARt6-hKbQvQiTAAEgwUN-wbhX02Vk2Zja2ODcln5vC6Iv_UtQrbUywbtGQQWm-u4wvfBfwPouq0wjD1lcOifPWZmtyT7DJ5ZDfj4AzfSWGHWlMuTcFXeQSEmh2TIbXs5W1am3sRBv5UsGT3RuSzxJyP7wZGvNzfkwZU3soVlHR979hl9W5aJC2gm1qFCfL_KcJvOBPlzGBkIK_YlSFOLZKXoGuIQwA6XgQW6Lb4kPZfqAJk0EWIoF31HcM65LpJv7pqTg8g7l5ZW-l".into(),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_projects,
            get_tasks,
            get_current_user
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
