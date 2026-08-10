<?php

namespace Tests\Feature;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_projects_can_be_listed(): void
    {
        Project::factory()->count(2)->create();

        $response = $this->getJson('/api/projects');

        $response->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_single_project_can_be_retrieved(): void
    {
        $project = Project::factory()->create();

        $response = $this->getJson('/api/projects/' . $project->id);

        $response->assertOk()
            ->assertJsonPath('data.id', $project->id)
            ->assertJsonPath('data.client_name', $project->client_name);
    }

    public function test_project_can_be_created(): void
    {
        $payload = [
            'client_name' => 'Acme Studio',
            'project_name' => 'Brand Refresh',
            'description' => 'Update the visual identity and landing page.',
            'status' => 'In Progress',
            'priority' => 'High',
            'start_date' => '2026-08-01',
            'due_date' => '2026-08-20',
        ];

        $response = $this->postJson('/api/projects', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('data.client_name', 'Acme Studio')
            ->assertJsonPath('data.project_name', 'Brand Refresh');

        $this->assertDatabaseHas('projects', [
            'client_name' => 'Acme Studio',
            'project_name' => 'Brand Refresh',
        ]);
    }

    public function test_project_requires_valid_due_date(): void
    {
        $payload = [
            'client_name' => 'Acme Studio',
            'project_name' => 'Brand Refresh',
            'status' => 'Planning',
            'priority' => 'Medium',
            'start_date' => '2026-08-20',
            'due_date' => '2026-08-10',
        ];

        $response = $this->postJson('/api/projects', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['due_date']);
    }

    public function test_project_can_be_updated(): void
    {
        $project = Project::factory()->create();

        $payload = [
            'client_name' => 'Updated Client',
            'project_name' => 'Updated Project',
            'description' => 'Updated description',
            'status' => 'Completed',
            'priority' => 'Low',
            'start_date' => '2026-01-01',
            'due_date' => '2026-01-15',
        ];

        $response = $this->putJson('/api/projects/' . $project->id, $payload);

        $response->assertOk()
            ->assertJsonPath('data.client_name', 'Updated Client')
            ->assertJsonPath('data.status', 'Completed');
    }

    public function test_project_can_be_deleted(): void
    {
        $project = Project::factory()->create();

        $response = $this->deleteJson('/api/projects/' . $project->id);

        $response->assertNoContent();
        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }
}
