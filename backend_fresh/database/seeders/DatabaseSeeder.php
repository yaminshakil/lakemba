<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Doctor;
use App\Models\Service;
use App\Models\Testimonial;
use App\Models\BlogPost;
use App\Models\Faq;
use App\Models\Gallery;
use App\Models\Setting;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Admin User ───────────────────────────────────────────────────────────
        User::updateOrCreate(
            ['email' => 'admin@lakembagmp.com.au'],
            [
                'name'     => 'Admin User',
                'password' => Hash::make('admin123'),
                'email_verified_at' => now(),
            ]
        );

        // ── Doctors ──────────────────────────────────────────────────────────────
        $doctors = [
            [
                'name'             => 'Dr. Sarah Ahmed',
                'slug'             => 'sarah-ahmed',
                'qualifications'   => 'MBBS, FRACGP',
                'specialty'        => "General Practice & Women's Health",
                'experience_years' => 12,
                'biography'        => "Dr. Sarah Ahmed is a dedicated GP with over 12 years of experience in general practice and women's health. She completed her medical degree at UNSW and subsequently achieved fellowship with the Royal Australian College of General Practitioners. Dr. Ahmed is passionate about preventive health and empowering patients to take an active role in their own wellbeing. She speaks English and Arabic fluently.",
                'languages'        => ['English', 'Arabic'],
                'available_days'   => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                'is_featured'      => true,
                'order'            => 1,
            ],
            [
                'name'             => 'Dr. Michael Chen',
                'slug'             => 'michael-chen',
                'qualifications'   => 'MBBS, DCH, FRACGP',
                'specialty'        => 'Paediatrics & Chronic Disease',
                'experience_years' => 9,
                'biography'        => 'Dr. Michael Chen has a particular interest in paediatric care and chronic disease management. He has a Diploma in Child Health and works closely with families to provide comprehensive care for children from birth through adolescence. He also manages complex chronic conditions including diabetes and cardiovascular disease.',
                'languages'        => ['English', 'Mandarin', 'Cantonese'],
                'available_days'   => ['Monday', 'Tuesday', 'Thursday', 'Friday'],
                'is_featured'      => true,
                'order'            => 2,
            ],
            [
                'name'             => 'Dr. Fatima Al-Hassan',
                'slug'             => 'fatima-al-hassan',
                'qualifications'   => 'MBBS, FRACGP, Dip RACOG',
                'specialty'        => 'Mental Health & Preventive Care',
                'experience_years' => 8,
                'biography'        => "Dr. Fatima Al-Hassan has a special interest in mental health and women's reproductive health. She completed additional training through the Royal Australian College of Obstetrics and Gynaecology. Dr. Al-Hassan provides compassionate, culturally sensitive care and is experienced in developing mental health care plans for patients dealing with anxiety, depression, and other conditions.",
                'languages'        => ['English', 'Arabic', 'French'],
                'available_days'   => ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
                'is_featured'      => true,
                'order'            => 3,
            ],
            [
                'name'             => 'Dr. James Nguyen',
                'slug'             => 'james-nguyen',
                'qualifications'   => 'MBBS, FRACGP',
                'specialty'        => 'Aged Care & Diabetes Management',
                'experience_years' => 15,
                'biography'        => 'With over 15 years of experience, Dr. James Nguyen is one of our most senior practitioners. He has extensive experience in aged care and diabetes management, and works closely with endocrinologists and aged care teams to provide comprehensive, coordinated care for his patients.',
                'languages'        => ['English', 'Vietnamese'],
                'available_days'   => ['Monday', 'Wednesday', 'Friday'],
                'is_featured'      => true,
                'order'            => 4,
            ],
            [
                'name'             => 'Dr. Priya Sharma',
                'slug'             => 'priya-sharma',
                'qualifications'   => 'MBBS, FRACGP',
                'specialty'        => 'Skin Health & Travel Medicine',
                'experience_years' => 7,
                'biography'        => 'Dr. Priya Sharma has developed expertise in skin health and travel medicine. She provides thorough skin cancer checks, manages common dermatological conditions, and offers comprehensive pre-travel health advice and vaccinations for patients travelling internationally.',
                'languages'        => ['English', 'Hindi', 'Punjabi'],
                'available_days'   => ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
                'is_featured'      => false,
                'order'            => 5,
            ],
        ];

        foreach ($doctors as $doctor) {
            Doctor::updateOrCreate(['slug' => $doctor['slug']], $doctor);
        }

        // ── Services ─────────────────────────────────────────────────────────────
        $services = [
            ['title' => 'General Practice',           'slug' => 'general-practice',     'icon' => 'stethoscope', 'description' => 'Comprehensive primary care for all ages — from routine check-ups to acute illness management.',                'is_featured' => true,  'order' => 1],
            ['title' => 'Preventive Health Checks',   'slug' => 'preventive',           'icon' => 'shield',      'description' => 'Proactive screenings, vaccinations, and lifestyle advice to keep you healthy long-term.',                   'is_featured' => true,  'order' => 2],
            ['title' => 'Mental Health Care',         'slug' => 'mental-health',        'icon' => 'brain',       'description' => 'Compassionate support for anxiety, depression, stress, and other mental health conditions.',                 'is_featured' => true,  'order' => 3],
            ['title' => 'Chronic Disease Management', 'slug' => 'chronic-disease',      'icon' => 'activity',    'description' => 'Personalised care plans for diabetes, hypertension, asthma, and other long-term conditions.',              'is_featured' => true,  'order' => 4],
            ['title' => "Women's Health",             'slug' => 'womens-health',        'icon' => 'heart',       'description' => "Pap smears, contraception, pregnancy, menopause, and holistic women's healthcare.",                        'is_featured' => true,  'order' => 5],
            ["title" => "Children's Health",          'slug' => 'childrens-health',     'icon' => 'baby',        'description' => 'Paediatric care including immunisations, developmental checks, and school assessments.',                   'is_featured' => true,  'order' => 6],
            ['title' => 'Travel Medicine',            'slug' => 'travel-medicine',      'icon' => 'zap',         'description' => 'Pre-travel health advice, vaccinations, and health certificates for international travellers.',             'is_featured' => false, 'order' => 7],
            ['title' => 'Skin Health',                'slug' => 'skin-health',          'icon' => 'eye',         'description' => 'Skin cancer checks, mole assessment, acne management, and minor dermatological procedures.',               'is_featured' => false, 'order' => 8],
            ['title' => 'Minor Procedures',           'slug' => 'minor-procedures',     'icon' => 'syringe',     'description' => 'In-clinic procedures including wound care, suturing, skin lesion removal, and joint injections.',          'is_featured' => false, 'order' => 9],
            ['title' => 'Pathology & Tests',          'slug' => 'pathology',            'icon' => 'microscope',  'description' => 'Blood tests, ECGs, spirometry, and referrals for specialist investigations and imaging.',                  'is_featured' => false, 'order' => 10],
        ];

        foreach ($services as $service) {
            Service::updateOrCreate(['slug' => $service['slug']], $service);
        }

        // ── Testimonials ─────────────────────────────────────────────────────────
        $testimonials = [
            ['patient_name' => 'Fatima K.',  'rating' => 5, 'review' => 'Exceptional care from the entire team. Dr. Ahmed took the time to really listen to my concerns and explain everything clearly. The bulk billing is a huge help for our family.', 'service' => 'General Practice',           'date' => '2024-05-15', 'is_featured' => true],
            ['patient_name' => 'David T.',   'rating' => 5, 'review' => "I've been coming here for years and the quality of care has always been outstanding. The staff are incredibly friendly and I never feel rushed during my consultations.",        'service' => 'Chronic Disease Management', 'date' => '2024-04-20', 'is_featured' => true],
            ['patient_name' => 'Aisha M.',   'rating' => 5, 'review' => 'As a new patient, I was made to feel so welcome. Being able to speak Arabic with my doctor made a huge difference. Highly recommend this clinic.',                             'service' => "Women's Health",             'date' => '2024-03-10', 'is_featured' => true],
            ['patient_name' => 'Michael C.', 'rating' => 5, 'review' => "Same day appointment for my sick child – the staff were compassionate and efficient. Dr. Chen was wonderful with my son. This is exactly the kind of local GP you want.",    'service' => "Children's Health",         'date' => '2024-06-01', 'is_featured' => true],
            ['patient_name' => 'Sarah L.',   'rating' => 5, 'review' => "The mental health support I've received here has been life-changing. My GP referred me to a psychologist through a care plan and followed up regularly. Truly holistic care.", 'service' => 'Mental Health',             'date' => '2024-05-28', 'is_featured' => true],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::create($testimonial);
        }

        // ── FAQs ─────────────────────────────────────────────────────────────────
        $faqs = [
            ['question' => 'Do you offer bulk billing?',                       'answer' => 'Yes. Bulk billing is available for eligible Medicare patients including concession card holders, children under 16, and patients over 65.', 'category' => 'Billing',      'order' => 1],
            ['question' => 'How do I book an appointment?',                    'answer' => 'You can book online 24/7 via HealthEngine, call us at (02) 9759 1234 during business hours, or walk in. Same-day appointments often available.', 'category' => 'Appointments', 'order' => 2],
            ['question' => 'What should I bring to my first appointment?',     'answer' => 'Please bring your Medicare card, any concession cards, a list of current medications, referral letters, and previous test results.',        'category' => 'Appointments', 'order' => 3],
            ['question' => 'Do you speak languages other than English?',       'answer' => 'Yes! Our team speaks Arabic, Mandarin, Cantonese, Vietnamese, and French. We can arrange interpreters for other languages.',              'category' => 'General',      'order' => 4],
            ['question' => 'What happens if I need care after hours?',         'answer' => 'For non-emergencies after hours, call 13 SICK (13 7425). For life-threatening emergencies, call 000 immediately.',                        'category' => 'General',      'order' => 5],
            ['question' => 'Can I get a referral to a specialist?',           'answer' => 'Yes. Our GPs provide referrals to specialists. A valid referral entitles you to a Medicare rebate on specialist fees.',                    'category' => 'Services',     'order' => 6],
            ['question' => 'Do you offer telehealth consultations?',           'answer' => 'Yes, telehealth appointments are available for eligible conditions. Please call to check if your concern is suitable.',                   'category' => 'Appointments', 'order' => 7],
            ['question' => 'How do I get my test results?',                   'answer' => 'We will contact you when results are ready. For urgent results we call directly. Allow 2-5 business days for standard results.',           'category' => 'Services',     'order' => 8],
        ];

        foreach ($faqs as $faq) {
            Faq::create($faq);
        }

        // ── Settings ─────────────────────────────────────────────────────────────
        $settings = [
            ['key' => 'phone_primary',    'value' => '(02) 9759 1234',                 'group' => 'contact'],
            ['key' => 'phone_secondary',  'value' => '(02) 9759 1235',                 'group' => 'contact'],
            ['key' => 'email_primary',    'value' => 'info@lakembagmp.com.au',         'group' => 'contact'],
            ['key' => 'address',          'value' => '123 Lakemba Street',             'group' => 'contact'],
            ['key' => 'suburb',           'value' => 'Lakemba',                        'group' => 'contact'],
            ['key' => 'state',            'value' => 'NSW',                            'group' => 'contact'],
            ['key' => 'postcode',         'value' => '2195',                           'group' => 'contact'],
            ['key' => 'hours_mon_fri',    'value' => '8:30am – 6:00pm',               'group' => 'hours'],
            ['key' => 'hours_sat',        'value' => '9:00am – 1:00pm',               'group' => 'hours'],
            ['key' => 'hours_sun',        'value' => 'Closed',                         'group' => 'hours'],
            ['key' => 'seo_home_title',   'value' => 'Lakemba General Medical Practice | Your Local GP', 'group' => 'seo'],
            ['key' => 'seo_home_description','value' => 'Quality, compassionate GP care in Lakemba NSW. Bulk billing available. Book online with HealthEngine.', 'group' => 'seo'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }

        $this->command->info('Database seeded successfully!');
        $this->command->info('Admin login: admin@lakembagmp.com.au / admin123');
    }
}
