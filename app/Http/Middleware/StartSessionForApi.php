<?php

namespace App\Http\Middleware;

use Illuminate\Session\Middleware\StartSession;

class StartSessionForApi extends StartSession
{
    /**
     * Determine if the session middleware should be excluded for the given request.
     */
    protected function shouldExclude($request): bool
    {
        // Ne pas exclure les routes API de la session
        return false;
    }
}

