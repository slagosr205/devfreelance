<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PdfController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectBoardController;
use App\Http\Controllers\QuoteController;
use App\Models\PageVisit;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $totalVisits = PageVisit::count();
    $todayVisits = PageVisit::whereDate('visited_at', today())->count();
    $countries = PageVisit::select('country')
        ->selectRaw('count(*) as count')
        ->whereNotNull('country')
        ->groupBy('country')
        ->orderByDesc('count')
        ->limit(10)
        ->get();

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'stats' => [
            'totalVisits' => $totalVisits,
            'todayVisits' => $todayVisits,
            'countries' => $countries,
        ],
    ]);
})->name('home');

// Public pages
Route::get('/about', fn () => Inertia::render('About'))->name('about');
Route::get('/blog', [\App\Http\Controllers\BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{post}', [\App\Http\Controllers\BlogController::class, 'show'])->name('blog.show');
Route::get('/works', [\App\Http\Controllers\WorkController::class, 'index'])->name('works.index');
Route::get('/works/{work}', [\App\Http\Controllers\WorkController::class, 'show'])->name('works.show');

Route::post('/payment/create', [PaymentController::class, 'createPayment'])->name('payment.create');
Route::post('/payment/quote/{quote}', [PaymentController::class, 'createPaymentForQuote'])->name('payment.create.quote');
Route::get('/payment/success', [PaymentController::class, 'success'])->name('payment.success');
Route::get('/payment/success/quote/{quote}', [PaymentController::class, 'successQuote'])->name('payment.success.quote');
Route::get('/payment/cancel', [PaymentController::class, 'cancel'])->name('payment.cancel');

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

// Ruta pública para aprobación de cotizaciones por clientes (sin login)
Route::get('/quotes/{quote}/approve', [QuoteController::class, 'approve'])->name('quotes.approve');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/my-projects', [ClientController::class, 'projects'])->name('client.projects');
    Route::get('/my-payments', [ClientController::class, 'payments'])->name('client.payments');
    Route::post('/my-projects', [ClientController::class, 'storeProject'])->name('client.project.store');

    // Quotes
    Route::get('/quotes', [QuoteController::class, 'index'])->name('quotes.index');
    Route::get('/quotes/create', [QuoteController::class, 'create'])->name('quotes.create');
    Route::post('/quotes', [QuoteController::class, 'store'])->name('quotes.store');
    Route::get('/quotes/{quote}', [QuoteController::class, 'show'])->name('quotes.show');
    Route::get('/quotes/{quote}/edit', [QuoteController::class, 'edit'])->name('quotes.edit');
    Route::put('/quotes/{quote}', [QuoteController::class, 'update'])->name('quotes.update');
    Route::post('/quotes/{quote}/send', [QuoteController::class, 'send'])->name('quotes.send');
    Route::post('/quotes/{quote}/accept', [QuoteController::class, 'accept'])->name('quotes.accept');
    Route::post('/quotes/{quote}/reject', [QuoteController::class, 'reject'])->name('quotes.reject');
    Route::post('/quotes/{quote}/convert', [QuoteController::class, 'convertToInvoice'])->name('quotes.convert');
    Route::delete('/quotes/{quote}', [QuoteController::class, 'destroy'])->name('quotes.destroy');

    // Invoices
    Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoices.index');
    Route::get('/invoices/create', [InvoiceController::class, 'create'])->name('invoices.create');
    Route::post('/invoices', [InvoiceController::class, 'store'])->name('invoices.store');
    Route::get('/invoices/{invoice}', [InvoiceController::class, 'show'])->name('invoices.show');
    Route::get('/invoices/{invoice}/edit', [InvoiceController::class, 'edit'])->name('invoices.edit');
    Route::put('/invoices/{invoice}', [InvoiceController::class, 'update'])->name('invoices.update');
    Route::post('/invoices/{invoice}/send', [InvoiceController::class, 'send'])->name('invoices.send');
    Route::post('/invoices/{invoice}/pay', [InvoiceController::class, 'markAsPaid'])->name('invoices.pay');
    Route::post('/invoices/{invoice}/cancel', [InvoiceController::class, 'cancel'])->name('invoices.cancel');
    Route::delete('/invoices/{invoice}', [InvoiceController::class, 'destroy'])->name('invoices.destroy');

    // Projects Board
    Route::get('/projects-board', [ProjectBoardController::class, 'index'])->name('projects-board.index');
    Route::get('/projects-board/{project}', [ProjectBoardController::class, 'show'])->name('projects-board.show');
    Route::post('/projects-board/{project}/stages', [ProjectBoardController::class, 'createStage'])->name('projects-board.stages.create');
    Route::put('/projects-board/stages/{stage}', [ProjectBoardController::class, 'updateStage'])->name('projects-board.stages.update');
    Route::delete('/projects-board/stages/{stage}', [ProjectBoardController::class, 'destroyStage'])->name('projects-board.stages.destroy');
    Route::post('/projects-board/{project}/tasks', [ProjectBoardController::class, 'createTask'])->name('projects-board.tasks.create');
    Route::put('/projects-board/tasks/{task}', [ProjectBoardController::class, 'updateTask'])->name('projects-board.tasks.update');
    Route::put('/projects-board/tasks/{task}/move', [ProjectBoardController::class, 'moveTask'])->name('projects-board.tasks.move');
    Route::delete('/projects-board/tasks/{task}', [ProjectBoardController::class, 'destroyTask'])->name('projects-board.tasks.destroy');
    Route::put('/projects-board/{project}/stages/reorder', [ProjectBoardController::class, 'reorderStages'])->name('projects-board.stages.reorder');
    Route::put('/projects-board/stages/{stage}/tasks/reorder', [ProjectBoardController::class, 'reorderTasks'])->name('projects-board.tasks.reorder');
    Route::post('/projects-board/{project}/generate-invoice', [ProjectBoardController::class, 'generateInvoice'])->name('projects-board.generate-invoice');
});

