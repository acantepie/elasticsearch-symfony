import JSONEditor, {JSONEditorOptions} from "jsoneditor";

export default class SearchEngine extends HTMLDivElement {

    private $queryEditor : HTMLDivElement
    private $searchBtn : HTMLButtonElement
    private $searchError: HTMLDivElement
    private $searchResult: HTMLDivElement

    private queryEditor: JSONEditor|null;

    constructor() {
        super()
        this.$queryEditor = this.querySelector('.query-editor')
        this.$searchBtn = this.querySelector('button')
        this.$searchError = this.querySelector('.search-error')
        this.$searchResult = this.querySelector('.search-result')
    }

    connectedCallback(): void {

        const options : JSONEditorOptions = {
            mode: "code",
            enableTransform: false,
            enableSort: false,
        }

        const query = this.dataset.query
        const json = query ? JSON.parse(query) : {}
        this.queryEditor = new JSONEditor(this.$queryEditor, options, json)

        this.$searchBtn.addEventListener('click', evt => {
            evt.preventDefault()
            this.search()
        })
    }

    async search(): Promise<any> {

        const errors = await this.queryEditor.validate()
        if (errors.length > 0) {
            return
        }

        const query = this.queryEditor.getText()

        const response = await fetch(this.dataset.url, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: query
        })

        const json = await response.json()

        if (response.ok) {
            this.renderResult(json)
        } else {
            this.renderError(json)
        }

    }

    private renderError(response: SearchErrorResponse): void
    {
        this.$searchError.hidden = false
        this.$searchResult.hidden = true

        let html = '<div class="alert alert-danger">'
        html += `<div class="fw-bold">${response.error}</div>`
        html += `<div>${response.description}</div>`
        html += '</div>'

        this.$searchError.innerHTML = html
    }

    private renderResult(response : SearchResponse<ImmeubleHistoriqueSource>): void
    {
        console.log(response)

        this.$searchResult.hidden = false
        this.$searchError.hidden = true

        const $tbody = this.$searchResult.querySelector('tbody')
        let html = '';

        if (response.hits.hits.length === 0) {
            $tbody.innerHTML = '<tr><td colspan="100%" class="text-muted text-center">No result.</td></tr>'
            return
        }

        for (const hit of response.hits.hits) {
            html += '<tr>'
            html += `<td>${hit._score}</td>`
            html += `<td>${hit._source.ref}</td>`
            html += `<td>${hit._source.nom}</td>`
            html += '</td>'
        }

        $tbody.innerHTML = html
    }
}