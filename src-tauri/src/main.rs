// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{LogicalPosition, LogicalSize, Manager, WebviewUrl, WebviewWindowBuilder};

/// Creates a transparent, borderless, always-on-top subtitle overlay window.
#[tauri::command]
async fn create_overlay_window(app: tauri::AppHandle) -> Result<String, String> {
    let label = "subtitle-overlay";

    // Close existing overlay if present.
    if let Some(win) = app.get_webview_window(label) {
        let _ = win.close();
    }

    let window = WebviewWindowBuilder::new(
        &app,
        label,
        WebviewUrl::App("index.html#/overlay".into()),
    )
        .title("KASANE Subtitle Overlay")
        .inner_size(720.0, 120.0)
        .position(120.0, 80.0)
        .transparent(true)
        .decorations(false)
        .always_on_top(true)
        .skip_taskbar(true)
        .resizable(false)
        .build()
        .map_err(|e| e.to_string())?;

    // Optional: make the overlay click-through friendly.
    let _ = window.set_ignore_cursor_events(true);

    Ok(label.to_string())
}

#[tauri::command]
fn move_overlay_window(window: tauri::Window, x: f64, y: f64) -> Result<(), String> {
    if window.label() == "subtitle-overlay" {
        window
            .set_position(LogicalPosition::new(x, y))
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
fn resize_overlay_window(window: tauri::Window, width: f64, height: f64) -> Result<(), String> {
    if window.label() == "subtitle-overlay" {
        window
            .set_size(LogicalSize::new(width, height))
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            create_overlay_window,
            move_overlay_window,
            resize_overlay_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
