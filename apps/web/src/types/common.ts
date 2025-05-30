export type ActionReturnType<T> = { success: true; message: string; data: T } | { success: false; message: string; data: null };
