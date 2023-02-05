import "./app.scss"
import 'jsoneditor/dist/jsoneditor.css';

import SearchEngine from "./SearchEngine";
customElements.define('search-engine', SearchEngine, {extends: 'div'});