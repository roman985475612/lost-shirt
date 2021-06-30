window.addEventListener('DOMContentLoaded', () => {
    (function () {
        const sidebar = document.querySelector('.sidebar')
        const openingBtn = document.querySelector('.sidebar__hamburger')
        const closingBtn = document.querySelector('.sidebar__close')
    
        openingBtn.addEventListener('click', e => {
            sidebar.classList.add('sidebar--opened')
        })
    
        closingBtn.addEventListener('click', e => {
            sidebar.classList.remove('sidebar--opened')
        })    
    })()
})
