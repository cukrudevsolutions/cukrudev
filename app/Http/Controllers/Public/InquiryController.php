<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\ProjectInquiry;
use App\Models\ProjectType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'fullName' => ['required', 'string', 'min:3'],
            'email' => ['required', 'email'],
            'phone' => ['required', 'regex:/^\+?[1-9]\d{7,14}$/'],
            'company' => ['required', 'string', 'min:2'],
            'country' => ['required', 'string', 'min:2'],
            'projectType' => ['required', 'string'],
            'message' => ['required', 'string', 'min:15'],
        ], [
            'fullName.min' => 'Please enter your full name.',
            'email.email' => 'Please enter a valid email address.',
            'phone.regex' => 'Please enter a valid phone number with country code.',
            'company.min' => 'Please enter your company or organization.',
            'country.min' => 'Please enter your country or target market.',
            'projectType.required' => 'Please select a project type.',
            'message.min' => 'Please include at least 15 characters.',
        ]);

        $projectTypeId = ProjectType::where('name', $validated['projectType'])->value('id');

        ProjectInquiry::create([
            'full_name' => $validated['fullName'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'company' => $validated['company'],
            'country' => $validated['country'],
            'project_type_id' => $projectTypeId,
            'project_type' => $validated['projectType'],
            'message' => $validated['message'],
            'source' => 'landing_page',
            'ip_address' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 255),
        ]);

        return back()->with('success', 'Inquiry submitted successfully. Our team will contact you shortly.');
    }
}
