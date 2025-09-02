export function generarContrasenaSegura(longitud: number = 8): string {
  const mayusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const minusculas = 'abcdefghijklmnopqrstuvwxyz';
  const numeros = '0123456789';
  const simbolos = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  // Asegurar al menos un carácter de cada tipo
  let contrasena = '';
  contrasena += mayusculas[Math.floor(Math.random() * mayusculas.length)];
  contrasena += minusculas[Math.floor(Math.random() * minusculas.length)];
  contrasena += numeros[Math.floor(Math.random() * numeros.length)];
  contrasena += simbolos[Math.floor(Math.random() * simbolos.length)];
  
  // Completar con caracteres aleatorios
  const todosLosCaracteres = mayusculas + minusculas + numeros + simbolos;
  for (let i = contrasena.length; i < longitud; i++) {
    contrasena += todosLosCaracteres[Math.floor(Math.random() * todosLosCaracteres.length)];
  }
  
  // Mezclar la contraseña para que los caracteres obligatorios no estén siempre al inicio
  return contrasena.split('').sort(() => Math.random() - 0.5).join('');
}
