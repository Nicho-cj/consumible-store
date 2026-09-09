import { exec } from 'child_process';
import { promisify } from 'util';
import 'dotenv/config';

const execAsync = promisify(exec);

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

            const { stdout } = await execAsync(
                `pg_dump -h ${host} -p ${port} -U ${user} -d ${db}`,
                { env, maxBuffer: 50 * 1024 * 1024 }
            );

            const nombreArchivo = `backup_${db}_${new Date().toISOString().replace(/[:.]/g, '-')}.sql`;

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
