'use client'
import { useState, useEffect } from 'react'
import { getSettings } from '@/lib/api'

export interface ContactSettings {
  phonePrimary:   string
  phoneSecondary: string
  emailPrimary:   string
  address:        string
  suburb:         string
  state:          string
  hoursMF:        string
  hoursSat:       string
  hoursSun:       string
  facebookUrl:    string
  instagramUrl:   string
  twitterUrl:     string
}

const DEFAULTS: ContactSettings = {
  phonePrimary:   '02 7265 1000',
  phoneSecondary: '',
  emailPrimary:   'info@lakembagmp.com.au',
  address:        '21 Haldon St, Lakemba NSW 2195',
  suburb:         'Lakemba',
  state:          'NSW',
  hoursMF:        'Mon–Fri 8:30am–6:00pm',
  hoursSat:       'Sat 9:00am–1:00pm',
  hoursSun:       '',
  facebookUrl:    '',
  instagramUrl:   '',
  twitterUrl:     '',
}

export function useContactSettings(): ContactSettings {
  const [settings, setSettings] = useState<ContactSettings>(DEFAULTS)

  useEffect(() => {
    getSettings()
      .then(res => {
        const s = ((res as any)?.data ?? res ?? {}) as Record<string, string>
        const suburb   = s.suburb   || 'Lakemba'
        const state    = s.state    || 'NSW'
        const postcode = s.postcode || '2195'
        const street   = s.address  || '21 Haldon St'
        setSettings({
          phonePrimary:   s.phone_primary   || DEFAULTS.phonePrimary,
          phoneSecondary: s.phone_secondary || DEFAULTS.phoneSecondary,
          emailPrimary:   s.email_primary   || DEFAULTS.emailPrimary,
          address:        `${street}, ${suburb} ${state} ${postcode}`,
          suburb,
          state,
          hoursMF:      s.hours_mon_fri  || DEFAULTS.hoursMF,
          hoursSat:     s.hours_sat      || DEFAULTS.hoursSat,
          hoursSun:     s.hours_sun      || DEFAULTS.hoursSun,
          facebookUrl:  s.facebook_url   || '',
          instagramUrl: s.instagram_url  || '',
          twitterUrl:   s.twitter_url    || '',
        })
      })
      .catch(() => {})
  }, [])

  return settings
}
