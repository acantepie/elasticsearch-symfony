import JSONEditor, {JSONEditorOptions} from "jsoneditor";
import {Grid, html} from "gridjs";
import Row from "gridjs/dist/src/row";
import {TCell} from "gridjs/dist/src/types";
import {GridUtils} from "./GridUtils";
import HitOffcanvas from "./HitOffcanvas";

export default class SearchEngine extends HTMLDivElement {

    private $queryEditor: HTMLDivElement
    private $searchBtn: HTMLButtonElement
    private $searchError: HTMLDivElement
    private $searchResult: HTMLDivElement
    private grid: Grid

    private queryEditor: JSONEditor | null;
    private offcanvas: HitOffcanvas<ImmeubleHistoriqueSource>

    constructor() {
        super()
        this.$queryEditor = this.querySelector('.query-editor')
        this.$searchBtn = this.querySelector('button')
        this.$searchError = this.querySelector('.search-error')
        this.$searchResult = this.querySelector('.search-result')
        this.offcanvas = new HitOffcanvas()
    }

    connectedCallback(): void {

        // init query editor
        const options: JSONEditorOptions = {
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
                table: 'table table-hover'
            },
            columns: [
                {
                    id: 'score',
                    name: '#',
                    sort: true,
                },
                {
                    id: 'ref',
                    name: 'Ref',
                    sort: true,
                },
                {
                    id: 'name',
                    name: 'Name',
                    sort: true,
                },
                {
                    id: 'history',
                    name: 'History',
                    sort: true,
                    formatter: (cell: TCell, row: Row) => {
                        return GridUtils.formatText(cell)
                    }
                },
                {
                    id: '_hit',
                    hidden: true
                }
            ],
            data: []
        })

        this.grid.on('rowClick', (...args) => {
            const hit = args[1].cell(4).data as Hit<ImmeubleHistoriqueSource>
            this.offcanvas.setHit(hit)
            this.offcanvas.show()
        });

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

    private renderError(response: SearchErrorResponse): void {
        this.$searchError.hidden = false
        this.$searchResult.hidden = true

        let html = '<div class="alert alert-danger">'
        html += `<div class="fw-bold">${response.error}</div>`
        html += `<div>${response.description}</div>`
        html += '</div>'

        this.$searchError.innerHTML = html
    }

    private renderResult(response: SearchResponse<ImmeubleHistoriqueSource>): void {
        this.$searchResult.hidden = false
        this.$searchError.hidden = true

        const data = []

        for (const hit of response.hits.hits) {
            data.push({
                'score': hit._score,
                'ref': hit._source.ref,
                'name': hit._source.nom,
                'history': hit._source.historique,
                '_hit': hit
            })
        }

        this.grid.updateConfig({data})
        this.grid.forceRender()
    }
}