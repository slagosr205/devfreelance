<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Quote;
use Dompdf\Dompdf;
use Dompdf\Options;

class PdfController extends Controller
{
    public function quote(Quote $quote)
    {
        $quote->load(['client', 'client.user', 'project', 'items', 'creator']);

        $html = view('pdfs.quote', ['quote' => $quote])->render();

        $options = new Options;
        $options->set('isRemoteEnabled', true);
        $options->set('isHtml5ParserEnabled', true);

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        return $dompdf->stream("cotizacion-{$quote->quote_number}.pdf", ['Attachment' => true]);
    }

    public function invoice(Invoice $invoice)
    {
        $invoice->load(['client', 'client.user', 'project', 'items', 'creator']);

        $html = view('pdfs.invoice', ['invoice' => $invoice])->render();

        $options = new Options;
        $options->set('isRemoteEnabled', true);
        $options->set('isHtml5ParserEnabled', true);

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        return $dompdf->stream("factura-{$invoice->invoice_number}.pdf", ['Attachment' => true]);
    }
}
