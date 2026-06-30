<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ImportLegacyData extends Command
{
    protected $signature = 'cukrudev:import-legacy-data';

    protected $description = 'One-time import of data from the legacy cukrudev_local database into the new schema';

    /**
     * Tables to copy verbatim, in FK-safe dependency order. admin_users and
     * payment_config are deliberately excluded (legacy/dead, per migration plan).
     */
    private const TABLES = [
        'project_types',
        'staff_users',
        'clients',
        'middlemen',
        'project_inquiries',
        'projects',
        'staff_projects',
        'staff_services',
        'project_contributors',
        'tasks',
        'task_offers',
        'payment_categories',
        'project_distributions',
        'payment_stages',
        'payment_distributions',
        'earnings',
        'contribution_points',
        'opportunity_points',
        'activity_logs',
    ];

    public function handle(): int
    {
        $legacy = DB::connection('legacy');
        $staffImages = [];

        DB::transaction(function () use ($legacy, &$staffImages) {
            DB::statement('SET FOREIGN_KEY_CHECKS=0');

            foreach (self::TABLES as $table) {
                $rows = $legacy->table($table)->get()->map(function ($row) use ($table, &$staffImages) {
                    $row = (array) $row;

                    if ($table === 'staff_users') {
                        // The legacy uploads/staff/ folder is empty on disk — profile_image_b64
                        // in the DB is the *only* place these photos actually exist. Capture it
                        // here so we can write real files to Laravel Storage after the transaction,
                        // instead of silently losing every staff photo when we drop this column.
                        if (! empty($row['profile_image_b64']) && ! empty($row['profile_image'])) {
                            $staffImages[$row['profile_image']] = $row['profile_image_b64'];
                        }
                        unset($row['profile_image_b64']);
                    }

                    return $row;
                });

                // delete() (DML) rather than truncate() (DDL) so this stays inside the
                // transaction — TRUNCATE implicitly commits in MySQL and would break rollback.
                DB::table($table)->delete();

                foreach ($rows->chunk(200) as $chunk) {
                    DB::table($table)->insert($chunk->all());
                }

                $this->info(sprintf('%-25s %d rows', $table, $rows->count()));
            }

            DB::statement('SET FOREIGN_KEY_CHECKS=1');
        });

        $this->newLine();
        $this->migrateStaffImages($staffImages);

        $this->newLine();
        $this->info('Import complete.');

        return self::SUCCESS;
    }

    /**
     * @param  array<string, string>  $staffImages  filename => "data:image/...;base64,...."
     */
    private function migrateStaffImages(array $staffImages): void
    {
        $written = 0;

        foreach ($staffImages as $filename => $dataUri) {
            if (! preg_match('/^data:([^;]+);base64,(.+)$/s', $dataUri, $m)) {
                $this->warn("Skipping unrecognized image data for {$filename}");

                continue;
            }

            $binary = base64_decode($m[2], true);

            if ($binary === false) {
                $this->warn("Failed to decode base64 image for {$filename}");

                continue;
            }

            Storage::disk('public')->put('staff/'.$filename, $binary);
            $written++;
        }

        $this->info(sprintf('staff profile images       %d files written to storage/app/public/staff', $written));
    }
}
