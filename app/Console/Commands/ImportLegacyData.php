<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

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

        DB::transaction(function () use ($legacy) {
            DB::statement('SET FOREIGN_KEY_CHECKS=0');

            foreach (self::TABLES as $table) {
                $rows = $legacy->table($table)->get()->map(function ($row) {
                    $row = (array) $row;
                    unset($row['profile_image_b64']);

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
        $this->info('Import complete.');

        return self::SUCCESS;
    }
}
