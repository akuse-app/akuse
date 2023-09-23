'use-strict'

module.exports = class LoadingBar {
    constructor() {
        this.bar = document.getElementById('loading-bar')
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
}