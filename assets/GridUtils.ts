import {TCell} from "gridjs/dist/src/types";


export const GridUtils = {
    formatText : function (cell: TCell, maxChar: number = 100): string {
        const value = cell.toString()

        if (value.length <= maxChar) {
            return value
        }

        return value.substring(0, maxChar) + ' ...'

    }
}