Route::prefix('admin')
    ->middleware(['auth', 'verified'])
    ->group(function () {
        Route::get('/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
        Route::get('/clients', [AdminController::class, 'clients'])->name('admin.clients');
        Route::post('/clients', [AdminController::class, 'createClient'])->name('admin.clients.create');
        Route::patch('/clients/{client}', [AdminController::class, 'updateClient'])->name('admin.clients.update');
        Route::get('/projects', [AdminController::class, 'projects'])->name('admin.projects');
        Route::post('/projects', [AdminController::class, 'createProject'])->name('admin.projects.create');
        Route::patch('/projects/{project}', [AdminController::class, 'updateProject'])->name('admin.projects.update');
        Route::get('/payments', [AdminController::class, 'payments'])->name('admin.payments');
        Route::get('/visits', [AdminController::class, 'visits'])->name('admin.visits');
        Route::get('/users', [AdminController::class, 'users'])->name('admin.users');
        Route::post('/users', [AdminController::class, 'createUser'])->name('admin.users.create');
        Route::put('/users/{user}', [AdminController::class, 'updateUser'])->name('admin.users.update');
        Route::post('/users/{user}/make-admin', [AdminController::class, 'makeAdmin'])->name('admin.users.make-admin');
        Route::post('/users/{user}/remove-admin', [AdminController::class, 'removeAdmin'])->name('admin.users.remove-admin');
        Route::get('/contacts', [AdminController::class, 'contacts'])->name('admin.contacts');
        Route::post('/contacts/{contact}/quote', [AdminController::class, 'generateQuote'])->name('admin.contacts.quote');
        Route::post('/clients/{client}/enable-access', [AdminController::class, 'enableClientAccess'])->name('admin.clients.enable-access');
    });

// PDF Routes
Route::get('/quotes/{quote}/pdf', [PdfController::class, 'quote'])->name('quotes.pdf');
Route::get('/invoices/{invoice}/pdf', [PdfController::class, 'invoice'])->name('invoices.pdf');

// Contact
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::post('/clients/{client}/quote', [ContactController::class, 'createQuote'])->name('clients.quote.create');

// Ruta de prueba para correo
Route::get('/test-email', function () {
    $contact = new \App\Models\Contact([
        'name' => 'Test Usuario',
        'email' => 'suamy.lagos@altiabusinesspark.com',
        'service' => 'sap',
        'message' => 'Este es un correo de prueba',
    ]);

    \Illuminate\Support\Facades\Mail::to('suamy.lagos@altiabusinesspark.com')->send(new \App\Mail\ContactConfirmation($contact));

    return response()->json(['message' => 'Correo enviado a suamy.lagos@altiabusinesspark.com']);
});

require __DIR__.'/auth.php';
