// controllers/authController.js
function login(req, res) {
  const { id, email } = req.user; // Obtén el id y email del usuario autenticado
  const uid = uuidv4(); // Genera un UID único para la revisión

    // Aquí puedes devolver los datos del usuario que desees
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user:  { id, email, uid },
    });
  }
  
  module.exports = {
    login,
  };
  