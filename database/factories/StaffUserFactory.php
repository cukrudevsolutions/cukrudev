<?php

namespace Database\Factories;

use App\Models\StaffUser;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends Factory<StaffUser>
 */
class StaffUserFactory extends Factory
{
    protected static ?string $password;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'full_name' => fake()->name(),
            'slug' => fake()->unique()->slug(2),
            'email' => fake()->unique()->safeEmail(),
            'password_hash' => static::$password ??= Hash::make('password'),
            'position' => fake()->jobTitle(),
            'availability_status' => 'available',
            'is_admin' => false,
            'is_active' => true,
        ];
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_admin' => true,
        ]);
    }
}
