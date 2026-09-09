import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UsuarioModel } from '../models/usuario.js';
import { JWT_SECRET } from '../middlewares/auth.js';

export class AuthController {
  // @REVISAR: POST /auth/login - valida nombre + contrasena contra la BD, retorna JWT
  static async login(req, res) {
    const { nombre, contrasena } = req.body;

    const usuario = await UsuarioModel.getByNombre(nombre);

    // Usuario inexistente o inactivo
    if (!usuario) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciales inválidas',
      });
    }

    // @REVISAR: compatible con seeds que tengan la contrasena sin hashear.
    // Si el usuario no tiene contrasena (NULL), como los tecnicos, no puede hacer login de admin.
    const hash = usuario.contrasena || '';
    let contrasenaValida = false;

    // Si el hash no es formato bcrypt, comparar en texto plano (para admins ya existentes)
    if (hash.startsWith('$2')) {
      contrasenaValida = bcrypt.compareSync(contrasena, hash);
    } else {
      contrasenaValida = hash === contrasena;
    }

    if (!contrasenaValida) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciales inválidas',
      });
    }

    const token = jwt.sign(
      { id: usuario.id_usuario, nombre: usuario.nombre, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    return res.status(200).json({
      status: 'success',
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        rol: usuario.rol,
      },
    });
  }
}
