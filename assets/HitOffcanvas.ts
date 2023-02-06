import {Offcanvas} from 'bootstrap'

export default class HitOffcanvas<T> {

    private inner: Offcanvas
    private el: HTMLDivElement

    constructor() {

        let wrapper = document.getElementById('offcanvas-wrapper')

        if (!wrapper) {
            wrapper = this.createWrapper()
        }

        this.el = wrapper.children[0] as HTMLDivElement
        this.inner = new Offcanvas(this.el)
    }

    private createWrapper(): HTMLDivElement {

        const wrapper = document.createElement('div')
        wrapper.id = 'offcanvas-wrapper'
        wrapper.innerHTML =
        `<div class="offcanvas offcanvas-end" tabindex="-1"  style="width: 600px">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title"></h5>
                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
            </div>
        </div>`

        document.body.appendChild(wrapper)
        return wrapper
    }

    setHit(hit: Hit<T>): void {
        this.el.querySelector('.offcanvas-title').textContent = hit._id

        let html = '<table class="table table-sm">'

        html += `<tr><th>_id</th><td>${hit._id}</td></tr>`
        html += `<tr><th>_index</th><td>${hit._index}</td></tr>`
        html += `<tr><th>_score</th><td>${hit._score}</td></tr>`

        Object.entries(hit._source).forEach(([key, value]) => {
            html += `<tr><th>${key}</th><td>${value}</td></tr>`
        })

        html += '</table>'

        this.el.querySelector('.offcanvas-body').innerHTML = html
    }

    show() {
        this.inner.show()
    }
}