// Enhanced Security System for GTR CUBAUTO
// Sistema de seguridad avanzado con protección contra fraudes y ataques

import crypto from 'crypto';

interface SecurityConfig {
  maxLoginAttempts: number;
  lockoutDuration: number; // minutos
  sessionTimeout: number; // minutos  
  encryptionKey: string;
  jwtSecret: string;
  adminIPs: string[];
  enableTwoFactor: boolean;
  fraudDetectionEnabled: boolean;
}

interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'failed_login' | 'admin_access' | 'transaction' | 'fraud_alert' | 'data_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  details: any;
  timestamp: Date;
  resolved: boolean;
}

interface FraudDetection {
  suspiciousPatterns: {
    rapidOrderChanges: boolean;
    unusualLocationAccess: boolean;
    multipleFailedPayments: boolean;
    abnormalOrderVolume: boolean;
  };
  riskScore: number; // 0-100
  actions: string[];
}

export class SecurityService {
  private config: SecurityConfig;
  private activeAttempts: Map<string, number> = new Map();
  private lockedIPs: Map<string, Date> = new Map();
  private activeSessions: Map<string, Date> = new Map();

  constructor(config: SecurityConfig) {
    this.config = config;
    this.initializeSecurity();
  }

  private initializeSecurity(): void {
    console.log('🔒 Sistema de seguridad GTR CUBAUTO inicializado');
    
    // Limpiar intentos antiguos cada 5 minutos
    setInterval(() => {
      this.cleanupOldAttempts();
    }, 5 * 60 * 1000);

    // Verificar sesiones activas cada minuto
    setInterval(() => {
      this.validateActiveSessions();
    }, 60 * 1000);
  }

