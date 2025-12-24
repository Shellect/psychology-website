<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class HealthController extends Controller
{
    public function index(): JsonResponse
    {
        $status = [
            'status' => 'healthy',
            'service' => 'Psychologist API',
            'version' => '1.0.0',
            'timestamp' => now()->toDateTimeString(),
            'environment' => app()->environment(),
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'timezone' => config('app.timezone'),
            'debug_mode' => config('app.debug')
        ];

        try {
            DB::connection()->getPdo();
            $status['database'] = [
                'connected' => true,
                'name' => DB::connection()->getDatabaseName(),
                'driver' => DB::connection()->getDriverName()
            ];
        } catch (\Exception $e) {
            $status['database'] = [
                'connected' => false,
                'error' => $e->getMessage()
            ];
        }

        if (extension_loaded('redis')) {
            $status['redis'] = [
                'available' => true,
                'extension' => 'installed'
            ];
        } else {
            $status['redis'] = [
                'available' => false,
                'extension' => 'not_installed'
            ];
        }

        return response()->json($status);
    }
}
