<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de contacto</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 40px 30px; text-align: center;">
                            <div style="width: 60px; height: 60px; background: #0f172a; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                                <svg width="40" height="40" viewBox="0 0 110 110">
                                    <rect x="0" y="0" width="110" height="110" rx="18" fill="#0f172a"/>
                                    <circle cx="30" cy="30" r="6" fill="#00aaff"/>
                                    <circle cx="80" cy="30" r="6" fill="#00aaff"/>
                                    <circle cx="30" cy="80" r="6" fill="#00aaff"/>
                                    <circle cx="80" cy="80" r="6" fill="#00aaff"/>
                                    <line x1="30" y1="30" x2="80" y2="30" stroke="#00aaff" stroke-width="2"/>
                                    <line x1="30" y1="30" x2="30" y2="80" stroke="#00aaff" stroke-width="2"/>
                                    <line x1="80" y1="30" x2="80" y2="80" stroke="#00aaff" stroke-width="2"/>
                                    <line x1="30" y1="80" x2="80" y2="80" stroke="#00aaff" stroke-width="2"/>
                                </svg>
                            </div>
                            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Lineth<span style="color: #00aaff;">Hn</span></h1>
                            <p style="color: #94a3b8; margin: 5px 0 0; font-size: 12px; letter-spacing: 2px;">Links&Tech by Honduras</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 50px 40px;">
                            <h2 style="color: #f1f5f9; margin: 0 0 20px; font-size: 24px; font-weight: 600;">¡Gracias por contactarnos!</h2>
                            
                            <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                                Hola <strong style="color: #f1f5f9;">{{ $contact->name }}</strong>, hemos recibido tu mensaje correctamente. 
                                Nos pondremos en contacto contigo muy pronto.
                            </p>
                            
                            <!-- Info Box -->
                            <div style="background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.2); border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding-bottom: 15px;">
                                            <span style="color: #06b6d4; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Tu mensaje</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #e2e8f0; font-size: 15px; line-height: 1.6;">
                                            {{ $contact->message }}
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- Service Info -->
                            @if($contact->service)
                            <div style="margin-bottom: 30px;">
                                <span style="color: #94a3b8; font-size: 14px;">Servicio de interés:</span>
                                <p style="color: #f1f5f9; font-size: 16px; font-weight: 500; margin: 5px 0 0;">
                                    @if($contact->service == 'sap')
                                        SAP Business One
                                    @elseif($contact->service == 'odoo')
                                        Odoo ERP
                                    @elseif($contact->service == 'modules')
                                        Desarrollo de Módulos
                                    @else
                                        {{ $contact->service }}
                                    @endif
                                </p>
                            </div>
                            @endif
                            
                            <!-- Time estimate -->
                            <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%); border-radius: 12px; padding: 25px; text-align: center; margin-bottom: 30px;">
                                <p style="color: #c4b5fd; font-size: 14px; margin: 0 0 10px;">
                                    Tiempo estimado de respuesta
                                </p>
                                <p style="color: #f1f5f9; font-size: 24px; font-weight: 700; margin: 0;">
                                    24 - 48 horas
                                </p>
                            </div>
                            
                            <!-- What happens next -->
                            <div style="margin-top: 40px;">
                                <h3 style="color: #f1f5f9; font-size: 16px; font-weight: 600; margin: 0 0 15px;">¿Qué sigue?</h3>
                                <ul style="color: #94a3b8; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                                    <li>Revisaremos tu mensaje y necesidades</li>
                                    <li>Te contactaremos al correo: <strong style="color: #06b6d4;">{{ $contact->email }}</strong></li>
                                    <li>Agendaremos una reunión si es necesario</li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: #1e293b; padding: 30px 40px; text-align: center;">
                            <p style="color: #64748b; font-size: 13px; margin: 0 0 10px;">
                                © 2026 LinethHn. Todos los derechos reservados.
                            </p>
                            <p style="color: #475569; font-size: 12px; margin: 0;">
                                Este es un correo automático, por favor no respondas directamente a este mensaje.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