  // Validar acceso administrativo
  async validateAdminAccess(ipAddress: string, userAgent: string): Promise<boolean> {
    try {
      // Verificar IP en lista blanca (si está configurada)
      if (this.config.adminIPs.length > 0 && !this.config.adminIPs.includes(ipAddress)) {
        await this.logSecurityEvent({
          type: 'admin_access',
          severity: 'high',
          ipAddress,
          userAgent,
          details: { reason: 'IP not in whitelist', whitelistedIPs: this.config.adminIPs.length },
          resolved: false
        });
        return false;
      }

      // Verificar si IP está bloqueada
      if (this.isIPLocked(ipAddress)) {
        await this.logSecurityEvent({
          type: 'admin_access',
          severity: 'medium',
          ipAddress,
          userAgent,
          details: { reason: 'IP temporarily locked' },
          resolved: false
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('🚨 Error en validación de acceso admin:', error);
      return false;
    }
  }

  // Detectar patrones fraudulentos
  async detectFraud(userId: string, action: string, details: any): Promise<FraudDetection> {
    const detection: FraudDetection = {
      suspiciousPatterns: {
        rapidOrderChanges: false,
        unusualLocationAccess: false,
        multipleFailedPayments: false,
        abnormalOrderVolume: false
      },
      riskScore: 0,
      actions: []
    };

    if (!this.config.fraudDetectionEnabled) {
      return detection;
    }

    try {
      // Analizar patrones sospechosos
      
      // 1. Cambios rápidos de pedidos
      if (action === 'order_change' && details.changeCount > 5) {
        detection.suspiciousPatterns.rapidOrderChanges = true;
        detection.riskScore += 25;
        detection.actions.push('Monitorear cambios de pedidos');
      }

      // 2. Acceso desde ubicaciones inusuales
      if (details.location && details.previousLocations) {
        const distance = this.calculateLocationDistance(details.location, details.previousLocations[0]);
        if (distance > 1000) { // Más de 1000km
          detection.suspiciousPatterns.unusualLocationAccess = true;
          detection.riskScore += 30;
          detection.actions.push('Verificar ubicación del usuario');
        }
      }

      // 3. Múltiples fallos de pago
      if (action === 'payment_failed' && details.recentFailures > 3) {
        detection.suspiciousPatterns.multipleFailedPayments = true;
        detection.riskScore += 35;
        detection.actions.push('Revisar método de pago');
      }

      // 4. Volumen anormal de pedidos
      if (action === 'order_created' && details.dailyOrderCount > 10) {
        detection.suspiciousPatterns.abnormalOrderVolume = true;
        detection.riskScore += 20;
        detection.actions.push('Validar capacidad de compra');
      }

      // Acciones basadas en nivel de riesgo
      if (detection.riskScore >= 70) {
        detection.actions.push('Bloquear cuenta temporalmente');
        detection.actions.push('Notificar administrador');
        
        await this.logSecurityEvent({
          type: 'fraud_alert',
          severity: 'critical',
          userId,
          ipAddress: details.ipAddress || 'unknown',
          userAgent: details.userAgent || 'unknown',
          details: {
            action,
            riskScore: detection.riskScore,
            patterns: detection.suspiciousPatterns
          },
          resolved: false
        });
      } else if (detection.riskScore >= 40) {
        detection.actions.push('Requerir verificación adicional');
        
        await this.logSecurityEvent({
          type: 'fraud_alert',
          severity: 'medium',
          userId,
          ipAddress: details.ipAddress || 'unknown',
          userAgent: details.userAgent || 'unknown',
          details: {
            action,
            riskScore: detection.riskScore,
            patterns: detection.suspiciousPatterns
          },
          resolved: false
        });
      }

      return detection;
    } catch (error) {
      console.error('🚨 Error en detección de fraude:', error);
      return detection;
    }
  }

  // Encriptar datos sensibles
  encryptSensitiveData(data: string): string {
    try {
      // Generate a random IV for each encryption (16 bytes for AES)
      const iv = crypto.randomBytes(16);
      
      // Derive a proper 32-byte key from the encryption key
      const key = crypto.createHash('sha256').update(this.config.encryptionKey).digest();
      
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Prepend IV to the encrypted data (IV is not secret, just needs to be unique)
      return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
      console.error('🚨 Error en encriptación:', error);
      throw new Error('Encryption failed');
    }
  }

  // Desencriptar datos
  decryptSensitiveData(encryptedData: string): string {
    try {
      // Extract IV from the beginning of the encrypted data
      const parts = encryptedData.split(':');
      if (parts.length !== 2) {
        throw new Error('Invalid encrypted data format');
      }
      
      const iv = Buffer.from(parts[0], 'hex');
      const encrypted = parts[1];
      
      // Derive the same key used for encryption
      const key = crypto.createHash('sha256').update(this.config.encryptionKey).digest();
      
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      console.error('🚨 Error en desencriptación:', error);
      throw new Error('Decryption failed');
    }
  }

  // Generar hash seguro para contraseñas
  generateSecureHash(password: string, salt?: string): { hash: string; salt: string } {
    const useSalt = salt || crypto.randomBytes(32).toString('hex');
    const hash = crypto.pbkdf2Sync(password, useSalt, 10000, 64, 'sha512').toString('hex');
    return { hash, salt: useSalt };
  }

  // Validar contraseña
  validatePassword(password: string, hash: string, salt: string): boolean {
    const validHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === validHash;
  }

  // Registrar evento de seguridad
  private async logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): Promise<void> {
    const securityEvent: SecurityEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };

    console.log(`🛡️ Evento de seguridad registrado:`, {
      type: securityEvent.type,
      severity: securityEvent.severity,
      ip: securityEvent.ipAddress,
      user: securityEvent.userId || 'anonymous'
    });

    // En producción, guardar en base de datos
    // await storage.createSecurityLog(securityEvent);
  }

  // Verificar si IP está bloqueada
  private isIPLocked(ipAddress: string): boolean {
    const lockTime = this.lockedIPs.get(ipAddress);
    if (!lockTime) return false;

    const now = new Date();
    const unlockTime = new Date(lockTime.getTime() + this.config.lockoutDuration * 60 * 1000);
    
    if (now >= unlockTime) {
      this.lockedIPs.delete(ipAddress);
      return false;
    }
    
    return true;
  }

  // Bloquear IP por intentos fallidos
  private lockIP(ipAddress: string): void {
    this.lockedIPs.set(ipAddress, new Date());
    console.log(`🚫 IP bloqueada por ${this.config.lockoutDuration} minutos: ${ipAddress}`);
  }

  // Limpiar intentos antiguos
  private cleanupOldAttempts(): void {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    // Limpiar IPs bloqueadas expiradas
    for (const [ip, lockTime] of this.lockedIPs.entries()) {
      if (now - lockTime.getTime() > this.config.lockoutDuration * 60 * 1000) {
        this.lockedIPs.delete(ip);
      }
    }
    
    // Resetear intentos antiguos
    this.activeAttempts.clear();
  }

  // Validar sesiones activas
  private validateActiveSessions(): void {
    const now = new Date();
    const timeoutMs = this.config.sessionTimeout * 60 * 1000;
    
    for (const [sessionId, lastActivity] of this.activeSessions.entries()) {
      if (now.getTime() - lastActivity.getTime() > timeoutMs) {
        this.activeSessions.delete(sessionId);
        console.log(`⏰ Sesión expirada: ${sessionId}`);
      }
    }
  }

  // Calcular distancia entre ubicaciones (simplificado)
  private calculateLocationDistance(loc1: any, loc2: any): number {
    // Implementación simplificada - en producción usar biblioteca geoespacial
    if (!loc1.lat || !loc1.lng || !loc2.lat || !loc2.lng) return 0;
    
    const latDiff = Math.abs(loc1.lat - loc2.lat);
    const lngDiff = Math.abs(loc1.lng - loc2.lng);
    
    // Conversión aproximada a kilómetros
    return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111;
  }

  // Obtener configuración de seguridad (sin secretos)
  getSecurityConfig(): Omit<SecurityConfig, 'encryptionKey' | 'jwtSecret'> {
    const { encryptionKey, jwtSecret, ...safeConfig } = this.config;
    return safeConfig;
  }

  // Actualizar configuración
  updateConfig(newConfig: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ Configuración de seguridad actualizada');
  }
}

// Configuración por defecto
export const defaultSecurityConfig: SecurityConfig = {
  maxLoginAttempts: 5,
  lockoutDuration: 15, // 15 minutos
  sessionTimeout: 120, // 2 horas
  encryptionKey: process.env.SECURITY_ENCRYPTION_KEY || 'gtr-cubauto-default-key-change-in-production',
  jwtSecret: process.env.JWT_SECRET || 'gtr-cubauto-jwt-secret-change-in-production',
  adminIPs: [], // Vacío = permitir desde cualquier IP
  enableTwoFactor: false,
  fraudDetectionEnabled: true,
};

// Instancia global del servicio
export const securityService = new SecurityService(defaultSecurityConfig);