<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Factura {{ $invoice->invoice_number }}</title>
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
            border-bottom: 3px solid #10b981;
        }
        
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #10b981;
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
        
        .invoice-badges {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
        }
        
        .badge {
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .badge-draft { background: #e2e8f0; color: #475569; }
        .badge-sent { background: #dbeafe; color: #2563eb; }
        .badge-paid { background: #d1fae5; color: #059669; }
        .badge-partial { background: #fef3c7; color: #d97706; }
        .badge-overdue { background: #fee2e2; color: #dc2626; }
        .badge-cancelled { background: #f1f5f9; color: #64748b; }
        
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
            border-left: 4px solid #10b981;
        }
        
        .info-box.invoice-box {
            border-left-color: #f59e0b;
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
        
        .payment-info {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        
        .payment-info h3 {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            opacity: 0.9;
            margin-bottom: 10px;
        }
        
        .payment-amount {
            font-size: 28px;
            font-weight: bold;
        }
        
        .payment-details {
            display: flex;
            gap: 40px;
            margin-top: 10px;
            font-size: 13px;
            opacity: 0.9;
        }
        
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
            font-size: 20px;
            font-weight: bold;
            color: #10b981;
            border-top: 2px solid #0f172a;
            padding-top: 15px;
        }
        
        .paid-stamp {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-15deg);
            font-size: 60px;
            font-weight: bold;
            color: #10b981;
            opacity: 0.2;
            border: 4px solid #10b981;
            padding: 20px 40px;
            border-radius: 10px;
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
        
        @media print {
            body { padding: 0; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <div class="logo">DEVFreelance</div>
            <div class="document-title">FACTURA</div>
            <div class="document-number">No. {{ $invoice->invoice_number }}</div>
        </div>
        <div class="company-info">
            <p><strong>DEVFreelance</strong></p>
            <p>Servicios de Desarrollo</p>
            <p>contacto@devfreelance.com</p>
        </div>
    </div>
    
    <div class="invoice-badges">
        <span class="badge badge-{{ $invoice->status }}">{{ $invoice->status }}</span>
        @if($invoice->paid_amount > 0 && $invoice->status !== 'paid')
        <span class="badge badge-partial">Parcial: ${{ number_format($invoice->paid_amount, 2) }}</span>
        @endif
    </div>
    
    <div class="info-grid">
        <div class="info-box">
            <h3>Cliente</h3>
            <p>{{ $invoice->client->company_name ?: $invoice->client->user->name }}</p>
            <p style="color: #64748b; font-size: 13px;">{{ $invoice->client->user->email }}</p>
        </div>
        <div class="info-box invoice-box">
            <h3>Información de Factura</h3>
            <p><strong>Fecha de emisión:</strong> {{ \Carbon\Carbon::parse($invoice->issue_date)->format('d/m/Y') }}</p>
            <p><strong>Fecha de vencimiento:</strong> {{ \Carbon\Carbon::parse($invoice->due_date)->format('d/m/Y') }}</p>
            @if($invoice->quote)
            <p><strong>Referencia:</strong> {{ $invoice->quote->quote_number }}</p>
            @endif
        </div>
    </div>
    
    <div class="payment-info">
        <h3>Monto Total</h3>
        <div class="payment-amount">${{ number_format($invoice->total, 2) }}</div>
        <div class="payment-details">
            <div>
                <span>Pagado:</span>
                <strong>${{ number_format($invoice->paid_amount, 2) }}</strong>
            </div>
            <div>
                <span>Pendiente:</span>
                <strong>${{ number_format($invoice->due_amount, 2) }}</strong>
            </div>
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
            @foreach($invoice->items as $item)
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
                <td class="text-right">${{ number_format($invoice->subtotal, 2) }}</td>
            </tr>
            @if($invoice->tax_rate > 0)
            <tr>
                <td>Impuesto ({{ $invoice->tax_rate }}%)</td>
                <td class="text-right">${{ number_format($invoice->tax_amount, 2) }}</td>
            </tr>
            @endif
            @if($invoice->discount > 0)
            <tr>
                <td>Descuento</td>
                <td class="text-right" style="color: #059669;">-${{ number_format($invoice->discount, 2) }}</td>
            </tr>
            @endif
            <tr>
                <td><strong>TOTAL</strong></td>
                <td class="text-right"><strong>${{ number_format($invoice->total, 2) }}</strong></td>
            </tr>
        </table>
    </div>
    
    @if($invoice->notes || $invoice->terms)
    <div class="notes-terms">
        @if($invoice->notes)
        <div>
            <h4>Notas</h4>
            <p>{{ $invoice->notes }}</p>
        </div>
        @endif
        @if($invoice->terms)
        <div>
            <h4>Términos de Pago</h4>
            <p>{{ $invoice->terms }}</p>
        </div>
        @endif
    </div>
    @endif
    
    <div class="footer">
        <p>Gracias por su preferencia • DEVFreelance</p>
        <p>Para cualquier consulta sobre esta factura, contactenos en contacto@devfreelance.com</p>
    </div>
</body>
</html>
