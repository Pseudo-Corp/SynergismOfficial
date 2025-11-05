import { http, type HttpHandler, HttpResponse } from 'msw'

export const paymentHandlers: HttpHandler[] = [
  http.get(/https:\/\/synergism.cc\/stripe(?:\/test)\/products/, async () => {
    return HttpResponse.json([
      {
        'id': 'omega-monthly-sub',
        'name': 'The Omega Baller',
        'description': 'The final subscription, giving the best perks available!',
        'price': 2000,
        'coins': 2000,
        'tier': 4,
        'subscription': true,
        'quarkBonus': 2,
        'features': [
          '+2,000 PseudoCoins / month ($20 Value!)',
          '+14% Personal Quark Bonus',
          '+2% to the Global Quark Bonus',
          '+9 Save Slots (10 total)'
        ]
      },
      {
        'id': 'ascended-monthly-sub',
        'name': 'The Ascended Baller',
        'description': 'Enjoy even more Quarks and Save Slots, on top of your monthly PseudoCoins!',
        'price': 1000,
        'coins': 1000,
        'tier': 3,
        'subscription': true,
        'quarkBonus': 1,
        'features': [
          '+1,000 PseudoCoins / month ($10 Value!)',
          '+9% Personal Quark Bonus',
          '+1% to the Global Quark Bonus',
          '+6 Save Slots (7 total)'
        ]
      },
      {
        'id': 'reincarnated-monthly-sub',
        'name': 'The Reincarnated Baller',
        'description': 'Higher tier Subscriptions have stronger additional perks!',
        'price': 600,
        'coins': 600,
        'tier': 2,
        'subscription': true,
        'quarkBonus': 0.6,
        'features': [
          '+600 PseudoCoins / month ($6 Value!)',
          '+5% Personal Quark Bonus',
          '+0.6% to the Global Quark Bonus',
          '+3 Save Slots (4 total)'
        ]
      },
      {
        'id': 'transcended-monthly-sub',
        'name': 'The Transcended Baller',
        'description': 'Subscriptions give PseudoCoins equal to their dollar value, plus additional perks!',
        'price': 300,
        'coins': 300,
        'tier': 1,
        'subscription': true,
        'quarkBonus': 0.3,
        'features': [
          '+300 PseudoCoins / month ($3 Value!)',
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
  }),
  http.post('https://synergism.cc/paypal/orders/create', () => {
    return HttpResponse.json({ error: 'You did not agree to the TOS.' })
  })
]
