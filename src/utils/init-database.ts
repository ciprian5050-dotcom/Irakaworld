/**
 * Script de inicialización de la base de datos
 * Este archivo contiene funciones para crear datos iniciales
 */

import { api } from './api';
import { inicializarProductosWayuu } from './init-productos-wayuu';

/**
 * Crea el usuario administrador por defecto
 * Email: admin@irakaworld.com
 * Contraseña: Iraka2025
 * 
 * IMPORTANTE: Ejecuta esta función UNA SOLA VEZ para crear tu usuario admin
 * Luego puedes crear más usuarios desde la pantalla de Usuarios
 */
export const crearUsuarioAdmin = async () => {
  try {
    console.log('📝 Intentando crear usuario admin...');
    
    const resultado = await api.auth.signup(
      'admin@irakaworld.com',
      'Iraka2025',
      'Administrador Irakaworld',
      'Admin'
    );
    
    console.log('✅ Usuario admin creado exitosamente:', resultado);
    return resultado;
  } catch (error: any) {
    console.error('❌ Error creando usuario admin:', error.message);
    
    // Si el usuario ya existe, no es un error crítico
    if (error.message.includes('ya existe')) {
      console.log('ℹ️ El usuario admin ya existe, continuando...');
      return { success: true, message: 'Usuario ya existe' };
    }
    
    throw error;
  }
};

/**
 * Crea datos de ejemplo para pruebas (opcional)
 */
export const crearDatosEjemplo = async () => {
  try {
    console.log('📊 Creando datos de ejemplo...');
    
    // Primero hacer login como admin
    console.log('🔐 Haciendo login...');
    await api.auth.login('admin@irakaworld.com', 'Iraka2025');
    console.log('✅ Login exitoso');
    
    // Crear algunos clientes de ejemplo
    console.log('👥 Creando cliente de ejemplo...');
    await api.clientes.create({
      nombre: 'Cliente de Ejemplo',
      email: 'cliente@ejemplo.com',
      telefono: '3001234567',
      direccion: 'Calle 123 #45-67, Bogotá'
    });
    
    // Crear 63 productos Wayuu auténticos
    console.log('📦 Creando catálogo completo de productos Wayuu...');
    await inicializarProductosWayuu();
    
    console.log('✅ Catálogo de productos Wayuu cargado exitosamente');
  } catch (error: any) {
    console.error('❌ Error creando datos de ejemplo:', error.message);
    // No lanzar error, solo loguear
    console.log('ℹ️ Continuando sin datos de ejemplo...');
  }
};

// Exportar función de inicialización completa
export const inicializarBaseDeDatos = async () => {
  console.log('🚀 Iniciando configuración de base de datos...');
  console.log('');
  
  try {
    // 1. Crear usuario admin
    console.log('PASO 1/2: Creando usuario administrador...');
    await crearUsuarioAdmin();
    console.log('');
    
    // 2. Crear datos de ejemplo (opcional)
    console.log('PASO 2/2: Creando datos de ejemplo...');
    await crearDatosEjemplo();
    console.log('');
    
    console.log('✅ ¡Base de datos inicializada correctamente!');
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('👤 CREDENCIALES DE ACCESO:');
    console.log('   📧 Email: admin@irakaworld.com');
    console.log('   🔒 Contraseña: Iraka2025');
    console.log('═══════════════════════════════════════');
  } catch (error) {
    console.error('❌ Error en la inicialización:', error);
    throw error;
  }
};