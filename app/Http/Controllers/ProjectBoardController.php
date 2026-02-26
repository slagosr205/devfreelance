<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Project;
use App\Models\ProjectStage;
use App\Models\ProjectTask;
use Illuminate\Http\Request;

class ProjectBoardController extends Controller
{
    public function index(Request $request)
    {
        $projects = Project::with(['client', 'stages', 'tasks'])
            ->when($request->client_id, fn ($q, $id) => $q->where('client_id', $id))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->orderByDesc('created_at')
            ->paginate(15);

        return inertia('Projects/Index', [
            'projects' => $projects,
        ]);
    }

    public function show(Project $project)
    {
        $project->load(['client', 'stages.tasks.assignee', 'stages.tasks.creator', 'activities.user']);

        return inertia('Projects/Board', [
            'project' => $project,
        ]);
    }

    public function createStage(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:7',
            'is_default' => 'nullable|boolean',
            'is_final' => 'nullable|boolean',
        ]);

        $order = $project->stages()->max('order') + 1;

        if (! empty($validated['is_final'])) {
            ProjectStage::where('project_id', $project->id)->update(['is_final' => false]);
        }

        $stage = ProjectStage::create([
            'project_id' => $project->id,
            'name' => $validated['name'],
            'color' => $validated['color'] ?? '#6b7280',
            'order' => $order,
            'is_default' => $validated['is_default'] ?? false,
            'is_final' => $validated['is_final'] ?? false,
        ]);

        Activity::log("Etapa '{$stage->name}' creada en proyecto {$project->name}", $project->id);

        return back()->with('success', 'Etapa creada');
    }

    public function updateStage(Request $request, ProjectStage $stage)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:7',
        ]);

        $stage->update($validated);

        Activity::log("Etapa '{$stage->name}' actualizada", $stage->project_id);

        return back()->with('success', 'Etapa actualizada');
    }

    public function destroyStage(ProjectStage $stage)
    {
        if ($stage->tasks()->count() > 0) {
            return back()->with('error', 'No se puede eliminar una etapa con tareas');
        }

        $stageName = $stage->name;
        $projectId = $stage->project_id;
        $stage->delete();

        Activity::log("Etapa '{$stageName}' eliminada", $projectId);

        return back()->with('success', 'Etapa eliminada');
    }

    public function createTask(Request $request, Project $project)
    {
        $validated = $request->validate([
            'stage_id' => 'required|exists:project_stages,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'estimated_hours' => 'nullable|integer|min:0',
            'due_date' => 'nullable|date',
        ]);

        $stage = ProjectStage::find($validated['stage_id']);
        $order = $stage->tasks()->max('order') + 1;

        $task = ProjectTask::create([
            'project_id' => $project->id,
            'stage_id' => $validated['stage_id'],
            'created_by' => auth()->id(),
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'assigned_to' => $validated['assigned_to'] ?? null,
            'priority' => $validated['priority'] ?? 'medium',
            'order' => $order,
            'estimated_hours' => $validated['estimated_hours'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'status' => 'todo',
        ]);

        Activity::log("Tarea '{$task->title}' creada", $project->id, [
            'task_id' => $task->id,
            'stage' => $stage->name,
        ]);

        return back()->with('success', 'Tarea creada');
    }

    public function updateTask(Request $request, ProjectTask $task)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'assigned_to' => 'nullable|exists:users,id',
            'priority' => 'sometimes|in:low,medium,high,urgent',
            'status' => 'sometimes|in:todo,in_progress,review,done,blocked',
            'estimated_hours' => 'nullable|integer|min:0',
            'actual_hours' => 'nullable|integer|min:0',
            'due_date' => 'nullable|date',
        ]);

        $oldStatus = $task->status;
        $task->update($validated);

        if (isset($validated['status']) && $validated['status'] === 'done' && $oldStatus !== 'done') {
            $task->update(['completed_at' => now()]);
        }

        Activity::log("Tarea '{$task->title}' actualizada", $task->project_id, [
            'task_id' => $task->id,
            'changes' => array_keys($validated),
        ]);

        return back()->with('success', 'Tarea actualizada');
    }

    public function moveTask(Request $request, ProjectTask $task)
    {
        $validated = $request->validate([
            'stage_id' => 'required|exists:project_stages,id',
            'order' => 'required|integer|min:0',
        ]);

        $oldStage = $task->stage->name;

        $task->update([
            'stage_id' => $validated['stage_id'],
            'order' => $validated['order'],
        ]);

        $newStage = $task->fresh()->stage->name;

        Activity::log("Tarea '{$task->title}' movida de {$oldStage} a {$newStage}", $task->project_id);

        return back()->with('success', 'Tarea movida');
    }

    public function destroyTask(ProjectTask $task)
    {
        $taskTitle = $task->title;
        $projectId = $task->project_id;
        $task->delete();

        Activity::log("Tarea '{$taskTitle}' eliminada", $projectId);

        return back()->with('success', 'Tarea eliminada');
    }

    public function reorderStages(Request $request, Project $project)
    {
        $validated = $request->validate([
            'stages' => 'required|array',
            'stages.*.id' => 'required|exists:project_stages,id',
            'stages.*.order' => 'required|integer|min:0',
        ]);

        foreach ($validated['stages'] as $stageData) {
            ProjectStage::where('id', $stageData['id'])->update(['order' => $stageData['order']]);
        }

        return back()->with('success', 'Etapas reordenadas');
    }

    public function reorderTasks(Request $request, ProjectStage $stage)
    {
        $validated = $request->validate([
            'tasks' => 'required|array',
            'tasks.*.id' => 'required|exists:project_tasks,id',
            'tasks.*.order' => 'required|integer|min:0',
        ]);

        foreach ($validated['tasks'] as $taskData) {
            ProjectTask::where('id', $taskData['id'])->update(['order' => $taskData['order']]);
        }

        return back()->with('success', 'Tareas reordenadas');
    }

    public function generateInvoice(Project $project)
    {
        $quote = $project->quotes()->where('status', 'accepted')->latest()->first();

        if (! $quote) {
            return back()->with('error', 'No hay cotización aceptada para este proyecto');
        }

        $invoice = Invoice::create([
            'client_id' => $project->client_id,
            'project_id' => $project->id,
            'quote_id' => $quote->id,
            'invoice_number' => Invoice::generateInvoiceNumber(),
            'status' => 'pending',
            'subtotal' => $quote->subtotal,
            'tax_rate' => $quote->tax_rate,
            'tax_amount' => $quote->tax_amount,
            'discount' => $quote->discount,
            'total' => $quote->total,
            'paid_amount' => 0,
            'due_amount' => $quote->total,
            'issue_date' => now(),
            'due_date' => now()->addDays(30),
            'created_by' => auth()->id(),
        ]);

        foreach ($quote->items as $quoteItem) {
            InvoiceItem::create([
                'invoice_id' => $invoice->id,
                'description' => $quoteItem->description,
                'quantity' => $quoteItem->quantity,
                'unit_price' => $quoteItem->unit_price,
                'subtotal' => $quoteItem->subtotal,
                'order' => $quoteItem->order,
            ]);
        }

        Activity::log("Factura {$invoice->invoice_number} generada desde cotización {$quote->quote_number}", $project->id, [
            'invoice_id' => $invoice->id,
        ]);

        return redirect()->route('invoices.show', $invoice->id)->with('success', 'Factura generada correctamente');
    }
}
