<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_unauthenticated_visitors_are_redirected_to_login(): void
    {
        $response = $this->followingRedirects()->get('/');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('Auth/Login'));
    }
}
