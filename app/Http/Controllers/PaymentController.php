<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Payment;
use App\Models\Quote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use PayPal\Api\Amount;
use PayPal\Api\Item;
use PayPal\Api\ItemList;
use PayPal\Api\Payer;
use PayPal\Api\Payment as PayPalPayment;
use PayPal\Api\PaymentExecution;
use PayPal\Api\RedirectUrls;
use PayPal\Api\Transaction;
use PayPal\Auth\OAuthTokenCredential;
use PayPal\Rest\ApiContext;

class PaymentController extends Controller
{
    private $apiContext;

    public function __construct()
    {
        $clientId = config('services.paypal.client_id', env('PAYPAL_CLIENT_ID', ''));
        $clientSecret = config('services.paypal.client_secret', env('PAYPAL_CLIENT_SECRET', ''));

        $this->apiContext = new ApiContext(
            new OAuthTokenCredential($clientId, $clientSecret)
        );

        $this->apiContext->setConfig([
            'mode' => config('services.paypal.mode', env('PAYPAL_MODE', 'sandbox')),
            'http.ConnectionTimeout' => 30000,
            'log.LogEnabled' => true,
            'log.FileName' => storage_path('logs/paypal.log'),
            'log.LogLevel' => 'DEBUG',
        ]);
    }

