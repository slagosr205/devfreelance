import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Client {
    id: number;
    company_name: string | null;
    user: {
        name: string;
    };
}

interface QuotesCreateProps {
    clients: Client[];
}

interface Item {
    description: string;
    quantity: number;
    unit_price: number;
}

export default function QuotesCreate() {
    const pageProps = usePage().props as unknown as QuotesCreateProps;
    const { clients } = pageProps;
    
    const [items, setItems] = useState<Item[]>([
        { description: '', quantity: 1, unit_price: 0 }
    ]);

    const { data, setData, post, processing } = useForm({
        client_id: '',
        project_id: '',
        items: items,
        tax_rate: 0,
        discount: 0,
        notes: '',
        terms: '',
        valid_until: '',
    });

    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, unit_price: 0 }]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            const newItems = items.filter((_, i) => i !== index);
            setItems(newItems);
            setData('items', newItems);
        }
    };

    const updateItem = (index: number, field: keyof Item, value: string | number) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
        setData('items', newItems);
    };

    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const taxAmount = subtotal * (data.tax_rate / 100);
    const total = subtotal + taxAmount - data.discount;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setData('items', items);
        post('/quotes');
    };

    return (
        <AuthenticatedLayout>
            <Head title="Nueva Cotización" />
            
            <div className="min-h-screen bg-slate-950">
                <header className="bg-slate-900 border-b border-slate-800 px-8 py-4">
                    <div className="flex items-center gap-4">
                        <a href="/quotes" className="text-slate-400 hover:text-white">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </a>
                        <h1 className="text-2xl font-bold text-white">Nueva Cotización</h1>
                    </div>
                </header>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="max-w-4xl">
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-6">
                            <h2 className="text-lg font-semibold text-white mb-4">Datos del Cliente</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Cliente *</label>
                                    <select
                                        value={data.client_id}
                                        onChange={(e) => setData('client_id', e.target.value)}
                                        required
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    >
                                        <option value="">Seleccionar cliente</option>
                                        {clients.map((client) => (
                                            <option key={client.id} value={client.id}>
                                                {client.company_name || client.user?.name || 'Cliente sin nombre'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Proyecto (opcional)</label>
                                    <input
                                        type="text"
                                        value={data.project_id}
                                        onChange={(e) => setData('project_id', e.target.value)}
                                        placeholder="Nombre del proyecto"
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-white">Items</h2>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="text-cyan-400 hover:text-cyan-300 text-sm"
                                >
                                    + Agregar Item
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {items.map((item, index) => (
                                    <div key={index} className="flex gap-4 items-start">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={item.description}
                                                onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                placeholder="Descripción del servicio"
                                                required
                                                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                            />
                                        </div>
                                        <div className="w-24">
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                                                min="1"
                                                required
                                                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-center"
                                            />
                                        </div>
                                        <div className="w-32">
                                            <input
                                                type="number"
                                                value={item.unit_price}
                                                onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                                min="0"
                                                step="0.01"
                                                required
                                                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-right"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            disabled={items.length === 1}
                                            className="text-red-400 hover:text-red-300 p-2 disabled:opacity-50"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-700">
                                <div className="flex justify-end">
                                    <div className="text-right">
                                        <p className="text-slate-400">Subtotal: <span className="text-white">${subtotal.toFixed(2)}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-6">
                            <h2 className="text-lg font-semibold text-white mb-4">Totales</h2>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Tasa de Impuesto (%)</label>
                                    <input
                                        type="number"
                                        value={data.tax_rate}
                                        onChange={(e) => setData('tax_rate', parseFloat(e.target.value) || 0)}
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Descuento ($)</label>
                                    <input
                                        type="number"
                                        value={data.discount}
                                        onChange={(e) => setData('discount', parseFloat(e.target.value) || 0)}
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Válido hasta</label>
                                    <input
                                        type="date"
                                        value={data.valid_until}
                                        onChange={(e) => setData('valid_until', e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-700 flex justify-end">
                                <div className="text-right">
                                    <p className="text-slate-400">Impuesto: <span className="text-white">${taxAmount.toFixed(2)}</span></p>
                                    <p className="text-xl font-bold text-white mt-2">Total: ${total.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 mb-6">
                            <h2 className="text-lg font-semibold text-white mb-4">Notas y Términos</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Notas</label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={4}
                                        placeholder="Notas adicionales..."
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Términos y Condiciones</label>
                                    <textarea
                                        value={data.terms}
                                        onChange={(e) => setData('terms', e.target.value)}
                                        rows={4}
                                        placeholder="Términos de pago, validez, etc."
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <a
                                href="/quotes"
                                className="flex-1 px-6 py-3 bg-slate-800 text-white text-center rounded-lg hover:bg-slate-700"
                            >
                                Cancelar
                            </a>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                            >
                                {processing ? 'Guardando...' : 'Crear Cotización'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
