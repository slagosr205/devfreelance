<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cotización</title>
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
                            <h2 style="color: #f1f5f9; margin: 0 0 20px; font-size: 24px; font-weight: 600;">
                                Cotización #{{ $quote->quote_number }}
                            </h2>
                            
                            <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                                Has recibido una cotización de <strong style="color: #f1f5f9;">LinethHn</strong>. 
                                Por favor revisa los detalles y approves o rechaza la cotización.
                            </p>
                            
                            <!-- Quote Summary -->
                            <div style="background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.2); border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding-bottom: 15px;">
                                            <span style="color: #06b6d4; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Total</span>
                                        </td>
                                        <td style="text-align: right; padding-bottom: 15px;">
                                            <span style="color: #f1f5f9; font-size: 24px; font-weight: 700;">${{ number_format($quote->total, 2) }}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-bottom: 15px;">
                                            <span style="color: #94a3b8; font-size: 14px;">Válido hasta</span>
                                        </td>
                                        <td style="text-align: right; padding-bottom: 15px;">
                                            <span style="color: #f1f5f9; font-size: 14px;">{{ $quote->valid_until->format('d/m/Y') }}</span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- Buttons -->
                            <div style="display: flex; gap: 15px; justify-content: center; margin-bottom: 30px;">
                                <a 
                                    href="{{ $approvalUrl }}?action=approve"
                                    style="flex: 1; display: block; text-align: center; padding: 16px 24px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; border-radius: 12px; font-weight: 600;"
                                >
                                    Aprobar Cotización
                                </a>
                                <a 
                                    href="{{ $approvalUrl }}?action=reject"
                                    style="flex: 1; display: block; text-align: center; padding: 16px 24px; background: #ef4444; color: white; text-decoration: none; border-radius: 12px; font-weight: 600;"
                                >
                                    Rechazar
                                </a>
                            </div>
                            
                            <p style="color: #64748b; font-size: 13px; text-align: center; margin: 0;">
                                Este enlace expira en 15 días.
                            </p>
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
