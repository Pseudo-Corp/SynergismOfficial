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
  }),
  http.post('https://synergism.cc/paypal/orders/create', () => {
    return HttpResponse.json({ error: 'You did not agree to the TOS.' })
  }),
  http.get('https://synergism.cc/merch/products', () => {
    return HttpResponse.json([
      {
        'id': '46411175-be96-46ee-97be-eaaa3e81c7fd',
        'name': 'Synergism Alt Logo Sticker',
        'slug': 'synergism-alt-logo-sticker',
        'description': '',
        'state': {
          'type': 'AVAILABLE'
        },
        'access': {
          'type': 'PUBLIC'
        },
        'images': [
          {
            'id': '9e0555d6-cb35-43a0-9195-c010dfb6349d',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/c5f93a44-97ef-4c39-b403-2adcf7995747.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '9637799c-a585-4e3f-bb18-4bf18e09ff89',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/b8b7a13c-8695-4e78-b498-caa2c898333a.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': 'ef185c55-5e6f-4206-94ef-ecbc52844b11',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/f2535b6a-a297-4fed-be2c-05f24da1655a.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '2f005d4b-c632-4d2a-bac6-c7bdc5ddf29f',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/d2d041d1-469f-4a69-a233-831736a8fd59.webp',
            'width': 1536,
            'height': 2048
          }
        ],
        'variants': [
          {
            'id': '8c7742c6-817b-4eac-8f9b-589d97a9200f',
            'name': 'Synergism Alt Logo Sticker - White, 15″ x 3.75″',
            'sku': '10ZY-0HCV015',
            'unitPrice': {
              'value': 9.99,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'White, 15″ x 3.75″',
              'color': {
                'name': 'White',
                'swatch': '#ffffff'
              },
              'size': {
                'name': '15″ x 3.75″'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 0.6,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': '9e0555d6-cb35-43a0-9195-c010dfb6349d',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/c5f93a44-97ef-4c39-b403-2adcf7995747.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '9637799c-a585-4e3f-bb18-4bf18e09ff89',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/b8b7a13c-8695-4e78-b498-caa2c898333a.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'ef185c55-5e6f-4206-94ef-ecbc52844b11',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/f2535b6a-a297-4fed-be2c-05f24da1655a.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '2f005d4b-c632-4d2a-bac6-c7bdc5ddf29f',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/d2d041d1-469f-4a69-a233-831736a8fd59.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          }
        ],
        'createdAt': '2025-01-10T16:29:42.062062Z',
        'updatedAt': '2025-01-11T01:37:57.854622Z'
      },
      {
        'id': 'e36cbe4d-7715-4ba1-b62e-af2d9c84f4e9',
        'name': 'Synergism Logo T-Shirt',
        'slug': 'synergism-logo-t-shirt',
        'description': '<p>A walking advertisement for the Greatest Idle Clicker Game of all time!</p>',
        'state': {
          'type': 'AVAILABLE'
        },
        'access': {
          'type': 'PUBLIC'
        },
        'images': [
          {
            'id': 'c5dbab47-254b-4a08-b002-e77d2c815bf8',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a1b4632c-c7f7-4624-aff5-1a830210cd18.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '854b6582-2d75-42f1-9f0a-de9c73c7ab0c',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/da5ef5df-32c0-4fd9-96d0-05ccadf77df4.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': 'e399f41e-8067-4e6a-bbb6-be5297e0984f',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/d136d500-7ac6-4932-9b0c-798898c86a97.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '6d6722c4-74d1-4f08-a6c2-249aaf3f538c',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/1cb5c5d5-a1c3-4528-a32b-5bcfea254e4b.jpg',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '94a5ff85-b9d8-4e89-b984-71b0a527b219',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/071e5628-562f-4614-af4b-3fe741a117de.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': 'eca4ad16-a460-4145-b29e-aeb0fc18aa76',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/08e2999d-4778-4eca-8b18-708324eea0cd.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '0c6dc235-3f65-47b2-ba74-bcfcdf10ad8a',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7137fe06-2674-4412-9a77-14c523c32998.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '466ecf90-7539-481c-862d-f27f7cfab04e',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5603202b-bcdd-484c-b916-4c1c0b6e1683.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '7919e6db-a282-45bc-8343-7f0ddce1587e',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/642930e2-d974-4ff0-920c-960382288d4a.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': 'ea8d4bda-5de4-4029-a991-5bc9b94a6368',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5df8a3f8-04cc-4916-a83f-e5f9e39c052a.webp',
            'width': 1536,
            'height': 2048
          }
        ],
        'variants': [
          {
            'id': '39df4bc2-d17f-415a-9d8f-bab6919116dd',
            'name': 'Synergism Logo T-Shirt - Black, XS',
            'sku': '1ZB9-K0V20XS',
            'unitPrice': {
              'value': 22,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, XS',
              'color': {
                'name': 'Black',
                'swatch': '#2d2c2d'
              },
              'size': {
                'name': 'XS'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 3.6,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': 'c5dbab47-254b-4a08-b002-e77d2c815bf8',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a1b4632c-c7f7-4624-aff5-1a830210cd18.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '854b6582-2d75-42f1-9f0a-de9c73c7ab0c',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/da5ef5df-32c0-4fd9-96d0-05ccadf77df4.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'e399f41e-8067-4e6a-bbb6-be5297e0984f',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/d136d500-7ac6-4932-9b0c-798898c86a97.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '6d6722c4-74d1-4f08-a6c2-249aaf3f538c',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/1cb5c5d5-a1c3-4528-a32b-5bcfea254e4b.jpg',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '94a5ff85-b9d8-4e89-b984-71b0a527b219',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/071e5628-562f-4614-af4b-3fe741a117de.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'eca4ad16-a460-4145-b29e-aeb0fc18aa76',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/08e2999d-4778-4eca-8b18-708324eea0cd.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '0c6dc235-3f65-47b2-ba74-bcfcdf10ad8a',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7137fe06-2674-4412-9a77-14c523c32998.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '466ecf90-7539-481c-862d-f27f7cfab04e',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5603202b-bcdd-484c-b916-4c1c0b6e1683.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '7919e6db-a282-45bc-8343-7f0ddce1587e',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/642930e2-d974-4ff0-920c-960382288d4a.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'ea8d4bda-5de4-4029-a991-5bc9b94a6368',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5df8a3f8-04cc-4916-a83f-e5f9e39c052a.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': '25d517c7-3d94-4402-8f3c-a4f979df0b1f',
            'name': 'Synergism Logo T-Shirt - Black, S',
            'sku': '1ZB9-3JD200S',
            'unitPrice': {
              'value': 22,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, S',
              'color': {
                'name': 'Black',
                'swatch': '#2d2c2d'
              },
              'size': {
                'name': 'S'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 3.6,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': 'c5dbab47-254b-4a08-b002-e77d2c815bf8',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a1b4632c-c7f7-4624-aff5-1a830210cd18.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '854b6582-2d75-42f1-9f0a-de9c73c7ab0c',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/da5ef5df-32c0-4fd9-96d0-05ccadf77df4.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'e399f41e-8067-4e6a-bbb6-be5297e0984f',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/d136d500-7ac6-4932-9b0c-798898c86a97.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '6d6722c4-74d1-4f08-a6c2-249aaf3f538c',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/1cb5c5d5-a1c3-4528-a32b-5bcfea254e4b.jpg',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '94a5ff85-b9d8-4e89-b984-71b0a527b219',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/071e5628-562f-4614-af4b-3fe741a117de.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'eca4ad16-a460-4145-b29e-aeb0fc18aa76',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/08e2999d-4778-4eca-8b18-708324eea0cd.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '0c6dc235-3f65-47b2-ba74-bcfcdf10ad8a',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7137fe06-2674-4412-9a77-14c523c32998.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '466ecf90-7539-481c-862d-f27f7cfab04e',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5603202b-bcdd-484c-b916-4c1c0b6e1683.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '7919e6db-a282-45bc-8343-7f0ddce1587e',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/642930e2-d974-4ff0-920c-960382288d4a.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'ea8d4bda-5de4-4029-a991-5bc9b94a6368',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5df8a3f8-04cc-4916-a83f-e5f9e39c052a.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': 'aa413e07-200e-4d35-9e96-5bd787ddf775',
            'name': 'Synergism Logo T-Shirt - Black, M',
            'sku': '1ZB9-H86200M',
            'unitPrice': {
              'value': 22,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, M',
              'color': {
                'name': 'Black',
                'swatch': '#2d2c2d'
              },
              'size': {
                'name': 'M'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 5,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': 'c5dbab47-254b-4a08-b002-e77d2c815bf8',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a1b4632c-c7f7-4624-aff5-1a830210cd18.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '854b6582-2d75-42f1-9f0a-de9c73c7ab0c',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/da5ef5df-32c0-4fd9-96d0-05ccadf77df4.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'e399f41e-8067-4e6a-bbb6-be5297e0984f',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/d136d500-7ac6-4932-9b0c-798898c86a97.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '6d6722c4-74d1-4f08-a6c2-249aaf3f538c',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/1cb5c5d5-a1c3-4528-a32b-5bcfea254e4b.jpg',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '94a5ff85-b9d8-4e89-b984-71b0a527b219',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/071e5628-562f-4614-af4b-3fe741a117de.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'eca4ad16-a460-4145-b29e-aeb0fc18aa76',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/08e2999d-4778-4eca-8b18-708324eea0cd.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '0c6dc235-3f65-47b2-ba74-bcfcdf10ad8a',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7137fe06-2674-4412-9a77-14c523c32998.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '466ecf90-7539-481c-862d-f27f7cfab04e',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5603202b-bcdd-484c-b916-4c1c0b6e1683.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '7919e6db-a282-45bc-8343-7f0ddce1587e',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/642930e2-d974-4ff0-920c-960382288d4a.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'ea8d4bda-5de4-4029-a991-5bc9b94a6368',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5df8a3f8-04cc-4916-a83f-e5f9e39c052a.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': '116893b9-f695-4ee8-b136-8e03c30342d6',
            'name': 'Synergism Logo T-Shirt - Black, L',
            'sku': '1ZB9-RSR200L',
            'unitPrice': {
              'value': 22,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, L',
              'color': {
                'name': 'Black',
                'swatch': '#2d2c2d'
              },
              'size': {
                'name': 'L'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 5.8,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': 'c5dbab47-254b-4a08-b002-e77d2c815bf8',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a1b4632c-c7f7-4624-aff5-1a830210cd18.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '854b6582-2d75-42f1-9f0a-de9c73c7ab0c',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/da5ef5df-32c0-4fd9-96d0-05ccadf77df4.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'e399f41e-8067-4e6a-bbb6-be5297e0984f',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/d136d500-7ac6-4932-9b0c-798898c86a97.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '6d6722c4-74d1-4f08-a6c2-249aaf3f538c',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/1cb5c5d5-a1c3-4528-a32b-5bcfea254e4b.jpg',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '94a5ff85-b9d8-4e89-b984-71b0a527b219',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/071e5628-562f-4614-af4b-3fe741a117de.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'eca4ad16-a460-4145-b29e-aeb0fc18aa76',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/08e2999d-4778-4eca-8b18-708324eea0cd.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '0c6dc235-3f65-47b2-ba74-bcfcdf10ad8a',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7137fe06-2674-4412-9a77-14c523c32998.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '466ecf90-7539-481c-862d-f27f7cfab04e',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5603202b-bcdd-484c-b916-4c1c0b6e1683.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '7919e6db-a282-45bc-8343-7f0ddce1587e',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/642930e2-d974-4ff0-920c-960382288d4a.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'ea8d4bda-5de4-4029-a991-5bc9b94a6368',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5df8a3f8-04cc-4916-a83f-e5f9e39c052a.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': 'bae96402-558f-4477-bb15-58af27936751',
            'name': 'Synergism Logo T-Shirt - Black, XL',
            'sku': '1ZB9-Q1L20XL',
            'unitPrice': {
              'value': 22,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, XL',
              'color': {
                'name': 'Black',
                'swatch': '#2d2c2d'
              },
              'size': {
                'name': 'XL'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 6,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': 'c5dbab47-254b-4a08-b002-e77d2c815bf8',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a1b4632c-c7f7-4624-aff5-1a830210cd18.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '854b6582-2d75-42f1-9f0a-de9c73c7ab0c',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/da5ef5df-32c0-4fd9-96d0-05ccadf77df4.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'e399f41e-8067-4e6a-bbb6-be5297e0984f',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/d136d500-7ac6-4932-9b0c-798898c86a97.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '6d6722c4-74d1-4f08-a6c2-249aaf3f538c',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/1cb5c5d5-a1c3-4528-a32b-5bcfea254e4b.jpg',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '94a5ff85-b9d8-4e89-b984-71b0a527b219',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/071e5628-562f-4614-af4b-3fe741a117de.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'eca4ad16-a460-4145-b29e-aeb0fc18aa76',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/08e2999d-4778-4eca-8b18-708324eea0cd.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '0c6dc235-3f65-47b2-ba74-bcfcdf10ad8a',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7137fe06-2674-4412-9a77-14c523c32998.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '466ecf90-7539-481c-862d-f27f7cfab04e',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5603202b-bcdd-484c-b916-4c1c0b6e1683.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '7919e6db-a282-45bc-8343-7f0ddce1587e',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/642930e2-d974-4ff0-920c-960382288d4a.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'ea8d4bda-5de4-4029-a991-5bc9b94a6368',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5df8a3f8-04cc-4916-a83f-e5f9e39c052a.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': '723bf051-0457-4675-a117-bd9ef5d7a362',
            'name': 'Synergism Logo T-Shirt - Black, 2XL',
            'sku': '1ZB9-HEQ202X',
            'unitPrice': {
              'value': 24,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, 2XL',
              'color': {
                'name': 'Black',
                'swatch': '#2d2c2d'
              },
              'size': {
                'name': '2XL'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 6,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': 'c5dbab47-254b-4a08-b002-e77d2c815bf8',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a1b4632c-c7f7-4624-aff5-1a830210cd18.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '854b6582-2d75-42f1-9f0a-de9c73c7ab0c',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/da5ef5df-32c0-4fd9-96d0-05ccadf77df4.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'e399f41e-8067-4e6a-bbb6-be5297e0984f',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/d136d500-7ac6-4932-9b0c-798898c86a97.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '6d6722c4-74d1-4f08-a6c2-249aaf3f538c',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/1cb5c5d5-a1c3-4528-a32b-5bcfea254e4b.jpg',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '94a5ff85-b9d8-4e89-b984-71b0a527b219',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/071e5628-562f-4614-af4b-3fe741a117de.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'eca4ad16-a460-4145-b29e-aeb0fc18aa76',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/08e2999d-4778-4eca-8b18-708324eea0cd.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '0c6dc235-3f65-47b2-ba74-bcfcdf10ad8a',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7137fe06-2674-4412-9a77-14c523c32998.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '466ecf90-7539-481c-862d-f27f7cfab04e',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5603202b-bcdd-484c-b916-4c1c0b6e1683.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '7919e6db-a282-45bc-8343-7f0ddce1587e',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/642930e2-d974-4ff0-920c-960382288d4a.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'ea8d4bda-5de4-4029-a991-5bc9b94a6368',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5df8a3f8-04cc-4916-a83f-e5f9e39c052a.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': 'a056ecf3-bffb-460e-b2ae-4ff33223939d',
            'name': 'Synergism Logo T-Shirt - Black, 3XL',
            'sku': '1ZB9-P9T203X',
            'unitPrice': {
              'value': 26,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, 3XL',
              'color': {
                'name': 'Black',
                'swatch': '#2d2c2d'
              },
              'size': {
                'name': '3XL'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 7.5,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': 'c5dbab47-254b-4a08-b002-e77d2c815bf8',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a1b4632c-c7f7-4624-aff5-1a830210cd18.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '854b6582-2d75-42f1-9f0a-de9c73c7ab0c',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/da5ef5df-32c0-4fd9-96d0-05ccadf77df4.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'e399f41e-8067-4e6a-bbb6-be5297e0984f',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/d136d500-7ac6-4932-9b0c-798898c86a97.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '6d6722c4-74d1-4f08-a6c2-249aaf3f538c',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/1cb5c5d5-a1c3-4528-a32b-5bcfea254e4b.jpg',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '94a5ff85-b9d8-4e89-b984-71b0a527b219',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/071e5628-562f-4614-af4b-3fe741a117de.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'eca4ad16-a460-4145-b29e-aeb0fc18aa76',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/08e2999d-4778-4eca-8b18-708324eea0cd.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '0c6dc235-3f65-47b2-ba74-bcfcdf10ad8a',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7137fe06-2674-4412-9a77-14c523c32998.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '466ecf90-7539-481c-862d-f27f7cfab04e',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5603202b-bcdd-484c-b916-4c1c0b6e1683.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '7919e6db-a282-45bc-8343-7f0ddce1587e',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/642930e2-d974-4ff0-920c-960382288d4a.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'ea8d4bda-5de4-4029-a991-5bc9b94a6368',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5df8a3f8-04cc-4916-a83f-e5f9e39c052a.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': 'eff2a2a5-3880-4988-ad71-3ddf0ba392df',
            'name': 'Synergism Logo T-Shirt - Black, 4XL',
            'sku': '1ZB9-T32204X',
            'unitPrice': {
              'value': 28,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, 4XL',
              'color': {
                'name': 'Black',
                'swatch': '#2d2c2d'
              },
              'size': {
                'name': '4XL'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 9,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': 'c5dbab47-254b-4a08-b002-e77d2c815bf8',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a1b4632c-c7f7-4624-aff5-1a830210cd18.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '854b6582-2d75-42f1-9f0a-de9c73c7ab0c',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/da5ef5df-32c0-4fd9-96d0-05ccadf77df4.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'e399f41e-8067-4e6a-bbb6-be5297e0984f',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/d136d500-7ac6-4932-9b0c-798898c86a97.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '6d6722c4-74d1-4f08-a6c2-249aaf3f538c',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/1cb5c5d5-a1c3-4528-a32b-5bcfea254e4b.jpg',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '94a5ff85-b9d8-4e89-b984-71b0a527b219',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/071e5628-562f-4614-af4b-3fe741a117de.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'eca4ad16-a460-4145-b29e-aeb0fc18aa76',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/08e2999d-4778-4eca-8b18-708324eea0cd.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '0c6dc235-3f65-47b2-ba74-bcfcdf10ad8a',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7137fe06-2674-4412-9a77-14c523c32998.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '466ecf90-7539-481c-862d-f27f7cfab04e',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5603202b-bcdd-484c-b916-4c1c0b6e1683.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '7919e6db-a282-45bc-8343-7f0ddce1587e',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/642930e2-d974-4ff0-920c-960382288d4a.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'ea8d4bda-5de4-4029-a991-5bc9b94a6368',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5df8a3f8-04cc-4916-a83f-e5f9e39c052a.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': '3a8aa3e2-29ca-4f74-8143-f3f2d9751a69',
            'name': 'Synergism Logo T-Shirt - Black, 5XL',
            'sku': '1ZB9-1CM205X',
            'unitPrice': {
              'value': 30,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, 5XL',
              'color': {
                'name': 'Black',
                'swatch': '#2d2c2d'
              },
              'size': {
                'name': '5XL'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 9,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': 'c5dbab47-254b-4a08-b002-e77d2c815bf8',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a1b4632c-c7f7-4624-aff5-1a830210cd18.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '854b6582-2d75-42f1-9f0a-de9c73c7ab0c',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/da5ef5df-32c0-4fd9-96d0-05ccadf77df4.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'e399f41e-8067-4e6a-bbb6-be5297e0984f',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/d136d500-7ac6-4932-9b0c-798898c86a97.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '6d6722c4-74d1-4f08-a6c2-249aaf3f538c',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/1cb5c5d5-a1c3-4528-a32b-5bcfea254e4b.jpg',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '94a5ff85-b9d8-4e89-b984-71b0a527b219',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/071e5628-562f-4614-af4b-3fe741a117de.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'eca4ad16-a460-4145-b29e-aeb0fc18aa76',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/08e2999d-4778-4eca-8b18-708324eea0cd.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '0c6dc235-3f65-47b2-ba74-bcfcdf10ad8a',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7137fe06-2674-4412-9a77-14c523c32998.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '466ecf90-7539-481c-862d-f27f7cfab04e',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5603202b-bcdd-484c-b916-4c1c0b6e1683.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '7919e6db-a282-45bc-8343-7f0ddce1587e',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/642930e2-d974-4ff0-920c-960382288d4a.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'ea8d4bda-5de4-4029-a991-5bc9b94a6368',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5df8a3f8-04cc-4916-a83f-e5f9e39c052a.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          }
        ],
        'createdAt': '2025-01-10T16:20:18.9375Z',
        'updatedAt': '2025-01-11T01:37:58.672174Z'
      },
      {
        'id': 'ae7dc221-08e2-473e-a9e0-1e9bda5c71fe',
        'name': 'Synergism Logo Sticker',
        'slug': 'synergism-logo-sticker',
        'description': '',
        'state': {
          'type': 'AVAILABLE'
        },
        'access': {
          'type': 'PUBLIC'
        },
        'images': [
          {
            'id': 'cb135459-8af9-4f4a-b513-1f350a3d8c6f',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/6b2b5199-92a5-48fe-a5da-92a16a300f33.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': 'eae9ff59-32f3-4631-989c-32a83a81e7be',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/b4a96c2b-d350-4b4c-b7fc-eceec50b4c9a.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '4e2ad2bb-5f06-493c-8543-81c1766ebfe4',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/fa8932b3-88fd-48c7-9114-9024e4125086.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': 'dee0444a-d86e-48af-99d5-bcad775e4549',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/9926e502-ac63-43fc-a102-1902dc83c788.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '85d54fc4-d64f-46b3-b775-57f37e883286',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/71157dc3-33cb-440d-a2b7-91a5b9e8102b.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': 'bf5bf748-f344-468b-a4e9-73952882adba',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/620925b7-91c4-4e56-b0d0-2c9b0bb626a8.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '24aeb44a-1d57-4084-a641-9b7b4c7b4dfb',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/41761122-a84c-431e-8994-dbcc69bfc35a.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': 'c0967a81-8aef-45f1-bf13-b22ee0a45a08',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/62d447a4-dbb6-4dd0-bfc3-7e053e9190ff.webp',
            'width': 1536,
            'height': 2048
          }
        ],
        'variants': [
          {
            'id': 'd0691a14-39d8-4ead-b59c-8e168984f1f9',
            'name': 'Synergism Logo Sticker - White, 3" x 3"',
            'sku': '1BDD-Z8MV03X',
            'unitPrice': {
              'value': 6.99,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'White, 3" x 3"',
              'color': {
                'name': 'White',
                'swatch': '#ffffff'
              },
              'size': {
                'name': '3" x 3"'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 0.06,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': 'cb135459-8af9-4f4a-b513-1f350a3d8c6f',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/6b2b5199-92a5-48fe-a5da-92a16a300f33.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'eae9ff59-32f3-4631-989c-32a83a81e7be',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/b4a96c2b-d350-4b4c-b7fc-eceec50b4c9a.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '4e2ad2bb-5f06-493c-8543-81c1766ebfe4',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/fa8932b3-88fd-48c7-9114-9024e4125086.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'dee0444a-d86e-48af-99d5-bcad775e4549',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/9926e502-ac63-43fc-a102-1902dc83c788.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': '79d77037-d4ba-4cdf-b0b7-3f99f88d8d4e',
            'name': 'Synergism Logo Sticker - White, 4" x 4"',
            'sku': '1BDD-0P6V04X',
            'unitPrice': {
              'value': 7.19,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'White, 4" x 4"',
              'color': {
                'name': 'White',
                'swatch': '#ffffff'
              },
              'size': {
                'name': '4" x 4"'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 0.1,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': '85d54fc4-d64f-46b3-b775-57f37e883286',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/71157dc3-33cb-440d-a2b7-91a5b9e8102b.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'bf5bf748-f344-468b-a4e9-73952882adba',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/620925b7-91c4-4e56-b0d0-2c9b0bb626a8.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '24aeb44a-1d57-4084-a641-9b7b4c7b4dfb',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/41761122-a84c-431e-8994-dbcc69bfc35a.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'c0967a81-8aef-45f1-bf13-b22ee0a45a08',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/62d447a4-dbb6-4dd0-bfc3-7e053e9190ff.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          }
        ],
        'createdAt': '2025-01-10T16:23:19.409999Z',
        'updatedAt': '2025-01-11T01:44:10.966793Z'
      },
      {
        'id': 'fb0c6aca-c9a5-4e2c-a99e-583c71e21d32',
        'name': 'Smith Sticker',
        'slug': 'smith-sticker',
        'description': '',
        'state': {
          'type': 'AVAILABLE'
        },
        'access': {
          'type': 'PUBLIC'
        },
        'images': [
          {
            'id': '7b54761c-2426-44de-8d1a-afe4feaf5d72',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/3b444935-f8eb-41b8-bd40-c1f9ac8bb75c.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '0ae9c725-10f2-476b-b156-c3732f054d8f',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/260549ef-084a-477e-bfde-e880e33b48ce.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': 'e1843c29-9a29-4b43-9448-a64ebe2236ea',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/19348e50-4a62-4a20-b185-eade89944cd5.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '7568253d-0474-4a42-8773-9e90f241e1d6',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/8f26a47b-3b26-44c0-a945-769cd4c02c2a.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '2875342f-baa2-4812-9715-3e22c1751343',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/979a00de-20af-47da-8ce6-4e9856215e62.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': 'f5fd4bf2-fa62-4787-b2e4-9620414e348e',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/07d6e516-690e-4529-935d-b9bc273f1d6e.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '6f3dcac5-d249-4d06-b667-123daa0ef704',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/80ea70c7-5a33-4180-995f-0d06dca650b1.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '95deeb0d-44fb-4b69-9339-1254d84b6fd5',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/9bdf4d7a-c863-44dc-88a7-a2fcb1278383.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '95123411-ade2-4eeb-9070-6acdd61dbbf8',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7e3f779e-8b1c-4fe0-b9b4-1b855a146608.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': 'b586e250-009c-4914-a372-df0c46ac1b7f',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7e8b36d5-6b99-45d8-a9e8-81c8069b25ed.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '60d4a7d5-9098-4318-ac8c-9bc46a558f77',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a3d9a07b-38b8-476b-a222-23b5af9a70b8.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '735ae220-1f39-49f1-943b-422e02f2791a',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/d63578aa-cb5a-409b-8a81-8477afdf6d91.webp',
            'width': 1536,
            'height': 2048
          }
        ],
        'variants': [
          {
            'id': '505fe214-d48d-4d86-844d-02fcb569826c',
            'name': 'Smith Sticker - White, 3" x 3"',
            'sku': '1B5E-SWLV03X',
            'unitPrice': {
              'value': 5.2,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'White, 3" x 3"',
              'color': {
                'name': 'White',
                'swatch': '#ffffff'
              },
              'size': {
                'name': '3" x 3"'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 0.06,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': '7b54761c-2426-44de-8d1a-afe4feaf5d72',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/3b444935-f8eb-41b8-bd40-c1f9ac8bb75c.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '0ae9c725-10f2-476b-b156-c3732f054d8f',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/260549ef-084a-477e-bfde-e880e33b48ce.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'e1843c29-9a29-4b43-9448-a64ebe2236ea',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/19348e50-4a62-4a20-b185-eade89944cd5.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '7568253d-0474-4a42-8773-9e90f241e1d6',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/8f26a47b-3b26-44c0-a945-769cd4c02c2a.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': '8c1113e5-ad88-43e9-82ba-a7585e100114',
            'name': 'Smith Sticker - White, 4" x 4"',
            'sku': '1B5E-FYMV04X',
            'unitPrice': {
              'value': 5.4,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'White, 4" x 4"',
              'color': {
                'name': 'White',
                'swatch': '#ffffff'
              },
              'size': {
                'name': '4" x 4"'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 0.1,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': '2875342f-baa2-4812-9715-3e22c1751343',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/979a00de-20af-47da-8ce6-4e9856215e62.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'f5fd4bf2-fa62-4787-b2e4-9620414e348e',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/07d6e516-690e-4529-935d-b9bc273f1d6e.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '6f3dcac5-d249-4d06-b667-123daa0ef704',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/80ea70c7-5a33-4180-995f-0d06dca650b1.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '95deeb0d-44fb-4b69-9339-1254d84b6fd5',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/9bdf4d7a-c863-44dc-88a7-a2fcb1278383.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': '59be273a-e269-4ebe-a103-c5fa4c761867',
            'name': 'Smith Sticker - White, 5.5" x 5.5"',
            'sku': '1B5E-QEAV055',
            'unitPrice': {
              'value': 5.6,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'White, 5.5" x 5.5"',
              'color': {
                'name': 'White',
                'swatch': '#ffffff'
              },
              'size': {
                'name': '5.5" x 5.5"'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 0.2,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': '95123411-ade2-4eeb-9070-6acdd61dbbf8',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7e3f779e-8b1c-4fe0-b9b4-1b855a146608.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'b586e250-009c-4914-a372-df0c46ac1b7f',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7e8b36d5-6b99-45d8-a9e8-81c8069b25ed.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '60d4a7d5-9098-4318-ac8c-9bc46a558f77',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a3d9a07b-38b8-476b-a222-23b5af9a70b8.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '735ae220-1f39-49f1-943b-422e02f2791a',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/d63578aa-cb5a-409b-8a81-8477afdf6d91.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          }
        ],
        'createdAt': '2025-01-10T04:48:59.606964Z',
        'updatedAt': '2025-01-11T01:44:25.403566Z'
      },
      {
        'id': '92adea93-72a1-4977-ab1e-5ae3c23a0a06',
        'name': 'Synergism Hoodie',
        'slug': 'synergism-hoodie',
        'description': '',
        'state': {
          'type': 'AVAILABLE'
        },
        'access': {
          'type': 'PUBLIC'
        },
        'images': [
          {
            'id': 'c849c974-392e-4227-bdae-80bc609b94f4',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/f7eb9bce-078a-4efa-8810-82d54cdb05e5.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': 'fa162948-42c7-4144-a0dd-f34059acdeeb',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/29499999-358f-4865-ac64-8338f33d2358.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '98c521de-d5f6-48e3-9e93-f40f4d3de775',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/f483e8de-5180-4503-8d7a-7431d008d47b.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '0df68c01-b1ef-4d41-9f99-7d490d4b6121',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/32c0db8d-c38e-445e-8f38-1fc562d84344.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '011a2fac-8c29-43bc-89db-e0364d9293e0',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/eac7c740-69ba-492b-80a1-83fdbecd53d4.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '9ce83492-7038-40ca-adc9-33fe6b8ae5b7',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/dd6d9773-92a1-4c49-94dd-cc9b22677107.webp',
            'width': 1536,
            'height': 2048
          }
        ],
        'variants': [
          {
            'id': '4a1796a1-4cd3-4412-b25b-dfa3d8c10181',
            'name': 'Synergism Hoodie - Black, S',
            'sku': '1BCA-W2K200S',
            'unitPrice': {
              'value': 35,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, S',
              'color': {
                'name': 'Black',
                'swatch': '#242424'
              },
              'size': {
                'name': 'S'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 16,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': 'c849c974-392e-4227-bdae-80bc609b94f4',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/f7eb9bce-078a-4efa-8810-82d54cdb05e5.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'fa162948-42c7-4144-a0dd-f34059acdeeb',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/29499999-358f-4865-ac64-8338f33d2358.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '98c521de-d5f6-48e3-9e93-f40f4d3de775',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/f483e8de-5180-4503-8d7a-7431d008d47b.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '0df68c01-b1ef-4d41-9f99-7d490d4b6121',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/32c0db8d-c38e-445e-8f38-1fc562d84344.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '011a2fac-8c29-43bc-89db-e0364d9293e0',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/eac7c740-69ba-492b-80a1-83fdbecd53d4.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '9ce83492-7038-40ca-adc9-33fe6b8ae5b7',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/dd6d9773-92a1-4c49-94dd-cc9b22677107.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': '1e94348b-4b79-4b31-8d30-79c28f3d7c62',
            'name': 'Synergism Hoodie - Black, M',
            'sku': '1BCA-K05200M',
            'unitPrice': {
              'value': 35,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, M',
              'color': {
                'name': 'Black',
                'swatch': '#242424'
              },
              'size': {
                'name': 'M'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 16.5,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': 'c849c974-392e-4227-bdae-80bc609b94f4',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/f7eb9bce-078a-4efa-8810-82d54cdb05e5.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'fa162948-42c7-4144-a0dd-f34059acdeeb',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/29499999-358f-4865-ac64-8338f33d2358.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '98c521de-d5f6-48e3-9e93-f40f4d3de775',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/f483e8de-5180-4503-8d7a-7431d008d47b.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '0df68c01-b1ef-4d41-9f99-7d490d4b6121',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/32c0db8d-c38e-445e-8f38-1fc562d84344.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '011a2fac-8c29-43bc-89db-e0364d9293e0',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/eac7c740-69ba-492b-80a1-83fdbecd53d4.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '9ce83492-7038-40ca-adc9-33fe6b8ae5b7',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/dd6d9773-92a1-4c49-94dd-cc9b22677107.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': 'fa7e2fbf-fbe6-4177-a231-00bd64425b4c',
            'name': 'Synergism Hoodie - Black, L',
            'sku': '1BCA-6TS200L',
            'unitPrice': {
              'value': 35,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, L',
              'color': {
                'name': 'Black',
                'swatch': '#242424'
              },
              'size': {
                'name': 'L'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 20,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': 'c849c974-392e-4227-bdae-80bc609b94f4',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/f7eb9bce-078a-4efa-8810-82d54cdb05e5.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'fa162948-42c7-4144-a0dd-f34059acdeeb',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/29499999-358f-4865-ac64-8338f33d2358.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '98c521de-d5f6-48e3-9e93-f40f4d3de775',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/f483e8de-5180-4503-8d7a-7431d008d47b.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '0df68c01-b1ef-4d41-9f99-7d490d4b6121',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/32c0db8d-c38e-445e-8f38-1fc562d84344.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '011a2fac-8c29-43bc-89db-e0364d9293e0',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/eac7c740-69ba-492b-80a1-83fdbecd53d4.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '9ce83492-7038-40ca-adc9-33fe6b8ae5b7',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/dd6d9773-92a1-4c49-94dd-cc9b22677107.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': '4750f453-2175-43b4-a692-c9a26087ca2c',
            'name': 'Synergism Hoodie - Black, XL',
            'sku': '1BCA-WZ320XL',
            'unitPrice': {
              'value': 35,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, XL',
              'color': {
                'name': 'Black',
                'swatch': '#242424'
              },
              'size': {
                'name': 'XL'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 21.8,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': 'c849c974-392e-4227-bdae-80bc609b94f4',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/f7eb9bce-078a-4efa-8810-82d54cdb05e5.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'fa162948-42c7-4144-a0dd-f34059acdeeb',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/29499999-358f-4865-ac64-8338f33d2358.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '98c521de-d5f6-48e3-9e93-f40f4d3de775',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/f483e8de-5180-4503-8d7a-7431d008d47b.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '0df68c01-b1ef-4d41-9f99-7d490d4b6121',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/32c0db8d-c38e-445e-8f38-1fc562d84344.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '011a2fac-8c29-43bc-89db-e0364d9293e0',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/eac7c740-69ba-492b-80a1-83fdbecd53d4.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '9ce83492-7038-40ca-adc9-33fe6b8ae5b7',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/dd6d9773-92a1-4c49-94dd-cc9b22677107.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': '2adeb1b3-1dbe-4394-8053-46d00e047fdb',
            'name': 'Synergism Hoodie - Black, 2XL',
            'sku': '1BCA-TJS202X',
            'unitPrice': {
              'value': 37,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, 2XL',
              'color': {
                'name': 'Black',
                'swatch': '#242424'
              },
              'size': {
                'name': '2XL'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 22.5,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': 'c849c974-392e-4227-bdae-80bc609b94f4',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/f7eb9bce-078a-4efa-8810-82d54cdb05e5.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'fa162948-42c7-4144-a0dd-f34059acdeeb',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/29499999-358f-4865-ac64-8338f33d2358.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '98c521de-d5f6-48e3-9e93-f40f4d3de775',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/f483e8de-5180-4503-8d7a-7431d008d47b.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '0df68c01-b1ef-4d41-9f99-7d490d4b6121',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/32c0db8d-c38e-445e-8f38-1fc562d84344.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '011a2fac-8c29-43bc-89db-e0364d9293e0',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/eac7c740-69ba-492b-80a1-83fdbecd53d4.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '9ce83492-7038-40ca-adc9-33fe6b8ae5b7',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/dd6d9773-92a1-4c49-94dd-cc9b22677107.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': 'dbc9e08c-ac30-4b0b-b617-1ded47a4e3a8',
            'name': 'Synergism Hoodie - Black, 3XL',
            'sku': '1BCA-2JZ203X',
            'unitPrice': {
              'value': 39,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, 3XL',
              'color': {
                'name': 'Black',
                'swatch': '#242424'
              },
              'size': {
                'name': '3XL'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 25.2,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': 'c849c974-392e-4227-bdae-80bc609b94f4',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/f7eb9bce-078a-4efa-8810-82d54cdb05e5.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'fa162948-42c7-4144-a0dd-f34059acdeeb',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/29499999-358f-4865-ac64-8338f33d2358.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '98c521de-d5f6-48e3-9e93-f40f4d3de775',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/f483e8de-5180-4503-8d7a-7431d008d47b.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '0df68c01-b1ef-4d41-9f99-7d490d4b6121',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/32c0db8d-c38e-445e-8f38-1fc562d84344.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '011a2fac-8c29-43bc-89db-e0364d9293e0',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/eac7c740-69ba-492b-80a1-83fdbecd53d4.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '9ce83492-7038-40ca-adc9-33fe6b8ae5b7',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/dd6d9773-92a1-4c49-94dd-cc9b22677107.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          }
        ],
        'createdAt': '2025-01-12T23:38:27.426159Z',
        'updatedAt': '2025-01-12T23:38:27.426159Z'
      },
      {
        'id': '3e1df4b6-97ca-4cdb-84df-03fe08c139d8',
        'name': 'Synergism Hoodie Unisex',
        'slug': 'synergism-hoodie-unisex',
        'description': '',
        'state': {
          'type': 'AVAILABLE'
        },
        'access': {
          'type': 'PUBLIC'
        },
        'images': [
          {
            'id': '19cd0364-d337-4beb-9732-750ba8da0214',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/2367473f-4414-40ec-b357-18276c25fdcb.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '98d10217-5a4b-4d14-aa5d-8c5f22b6d409',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7247e225-1c33-4835-ad3b-dabeb9a3c4ac.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '124b19f1-9057-4a59-929f-82c0bc6de242',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/2a0af1af-eb3e-4947-afe0-129a374db24f.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': 'b7cdcd8c-6411-4f77-8634-b602b34255dd',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a4eea40b-7b2e-4602-aaa1-04273349c220.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '83fdd33e-e48b-429d-8d3a-0d9590bdc7c6',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/b9c25327-1858-4826-b10a-71f18e8e08b1.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '9975423b-088a-471a-9a98-2b01b0aa7c01',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/e4d3264e-43af-4ca9-a3b3-ef8a6ac8ad8b.webp',
            'width': 1536,
            'height': 2048
          }
        ],
        'variants': [
          {
            'id': '363a0650-dd06-4e0b-8c82-2ccdce00a314',
            'name': 'Synergism Hoodie Unisex - Black, S',
            'sku': '1PVX-U5D200S',
            'unitPrice': {
              'value': 39.99,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, S',
              'color': {
                'name': 'Black',
                'swatch': '#080808'
              },
              'size': {
                'name': 'S'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 17.5,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': '19cd0364-d337-4beb-9732-750ba8da0214',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/2367473f-4414-40ec-b357-18276c25fdcb.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '98d10217-5a4b-4d14-aa5d-8c5f22b6d409',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7247e225-1c33-4835-ad3b-dabeb9a3c4ac.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '124b19f1-9057-4a59-929f-82c0bc6de242',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/2a0af1af-eb3e-4947-afe0-129a374db24f.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'b7cdcd8c-6411-4f77-8634-b602b34255dd',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a4eea40b-7b2e-4602-aaa1-04273349c220.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '83fdd33e-e48b-429d-8d3a-0d9590bdc7c6',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/b9c25327-1858-4826-b10a-71f18e8e08b1.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '9975423b-088a-471a-9a98-2b01b0aa7c01',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/e4d3264e-43af-4ca9-a3b3-ef8a6ac8ad8b.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': '45928aab-ebd1-4b78-ba55-25d741fa1895',
            'name': 'Synergism Hoodie Unisex - Black, M',
            'sku': '1PVX-CZV200M',
            'unitPrice': {
              'value': 39.99,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, M',
              'color': {
                'name': 'Black',
                'swatch': '#080808'
              },
              'size': {
                'name': 'M'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 18.8,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': '19cd0364-d337-4beb-9732-750ba8da0214',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/2367473f-4414-40ec-b357-18276c25fdcb.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '98d10217-5a4b-4d14-aa5d-8c5f22b6d409',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7247e225-1c33-4835-ad3b-dabeb9a3c4ac.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '124b19f1-9057-4a59-929f-82c0bc6de242',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/2a0af1af-eb3e-4947-afe0-129a374db24f.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'b7cdcd8c-6411-4f77-8634-b602b34255dd',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a4eea40b-7b2e-4602-aaa1-04273349c220.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '83fdd33e-e48b-429d-8d3a-0d9590bdc7c6',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/b9c25327-1858-4826-b10a-71f18e8e08b1.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '9975423b-088a-471a-9a98-2b01b0aa7c01',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/e4d3264e-43af-4ca9-a3b3-ef8a6ac8ad8b.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': '896a47df-ddcc-4878-96de-403d8a6bb55e',
            'name': 'Synergism Hoodie Unisex - Black, L',
            'sku': '1PVX-PE7200L',
            'unitPrice': {
              'value': 39.99,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, L',
              'color': {
                'name': 'Black',
                'swatch': '#080808'
              },
              'size': {
                'name': 'L'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 20,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': '19cd0364-d337-4beb-9732-750ba8da0214',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/2367473f-4414-40ec-b357-18276c25fdcb.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '98d10217-5a4b-4d14-aa5d-8c5f22b6d409',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7247e225-1c33-4835-ad3b-dabeb9a3c4ac.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '124b19f1-9057-4a59-929f-82c0bc6de242',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/2a0af1af-eb3e-4947-afe0-129a374db24f.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'b7cdcd8c-6411-4f77-8634-b602b34255dd',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a4eea40b-7b2e-4602-aaa1-04273349c220.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '83fdd33e-e48b-429d-8d3a-0d9590bdc7c6',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/b9c25327-1858-4826-b10a-71f18e8e08b1.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '9975423b-088a-471a-9a98-2b01b0aa7c01',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/e4d3264e-43af-4ca9-a3b3-ef8a6ac8ad8b.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': 'c0bb34e7-23d5-4156-9e92-04c0c0af0154',
            'name': 'Synergism Hoodie Unisex - Black, XL',
            'sku': '1PVX-7HR20XL',
            'unitPrice': {
              'value': 39.99,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, XL',
              'color': {
                'name': 'Black',
                'swatch': '#080808'
              },
              'size': {
                'name': 'XL'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 21.5,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': '19cd0364-d337-4beb-9732-750ba8da0214',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/2367473f-4414-40ec-b357-18276c25fdcb.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '98d10217-5a4b-4d14-aa5d-8c5f22b6d409',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7247e225-1c33-4835-ad3b-dabeb9a3c4ac.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '124b19f1-9057-4a59-929f-82c0bc6de242',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/2a0af1af-eb3e-4947-afe0-129a374db24f.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'b7cdcd8c-6411-4f77-8634-b602b34255dd',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a4eea40b-7b2e-4602-aaa1-04273349c220.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '83fdd33e-e48b-429d-8d3a-0d9590bdc7c6',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/b9c25327-1858-4826-b10a-71f18e8e08b1.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '9975423b-088a-471a-9a98-2b01b0aa7c01',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/e4d3264e-43af-4ca9-a3b3-ef8a6ac8ad8b.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': 'c67b0c1e-e380-4272-8527-af4e7fa6366f',
            'name': 'Synergism Hoodie Unisex - Black, 2XL',
            'sku': '1PVX-07L202X',
            'unitPrice': {
              'value': 41.99,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, 2XL',
              'color': {
                'name': 'Black',
                'swatch': '#080808'
              },
              'size': {
                'name': '2XL'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 24.1,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': '19cd0364-d337-4beb-9732-750ba8da0214',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/2367473f-4414-40ec-b357-18276c25fdcb.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '98d10217-5a4b-4d14-aa5d-8c5f22b6d409',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7247e225-1c33-4835-ad3b-dabeb9a3c4ac.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '124b19f1-9057-4a59-929f-82c0bc6de242',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/2a0af1af-eb3e-4947-afe0-129a374db24f.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'b7cdcd8c-6411-4f77-8634-b602b34255dd',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a4eea40b-7b2e-4602-aaa1-04273349c220.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '83fdd33e-e48b-429d-8d3a-0d9590bdc7c6',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/b9c25327-1858-4826-b10a-71f18e8e08b1.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '9975423b-088a-471a-9a98-2b01b0aa7c01',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/e4d3264e-43af-4ca9-a3b3-ef8a6ac8ad8b.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': 'afc0e407-6dea-4e9a-bd77-7d725ff53ad9',
            'name': 'Synergism Hoodie Unisex - Black, 3XL',
            'sku': '1PVX-42B203X',
            'unitPrice': {
              'value': 43.99,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, 3XL',
              'color': {
                'name': 'Black',
                'swatch': '#080808'
              },
              'size': {
                'name': '3XL'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 27,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': '19cd0364-d337-4beb-9732-750ba8da0214',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/2367473f-4414-40ec-b357-18276c25fdcb.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '98d10217-5a4b-4d14-aa5d-8c5f22b6d409',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7247e225-1c33-4835-ad3b-dabeb9a3c4ac.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '124b19f1-9057-4a59-929f-82c0bc6de242',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/2a0af1af-eb3e-4947-afe0-129a374db24f.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'b7cdcd8c-6411-4f77-8634-b602b34255dd',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a4eea40b-7b2e-4602-aaa1-04273349c220.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '83fdd33e-e48b-429d-8d3a-0d9590bdc7c6',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/b9c25327-1858-4826-b10a-71f18e8e08b1.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '9975423b-088a-471a-9a98-2b01b0aa7c01',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/e4d3264e-43af-4ca9-a3b3-ef8a6ac8ad8b.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          }
        ],
        'createdAt': '2025-01-12T23:40:44.712057Z',
        'updatedAt': '2025-01-12T23:40:44.712057Z'
      },
      {
        'id': 'e437441b-858a-4482-b72e-bec131f7c9a8',
        'name': 'iSynergism Phone Case',
        'slug': 'isynergism-phone-case',
        'description': '',
        'state': {
          'type': 'AVAILABLE'
        },
        'access': {
          'type': 'PUBLIC'
        },
        'images': [
          {
            'id': 'cbc94503-7dbd-4465-8e65-69a64ae59122',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/4886d427-5205-454a-bc4e-266954d26497.webp',
            'width': 1000,
            'height': 1000
          },
          {
            'id': 'b85e2b2f-b87d-4618-8bc0-f54d05a23b6d',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/c6f6ccc5-5ead-4765-a491-7752bd6eb579.webp',
            'width': 1000,
            'height': 1000
          },
          {
            'id': 'e4077c6c-f434-4fda-bbbf-4fbc9759ab1c',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/410b2344-0a22-4224-aa68-15ba09281363.webp',
            'width': 1000,
            'height': 1000
          },
          {
            'id': 'd17c2d56-ac1d-4195-b50f-eff1de0d3bba',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/49ad774e-aac7-4e0c-a131-69cba518e7e8.webp',
            'width': 1000,
            'height': 1000
          },
          {
            'id': 'cdc34a44-2a3a-4edb-bf86-4fca95e1ecf8',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/40e6cc3f-663b-409f-9b47-8b4e466c8c73.webp',
            'width': 1000,
            'height': 1000
          },
          {
            'id': '19ba5557-0825-48c3-b877-5fb6e0965e44',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/63b15827-5cdb-4e44-a571-adba7dc12db8.webp',
            'width': 1000,
            'height': 1000
          },
          {
            'id': '6ec59e4d-610e-4991-bd27-80ee2a74437c',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/ca93d2f4-a492-4e64-9d6b-a6c614913760.webp',
            'width': 1000,
            'height': 1000
          },
          {
            'id': 'de95019a-1af0-4dd1-b495-d823d7ce49e7',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/76e18ddd-bf77-4b54-8700-eb42f7026620.webp',
            'width': 1000,
            'height': 1000
          },
          {
            'id': '598e19ed-f405-4712-b2ea-5463a2b5a809',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/21d980c2-ac08-4d72-9f62-c6ac1ce8b978.webp',
            'width': 1000,
            'height': 1000
          },
          {
            'id': 'b054cc43-3fc5-4f9f-be01-19f9c1ba90a5',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/2899f1d7-21f6-44dc-b001-984e95b04b8a.webp',
            'width': 1000,
            'height': 1000
          },
          {
            'id': 'ae24bada-f362-4ae7-a2ea-d1b80fa63569',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/fea145f0-a04e-4490-964f-22d23e22fa3e.webp',
            'width': 1000,
            'height': 1000
          },
          {
            'id': '3d00f1f9-3639-4123-b4d1-412e185e0cf1',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/f23edf77-5022-4e2c-b265-2715f3192196.webp',
            'width': 1000,
            'height': 1000
          }
        ],
        'variants': [
          {
            'id': '38a3bb6d-e935-4dcf-afe5-f773c1a758ff',
            'name': 'iSynergism Phone Case - All-Over Print, iPhone 14 Plus',
            'sku': '1DZA-X0EG0PH',
            'unitPrice': {
              'value': 23,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'All-Over Print, iPhone 14 Plus',
              'color': {
                'name': 'All-Over Print',
                'swatch': '#ffffff'
              },
              'size': {
                'name': 'iPhone 14 Plus'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 1.6,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': 'cbc94503-7dbd-4465-8e65-69a64ae59122',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/4886d427-5205-454a-bc4e-266954d26497.webp',
                'width': 1000,
                'height': 1000
              }
            ]
          },
          {
            'id': '9fce71a7-1b97-41b8-9e3e-92b47e26d8dc',
            'name': 'iSynergism Phone Case - All-Over Print, iPhone 14',
            'sku': '1DZA-0V5G0PH',
            'unitPrice': {
              'value': 23,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'All-Over Print, iPhone 14',
              'color': {
                'name': 'All-Over Print',
                'swatch': '#ffffff'
              },
              'size': {
                'name': 'iPhone 14'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 1.6,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': 'b85e2b2f-b87d-4618-8bc0-f54d05a23b6d',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/c6f6ccc5-5ead-4765-a491-7752bd6eb579.webp',
                'width': 1000,
                'height': 1000
              }
            ]
          },
          {
            'id': '73f04697-e603-4ae7-8dbe-a3f5bcd9aeda',
            'name': 'iSynergism Phone Case - All-Over Print, iPhone 14 Pro Max',
            'sku': '1DZA-Z1YG0PH',
            'unitPrice': {
              'value': 23,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'All-Over Print, iPhone 14 Pro Max',
              'color': {
                'name': 'All-Over Print',
                'swatch': '#ffffff'
              },
              'size': {
                'name': 'iPhone 14 Pro Max'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 1.6,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': 'e4077c6c-f434-4fda-bbbf-4fbc9759ab1c',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/410b2344-0a22-4224-aa68-15ba09281363.webp',
                'width': 1000,
                'height': 1000
              }
            ]
          },
          {
            'id': 'c06a29fb-b2ca-49f1-8ba6-3ba152f7ce7e',
            'name': 'iSynergism Phone Case - All-Over Print, iPhone 14 Pro',
            'sku': '1DZA-NXXG0PH',
            'unitPrice': {
              'value': 23,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'All-Over Print, iPhone 14 Pro',
              'color': {
                'name': 'All-Over Print',
                'swatch': '#ffffff'
              },
              'size': {
                'name': 'iPhone 14 Pro'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 1.6,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': 'd17c2d56-ac1d-4195-b50f-eff1de0d3bba',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/49ad774e-aac7-4e0c-a131-69cba518e7e8.webp',
                'width': 1000,
                'height': 1000
              }
            ]
          },
          {
            'id': '6341b38c-2007-4a3c-9688-0bea7820388b',
            'name': 'iSynergism Phone Case - All-Over Print, iPhone 15 Pro Max',
            'sku': '1DZA-Q50G0PH',
            'unitPrice': {
              'value': 23,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'All-Over Print, iPhone 15 Pro Max',
              'color': {
                'name': 'All-Over Print',
                'swatch': '#ffffff'
              },
              'size': {
                'name': 'iPhone 15 Pro Max'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 1.6,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': 'cdc34a44-2a3a-4edb-bf86-4fca95e1ecf8',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/40e6cc3f-663b-409f-9b47-8b4e466c8c73.webp',
                'width': 1000,
                'height': 1000
              }
            ]
          },
          {
            'id': 'a831b154-f0b2-4155-aac7-bca1cf35c8a7',
            'name': 'iSynergism Phone Case - All-Over Print, iPhone 15 Pro',
            'sku': '1DZA-1A5G0PH',
            'unitPrice': {
              'value': 23,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'All-Over Print, iPhone 15 Pro',
              'color': {
                'name': 'All-Over Print',
                'swatch': '#ffffff'
              },
              'size': {
                'name': 'iPhone 15 Pro'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 1.6,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': '19ba5557-0825-48c3-b877-5fb6e0965e44',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/63b15827-5cdb-4e44-a571-adba7dc12db8.webp',
                'width': 1000,
                'height': 1000
              }
            ]
          },
          {
            'id': 'c051feb2-6550-4f61-b9d5-cdbf784e84a5',
            'name': 'iSynergism Phone Case - All-Over Print, iPhone 15 Plus',
            'sku': '1DZA-T7HG0PH',
            'unitPrice': {
              'value': 23,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'All-Over Print, iPhone 15 Plus',
              'color': {
                'name': 'All-Over Print',
                'swatch': '#ffffff'
              },
              'size': {
                'name': 'iPhone 15 Plus'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 1.6,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': '6ec59e4d-610e-4991-bd27-80ee2a74437c',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/ca93d2f4-a492-4e64-9d6b-a6c614913760.webp',
                'width': 1000,
                'height': 1000
              }
            ]
          },
          {
            'id': 'd7e27129-00c0-4022-a97b-f922598e16fe',
            'name': 'iSynergism Phone Case - All-Over Print, iPhone 15',
            'sku': '1DZA-3SWG0PH',
            'unitPrice': {
              'value': 23,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'All-Over Print, iPhone 15',
              'color': {
                'name': 'All-Over Print',
                'swatch': '#ffffff'
              },
              'size': {
                'name': 'iPhone 15'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 1.6,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': 'de95019a-1af0-4dd1-b495-d823d7ce49e7',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/76e18ddd-bf77-4b54-8700-eb42f7026620.webp',
                'width': 1000,
                'height': 1000
              }
            ]
          },
          {
            'id': 'eb24c6a4-f54d-4c64-a836-6caa78bf50ae',
            'name': 'iSynergism Phone Case - All-Over Print, iPhone 16 Plus',
            'sku': '1DZA-GC6G0PH',
            'unitPrice': {
              'value': 23,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'All-Over Print, iPhone 16 Plus',
              'color': {
                'name': 'All-Over Print',
                'swatch': '#ffffff'
              },
              'size': {
                'name': 'iPhone 16 Plus'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 1.6,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': '598e19ed-f405-4712-b2ea-5463a2b5a809',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/21d980c2-ac08-4d72-9f62-c6ac1ce8b978.webp',
                'width': 1000,
                'height': 1000
              }
            ]
          },
          {
            'id': '99b21755-cbd2-4be3-8a2c-e8cae7f6203a',
            'name': 'iSynergism Phone Case - All-Over Print, iPhone 16 Pro Max',
            'sku': '1DZA-DS3G0PH',
            'unitPrice': {
              'value': 23,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'All-Over Print, iPhone 16 Pro Max',
              'color': {
                'name': 'All-Over Print',
                'swatch': '#ffffff'
              },
              'size': {
                'name': 'iPhone 16 Pro Max'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 1.6,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': 'b054cc43-3fc5-4f9f-be01-19f9c1ba90a5',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/2899f1d7-21f6-44dc-b001-984e95b04b8a.webp',
                'width': 1000,
                'height': 1000
              }
            ]
          },
          {
            'id': 'b07c28f1-4a6b-4842-9fde-ac72eda7df76',
            'name': 'iSynergism Phone Case - All-Over Print, iPhone 16',
            'sku': '1DZA-4J0G0PH',
            'unitPrice': {
              'value': 23,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'All-Over Print, iPhone 16',
              'color': {
                'name': 'All-Over Print',
                'swatch': '#ffffff'
              },
              'size': {
                'name': 'iPhone 16'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 1.6,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': 'ae24bada-f362-4ae7-a2ea-d1b80fa63569',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/fea145f0-a04e-4490-964f-22d23e22fa3e.webp',
                'width': 1000,
                'height': 1000
              }
            ]
          },
          {
            'id': '99711bf4-7cac-4ac0-81bf-9e8a7a417f67',
            'name': 'iSynergism Phone Case - All-Over Print, iPhone 16 Pro',
            'sku': '1DZA-9DXG0PH',
            'unitPrice': {
              'value': 23,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'All-Over Print, iPhone 16 Pro',
              'color': {
                'name': 'All-Over Print',
                'swatch': '#ffffff'
              },
              'size': {
                'name': 'iPhone 16 Pro'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 1.6,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': '3d00f1f9-3639-4123-b4d1-412e185e0cf1',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/f23edf77-5022-4e2c-b265-2715f3192196.webp',
                'width': 1000,
                'height': 1000
              }
            ]
          }
        ],
        'createdAt': '2025-01-12T23:45:47.812344Z',
        'updatedAt': '2025-01-12T23:45:47.812344Z'
      },
      {
        'id': 'd7dbfe94-4cf2-440f-b6c4-8e7f87476d0c',
        'name': 'Synergism Mug',
        'slug': 'synergism-mug',
        'description': '',
        'state': {
          'type': 'AVAILABLE'
        },
        'access': {
          'type': 'PUBLIC'
        },
        'images': [
          {
            'id': 'e90241f7-aef7-4842-88a5-00dd12472016',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/2bf37ae5-68b4-4d6d-8c14-ab83f42edf6d.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '940791d0-e224-40d3-b63b-9d2be6bf0581',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/b79882bb-901c-4211-8ceb-84772aaae7c6.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '960c76b8-c516-43a6-b02f-484c10c1e3a4',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/581ad855-7184-407b-a60e-b091229922cb.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '6eb0889e-0b40-4373-a414-29696084b925',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/79ab28f0-91a0-4c4f-ba97-4e9f5ba818a8.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '13c0b927-9c03-4a70-95fd-00a06650fef7',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/ef97fc09-2360-4b1f-8cf5-cb1b6242e657.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '73f4cc47-0172-4239-aac5-44d16069481f',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5a853adc-3d1f-4ae0-a48a-952c7bb65cce.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '08820e16-b36e-4f43-a8c1-767deac326b1',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/2b6610a3-f023-4670-8b3d-414940429725.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '27196ea8-8b9c-4524-84b1-4ef72f993826',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/dd6321ee-30be-4663-ac92-38edd3f4d3e4.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '4268f2ad-10e5-4dc4-91f9-b3e5262b5bcd',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/d344e103-8ebf-490e-b14b-3649241bed18.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '6f540057-0dd7-447b-a9a0-87df020e357c',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7c154baf-4042-4543-865f-35e145afe6e6.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': 'eb1b7bc4-7423-4676-aead-e643c3914980',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/44cf58fe-5e0a-4257-a669-8d27dd7a7007.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '7cbee805-c18f-4856-9ca1-850c041a8725',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/3de3b1df-5530-42f5-932a-45437f7d8d4e.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '673d217d-a5b0-4605-9f8a-1bce4adc30c8',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5b8debbd-9134-43d6-b158-79ee1de36c81.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '4663e491-e108-4058-b558-9d5246307ea4',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5cc13dd4-4d08-4d94-a3f4-b448631212e6.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '5343272b-da11-48e7-8c7a-01e2f9bcf19a',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/94447d40-6618-45d5-9734-d86bf9b47aed.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': 'c61d4023-fdd2-46da-885a-8234604243c4',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/0cfd80ca-a35b-438e-9d3b-0fc3f0e08172.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '2180a95c-d0c3-46a7-9f0e-364725d5101b',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/0c8538e4-29fd-4da4-9aa8-b857ac69f203.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '5776bb96-b8e6-4353-8dbd-0cbecb4a53fb',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/6840ae35-2d44-43ca-9c23-399a0b7c549b.webp',
            'width': 1536,
            'height': 2048
          }
        ],
        'variants': [
          {
            'id': '51def70d-e8e9-46c7-9e90-4612ed2c5932',
            'name': 'Synergism Mug - White, 11oz',
            'sku': '1600-MGXV011',
            'unitPrice': {
              'value': 11,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'White, 11oz',
              'color': {
                'name': 'White',
                'swatch': '#ffffff'
              },
              'size': {
                'name': '11oz'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 16,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': 'e90241f7-aef7-4842-88a5-00dd12472016',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/2bf37ae5-68b4-4d6d-8c14-ab83f42edf6d.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '940791d0-e224-40d3-b63b-9d2be6bf0581',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/b79882bb-901c-4211-8ceb-84772aaae7c6.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '960c76b8-c516-43a6-b02f-484c10c1e3a4',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/581ad855-7184-407b-a60e-b091229922cb.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '6eb0889e-0b40-4373-a414-29696084b925',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/79ab28f0-91a0-4c4f-ba97-4e9f5ba818a8.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '13c0b927-9c03-4a70-95fd-00a06650fef7',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/ef97fc09-2360-4b1f-8cf5-cb1b6242e657.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '73f4cc47-0172-4239-aac5-44d16069481f',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5a853adc-3d1f-4ae0-a48a-952c7bb65cce.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': '1e7d0ba0-67e5-489c-8b02-ca770c07937c',
            'name': 'Synergism Mug - White, 15oz',
            'sku': '1600-3REV015',
            'unitPrice': {
              'value': 13,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'White, 15oz',
              'color': {
                'name': 'White',
                'swatch': '#ffffff'
              },
              'size': {
                'name': '15oz'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 16,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': '08820e16-b36e-4f43-a8c1-767deac326b1',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/2b6610a3-f023-4670-8b3d-414940429725.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '27196ea8-8b9c-4524-84b1-4ef72f993826',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/dd6321ee-30be-4663-ac92-38edd3f4d3e4.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '4268f2ad-10e5-4dc4-91f9-b3e5262b5bcd',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/d344e103-8ebf-490e-b14b-3649241bed18.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '6f540057-0dd7-447b-a9a0-87df020e357c',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7c154baf-4042-4543-865f-35e145afe6e6.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'eb1b7bc4-7423-4676-aead-e643c3914980',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/44cf58fe-5e0a-4257-a669-8d27dd7a7007.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '7cbee805-c18f-4856-9ca1-850c041a8725',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/3de3b1df-5530-42f5-932a-45437f7d8d4e.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': '723b5791-3af7-4468-995c-024e16f0aa6a',
            'name': 'Synergism Mug - White, 20 oz',
            'sku': '1600-92FV020',
            'unitPrice': {
              'value': 14.55,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'White, 20 oz',
              'color': {
                'name': 'White',
                'swatch': '#ffffff'
              },
              'size': {
                'name': '20 oz'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 16,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': '673d217d-a5b0-4605-9f8a-1bce4adc30c8',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5b8debbd-9134-43d6-b158-79ee1de36c81.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '4663e491-e108-4058-b558-9d5246307ea4',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5cc13dd4-4d08-4d94-a3f4-b448631212e6.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '5343272b-da11-48e7-8c7a-01e2f9bcf19a',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/94447d40-6618-45d5-9734-d86bf9b47aed.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'c61d4023-fdd2-46da-885a-8234604243c4',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/0cfd80ca-a35b-438e-9d3b-0fc3f0e08172.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '2180a95c-d0c3-46a7-9f0e-364725d5101b',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/0c8538e4-29fd-4da4-9aa8-b857ac69f203.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '5776bb96-b8e6-4353-8dbd-0cbecb4a53fb',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/6840ae35-2d44-43ca-9c23-399a0b7c549b.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          }
        ],
        'createdAt': '2025-01-12T23:48:22.351538Z',
        'updatedAt': '2025-01-12T23:48:22.351538Z'
      },
      {
        'id': 'e3555380-e556-4891-8c8b-cc82e3c8930d',
        'name': 'Synergism Mug - Black',
        'slug': 'synergism-mug-black',
        'description': '',
        'state': {
          'type': 'AVAILABLE'
        },
        'access': {
          'type': 'PUBLIC'
        },
        'images': [
          {
            'id': '8b634cf6-3485-4814-94a8-b869c14da118',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a5747501-1ed4-42e0-8a96-bb5dd4ad308e.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '43680e86-94a5-4353-956a-1393f0ee1a45',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/abf1911c-7ca7-48c7-89fe-480a4dbf03b4.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': 'b626044b-1c68-431b-aef9-db413fb1e390',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7b55cc14-2d7e-40cb-8313-ffeb4f0c6b8e.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '56fa7eee-011d-4aae-b42a-de35967ea5e3',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a09cd287-0cdd-42f3-99f4-2206423904df.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': 'af7c19fa-982b-4fc3-bedd-f4aec4dac936',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/e028bc5a-1207-4b5e-9efc-0a5e190683d9.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': 'b6b0bc33-305d-4bb3-9f4c-083449d470a9',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/cd7e78ed-e906-4e76-ba79-ade9ec4d46fd.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '9a8944ef-e4b2-4565-9ac6-fc778ce1e0f6',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/601c0d07-1e41-42e1-83a1-9044a2368801.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '9255482c-a439-45ce-8e38-a90dabf73e43',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/402f3da3-29c5-4db6-b80f-4dfc36cd3011.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '5eb48bee-6581-4009-969e-ff47e370d00b',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7c48cd8c-cefd-4d85-ae61-67a2e3f3e307.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '30f039d1-f99a-471d-946a-67fc7dc710fb',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/27522d6a-0c10-4825-976e-4f7074641712.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': 'fe68a611-4937-4b0e-8d0c-37d7759496e4',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/8e1b70fc-4be5-4b01-8891-6aa9955eb815.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': 'cb638d05-e0b8-41b1-81f3-a6173608330b',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/323d13d5-6c42-40f0-b387-5d83ea4ca981.webp',
            'width': 1536,
            'height': 2048
          }
        ],
        'variants': [
          {
            'id': 'd1fbb557-a697-4310-a35a-cd56a7c324ea',
            'name': 'Synergism Mug - Black - Black, 11oz',
            'sku': '1404-JTB2011',
            'unitPrice': {
              'value': 14,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, 11oz',
              'color': {
                'name': 'Black',
                'swatch': '#171717'
              },
              'size': {
                'name': '11oz'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 12.77,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': '8b634cf6-3485-4814-94a8-b869c14da118',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a5747501-1ed4-42e0-8a96-bb5dd4ad308e.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '43680e86-94a5-4353-956a-1393f0ee1a45',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/abf1911c-7ca7-48c7-89fe-480a4dbf03b4.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'b626044b-1c68-431b-aef9-db413fb1e390',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7b55cc14-2d7e-40cb-8313-ffeb4f0c6b8e.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '56fa7eee-011d-4aae-b42a-de35967ea5e3',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a09cd287-0cdd-42f3-99f4-2206423904df.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'af7c19fa-982b-4fc3-bedd-f4aec4dac936',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/e028bc5a-1207-4b5e-9efc-0a5e190683d9.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'b6b0bc33-305d-4bb3-9f4c-083449d470a9',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/cd7e78ed-e906-4e76-ba79-ade9ec4d46fd.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': '36207776-a2a4-478a-8c46-8c806c1930b4',
            'name': 'Synergism Mug - Black - Black, 15oz',
            'sku': '1404-0F22015',
            'unitPrice': {
              'value': 15,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, 15oz',
              'color': {
                'name': 'Black',
                'swatch': '#171717'
              },
              'size': {
                'name': '15oz'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 16,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': '9a8944ef-e4b2-4565-9ac6-fc778ce1e0f6',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/601c0d07-1e41-42e1-83a1-9044a2368801.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '9255482c-a439-45ce-8e38-a90dabf73e43',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/402f3da3-29c5-4db6-b80f-4dfc36cd3011.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '5eb48bee-6581-4009-969e-ff47e370d00b',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7c48cd8c-cefd-4d85-ae61-67a2e3f3e307.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '30f039d1-f99a-471d-946a-67fc7dc710fb',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/27522d6a-0c10-4825-976e-4f7074641712.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'fe68a611-4937-4b0e-8d0c-37d7759496e4',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/8e1b70fc-4be5-4b01-8891-6aa9955eb815.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'cb638d05-e0b8-41b1-81f3-a6173608330b',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/323d13d5-6c42-40f0-b387-5d83ea4ca981.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          }
        ],
        'createdAt': '2025-01-12T23:49:00.436889Z',
        'updatedAt': '2025-01-12T23:49:00.436889Z'
      },
      {
        'id': 'cdd1ef68-09b8-46e9-b622-f4d0cf1e2113',
        'name': 'Stanergism Water Bottle',
        'slug': 'stanergism-water-bottle',
        'description': '',
        'state': {
          'type': 'AVAILABLE'
        },
        'access': {
          'type': 'PUBLIC'
        },
        'images': [
          {
            'id': '12e61252-74d5-46d4-a2d9-bebf5b2dcf7a',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/6e02d125-ea3e-458d-a63a-4b02c165f9b4.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '5091cc92-2d11-4fbb-968a-15696964c8a9',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/9c53120f-86f7-4155-a6e7-7e425441e4aa.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '7d5456e1-0c0c-4695-a0e5-b9e15f36ee22',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/cb4a6b49-1a34-4ffd-97d7-697bc6aa1191.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': 'ed6bfffb-dfbc-4783-843a-3ff5e92d36b4',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/988bc4bb-b871-4ff0-b703-98127b9ca139.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '568e9704-5533-4765-b610-7287633afd39',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/e56ccafd-b1f4-48ef-9107-298c2c67007e.webp',
            'width': 1536,
            'height': 2048
          }
        ],
        'variants': [
          {
            'id': '7cdbf32b-d02f-4df8-b321-1c15a3da5920',
            'name': 'Stanergism Water Bottle - Black, 17oz',
            'sku': '12QM-9RK2017',
            'unitPrice': {
              'value': 30,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, 17oz',
              'color': {
                'name': 'Black',
                'swatch': '#020202'
              },
              'size': {
                'name': '17oz'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 10.9,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': '12e61252-74d5-46d4-a2d9-bebf5b2dcf7a',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/6e02d125-ea3e-458d-a63a-4b02c165f9b4.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '5091cc92-2d11-4fbb-968a-15696964c8a9',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/9c53120f-86f7-4155-a6e7-7e425441e4aa.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '7d5456e1-0c0c-4695-a0e5-b9e15f36ee22',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/cb4a6b49-1a34-4ffd-97d7-697bc6aa1191.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'ed6bfffb-dfbc-4783-843a-3ff5e92d36b4',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/988bc4bb-b871-4ff0-b703-98127b9ca139.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '568e9704-5533-4765-b610-7287633afd39',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/e56ccafd-b1f4-48ef-9107-298c2c67007e.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          }
        ],
        'createdAt': '2025-01-12T23:50:43.25655Z',
        'updatedAt': '2025-01-12T23:50:43.25655Z'
      },
      {
        'id': '077ebb83-6d6c-4d16-a720-9d6d2eb1f866',
        'name': 'Synergism Hoodie Small Logo',
        'slug': 'synergism-hoodie-small-logo',
        'description': '',
        'state': {
          'type': 'AVAILABLE'
        },
        'access': {
          'type': 'PUBLIC'
        },
        'images': [
          {
            'id': '630863af-e1bb-4849-a509-a18e92257494',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5da492a2-0964-4ec5-b63a-e6893bbb14d0.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': 'a097831e-dccc-40e8-8277-d776726f7561',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/b3c9567d-b4dd-420e-ad7b-a01929cee646.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '960c1563-ba3f-41bf-80aa-5c1b9f893c45',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/b4a7bd29-49d3-445d-b04e-b25e694dd30f.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '36c50522-e973-4757-960d-f61adcf022fd',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/195ead88-6bac-4284-b89b-faec42e112b1.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '55e3d1d9-3391-44d9-a0d9-576e1e05b9d1',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/6d1491e7-86f1-4e47-9dda-839a1a4ad3b8.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '1f66497b-fcb1-44f7-ac14-28adea472123',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/66c0e583-5e09-4bc0-afed-cb8c3d972e6c.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': 'd6cb688b-4edd-4a7c-94e5-46487c19d092',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/eb29390c-51a1-47da-be79-a3dc53cc95c1.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '9037a579-cace-446c-b638-b35f4db5aa86',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a2f783b7-2a14-48c9-901f-96f3db1620b5.webp',
            'width': 1536,
            'height': 2048
          }
        ],
        'variants': [
          {
            'id': '9d15545a-eb8d-42e8-9765-04a34dced7e8',
            'name': 'Synergism Hoodie Small Logo - Black, S',
            'sku': '1W86-G8T200S',
            'unitPrice': {
              'value': 35,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, S',
              'color': {
                'name': 'Black',
                'swatch': '#242424'
              },
              'size': {
                'name': 'S'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 16,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': '630863af-e1bb-4849-a509-a18e92257494',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5da492a2-0964-4ec5-b63a-e6893bbb14d0.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'a097831e-dccc-40e8-8277-d776726f7561',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/b3c9567d-b4dd-420e-ad7b-a01929cee646.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '960c1563-ba3f-41bf-80aa-5c1b9f893c45',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/b4a7bd29-49d3-445d-b04e-b25e694dd30f.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '36c50522-e973-4757-960d-f61adcf022fd',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/195ead88-6bac-4284-b89b-faec42e112b1.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '55e3d1d9-3391-44d9-a0d9-576e1e05b9d1',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/6d1491e7-86f1-4e47-9dda-839a1a4ad3b8.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '1f66497b-fcb1-44f7-ac14-28adea472123',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/66c0e583-5e09-4bc0-afed-cb8c3d972e6c.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'd6cb688b-4edd-4a7c-94e5-46487c19d092',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/eb29390c-51a1-47da-be79-a3dc53cc95c1.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '9037a579-cace-446c-b638-b35f4db5aa86',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a2f783b7-2a14-48c9-901f-96f3db1620b5.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': '4b300b7d-e7a7-40bd-93ff-091c3968a4d6',
            'name': 'Synergism Hoodie Small Logo - Black, M',
            'sku': '1W86-284200M',
            'unitPrice': {
              'value': 35,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, M',
              'color': {
                'name': 'Black',
                'swatch': '#242424'
              },
              'size': {
                'name': 'M'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 16.5,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': '630863af-e1bb-4849-a509-a18e92257494',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5da492a2-0964-4ec5-b63a-e6893bbb14d0.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'a097831e-dccc-40e8-8277-d776726f7561',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/b3c9567d-b4dd-420e-ad7b-a01929cee646.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '960c1563-ba3f-41bf-80aa-5c1b9f893c45',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/b4a7bd29-49d3-445d-b04e-b25e694dd30f.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '36c50522-e973-4757-960d-f61adcf022fd',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/195ead88-6bac-4284-b89b-faec42e112b1.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '55e3d1d9-3391-44d9-a0d9-576e1e05b9d1',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/6d1491e7-86f1-4e47-9dda-839a1a4ad3b8.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '1f66497b-fcb1-44f7-ac14-28adea472123',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/66c0e583-5e09-4bc0-afed-cb8c3d972e6c.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'd6cb688b-4edd-4a7c-94e5-46487c19d092',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/eb29390c-51a1-47da-be79-a3dc53cc95c1.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '9037a579-cace-446c-b638-b35f4db5aa86',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a2f783b7-2a14-48c9-901f-96f3db1620b5.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': '10e3bf30-3d18-4f7c-b0e5-dc35b1b2275f',
            'name': 'Synergism Hoodie Small Logo - Black, L',
            'sku': '1W86-28S200L',
            'unitPrice': {
              'value': 35,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, L',
              'color': {
                'name': 'Black',
                'swatch': '#242424'
              },
              'size': {
                'name': 'L'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 20,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': '630863af-e1bb-4849-a509-a18e92257494',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5da492a2-0964-4ec5-b63a-e6893bbb14d0.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'a097831e-dccc-40e8-8277-d776726f7561',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/b3c9567d-b4dd-420e-ad7b-a01929cee646.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '960c1563-ba3f-41bf-80aa-5c1b9f893c45',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/b4a7bd29-49d3-445d-b04e-b25e694dd30f.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '36c50522-e973-4757-960d-f61adcf022fd',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/195ead88-6bac-4284-b89b-faec42e112b1.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '55e3d1d9-3391-44d9-a0d9-576e1e05b9d1',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/6d1491e7-86f1-4e47-9dda-839a1a4ad3b8.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '1f66497b-fcb1-44f7-ac14-28adea472123',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/66c0e583-5e09-4bc0-afed-cb8c3d972e6c.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'd6cb688b-4edd-4a7c-94e5-46487c19d092',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/eb29390c-51a1-47da-be79-a3dc53cc95c1.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '9037a579-cace-446c-b638-b35f4db5aa86',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a2f783b7-2a14-48c9-901f-96f3db1620b5.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': '8167a602-eb50-40c0-b114-82a4d421cfeb',
            'name': 'Synergism Hoodie Small Logo - Black, XL',
            'sku': '1W86-YJW20XL',
            'unitPrice': {
              'value': 35,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, XL',
              'color': {
                'name': 'Black',
                'swatch': '#242424'
              },
              'size': {
                'name': 'XL'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 21.8,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': '630863af-e1bb-4849-a509-a18e92257494',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5da492a2-0964-4ec5-b63a-e6893bbb14d0.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'a097831e-dccc-40e8-8277-d776726f7561',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/b3c9567d-b4dd-420e-ad7b-a01929cee646.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '960c1563-ba3f-41bf-80aa-5c1b9f893c45',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/b4a7bd29-49d3-445d-b04e-b25e694dd30f.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '36c50522-e973-4757-960d-f61adcf022fd',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/195ead88-6bac-4284-b89b-faec42e112b1.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '55e3d1d9-3391-44d9-a0d9-576e1e05b9d1',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/6d1491e7-86f1-4e47-9dda-839a1a4ad3b8.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '1f66497b-fcb1-44f7-ac14-28adea472123',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/66c0e583-5e09-4bc0-afed-cb8c3d972e6c.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'd6cb688b-4edd-4a7c-94e5-46487c19d092',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/eb29390c-51a1-47da-be79-a3dc53cc95c1.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '9037a579-cace-446c-b638-b35f4db5aa86',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a2f783b7-2a14-48c9-901f-96f3db1620b5.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': '945237e5-a1b7-4893-82b6-f33c450b7b3d',
            'name': 'Synergism Hoodie Small Logo - Black, 2XL',
            'sku': '1W86-DV5202X',
            'unitPrice': {
              'value': 37,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, 2XL',
              'color': {
                'name': 'Black',
                'swatch': '#242424'
              },
              'size': {
                'name': '2XL'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 22.5,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': '630863af-e1bb-4849-a509-a18e92257494',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5da492a2-0964-4ec5-b63a-e6893bbb14d0.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'a097831e-dccc-40e8-8277-d776726f7561',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/b3c9567d-b4dd-420e-ad7b-a01929cee646.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '960c1563-ba3f-41bf-80aa-5c1b9f893c45',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/b4a7bd29-49d3-445d-b04e-b25e694dd30f.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '36c50522-e973-4757-960d-f61adcf022fd',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/195ead88-6bac-4284-b89b-faec42e112b1.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '55e3d1d9-3391-44d9-a0d9-576e1e05b9d1',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/6d1491e7-86f1-4e47-9dda-839a1a4ad3b8.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '1f66497b-fcb1-44f7-ac14-28adea472123',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/66c0e583-5e09-4bc0-afed-cb8c3d972e6c.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'd6cb688b-4edd-4a7c-94e5-46487c19d092',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/eb29390c-51a1-47da-be79-a3dc53cc95c1.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '9037a579-cace-446c-b638-b35f4db5aa86',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a2f783b7-2a14-48c9-901f-96f3db1620b5.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          },
          {
            'id': '924caa4d-0683-4714-bc90-620984f865eb',
            'name': 'Synergism Hoodie Small Logo - Black, 3XL',
            'sku': '1W86-P9M203X',
            'unitPrice': {
              'value': 39,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'Black, 3XL',
              'color': {
                'name': 'Black',
                'swatch': '#242424'
              },
              'size': {
                'name': '3XL'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 25.2,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': '630863af-e1bb-4849-a509-a18e92257494',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/5da492a2-0964-4ec5-b63a-e6893bbb14d0.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'a097831e-dccc-40e8-8277-d776726f7561',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/b3c9567d-b4dd-420e-ad7b-a01929cee646.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '960c1563-ba3f-41bf-80aa-5c1b9f893c45',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/b4a7bd29-49d3-445d-b04e-b25e694dd30f.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '36c50522-e973-4757-960d-f61adcf022fd',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/195ead88-6bac-4284-b89b-faec42e112b1.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '55e3d1d9-3391-44d9-a0d9-576e1e05b9d1',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/6d1491e7-86f1-4e47-9dda-839a1a4ad3b8.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '1f66497b-fcb1-44f7-ac14-28adea472123',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/66c0e583-5e09-4bc0-afed-cb8c3d972e6c.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': 'd6cb688b-4edd-4a7c-94e5-46487c19d092',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/eb29390c-51a1-47da-be79-a3dc53cc95c1.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '9037a579-cace-446c-b638-b35f4db5aa86',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/a2f783b7-2a14-48c9-901f-96f3db1620b5.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          }
        ],
        'createdAt': '2025-01-12T23:48:22.346388Z',
        'updatedAt': '2025-01-13T00:48:25.270333Z'
      },
      {
        'id': 'c373e86e-0b09-4d3a-bb26-c6d1f9c02d2f',
        'name': 'Synergism Mouse Pad',
        'slug': 'synergism-mouse-pad',
        'description': '',
        'state': {
          'type': 'AVAILABLE'
        },
        'access': {
          'type': 'PUBLIC'
        },
        'images': [
          {
            'id': '7672379b-3d66-4a20-87fa-9bc021863b3d',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/64993ee3-7de1-4e7b-badc-d86c560b614e.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '02a70002-5870-4323-aa32-decb8583caed',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7ca11b59-f1c6-4700-ac45-f5278039fc97.webp',
            'width': 1536,
            'height': 2048
          },
          {
            'id': '471d5aa6-a41c-42de-877f-1f918c3830ac',
            'url':
              'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/f75ebe42-4650-44dd-ab2a-b62bf89ab7d8.webp',
            'width': 1536,
            'height': 2048
          }
        ],
        'variants': [
          {
            'id': '4178f452-66e0-4f38-903d-dd486ca62618',
            'name': 'Synergism Mouse Pad - All-Over Print, 15.5" x 31.5"',
            'sku': '17PG-BX4G015',
            'unitPrice': {
              'value': 23,
              'currency': 'USD'
            },
            'attributes': {
              'description': 'All-Over Print, 15.5" x 31.5"',
              'color': {
                'name': 'All-Over Print',
                'swatch': '#ffffff'
              },
              'size': {
                'name': '15.5" x 31.5"'
              }
            },
            'stock': {
              'type': 'UNLIMITED'
            },
            'weight': {
              'value': 32,
              'unit': 'oz'
            },
            'dimensions': {
              'length': 0,
              'width': 0,
              'height': 0,
              'unit': 'in'
            },
            'images': [
              {
                'id': '7672379b-3d66-4a20-87fa-9bc021863b3d',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/64993ee3-7de1-4e7b-badc-d86c560b614e.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '02a70002-5870-4323-aa32-decb8583caed',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/7ca11b59-f1c6-4700-ac45-f5278039fc97.webp',
                'width': 1536,
                'height': 2048
              },
              {
                'id': '471d5aa6-a41c-42de-877f-1f918c3830ac',
                'url':
                  'https://cdn.fourthwall.com/customizations/sh_f253653b-dab8-4fce-a5b7-2418a87712c4/f75ebe42-4650-44dd-ab2a-b62bf89ab7d8.webp',
                'width': 1536,
                'height': 2048
              }
            ]
          }
        ],
        'createdAt': '2025-01-12T23:48:22.353061Z',
        'updatedAt': '2025-01-13T00:48:25.571569Z'
      }
    ])
  })
]
