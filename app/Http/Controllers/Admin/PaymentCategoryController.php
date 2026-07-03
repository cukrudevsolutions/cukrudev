<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\PaymentCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PaymentCategoryController extends Controller
{
    private const SOURCES = [
        'team_sourced' => 'Team-Sourced',
        'mentor_led' => 'Mentor-Led',
        'middleman' => 'Via Middleman',
        'investor' => 'With Investor',
        'task' => 'Task (No MM)',
        'task_mm' => 'Task (With MM)',
    ];

    public function index(): Response
    {
        $bySource = PaymentCategory::orderBy('sort_order')->orderBy('id')->get()->groupBy('source');

        return Inertia::render('Admin/PaymentCategories/Index', [
            'sources' => self::SOURCES,
            'categoriesBySource' => collect(self::SOURCES)->keys()->mapWithKeys(fn ($src) => [
                $src => ($bySource[$src] ?? collect())->map(fn (PaymentCategory $c) => [
                    'id' => $c->id,
                    'name' => $c->display_name,
                    'color' => $c->color,
                    'pct' => (float) $c->pct,
                    'isVariable' => $c->is_variable,
                    'isCore' => $c->is_core,
                ])->values(),
            ]),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'source' => ['required', 'string', 'in:'.implode(',', array_keys(self::SOURCES))],
            'categories' => ['present', 'array'],
            'categories.*.id' => ['nullable', 'integer'],
            'categories.*.name' => ['required', 'string', 'max:100'],
            'categories.*.color' => ['nullable', 'string', 'max:30'],
            'categories.*.pct' => ['required', 'numeric', 'min:0', 'max:100'],
            'categories.*.is_variable' => ['boolean'],
            'categories.*.delete' => ['boolean'],
        ]);

        foreach ($validated['categories'] as $row) {
            if (! empty($row['id'])) {
                $cat = PaymentCategory::find($row['id']);

                if (! $cat || $cat->source !== $validated['source']) {
                    continue;
                }

                if (! empty($row['delete'])) {
                    if (! $cat->is_core) {
                        $cat->delete();
                    }

                    continue;
                }

                $cat->update([
                    'display_name' => trim($row['name']) ?: 'Unnamed',
                    'color' => $row['color'] ?? '#888888',
                    'pct' => max(0, min(100, (float) $row['pct'])),
                    'is_variable' => (bool) ($row['is_variable'] ?? false),
                ]);

                continue;
            }

            if (! empty($row['delete'])) {
                continue;
            }

            $name = trim($row['name']);
            if ($name === '') {
                continue;
            }

            $configKey = Str::slug($name, '_').'_'.substr(md5($name.$validated['source'].microtime()), 0, 4);

            PaymentCategory::create([
                'source' => $validated['source'],
                'display_name' => $name,
                'config_key' => $configKey,
                'color' => $row['color'] ?? '#888888',
                'pct' => max(0, min(100, (float) $row['pct'])),
                'sort_order' => 99,
                'is_core' => false,
                'is_variable' => (bool) ($row['is_variable'] ?? false),
            ]);
        }

        ActivityLog::record($request->user()->id, 'payment_config_updated', 'payments', 'Distribution settings updated');

        return back()->with('success', 'Settings saved.');
    }
}
