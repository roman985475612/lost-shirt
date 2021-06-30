window.addEventListener('DOMContentLoaded', () => {
    (function() {
        const elem = document.querySelector('.products__list');
        const iso = new Isotope( elem, {
          itemSelector: '.products__item',
          filter: '.all'
        })

        const filter = document.querySelector('.filter')

        filter.addEventListener('click', e => {
            if (!e.target.classList.contains('filter__link')) {
                return false;
            }

            filter.querySelector('.filter__item--active').classList.remove('filter__item--active')
            e.target.closest('.filter__item').classList.add('filter__item--active')

            iso.arrange({
                filter: `.${e.target.dataset.filter}`
            })

            e.preventDefault()
        })

    })()
})