    public function createPayment(Request $request)
    {
        try {
            $amount = floatval($request->input('amount', 100.00));
            $description = $request->input('description', 'Servicio de desarrollo freelance');

            if ($amount <= 0) {
                throw new \Exception('Invalid amount');
            }

            $payer = new Payer;
            $payer->setPaymentMethod('paypal');

            $item = new Item;
            $item->setName($description)
                ->setCurrency('USD')
                ->setQuantity(1)
                ->setPrice($amount);

            $itemList = new ItemList;
            $itemList->setItems([$item]);

            $amountObj = new Amount;
            $amountObj->setCurrency('USD')
                ->setTotal(number_format($amount, 2, '.', ''));

            $transaction = new Transaction;
            $transaction->setAmount($amountObj)
                ->setItemList($itemList)
                ->setDescription($description);

            $redirectUrls = new RedirectUrls;
            $redirectUrls->setReturnUrl(route('payment.success'))
                ->setCancelUrl(route('payment.cancel'));

            $payment = new PayPalPayment;
            $payment->setIntent('sale')
                ->setPayer($payer)
                ->setTransactions([$transaction])
                ->setRedirectUrls($redirectUrls);

            $payment->create($this->apiContext);

            if (auth()->check()) {
                $user = auth()->user();
                $client = Client::firstOrCreate(
                    ['user_id' => $user->id],
                    ['status' => 'prospect']
                );

                Payment::create([
                    'client_id' => $client->id,
                    'paypal_payment_id' => $payment->getId(),
                    'amount' => $amount,
                    'currency' => 'USD',
                    'status' => 'pending',
                    'description' => $description,
                ]);
            }

            return response()->json([
                'success' => true,
                'approvalUrl' => $payment->getApprovalLink(),
            ]);
        } catch (\PayPal\Exception\PayPalConnectionException $e) {
            $errorData = $e->getData();
            Log::error('PayPal connection error - Data: '.$errorData);
            Log::error('PayPal connection error - Message: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'debug' => $errorData,
            ], 500);
        } catch (\Exception $e) {
            Log::error('PayPal payment creation error: '.$e->getMessage());
            Log::error('PayPal trace: '.$e->getTraceAsString());

            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function createPaymentForQuote(Request $request, Quote $quote)
    {
        try {
            $amount = floatval($quote->total);
            $description = "Pago - Cotización {$quote->quote_number}";

            if ($amount <= 0) {
                throw new \Exception('Invalid amount');
            }

            $payer = new Payer;
            $payer->setPaymentMethod('paypal');

            $item = new Item;
            $item->setName($description)
                ->setCurrency('USD')
                ->setQuantity(1)
                ->setPrice($amount);

            $itemList = new ItemList;
            $itemList->setItems([$item]);

            $amountObj = new Amount;
            $amountObj->setCurrency('USD')
                ->setTotal(number_format($amount, 2, '.', ''));

            $transaction = new Transaction;
            $transaction->setAmount($amountObj)
                ->setItemList($itemList)
                ->setDescription($description);

            $redirectUrls = new RedirectUrls;
            $redirectUrls->setReturnUrl(route('payment.success.quote', ['quote' => $quote->id]))
                ->setCancelUrl(route('payment.cancel'));

            $payment = new PayPalPayment;
            $payment->setIntent('sale')
                ->setPayer($payer)
                ->setTransactions([$transaction])
                ->setRedirectUrls($redirectUrls);

            $payment->create($this->apiContext);

            $quote->update([
                'status' => 'paid_pending',
            ]);

            Payment::create([
                'client_id' => $quote->client_id,
                'project_id' => $quote->project_id,
                'paypal_payment_id' => $payment->getId(),
                'amount' => $amount,
                'currency' => 'USD',
                'status' => 'pending',
                'description' => $description,
            ]);

            return response()->json([
                'success' => true,
                'approvalUrl' => $payment->getApprovalLink(),
            ]);
        } catch (\Exception $e) {
            Log::error('PayPal payment for quote error: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function success(Request $request)
    {
        try {
            $paymentId = $request->input('paymentId');
            $payerId = $request->input('PayerID');

            $payment = PayPalPayment::get($paymentId, $this->apiContext);

            $execution = new PaymentExecution;
            $execution->setPayerId($payerId);

            $payment->execute($execution, $this->apiContext);

            $paymentRecord = Payment::where('paypal_payment_id', $paymentId)->first();
            if ($paymentRecord) {
                $paymentRecord->update([
                    'paypal_payer_id' => $payerId,
                    'status' => 'completed',
                    'paid_at' => now(),
                ]);
            }

            return redirect('/?payment=success');
        } catch (\Exception $e) {
            Log::error('PayPal payment execution error: '.$e->getMessage());

            return redirect('/?payment=error');
        }
    }

    public function successQuote(Request $request, Quote $quote)
    {
        try {
            $paymentId = $request->input('paymentId');
            $payerId = $request->input('PayerID');

            $payment = PayPalPayment::get($paymentId, $this->apiContext);

            $execution = new PaymentExecution;
            $execution->setPayerId($payerId);

            $payment->execute($execution, $this->apiContext);

            $paymentRecord = Payment::where('paypal_payment_id', $paymentId)->first();
            if ($paymentRecord) {
                $paymentRecord->update([
                    'paypal_payer_id' => $payerId,
                    'status' => 'completed',
                    'paid_at' => now(),
                ]);

                $invoice = $this->generateInvoiceFromQuote($quote);

                $paymentRecord->update([
                    'invoice_id' => $invoice->id,
                ]);
            }

            return redirect("/invoices/{$invoice->id}?payment=success");
        } catch (\Exception $e) {
            Log::error('PayPal quote payment execution error: '.$e->getMessage());

            return redirect('/?payment=error');
        }
    }

    private function generateInvoiceFromQuote(Quote $quote): Invoice
    {
        $invoiceNumber = 'INV-'.date('Y').'-'.str_pad(Invoice::count() + 1, 4, '0', STR_PAD_LEFT);

        $invoice = Invoice::create([
            'client_id' => $quote->client_id,
            'project_id' => $quote->project_id,
            'invoice_number' => $invoiceNumber,
            'status' => 'paid',
            'issue_date' => now(),
            'due_date' => now()->addDays(30),
            'subtotal' => $quote->subtotal,
            'tax_rate' => $quote->tax_rate,
            'tax_amount' => $quote->tax_amount,
            'discount' => $quote->discount,
            'total' => $quote->total,
            'paid_amount' => $quote->total,
            'due_amount' => 0,
            'notes' => $quote->notes,
            'terms' => $quote->terms,
            'paid_at' => now(),
        ]);

        foreach ($quote->items as $quoteItem) {
            InvoiceItem::create([
                'invoice_id' => $invoice->id,
                'description' => $quoteItem->description,
                'quantity' => $quoteItem->quantity,
                'unit_price' => $quoteItem->unit_price,
                'subtotal' => $quoteItem->subtotal,
            ]);
        }

        $quote->update([
            'status' => 'paid',
        ]);

        return $invoice;
    }

    public function cancel()
    {
        return redirect('/?payment=cancelled');
    }
}
