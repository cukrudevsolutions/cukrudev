<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\StaffUser;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class VCardController extends Controller
{
    public function download(string $slug): Response
    {
        $staff = StaffUser::where('slug', $slug)->first();

        if (! $staff || ! $staff->is_active) {
            abort(HttpResponse::HTTP_NOT_FOUND, 'Profile not found.');
        }

        $website = StaffUser::safeUrl($staff->website_url) ?? 'https://cukrudev.com';
        $linkedin = StaffUser::safeUrl($staff->linkedin_url);
        $profileUrl = url('/'.$staff->slug);

        $nl = "\r\n";
        $vcf = 'BEGIN:VCARD'.$nl;
        $vcf .= 'VERSION:3.0'.$nl;
        $vcf .= 'FN:'.$this->escape($staff->full_name).$nl;
        $vcf .= 'N:'.$this->nameParts($staff->full_name).$nl;
        $vcf .= 'ORG:CukruDev Solutions'.$nl;

        if ($staff->position) {
            $vcf .= 'TITLE:'.$this->escape($staff->position).$nl;
        }
        if ($staff->phone) {
            $vcf .= 'TEL;TYPE=CELL:'.$this->escape($staff->phone).$nl;
        }
        if ($staff->whatsapp_number) {
            $vcf .= 'TEL;TYPE=CELL;X-SERVICE=WhatsApp:'.$this->escape(preg_replace('/[^0-9+]/', '', $staff->whatsapp_number)).$nl;
        }

        $vcf .= 'EMAIL;TYPE=WORK:'.$this->escape($staff->email).$nl;
        $vcf .= 'URL:'.$profileUrl.$nl;
        $vcf .= 'URL;TYPE=WORK:'.$website.$nl;
        $vcf .= 'ADR;TYPE=WORK:;;Fakulti Komputeran (FK)\, UMP Kampus Pekan;Pekan;Pahang;26600;Malaysia'.$nl;

        if ($linkedin) {
            $vcf .= 'X-SOCIALPROFILE;TYPE=linkedin:'.$linkedin.$nl;
        }

        if ($staff->profile_image && Storage::disk('public')->exists('staff/'.$staff->profile_image)) {
            $binary = Storage::disk('public')->get('staff/'.$staff->profile_image);
            $ext = strtolower(pathinfo($staff->profile_image, PATHINFO_EXTENSION));
            $imgType = ['jpg' => 'JPEG', 'jpeg' => 'JPEG', 'png' => 'PNG', 'webp' => 'JPEG'][$ext] ?? 'JPEG';
            $vcf .= 'PHOTO;ENCODING=BASE64;TYPE='.$imgType.':'.base64_encode($binary).$nl.' '.$nl;
        }

        $vcf .= 'END:VCARD'.$nl;

        $filename = preg_replace('/[^a-z0-9_-]/i', '_', $staff->full_name).'.vcf';

        return response($vcf, HttpResponse::HTTP_OK, [
            'Content-Type' => 'text/vcard; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
        ]);
    }

    private function escape(string $value): string
    {
        return str_replace([',', ';', '\\', "\n"], ['\\,', '\\;', '\\\\', '\\n'], $value);
    }

    private function nameParts(string $fullName): string
    {
        $parts = explode(' ', trim($fullName), 2);
        $first = $this->escape($parts[0] ?? '');
        $last = $this->escape($parts[1] ?? '');

        return $last.';'.$first.';;;';
    }
}
