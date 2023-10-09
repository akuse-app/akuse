'use-strict'

module.exports = class LoadingBar {
    constructor() {
        this.bar = document.getElementById('loading-bar')
        this.pageBar = document.getElementById('loading-page-progress-bar')
    }

    completeBar() {
        this.fillBar()
        setTimeout(() => {
            this.resetBar()
        }, 500)
    }
    
    fillBar() {
        this.bar.classList.add('loading-bar-animation')
    }
    
    resetBar() {
        this.bar.classList.remove('loading-bar-animation')
    }
    
    initPageBar() {
        this.pageBar.classList.add('loading-page-init-bar-animation')
    }

    fillPageBar() {
        this.pageBar.classList.add('loading-page-bar-animation')
    }
}