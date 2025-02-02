import axios from "axios";
import Usuario from "../../core/models/usuario.model";
import GenericError from "../../infrastructure/models/error.model";

export class SigaApiAuthService {
  public static async loginAndGetToken(correo: string, contrasenia: string): Promise<string> {
    try {
      const res = await axios.post(`${process.env.SIGA_API_URL}/autenticacion/login/`, `username=${correo}&password=${contrasenia}`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Host: "siga.utem.cl",
        },
      });

      return res.data.response.token;
    } catch (err) {
      if (err.response?.status === 401) {
        console.debug({
          message: "Credenciales incorrectas",
          error: err,
        })
        throw GenericError.CREDENCIALES_INCORRECTAS
      }

      throw err
    }
  }

  public static async loginAndGetProfile(correo: string, contrasenia: string): Promise<Usuario> {
    try {
      const res = await axios.post(`${process.env.SIGA_API_URL}/autenticacion/login/`, `username=${correo}&password=${contrasenia}`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Host: "siga.utem.cl",
        },
      });

      return {
        token: res.data.response.token,
        rut: res.data.response.datos_persona.rut,
        nombreCompleto: res.data.response.datos_persona.nombre_completo,
        correoPersonal: res.data.response.datos_persona.correo_personal,
        correoUtem: res.data.response.datos_persona.correo_utem,
        fotoBase64: res.data.response.datos_persona.foto,
        perfiles: res.data.response.datos_persona.perfiles,
      };
    } catch (err) {
      if (err.response?.status === 401) {
        console.debug({
          message: "Credenciales incorrectas",
          error: err,
        })
        throw GenericError.CREDENCIALES_INCORRECTAS
      }

      throw err
    }
  }
}
