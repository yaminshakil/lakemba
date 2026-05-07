<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeesSettings extends Model
{
    protected $table = 'fees_settings';

    protected $fillable = [
        'bulk_billing_available',
        'bulk_billing_details',
        'bulk_billing_eligibility',
        'fee_schedule',
        'payment_methods',
        'cancellation_policy',
        'after_hours_info',
        'health_fund_info',
        'medicare_info',
        'additional_sections',
    ];

    protected $casts = [
        'bulk_billing_available'  => 'boolean',
        'bulk_billing_eligibility' => 'array',
        'fee_schedule'            => 'array',
        'payment_methods'         => 'array',
        'additional_sections'     => 'array',
    ];
}
