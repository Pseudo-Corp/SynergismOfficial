import { http, type HttpHandler, HttpResponse } from 'msw'

export const paymentHandlers: HttpHandler[] = [
  http.get(/https:\/\/synergism.cc\/stripe(?:\/test)\/products/, async () => {
    return HttpResponse.json([
      {
        'id': 'omega-monthly-sub',
        'name': 'Tier 4 Subscription - The Omega Baller',
        'description': '+2,000 PseudoCoins per month and +14% Quarks as a personal bonus!',
        'price': 2000,
        'coins': 2000,
        'tier': 4,
        'subscription': true,
        'quarkBonus': 2,
        'features': [
          '+2,000 PseudoCoins / month',
          '+14% Personal Quark Bonus',
          '+2% to the Global Quark Bonus',
          '+9 Save Slots (10 total)'
        ]
      },
      {
        'id': 'ascended-monthly-sub',
        'name': 'Tier 3 Subscription - The Ascended Baller',
        'description': '+1,000 PseudoCoins per month and +9% Quarks as a personal bonus!',
        'price': 1000,
        'coins': 1000,
        'tier': 3,
        'subscription': true,
        'quarkBonus': 1,
        'features': [
          '+1,000 PseudoCoins / month',
          '+9% Personal Quark Bonus',
          '+1% to the Global Quark Bonus',
          '+6 Save Slots (7 total)'
        ]
      },
      {
        'id': 'reincarnated-monthly-sub',
        'name': 'Tier 2 Subscription - The Reincarnated Baller',
        'description': '+600 PseudoCoins / month and +5% Quarks as a personal bonus!',
        'price': 600,
        'coins': 600,
        'tier': 2,
        'subscription': true,
        'quarkBonus': 0.6,
        'features': [
          '+600 PseudoCoins / month',
          '+5% Personal Quark Bonus',
          '+0.6% to the Global Quark Bonus',
          '+3 Save Slots (4 total)'
        ]
      },
      {
        'id': 'transcended-monthly-sub',
        'name': 'Tier 1 Subscription - The Transcended Baller',
        'description': 'Gain +300 PseudoCoins / month, and +2% Quarks as a personal bonus.',
        'price': 300,
        'coins': 300,
        'tier': 1,
        'subscription': true,
        'quarkBonus': 0.3,
        'features': [
          '+300 PseudoCoins / month',
          '+2% Personal Quark Bonus',
          '+0.3% to the Global Quark Bonus',
          '+1 Save Slot (2 total)'
        ]
      },
      {
        'id': 'magic-pot-pseudocoins',
        'name': 'Magic Pot of PseudoCoins',
        'description': '12,000 PseudoCoins [2,000 free!]',
        'price': 10000,
        'coins': 12000,
        'subscription': false,
        'features': []
      },
      {
        'id': 'jug-pseudocoins',
        'name': 'Jug of PseudoCoins',
        'description': '5,750 PseudoCoins (750 free!)',
        'price': 5000,
        'coins': 5750,
        'subscription': false,
        'features': []
      },
      {
        'id': 'jar-pseudocoins',
        'name': 'Jar of PseudoCoins',
        'description': '2,200 PseudoCoins (200 free!)',
        'price': 2000,
        'coins': 2200,
        'subscription': false,
        'features': []
      },
      {
        'id': 'piggy-bank-pseudocoins',
        'name': 'Piggy Bank of PseudoCoins',
        'description': '1050 PseudoCoins (50 Free!)',
        'price': 1000,
        'coins': 1050,
        'subscription': false,
        'features': []
      },
      {
        'id': 'roll-pseudocoins',
        'name': 'Roll of PseudoCoins',
        'description': '500 PseudoCoins',
        'price': 500,
        'coins': 500,
        'subscription': false,
        'features': []
      }
    ])
  })
]
