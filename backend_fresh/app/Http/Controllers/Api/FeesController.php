<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FeesSettings;
use Illuminate\Http\Request;

class FeesController extends Controller
{
    public function show()
    {
        $settings = FeesSettings::first();

        if (!$settings) {
            return response()->json(['data' => $this->defaults()]);
        }

        return response()->json(['data' => $settings]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'bulk_billing_available'          => 'boolean',
            'bulk_billing_details'            => 'nullable|string',
            'bulk_billing_eligibility'        => 'nullable|array',
            'bulk_billing_eligibility.*'      => 'string',
            'fee_schedule'                    => 'nullable|array',
            'fee_schedule.*.service'          => 'required|string',
            'fee_schedule.*.fee'              => 'required|string',
            'fee_schedule.*.concession_fee'   => 'nullable|string',
            'fee_schedule.*.notes'            => 'nullable|string',
            'payment_methods'                 => 'nullable|array',
            'payment_methods.*'               => 'string',
            'cancellation_policy'             => 'nullable|string',
            'after_hours_info'                => 'nullable|string',
            'health_fund_info'                => 'nullable|string',
            'medicare_info'                   => 'nullable|string',
            'additional_sections'             => 'nullable|array',
            'additional_sections.*.title'     => 'required|string',
            'additional_sections.*.content'   => 'required|string',
        ]);

        $settings = FeesSettings::updateOrCreate(['id' => 1], $validated);

        return response()->json(['data' => $settings]);
    }

    private function defaults(): array
    {
        return [
            'bulk_billing_available' => true,
            'bulk_billing_details'   => 'We offer bulk billing for eligible patients. Please ask our reception staff if you qualify.',
            'bulk_billing_eligibility' => [
                'Commonwealth Health Care Card holders',
                'Pensioner Concession Card holders',
                'Children under 16 years of age',
                'Patients referred for specific bulk billed services',
            ],
            'fee_schedule' => [
                ['service' => 'Standard Consultation (< 20 mins)', 'fee' => '$80.00',  'concession_fee' => 'Bulk Billed', 'notes' => 'Medicare rebate applicable'],
                ['service' => 'Long Consultation (20–40 mins)',    'fee' => '$120.00', 'concession_fee' => 'Bulk Billed', 'notes' => 'Medicare rebate applicable'],
                ['service' => 'Extended Consultation (> 40 mins)', 'fee' => '$160.00', 'concession_fee' => 'Bulk Billed', 'notes' => 'Medicare rebate applicable'],
                ['service' => 'Procedure / Minor Surgery',         'fee' => 'On request', 'concession_fee' => '',        'notes' => 'Quoted at time of booking'],
            ],
            'payment_methods'    => ['Cash', 'EFTPOS', 'Visa', 'Mastercard', 'Cheque'],
            'cancellation_policy' => 'We require at least 2 hours notice for appointment cancellations. Failure to provide adequate notice or missed appointments may incur a cancellation fee of $30.',
            'after_hours_info'   => "For urgent medical concerns outside clinic hours, please call 13SICK (137 425) for after-hours GP services, or visit your nearest emergency department. In a life-threatening emergency, always call 000.",
            'health_fund_info'   => 'We accept all major private health funds and process rebates on the spot via HICAPS. Please bring your health fund card to each appointment.',
            'medicare_info'      => 'We process Medicare rebates on the spot for all eligible consultations. Please ensure your Medicare details are up to date. Bring your Medicare card to every visit.',
            'additional_sections' => [],
        ];
    }
}
