import JSONEditor, {JSONEditorOptions} from "jsoneditor";
import { Grid } from "gridjs";

export default class SearchEngine extends HTMLDivElement {

    private $queryEditor : HTMLDivElement
    private $searchBtn : HTMLButtonElement
    private $searchError: HTMLDivElement
    private $searchResult: HTMLDivElement
    private grid : Grid

    private queryEditor: JSONEditor|null;

    constructor() {
        super()
        this.$queryEditor = this.querySelector('.query-editor')
        this.$searchBtn = this.querySelector('button')
        this.$searchError = this.querySelector('.search-error')
        this.$searchResult = this.querySelector('.search-result')
    }

    connectedCallback(): void {

        // init query editor
        const options : JSONEditorOptions = {
            mode: "code",
            enableTransform: false,
            enableSort: false,
        }

        const query = this.dataset.query
        const json = query ? JSON.parse(query) : {}
        this.queryEditor = new JSONEditor(this.$queryEditor, options, json)

        // bind search
        this.$searchBtn.addEventListener('click', evt => {
            evt.preventDefault()
            this.search()
        })

        // init table
        this.grid = new Grid({
            className: {
                table: 'table'
            },
            columns: [
                {
                    name: '#',
                    sort: true,
                },
                {
                    name: 'Ref',
                    sort: true
                },
                {
                    name: 'Name',
                    sort: true
                }
            ],
            data: []
        })

        this.grid.render(this.$searchResult);
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
        this.$searchResult.hidden = false
        this.$searchError.hidden = true

        const data = []

        for (const hit of response.hits.hits) {
            data.push([
                hit._score,
                hit._source.ref,
                hit._source.nom
            ])
        }

        this.grid.updateConfig({data})
        this.grid.forceRender()
    }
}