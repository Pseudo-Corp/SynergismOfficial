import { memoize } from '../Utility'

interface Merch {
  id: string
  name: string
  slug: string
  description: string
  state: {
    type: string
  }
  access: {
    type: string
  }
  images: {
    id: string
    url: string
    width: number
    height: number
  }[]
  variants: {
    id: string
    name: string
    sku: string
    unitPrice: { value: number; currency: string }
    attributes: {
      description: string
      color: { name: string; swatch: string }
      size: { name: string }
    }
    stock: { type: string }
    weight: { value: number; unit: string }
    dimensions: {
      length: number
      width: number
      height: number
      unit: string
    }
    images: {
      id: string
      url: string
      width: number
      height: number
    }[]
  }[]
  createdAt: string
  updatedAt: string
}

const tab = document.querySelector<HTMLElement>('#pseudoCoins > #merchContainer')!

const initializeMerchSubtab = memoize(() => {
  ;(async () => {
    const response = await fetch('https://synergism.cc/api/merch/products')
    const merch = await response.json() as Merch[]

    for (let i = 0; i < merch.length; i++) {
      const slideshow = document.createElement('div')
      slideshow.classList.add('slideshow-container')

      for (let j = 0; j < merch[i].variants.length; j++) {
        const variant = merch[i].variants[j]

        for (let k = 0; k < variant.images.length; k++) {
          const slide = document.createElement('div')
          slide.classList.add('slide', 'fade')

          const pageNumber = document.createElement('div')
          pageNumber.classList.add('pageNumber')
          pageNumber.textContent = `${j + 1}/${merch[i].variants.length}`

          const img = document.createElement('img')
          img.src = variant.images[k].url
          img.width = img.height = 400

          const text = document.createElement('div')
          text.classList.add('text')
          text.textContent = variant.name

          slideshow.appendChild(slide)
          slide.appendChild(pageNumber)
          slide.appendChild(img)
          slide.appendChild(text)
        }
      }

      const prev = document.createElement('a')
      prev.classList.add('prev')
      prev.textContent = String.fromCharCode(Number.parseInt('10094'))

      const next = document.createElement('a')
      next.classList.add('next')
      next.textContent = String.fromCharCode(Number.parseInt('10095'))

      if (merch[i].variants.length > 1) {
        let slideIndex = 0
        const slides = slideshow.getElementsByClassName('slide')

        prev.addEventListener('click', () => {
          slides.item(slideIndex)?.classList.remove('active')

          if (--slideIndex < 0) slideIndex = slides.length - 1

          slides.item(slideIndex)?.classList.add('active')
        })

        next.addEventListener('click', () => {
          slides.item(slideIndex)?.classList.remove('active')

          if (++slideIndex > slides.length - 1) slideIndex = 0

          slides.item(slideIndex)?.classList.add('active')
        })
      }

      slideshow.appendChild(prev)
      slideshow.appendChild(next)

      slideshow.querySelector('.slide')!.classList.add('active')

      tab.querySelector('#slideshows')!.appendChild(slideshow)
    }
  })()
})

export const toggleMerchSubtab = () => {
  initializeMerchSubtab()

  tab.style.display = 'flex'
}

export const clearMerchSubtab = () => {
  tab.style.display = 'none'
}
