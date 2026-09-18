import { spawn } from 'child_process';
import { registrarAuditoria } from '../utils/auditoria.js';

export class BackupController {
    static async generar(req, res) {
        const CONTAINER_NAME = process.env.DB_CONTAINER_NAME;
        const DB_USER = process.env.DB_USER;
        const DB_NAME = process.env.DB_NAME;
        const DB_PASSWORD = process.env.DB_PASSWORD;

        if (!CONTAINER_NAME || !DB_USER || !DB_NAME || !DB_PASSWORD) {
            return res.status(500).json({
                error: 'Faltan configuraciones de base de datos en las variables de entorno.'
            });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFileName = `backup-${DB_NAME}-${timestamp}.sql`;

        // Configuramos las cabeceras de descarga de forma segura
        res.setHeader('Content-Disposition', `attachment; filename="${backupFileName}"`);
        res.setHeader('Content-Type', 'application/sql');

        const args = [
            '-h', DB_HOST,
            '-p', DB_PORT,
            '-U', DB_USER,
            '-d', DB_NAME,
            '--no-owner',
            '--no-acl'
        ];

        const env = { ...process.env, PGPASSWORD: DB_PASSWORD };

        const pgDumpProcess = spawn('pg_dump', args, { env });
        let errorOcurrido = false;

        pgDumpProcess.stderr.on('data', (data) => {
            const mensaje = data.toString();
            // pg_dump a veces manda avisos menores por stderr, filtramos errores reales
            if (mensaje.toLowerCase().includes('error') || mensaje.toLowerCase().includes('fatal')) {
                errorOcurrido = true;
            }
        });

        pgDumpProcess.stdout.pipe(res);

        pgDumpProcess.on('close', async (code) => {
            if (code === 0 && !errorOcurrido) {
                try {
                    await registrarAuditoria(req, {
                        modulo: 'Seguridad / Sistema',
                        accion: 'Copia de Seguridad',
                        detalles: `Respaldo generado exitosamente por ${req.user?.nombre || 'Sistema'}`,
                    });
                } catch (auditError) {
                    // Silencioso
                }
            } else {
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Error al generar el respaldo de la base de datos.' });
                } else {
                    res.destroy();
                }
            }
        });

        pgDumpProcess.on('error', (err) => {
            console.error('Error ejecutando pg_dump:', err);
            if (!res.headersSent) {
                res.status(500).json({
                    error: 'El contenedor del backend no tiene instalado la herramienta pg_dump. Asegúrate de incluirla en el Dockerfile.'
                });
            } else {
                res.destroy();
            }
        });
    }
}