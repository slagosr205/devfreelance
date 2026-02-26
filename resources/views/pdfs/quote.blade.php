<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cotización {{ $quote->quote_number }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            color: #1e293b;
            line-height: 1.6;
            padding: 40px;
            background: #fff;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #06b6d4;
        }
        
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #06b6d4;
        }
        
        .company-info {
            text-align: right;
            font-size: 12px;
            color: #64748b;
        }
        
        .document-title {
            font-size: 32px;
            font-weight: bold;
            color: #0f172a;
            margin-bottom: 5px;
        }
        
        .document-number {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 30px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
        }
        
        .info-box {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #06b6d4;
        }
        
        .info-box h3 {
            font-size: 12px;
            text-transform: uppercase;
            color: #64748b;
            margin-bottom: 8px;
            letter-spacing: 1px;
        }
        
        .info-box p {
            font-size: 14px;
            color: #1e293b;
            font-weight: 500;
        }
        
        .status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .status-draft { background: #e2e8f0; color: #475569; }
        .status-sent { background: #dbeafe; color: #2563eb; }
        .status-accepted { background: #d1fae5; color: #059669; }
        .status-rejected { background: #fee2e2; color: #dc2626; }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        
        th {
            background: #0f172a;
            color: white;
            padding: 12px 15px;
            text-align: left;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        th:last-child {
            text-align: right;
        }
        
        td {
            padding: 15px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
        }
        
        td:last-child {
            text-align: right;
        }
        
        tr:nth-child(even) {
            background: #f8fafc;
        }
        
        .totals {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 30px;
        }
        
        .totals-table {
            width: 300px;
        }
        
        .totals-table td {
            padding: 8px 15px;
            border: none;
        }
        
        .totals-table tr:last-child td {
            font-size: 18px;
            font-weight: bold;
            color: #06b6d4;
            border-top: 2px solid #0f172a;
            padding-top: 15px;
        }
        
        .notes-terms {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
        }
        
        .notes-terms h4 {
            font-size: 12px;
            text-transform: uppercase;
            color: #64748b;
            margin-bottom: 10px;
            letter-spacing: 1px;
        }
        
        .notes-terms p {
            font-size: 12px;
            color: #475569;
            line-height: 1.8;
        }
        
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 11px;
            color: #94a3b8;
        }
        
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        
        @media print {
            body { padding: 0; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <div class="logo">DEVFreelance</div>
            <div class="document-title">COTIZACIÓN</div>
            <div class="document-number">No. {{ $quote->quote_number }}</div>
        </div>
        <div class="company-info">
            <p><strong>DEVFreelance</strong></p>
            <p>Servicios de Desarrollo</p>
            <p>contacto@devfreelance.com</p>
        </div>
    </div>
    
    <div class="info-grid">
        <div class="info-box">
            <h3>Cliente</h3>
            <p>{{ $quote->client->company_name ?: $quote->client->user->name }}</p>
            <p style="color: #64748b; font-size: 13px;">{{ $quote->client->user->email }}</p>
        </div>
        <div class="info-box">
            <h3>Detalles</h3>
            <p><strong>Fecha:</strong> {{ $quote->created_at->format('d/m/Y') }}</p>
            <p><strong>Validez:</strong> {{ $quote->valid_until ? \Carbon\Carbon::parse($quote->valid_until)->format('d/m/Y') : 'Sin fecha' }}</p>
            <p><strong>Estado:</strong> <span class="status status-{{ $quote->status }}">{{ $quote->status }}</span></p>
        </div>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>Descripción</th>
                <th class="text-right">Cantidad</th>
                <th class="text-right">Precio Unit.</th>
                <th class="text-right">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($quote->items as $item)
            <tr>
                <td>{{ $item->description }}</td>
                <td class="text-right">{{ $item->quantity }}</td>
                <td class="text-right">${{ number_format($item->unit_price, 2) }}</td>
                <td class="text-right">${{ number_format($item->subtotal, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    
    <div class="totals">
        <table class="totals-table">
            <tr>
                <td>Subtotal</td>
                <td class="text-right">${{ number_format($quote->subtotal, 2) }}</td>
            </tr>
            @if($quote->tax_rate > 0)
            <tr>
                <td>Impuesto ({{ $quote->tax_rate }}%)</td>
                <td class="text-right">${{ number_format($quote->tax_amount, 2) }}</td>
            </tr>
            @endif
            @if($quote->discount > 0)
            <tr>
                <td>Descuento</td>
                <td class="text-right" style="color: #059669;">-${{ number_format($quote->discount, 2) }}</td>
            </tr>
            @endif
            <tr>
                <td><strong>TOTAL</strong></td>
                <td class="text-right"><strong>${{ number_format($quote->total, 2) }}</strong></td>
            </tr>
        </table>
    </div>
    
    @if($quote->notes || $quote->terms)
    <div class="notes-terms">
        @if($quote->notes)
        <div>
            <h4>Notas</h4>
            <p>{{ $quote->notes }}</p>
        </div>
        @endif
        @if($quote->terms)
        <div>
            <h4>Términos y Condiciones</h4>
            <p>{{ $quote->terms }}</p>
        </div>
        @endif
    </div>
    @endif
    
    <div class="footer">
        <p>Esta cotización es válida por 30 días a partir de la fecha de emisión.</p>
        <p>Gracias por su confianza • DEVFreelance</p>
    </div>
</body>
</html>
