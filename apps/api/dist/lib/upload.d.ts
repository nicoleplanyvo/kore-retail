import multer from 'multer';
declare const UPLOAD_DIR: string;
/**
 * Erstellt eine Multer-Instanz für ein bestimmtes Tool.
 * Dateien werden unter UPLOAD_DIR/{toolSlug}/{tenantId}/{sessionId}/ gespeichert.
 *
 * Erwartet req.tenantId (von requireToolAccess Middleware) und req.params.sessionId.
 */
export declare function createToolUpload(toolSlug: string): multer.Multer;
/** Gibt den absoluten Pfad zu einer Upload-Datei zurück */
export declare function getUploadPath(relativePath: string): string;
/** Gibt den relativen Pfad für die Datenbank zurück */
export declare function getRelativePath(toolSlug: string, tenantId: string, sessionId: string, filename: string): string;
/** Löscht eine Upload-Datei */
export declare function deleteUploadFile(relativePath: string): Promise<void>;
export { UPLOAD_DIR };
//# sourceMappingURL=upload.d.ts.map