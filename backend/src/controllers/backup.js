import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import 'dotenv/config';
import { registrarAuditoria } from '../utils/auditoria.js';

const execAsync = promisify(exec);

// @REVISAR: pg_dump no siempre esta en el PATH del proceso (Windows).
// Se prueban rutas absolutas conocidas (existentes) y se cae a pg_dump del PATH.
function resolverPGDump() {
    const rutasConocidas = [
        process.env.PG_DUMP_PATH,
        'C:\\Program Files\\PostgreSQL\\18\\bin\\pg_dump.exe',
        'C:\\Program Files\\PostgreSQL\\17\\bin\\pg_dump.exe',
        'C:\\Program Files\\PostgreSQL\\16\\bin\\pg_dump.exe',
        'C:\\Program Files\\PostgreSQL\\15\\bin\\pg_dump.exe',
    ].filter(Boolean);

    for (const r of rutasConocidas) {
        if (fs.existsSync(r)) return { bin: r, quotear: true };
    }
    return { bin: 'pg_dump', quotear: false };
}

// @REVISAR: controller de backup - RNF-06: permite descargar un respaldo SQL de la BD
// Genera un pg_dump y lo devuelve como archivo descargable.
export class BackupController {
    static async generar(req, res) {
        try {
            const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

            // Configurar la contrasena en credenciales PGPASSWORD para no exponerla en el comando
            const env = { ...process.env, PGPASSWORD: DB_PASSWORD };

            const host = DB_HOST || 'localhost';
            const port = DB_PORT || '5432';
            const user = DB_USER || 'postgres';
            const db = DB_NAME || 'postgres';

            const pgDump = resolverPGDump();
            const bin = pgDump.quotear ? `"${pgDump.bin}"` : pgDump.bin;

            const { stdout } = await execAsync(
                `${bin} -h ${host} -p ${port} -U ${user} -d ${db}`,
                { env, maxBuffer: 50 * 1024 * 1024 }
            );

            const nombreArchivo = `backup_${db}_${new Date().toISOString().replace(/[:.]/g, '-')}.sql`;

            await registrarAuditoria(req, {
                modulo: 'Seguridad / Sistema',
                accion: 'Copia de Seguridad',
                detalles: `Respaldo generado por ${req.user?.nombre} (${Math.round(stdout.length / 1024)} KB)`,
            });

            res.setHeader('Content-Type', 'application/sql');
            res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
            res.status(200).send(stdout);
        } catch (error) {
            console.error('Error generando backup:', error);
            res.status(500).json({
                status: 'error',
                message: 'No se pudo generar el backup. Verifique que pg_dump esté instalado y accesible.',
            });
        }
    }
}
