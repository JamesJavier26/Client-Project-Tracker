<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'client_name' => ['required', 'string', 'max:255'],
            'project_name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['Planning', 'In Progress', 'On Hold', 'Completed'])],
            'priority' => ['required', Rule::in(['Low', 'Medium', 'High'])],
            'start_date' => ['required', 'date'],
            'due_date' => ['required', 'date', 'after_or_equal:start_date'],
        ];
    }

    public function messages(): array
    {
        return [
            'client_name.required' => 'Client name is required.',
            'project_name.required' => 'Project name is required.',
            'status.in' => 'Status must be one of: Planning, In Progress, On Hold, Completed.',
            'priority.in' => 'Priority must be one of: Low, Medium, High.',
            'due_date.after_or_equal' => 'Due date cannot be earlier than the start date.',
        ];
    }
}
