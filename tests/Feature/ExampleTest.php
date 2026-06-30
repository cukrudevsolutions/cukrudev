<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_the_landing_page_renders(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page->component('Public/Home'));
    }
}
