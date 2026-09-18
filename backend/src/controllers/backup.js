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
            'exec',
            '-e', `PGPASSWORD=${DB_PASSWORD}`,
            CONTAINER_NAME,
            'pg_dump',
            '-U', DB_USER,
            DB_NAME
        ];

        const dockerProcess = spawn('docker', args);
        let errorOcurrido = false;

        dockerProcess.stderr.on('data', (data) => {
            const mensaje = data.toString();
            if (mensaje.toLowerCase().includes('error') || mensaje.toLowerCase().includes('fatal')) {
                errorOcurrido = true;
            }
        });

        // Interceptamos la tubería para asegurar que si hay un error crítico temprano, abortemos antes de enviar basura
        dockerProcess.stdout.on('data', (chunk) => {
            if (errorOcurrido) {
                dockerProcess.kill();
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Error crítico durante el volcado de la base de datos.' });
                } else {
                    res.end();
                }
                return;
            }
        });

        // Conectamos el flujo al cliente
        dockerProcess.stdout.pipe(res);

        dockerProcess.on('close', async (code) => {
            if (code === 0 && !errorOcurrido) {
                try {
                    await registrarAuditoria(req, {
                        modulo: 'Seguridad / Sistema',
                        accion: 'Copia de Seguridad',
                        detalles: `Respaldo generado exitosamente por ${req.user?.nombre || 'Sistema'}`,
                    });
                } catch (auditError) {
                    // Fallo silencioso de auditoría para no afectar la respuesta HTTP, idealmente manejado por un logger interno
                }
            } else {
                // Si el stream ya inició y falló a mitad de camino, destruimos la respuesta para corromper explícitamente el archivo incompleto en el cliente
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Error al generar el respaldo de la base de datos.' });
                } else {
                    res.destroy();
                }
            }
        });

        dockerProcess.on('error', () => {
            if (!res.headersSent) {
                res.status(500).json({ error: 'Error interno al ejecutar el proceso de respaldo.' });
            } else {
                res.destroy();
            }
        });
    }
}