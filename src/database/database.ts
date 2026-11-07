import { open } from 'react-native-nitro-sqlite';

export const db = open({ name: 'habitflow.sqlite'});

export async function resetDatabase() {
    await db.executeAsync(`
        DROP TABLE IF EXISTS tasks;
    `);

    await initializeDatabase();
}

export async function initializeDatabase() {
    await db.executeAsync(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category_id INTEGER NOT NULL,
            date TEXT NOT NULL,
            scheduled_time TEXT,
            repeat_daily INTEGER NOT NULL DEFAULT 0,
            repeat_weekly INTEGER NOT NULL DEFAULT 0,
            repeat_monthly INTEGER NOT NULL DEFAULT 0,
            is_completed INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL        
        );
    `);
}

export type NewTask = {
    title: string;
    category_id: number;
    date: string;
    scheduled_time: string | null;
    repeat_daily: number;
    repeat_weekly: number;
    repeat_monthly: number;
};

export async function addTask(task: NewTask) {
    await db.executeAsync(`
        INSERT INTO tasks (
            title, 
            category_id, 
            date,
            scheduled_time, 
            repeat_daily, 
            repeat_weekly, 
            repeat_monthly,
            created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
        [
            task.title,
            task.category_id,
            task.date,
            task.scheduled_time,
            task.repeat_daily,
            task.repeat_weekly,
            task.repeat_monthly,
            new Date().toISOString()
        ]
    );
}

export type Task = {
    id: number;
    title: string;
    category_id: number;
    date: string;
    scheduled_time: string | null;
    repeat_daily: number;
    repeat_weekly: number;
    repeat_monthly: number;
    is_completed: number;
    created_at: string;
};

export async function getTasks(date?: string): Promise<Task[]> {
       const result = await db.executeAsync(`
        SELECT * FROM tasks WHERE date = ? ORDER BY id DESC
    `, [date]);


    return result.rows._array as Task[];
}

export async function updateTaskCompletion(
    id: number,
    isCompleted: boolean
) {
    await db.executeAsync(
        `UPDATE tasks SET is_completed = ? WHERE id = ?`,
        [isCompleted ? 1 : 0, id]
    );
}