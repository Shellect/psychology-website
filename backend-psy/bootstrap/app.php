<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            Route::middleware('api')
                ->prefix('api/v1')
                ->group(base_path('routes/api.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware) {
        // CORS обрабатывается встроенным middleware Laravel 11
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Подробный вывод ошибок для API (как в ASP.NET Developer Exception Page)
        $exceptions->render(function (\Throwable $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                $statusCode = method_exists($e, 'getStatusCode')
                    ? $e->getStatusCode()
                    : 500;

                $response = [
                    'success' => false,
                    'error' => [
                        'type' => get_class($e),
                        'message' => $e->getMessage(),
                        'code' => $e->getCode(),
                    ],
                    'request' => [
                        'method' => $request->method(),
                        'url' => $request->fullUrl(),
                        'path' => $request->path(),
                    ],
                    'timestamp' => now()->toIso8601String(),
                ];

                // В debug режиме показываем полный stack trace
                if (config('app.debug')) {
                    $response['debug'] = [
                        'file' => $e->getFile(),
                        'line' => $e->getLine(),
                        'trace' => collect($e->getTrace())->take(20)->map(function ($frame) {
                            return [
                                'file' => $frame['file'] ?? null,
                                'line' => $frame['line'] ?? null,
                                'function' => $frame['function'] ?? null,
                                'class' => $frame['class'] ?? null,
                            ];
                        })->toArray(),
                    ];

                    // Если есть предыдущее исключение
                    if ($previous = $e->getPrevious()) {
                        $response['debug']['previous'] = [
                            'type' => get_class($previous),
                            'message' => $previous->getMessage(),
                            'file' => $previous->getFile(),
                            'line' => $previous->getLine(),
                        ];
                    }
                }

                return response()->json($response, $statusCode);
            }
        });

        // Специальная обработка 404 для API
        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'error' => [
                        'type' => 'NotFoundHttpException',
                        'message' => 'Эндпоинт не найден: ' . $request->path(),
                    ],
                    'available_endpoints' => [
                        'GET /api/v1/health' => 'Проверка здоровья API',
                        'GET /api/v1/test' => 'Тестовый эндпоинт',
                        'POST /api/v1/appointments' => 'Создание записи',
                    ],
                ], 404);
            }
        });
    })->create();
