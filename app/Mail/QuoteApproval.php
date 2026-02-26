<?php

namespace App\Mail;

use App\Models\Quote;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class QuoteApproval extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Quote $quote, public string $approvalUrl) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Cotización #{$this->quote->quote_number} - Aprobación requerida",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.quote-approval',
        );
    }
}
